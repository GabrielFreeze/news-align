import traceback
from PIL import Image
import multiprocessing
from io import BytesIO
from random import randint
from base64 import b64decode
from time import time, sleep
from fastapi import FastAPI
from utils import Payload, GPU_Payload
from gpu_backend import GPU_Backend
from article_scraper import ArticleScraper
    
app = FastAPI()
artScraper = ArticleScraper()
init:bool = False
job_no:int = 0

queue_1: multiprocessing.Queue[Payload] = None
queue_2: multiprocessing.Queue[Payload] = None
        

@app.get("/")
async def endpoint(url:str=""):
    
    global init, job_no, artScraper, queue_1, queue_2
    
    if not init:
        #Queues for maintaining communication between this process and `gpu_proc`
        queue_1 = multiprocessing.Queue[Payload]()
        queue_2 = multiprocessing.Queue[Payload]()

        #Initialise GPU backend
        job = multiprocessing.Process(target=gpu_proc, args=(queue_1,queue_2))
        job.start()
        
        #Initialisaion ready
        init=True
      
    this_job_no = job_no
    job_no = (job_no+1)%256 #Handles theoretical edge case where integer reaches limit
    
    s=time()
    print(f'[{this_job_no}] Start')
    
    #Extract data from URL to pass to `gpu_proc`
    payload:Payload = artScraper.scrape(url)
    
    #Don't invoke job if error in scraping
    if payload.error:
        return payload
        
    #Place data in queue_1 to be read by `gpu_proc`
    queue_1.put(GPU_Payload(this_job_no,payload))
    
    #Await the return payload from `gpu_proc`
    #Make sure the output we retrieved is the one produced by our payload.
    while (return_payload:=queue_2.get()).job_no != this_job_no:
        queue_2.put(return_payload) #Place output back in queue_2 for correct process to consume
        
    print(f'[{this_job_no}] Finished in {round(time()-s,2)}s')
    
    return return_payload.to_dict()
    
    
#Spin new thread and send data to GPU when received
def gpu_proc(queue_1:multiprocessing.Queue[Payload],
             queue_2:multiprocessing.Queue[Payload]):
    
    print("Initialising GPU Backend: ",end='\r')
    gpu_backend = GPU_Backend()
    print("[OK]")
    
    #Blocks on empty queue
    while gpu_payload := queue_1.get():
        queue_2.put(
            gpu_backend(gpu_payload)
        )
            