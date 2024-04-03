import traceback
import multiprocessing
from random import randint
from time import time, sleep
from fastapi import FastAPI
from article_scraper import ArticleScraper
    

def gpu_proc(queue_1:multiprocessing.Queue,queue_2:multiprocessing.Queue):
    
    while True:
        try:
            return_payload = {}
            payload = queue_1.get()
            
            sleep(randint(0,7))
            
            #TODO:Use GPU to process `payload` in order to produce `return_payload`
            return_payload = {"this_job_no":payload["this_job_no"],
                              "data":"Meaningful extension data here",
                              "error":""}
        except Exception as e:
            return_payload = {"this_job_no":payload["this_job_no"],
                              "data":"",
                              "error":f"Unexpected Error: {traceback.format_exc()}"}
        finally:
            queue_2.put(return_payload)
            


app = FastAPI()
artScraper = ArticleScraper()
init:bool = False
job_no:int = 0

queue_1: multiprocessing.Queue = None
queue_2: multiprocessing.Queue = None
        


@app.get("/")
async def endpoint(url:str=""):
    
    global init, job_no, artScraper, queue_1, queue_2
    
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
    
    #Extract data from URL to pass to `gpu_proc`
    payload = artScraper.scrape(url)
    
    #Place data in queue_1 to be read by `gpu_proc`
    queue_1.put({"this_job_no":this_job_no, "payload":payload})
    
    #Await the return payload from `gpu_proc`
    #Make sure the output we retrieved is the one produced by our payload.
    
    print(f'S: {this_job_no}')
    s=time()
    
    while (response:=queue_2.get())['this_job_no'] != this_job_no:
        queue_2.put(response) #Place output back in queue_2 for correct process to consume
        
    print(f'R: {this_job_no} [{round(time()-s,2)}s]')
    
    return response        
    