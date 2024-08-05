import os
import json
import torch
import requests
import numpy as np
from PIL import Image
import torch.nn.functional as F
from common.payload import bytestring2image
from transformers import AutoTokenizer, AutoModel
from lavis.models import load_model_and_preprocess
from chromadb import Embeddings, EmbeddingFunction as _EmbeddingFunction

class EmbeddingFunction(_EmbeddingFunction):    
    def __init__(self, remote:bool=False):
        super().__init__()
        
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.remote = remote
                
    def __call__(self,input):

        if self.remote:
            
            #Request for the input to be embedded then return the response
            endpoint = {TextEmbeddingFunction :'text',
                        ImageEmbeddingFunction:'img'}[type(self)]
            
            
            response = requests.post(
                url=f"http://localhost:8001/{endpoint}",
                json={"input": input}
            )
            
            return response.json()
            
        else:
            return self.process_input(input)
        
    def process_input(self,input):
        raise NotImplementedError("Subclasses must implement `process_input` method")
        
class ImageEmbeddingFunction(EmbeddingFunction):
    def __init__(self,**kwargs) -> None:
        super().__init__(**kwargs)
        
        if not self.remote:
            self.model, self.vis_processors, self.txt_processors = (
                load_model_and_preprocess(name="blip2_feature_extractor",model_type="pretrain",is_eval=True,device=self.device)
            )
            self.model.eval()
        

    def process_input(self, input) -> Embeddings:

        if type(input) is str:
            input = bytestring2image(input)
        elif type(input) is np.ndarray:
            input = Image.fromarray(input)
        
        embedding = self.model.extract_features({
                "image"     : self.vis_processors["eval"](input).unsqueeze(0).to(self.device),
                "text_input": None
            },mode="image",
        ).image_embeds
        
        return embedding.squeeze().flatten().tolist()
        
class TextEmbeddingFunction(EmbeddingFunction):
    def __init__(self,**kwargs) -> None:
        super().__init__(**kwargs)
        
        # self.embedding_prompt = "Represent this news article for searching relevant passages about events, people, dates, and facts."
        with open(os.path.join("lm_prompts","retrieval_system_prompt.txt"), "r", encoding='utf-8') as f:
            
            self.embedding_prompt = f.read()
        
        
        if not self.remote:
            self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
            self.model = AutoModel.from_pretrained("nomic-ai/nomic-embed-text-v1", trust_remote_code=True)
            self.model.eval()
        
    def process_input(self, input) -> Embeddings:   
        encoded_input = self.tokenizer(input, padding=True,truncation=True, return_tensors='pt')

        with torch.no_grad():
            model_output = self.model(**encoded_input)
            embeddings = self.normalize(model_output,encoded_input['attention_mask'])
        
        return embeddings.tolist()
    
    def normalize(self,model_output, attention_mask):
        
        token_embeddings = model_output[0]
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        
        embeddings = torch.sum(token_embeddings * input_mask_expanded, 1) / \
                     torch.clamp(input_mask_expanded.sum(1), min=1e-9)
                     
        embeddings = F.normalize(embeddings, p=2, dim=1)
        
        return embeddings


def format_document(payload_data:dict,query:bool=False):
    captions = json.dumps([img['alt'] or "" for img in payload_data['imgs']])
    return f"search_{['document','query'][query]}:{payload_data['title']}. {payload_data['body']}. {captions}"

def get_similar_articles_by_text(vectordb, data:dict):
           
        #Get top-k similar articles
        search_doc = format_document(data,query=True)
        retrieved_articles = vectordb.query(
            query_texts=search_doc,
            n_results=15,
        )
        
        related = []
        
        for id,distance,metadata in zip(retrieved_articles['ids'][0],
                                        retrieved_articles['distances'][0],
                                        retrieved_articles['metadatas'][0]):
            
            print(distance,metadata['title'])
            
            #If key article and retrieved article do not talk about the same event
            if distance > 0.45:
                continue
            
            #If key article and retrieved article are duplicate
            if distance <= 0.05 and data['newspaper'] == metadata['newspaper']:
                continue
            
            #Add distance to article info
            metadata['distance'] = distance
            
            #Add id to article info
            metadata['id'] = id
            
            related.append(metadata)
            
        return related

def get_similar_articles_by_images(self,data:dict,
                                       include_self:bool=False):      
        
    def get_similar_images(img_bytestring:str):
                    
        related = []                     
        
        #Get top-k similar images
        retrieved_images = self.img_collection.query(
            #Hekk biss taħdem, għax inkella jiġi bil-ħara man, afdani.
            query_texts=img_bytestring, 
            n_results=15,                
        )
        
        #Get the metadatas of every similar image retrieved        
        for distance, bytestring, metadata in zip(retrieved_images['distances'][0],
                                                    retrieved_images['documents'][0],
                                                    retrieved_images['metadatas'][0]):
            #TODO: implement a threshold here    
            if distance > 1000: #Dan in-numru ħareġ minn sormi.
                continue
        
            #Include image data
            metadata['data'] = bytestring
            related.append(metadata)
        
        return related
    
    #Every element of this list corresponds to every image in the article
    articles_per_img = []
    
    for i,img in enumerate(data['imgs']):
        articles_per_sim_img_of_img = []
        
        if include_self:
            #NOTE: We have to do this because the key article might not be currently indexed by the vectorDB
            key_article_metadatas = {
                "distance" : 0,
                "url"      : data['url'],
                "newspaper": data['newspaper'],
                "title"    : data['title'],
                "body:"    : data['body'],
                
                #TODO: I am copying the same process in `listener.py`. I should put this in a function
                #TODO: Naming convention of dict needs to be standardized (eg. alt vs captions, selectors vs css-selectors)
                "img_ids"  : ",".join([
                    data2id(img_payload["data"])
                    for img_payload in data['imgs']
                ])
            }
            
            articles_per_sim_img_of_img.append({
                #Matching below format.
                "article_metadatas" : [key_article_metadatas],
                "selectors" : [img['css-selector']],
                "captions"  : [img['alt']],
                "bytestring": img['data']
            })
                    
        for sim_img in get_similar_images(img['data']):    
            
            #This list contains information on where every sim_img appears.
            articles_per_sim_img_of_img.append({
                
                #Get all articles where sim_img appears
                "article_metadatas":  self.text_collection.get(
                    ids=json.loads(sim_img['article_ids'])
                )['metadatas'],
                
                #Get the selectors of the image within the articles
                "selectors" : json.loads(sim_img['selectors']), #This is a list
                
                #Get the captions of the image within the articles
                "captions": json.loads(sim_img['captions']), #This is a list
                
                #Bytestring is not a list because the image data remains the same despite being in many articles and positions
                "bytestring": sim_img['data']
            })
        
        
        #Every image in the article will contain a list of articles where that image is approximated
        articles_per_img.append(
            articles_per_sim_img_of_img
        )
    
    return articles_per_img