import os
import torch
import chromadb
from typing import List
from random import randint
from threading import Thread
from common.color import color
from datetime import datetime as dt
from transformers import BitsAndBytesConfig
from vector_db.utils import TextEmbeddingFunction
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer, StoppingCriteria, StoppingCriteriaList, TextIteratorStreamer

                        

class GlobalBackend:
    def __init__(self,model_id:str,revision:str='main'):
                
        self.default_src_thresh = 0.68

        self.device = f'cuda:{torch.cuda.current_device()}' if torch.cuda.is_available() else 'cpu'
        print(f"Device: {self.device}")

        if "HF_TOKEN" in os.environ:
            hf_token = os.environ["HF_TOKEN"]
        else:
            hf_token = ""
            print(f'{color.YELLOW}HuggingFace token not set!\n{color.ESC} Powershell:{color.BLUE} $env:HF_TOKEN="<YOUR_TOKEN>"{color.ESC}')
        
        #Vector Database client used to retrieve context documents
        chromadb_client = chromadb.HttpClient(host="localhost",port=8000)
        txt_fn = TextEmbeddingFunction(remote=True)
        self.vector_db = chromadb_client.get_or_create_collection(name="text_collection",embedding_function=txt_fn)
        

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
        )
        
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        

        #Chat Model
        self.model     = AutoModelForCausalLM.from_pretrained(model_id,device_map=self.device,token=hf_token,
                                                              quantization_config=bnb_config,revision=revision,
                                                              attn_implementation="flash_attention_2")
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_id,device_map=self.device,token=hf_token,use_fast=True,
                                                       quantization_config=bnb_config,
                                                       attn_implementation="flash_attention_2")

                  
class SessionBackend:
    def __init__(self):
        
        #Load device
        self.device = f'cuda:{torch.cuda.current_device()}' if torch.cuda.is_available() else 'cpu'
        print(f"Device: {self.device}")

        self.stop_generation = False
        self.generate_kwargs = dict() # Holds input+hyperparameters to invoke model generation
        self.streamer = None
        self.context_str = ""
        
        self.system_prompt = ""
        with open(os.path.join("lm_prompts","chat_system_prompt.txt"), "r") as f:
            self.system_prompt = f.read()

        return
    
    def set_context_docs(self,ids:List, g_bk:GlobalBackend):
        context_docs = g_bk.vector_db.get(ids)['metadatas']
        #This string is prepended to the chat history so the LLM has context about the articles
        self.context_str = "".join([self.format_sources(doc) for doc in context_docs])
        
        if self.context_str == "":
            print(f'{color.RED}GET parameters context IDs could not be parsed {color.ESC}')
        
    def format_input(self,history):

        #Augment latest user query with related news articles
            
        messages = []
        #First start with the system prompt and the retrieved context news articles
        messages = [{
            "role":"system",
            "content":f"{self.system_prompt}\nNews Articles:\n{self.context_str}"
        }]
        
        last=len(history)-1
        for i,(user_msg,ai_msg) in enumerate(history):
            
            #Append the user's message
            messages.append({
                "role":"user",
                "content": user_msg 
                        #    if i!=0 else f"{self.system_prompt}\nNews Articles: \n{current_documents}\nQuery: {user_msg}"
            })

            #Append the AI's message.
            if i != last:
                messages.append({
                    "role":"assistant",
                    "content":ai_msg
                })

        return messages

    def prepare_streamer(self, history, g_bk:GlobalBackend):
        messages = self.format_input(history)

        self.streamer = TextIteratorStreamer(g_bk.tokenizer, timeout=300,skip_prompt=True,skip_special_tokens=False) 

        #Initialise Model
        input_tokens = g_bk.tokenizer.apply_chat_template(
            messages,
            return_tensors="pt",
            add_generation_prompt=True
        ).to(self.device)
        
        #Arguments to pass to g_bk.model upon generation
        self.generate_kwargs = dict(
            input_ids      = input_tokens,
            attention_mask = torch.ones_like(input_tokens, device=self.device),
            streamer       = self.streamer,
            max_new_tokens = 1024,
            do_sample      = True,
            top_p          = 0.90,
            temperature    = 0.4,
            num_beams      = 1,
            eos_token_id = [
                g_bk.tokenizer.eos_token_id,
                g_bk.tokenizer.convert_tokens_to_ids("<|eot_id|>")
           ],
        )
                
        return

    def stream_response(self,history,g_bk:GlobalBackend):

        #Invoke Model
        t = Thread(target=g_bk.model.generate, kwargs=self.generate_kwargs)
        t.start()
               
        #Stream response
        history[-1][1] = "" 
        for i,token in enumerate(self.streamer):
            if self.stop_generation:
                return ""
            
            history[-1][1] += token
            yield history

    def format_sources(self, source) -> str:

        return f"Title: {source['title']}\n"      + \
               f"Date: {source['date']}\n"        + \
               f"URL: {source['url']}\n"          + \
               f"Author: {source['author']}\n"    + \
               f"News Article: {source['body']}\n\n"
    
    def reset(self):
        
        #Context articles are stored in the system prompt
        with open(os.path.join("lm_prompts","chat_system_prompt.txt"), "r") as f:
            self.system_prompt = f.read()

        return


class StopOnTokens(StoppingCriteria):
    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:       

        for stop_id in []:
            if input_ids[0][-1] == stop_id:
                return True
        return False

def augment_date(date:str):
        
    #31 suffices that follow the day
    sfx = ['st','nd','rd','th','th','th','th',
           'th','th','th','th','th','th','th',
           'th','th','th','th','th','th','st',
           'nd','rd','th','th','th','th','th',
           'th','th','st']

    old_date = date

    try:
        date = dt.strptime(date, '%d-%m-%Y') if date != 'NULL' else 'NULL'
    except: date = dt.strptime(date, '%Y-%m-%d') if date != 'NULL' else 'NULL'
    
    date = date.strftime(f'%B %d{sfx[date.day-1]} %Y')\
                         if date != 'NULL' else 'NULL'

    
    date += ' ('+old_date+')' #Add numerical format in brackets
    
    return date