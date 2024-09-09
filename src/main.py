import os
import traceback
from time import time
import multiprocessing
from fastapi import FastAPI
from common.color import color
from common.payload import Payload,GPU_Payload
from backend.spectrum_backend import GPU_Backend
from common.article_scraper import ArticleScraper
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

artScraper = ArticleScraper()
init:bool = False
job_no:int = 0

queue_1: multiprocessing.Queue = None
queue_2: multiprocessing.Queue = None       
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
revision = "main"    

@app.get(f"/")
def root() -> dict:
    return Payload(error="Access token must be passed as a GET parameter. Eg: http://10.59.16.3/{token}/?url={window.location.href}").to_dict()
    

@app.get(f"/{os.environ['AI_EXT_TOKEN']}/")
def endpoint(url:str="") -> dict:
    try:
        global init, job_no, artScraper, queue_1, queue_2
        
        #Initialisation
        if not init:
            #Queues for maintaining communication between this process and `gpu_proc`
            queue_1 = multiprocessing.Queue()
            queue_2 = multiprocessing.Queue()

            #Initialise GPU backend
            job = multiprocessing.Process(target=gpu_proc, args=(queue_1,queue_2))
            job.start()
            
            #Initialisaion ready
            init=True
        
        this_job_no = job_no
        job_no = (job_no+1)%256 #Handles theoretical edge case where integer reaches limit
        
        print(f'[{this_job_no}] Start')
        # sleep(randint(0,10))
        all_time = time()
        
        #Extract data from URL to pass to `gpu_proc`
        s=time()
        payload:Payload = artScraper.scrape(url)
        print(f'[{this_job_no}] Scraping finished: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
          
        #TODO:Add current article to vector_db, if not available
          
        #Don't invoke job if error in scraping
        if payload.error:
            return payload.to_dict()
        
        #Place data in queue_1 to be read by `gpu_proc`
        #Very important that I use kwargs due to `__init__` overloading.
        queue_1.put(GPU_Payload(job_no=this_job_no,
                                payload=payload))
        
        if payload.error:
            return payload.to_dict()
        
        #Await the return payload from `gpu_proc`
        #Make sure the output we retrieved is the one produced by our payload.
        while (return_payload:=queue_2.get()).job_no != this_job_no and not return_payload.error:
            print(return_payload.error)
            queue_2.put(return_payload) #Place output back in queue_2 for correct process to consume                 
        
        print(f'[{this_job_no}] Finished in {round(time()-all_time,2)}s')    
                
        return return_payload.to_dict()
    
    except Exception as e:
        traceback.print_exc()
        return Payload(error=traceback.format_exc(),data={}).to_dict()

    
#Spin new thread and send data to GPU when received
def gpu_proc(queue_1:multiprocessing.Queue,
             queue_2:multiprocessing.Queue):
    s=time()
    gpu_backend = GPU_Backend()
    print(f"Initialising GPU Backend: [{round(time()-s,2)}s]")
    
    while True:
        gpu_payload = queue_1.get() #Blocks on empty queue
        queue_2.put(
            gpu_backend(gpu_payload)
        )
