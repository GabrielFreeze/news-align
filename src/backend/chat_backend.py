import os
import torch
import chromadb
from typing import List
from random import randint
from threading import Thread
from datetime import datetime as dt
# from auto_gptq import exllama_set_max_input_length
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer, StoppingCriteria, \
                         StoppingCriteriaList, TextIteratorStreamer
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction, format_document                         


class GlobalBackend:
    def __init__(self,
                 model_id:str,
                 hf_token:str,
                 revision:str='main',
                 exllama:bool=True):
        
        self.default_from_yr = 2024
        self.default_to_yr   = 2024
        self.default_src_thresh = 0.68

        self.device = f'cuda:{torch.cuda.current_device()}' if torch.cuda.is_available() else 'cpu'
        print(f"Device: {self.device}")

        #Load Retrieval Model & Related
        self.retrieval_model = SentenceTransformer("nomic-ai/nomic-embed-text-v1",trust_remote_code=True,device='cpu')

        self.model     = AutoModelForCausalLM.from_pretrained(model_id,device_map=self.device,token=hf_token,
                                                              torch_dtype=torch.float16,
                                                              offload_folder="offload", revision=revision)
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_id,device_map=self.device,token=hf_token, use_fast=True,
                                                       torch_dtype=torch.float16,offload_folder="offload")

        if exllama:
            self.model = exllama_set_max_input_length(self.model, max_input_length=100_000)
                  
class SessionBackend:
    def __init__(self, vectorDB_name:str="vector_db"):
        #Load device
        self.device = f'cuda:{torch.cuda.current_device()}' if torch.cuda.is_available() else 'cpu'
        print(f"Device: {self.device}")

        self.stop_generation = False
        self.generate_kwargs = dict() # Holds input+hyperparameters to invoke model generation
        self.streamer = None
        self.system_prompt = ""
        with open(os.path.join("lm_prompts","chat_system_prompt.txt"), "r") as f:
            self.system_prompt = f.read()
        
        self.previous_documents = ""
        self.retrieved_EmbDocs = []

        self.vector_db_manager = VectorDB_Manager(vectorDB_name=vectorDB_name)
        self.vector_db_manager.update_range(2024,2024)
        self.url_sources = set() #This will contain current extracted sources
        self.source_header = """<div style="text-align: center; font-size: 24px;">Sources</div>"""        

        return
    
    def update_range(self,from_yr,to_yr):
        return self.vector_db_manager.update_range(from_yr,to_yr)

    def format_sources(self, source) -> str:
        
        return f"Title: {source.title}\n"      + \
               f"Date: {source.date}\n"        + \
               f"URL: {source.url}\n"          + \
               f"Author: {source.author}\n"    + \
               f"News Article: {source.body}\n\n"

    def get_context(self,history,retrieval_model,k:int=20):

        #Extract the user-inputted prompt
        prompt_query = history[-1][0]
        results = self.vector_db_manager.search(prompt_query,n_results=k)
        #TODO: The context articles are already retrieved: They are the points on the spectrum shown on the thumbnail. 
        #Find a way to put them here
        #I'm thinking I will communicate with the chat part and the webext part via an API in order to retrieve
        #the related articles. So here, I need to call the web-ext to give me the related articles.
        #I think its easier to do this instead of integrating both systems so I don't have to code additional logic in the 
        #frontend, as well as I can keep using gradio and then embed gradio as a popup on the web interface.
        
        #Extract meta-data from retrieved items
        context_str = ""
        urls = []
        print('\n\DOCS:\n')

        #Format top k relevant results
        for i,m in enumerate(results[::-1]):
            
            score = m.distance
            
            # score = (self.vector_db_manager
            #              .cos(rtrv_emb := torch.tensor(m.embedding, device=self.device),
            #                   torch.tensor(q_emb, device=self.device))
            #              .detach()
            #              .item())

            #This variable should really be a hyper-parameter
            if score < 0.62:
                continue
            
            context_str += self.format_sources(m)
            self.retrieved_EmbDocs.append(m)
            print(f'{m.date} - {m.title} - {round(score,2)}')
            
        print('\n\n')
        
        return context_str
    
    def format_input(self,history,retrieval_model):

        #Augment latest user query with related news articles
        #Also pass top 3 previously retrieved sources to help with relevance.
        current_documents = self.previous_documents + self.get_context(history,retrieval_model)

        # chat_history = ""
        # last=len(history)-1
        # for i,(user_msg,ai_msg) in enumerate(history):
            
        #     #Latest Queries are prepended with `New`
        #     chat_history += f"{['New ',''][i==last]}Query: {user_msg}\n"
        #     chat_history += f"Assistant: {ai_msg}\n" if i != last else "Assistant: "
        
        # date = augment_date(datetime.today().strftime('%d-%m-%Y'))

        #NOTE: I am experimenting with putting all related articles at the start, then the chat history at the end.
        # Maybe it will help with the AI keeping on topic/conversation.
        #UPDATE: This seems to greatly improve system performance.
        # input_sequence = f'<s>[INST]{self.system_prompt}\nNEWS ARTICLES:{current_documents}\n{chat_history}[/INST]'


        
        messages = []
        #First start with the system prompt and the retrieved news articles
        messages = [{
            "role":"system",
            "content":f"{self.system_prompt}\nNews Articles:\n{current_documents}"
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
        print(self.previous_documents)

        messages = self.format_input(history,g_bk.retrieval_model)

        self.streamer = TextIteratorStreamer(g_bk.tokenizer, timeout=120,skip_prompt=True,skip_special_tokens=False) 

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
            max_new_tokens = 512,
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

    def display_sources(self, thresh):
        return self.source_header + \
               '<div style="font-size: 15px;">'+ \
               "<br>".join([f'<a href="{url}" target=”_blank”>{title}</a>'
                            for url,title,score in self.url_sources if score >= thresh]) + \
               '</div>'

    def update_sources(self,history,thresh,
                       retrieval_model:SentenceTransformer):

        new_url_sources = []

        #Calculate cosine similarity between last response and documents
        #..to find out which documents the AI actually used
        #TODO: I don't know if there is a better approach to do this.
        rsp_emb = torch.tensor(retrieval_model.encode(history[-1][1]), device=self.device)

        for m in self.retrieved_EmbDocs:
            similarity = self.vector_db_manager.cos(
                            torch.tensor(m.embedding, device=self.device),
                            rsp_emb
                        )

            new_url_sources.append((m,similarity))

            
        #Filter previously retrieved documents with only the top 3 similair sources.
        to_add = sorted(new_url_sources,reverse=True,key=lambda x: x[1].detach().cpu())[:3]
        #TODO: This is dumb vvv
        try:
            self.previous_documents += self.format_sources(to_add[0][0])
            self.previous_documents += self.format_sources(to_add[1][0])
            self.previous_documents += self.format_sources(to_add[2][0])
        except:
            pass

        #Format url_sources in set and remove similarity scores
        new_url_sources = set([(m.url,m.title,score) for m,score  in new_url_sources])

        #This is so fucking janky bro        vv
        self.url_sources |= {(f"{randint(0,10e10)}","\n",
                              torch.tensor(1.0,device=self.device))} | new_url_sources 

        #Update sourceBox with new sources based on the threshold
        return self.display_sources(thresh)

    def reset(self):
        self.previous_documents = ""
        self.retrieved_EmbDocs = []
        self.url_sources = set()

        with open("chat_system_prompt.txt", "r") as f:
            self.system_prompt = f.read()

        return

class VectorDB_Manager:
    def __init__(self,vectorDB_name:str='text_collection',
                 from_yr:int=2023,to_yr:int=2024):
        
        self.device = f'cuda:{torch.cuda.current_device()}' if torch.cuda.is_available() else 'cpu'

        self.vectorDB_name = vectorDB_name

        client = chromadb.HttpClient(host="localhost",port=8000)
        txt_fn = TextEmbeddingFunction(remote=True)
        self.vector_db = client.get_or_create_collection(name="text_collection",embedding_function=txt_fn)
        
        
        self.cos = torch.nn.CosineSimilarity(dim=0) #To calculate cosine similarity between embeddings     
        self.from_yr = from_yr
        self.to_yr   = to_yr

        self.MIN_YR = 2018
        self.MAX_YR = 2024

        self.yr_range:List[int] = list(range(from_yr ,to_yr+1))
    
    
    def search(self,query,n_results:int=40):
        
        date = augment_date(dt.today().strftime('%d-%m-%Y'))
        
        
        
        
        
        #Get most relevant articles
        retrieved_docs = self.vector_db.query(
            query_texts=f"Date: {date}\nsearch_query:{query}", #Adding `search_query` improves performance on NomicAI
            n_results=n_results*2,
        )
        
        
        valid_ids = []
        for i,id in enumerate(retrieved_docs[0]['ids']):
            
            this_doc = retrieved_docs['metadatas'][0][i]
            unix_time = dt.strptime(this_doc['date'], "%d-%m-%Y").timestamp()
            
            
            pass
            
        
        
        #TODO:Only consider articles published 6 months before/after query article
        
        # print(retrieved_docs['metadatas'])

    

        #Return top 40 most relevant documents        
        return retrieved_docs

    def update_range(self,from_yr,to_yr):        
        
        #Update new year ranges
        self.from_yr = from_yr
        self.to_yr   = to_yr

        #Get indices
        self.yr_range = list(range(from_yr ,to_yr+1))

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