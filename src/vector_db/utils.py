import os
import json
import time
import torch
import chromadb
import requests
import traceback
import numpy as np
from PIL import Image
from common.color import color
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
from common.payload import bytestring2image,data2id
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
            #Import is here so when TextEmbeddingFunction is imported lavis is not a dependency
            from lavis.models import load_model_and_preprocess 
            self.model, self.vis_processors, self.txt_processors = (
                load_model_and_preprocess(name="blip2_feature_extractor",model_type="pretrain",is_eval=True,device=self.device)
            )
            self.model.eval()
        
    def process_input(self, input) -> Embeddings:

        if type(input) is str:
            input = bytestring2image(input)
        elif type(input) is np.ndarray:
            input = Image.fromarray(input)
        elif type(input) is list:
            input = bytestring2image(input[0])
        
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
            self.model = AutoModel.from_pretrained("nomic-ai/nomic-embed-text-v1", trust_remote_code=True,local_files_only=True)
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

def get_similar_articles_by_text(self, data:dict):
           
        #Get top-k similar articles
        search_doc = format_document(data,query=True)
        retrieved_articles = self.text_collection.query(
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



def add_article(data:dict,
                txt_collection:chromadb.Collection,
                img_collection:chromadb.Collection):
    
    # == GET ARTICLE ID ==
    document = format_document(data)
    #Encode entire payload. If id is different, then the article is new/(was updated).
    article_id = data2id(data)
    
    #Discard non-unique articles. Non-unique articles mean that the img-txt pairs are not unique
    if article_id in txt_collection.get()['ids']:
        print(f"{color.YELLOW}Article is non-unique... Skipping{color.ESC}",end='\r')
        
        # txt_collection.delete(ids=article_id) #TEMP: Replace previously collected articles
        return article_id
    print(f"[{data['newspaper']}] {color.UNDERLINE}{data['title'][:50]}...{color.ESC}")
    img_ids = []
    
    #== ADD IMAGES TO VECTOR DATABASE ==
    for i,img_payload in enumerate(data['imgs']):
        try:
            txt = img_payload['alt'] or ""
            byte_string = img_payload["data"]
            selector = img_payload['css-selector']
            
            if byte_string == "":
                print(f"{color.YELLOW}Image data is empty... Skipping{color.ESC}")
                continue

            img_id = data2id(byte_string)
            img_ids.append(img_id) #Keep track of ALL image_ids of the current article
            
            '''In the case of a repeated image, we just want to update the metadata,
            so we keep track of all articles that featured the image'''

            #TODO: You are appending the css-selector in order to locate this image,
            #however since one css-selector can have multiple images allocated to it,
            #you are not recording the position of the image within the css-selector.
            #As a result, from the css-selector alone, we only get the position of
            #the group of images which our key image is contained in, not the specific position.

            #Update image in vector database
            if img_metadata:=img_collection.get(ids=img_id)['metadatas']:
                img_metadata = img_metadata[0]
                
                #We have already recorded this image in this article, so we don't need to update
                if article_id in json.loads(img_metadata['article_ids']):
                    continue

                #Add this article_id into the JSON list of article_ids.
                img_metadata['article_ids'] = json.dumps(
                    json.loads(img_metadata['article_ids']) + [article_id]
                )
                
                #Add this current caption (txt) into the JSON list of captions.
                img_metadata['captions'] = json.dumps(
                    json.loads(img_metadata['captions']) + [txt]
                )
                
                #Add this image selector into the JSON list of selectors.
                img_metadata['selectors'] = json.dumps(
                    json.loads(img_metadata['selectors']) + [selector]
                )
                
                #Update the entry
                img_collection.update(
                    ids=img_id,
                    metadatas=img_metadata
                )

            else:
                #Add image to vector database
                img_collection.add(

                    documents=byte_string,
                    
                    #NOTE: I think I don't need to supply the embeddings since img_fn is applied to documents automatically.
                    #However at this point in time [11:13AM 8-8-2024] I still haven't confirmed it yet.
                    # embeddings=img_fn(byte_string),
                    
                    #Adding the current caption, url and css-selector to the metadata.
                    
                    #TEMP:We put every field in a json.dumps([]) because the image
                    #might have multiple article_ids/captions/selectors across different articles
                    #TODO:Make another table
                    metadatas={
                        #Add reference to article entry in article database
                        "article_ids": json.dumps([article_id]),
                        "captions"   : json.dumps([txt]),
                        "selectors"  : json.dumps([selector]),
                    },
                    
                    #ID is the hashed img.
                    ids=img_id
                )
                
        except Exception as e:
            traceback.print_exc()
            return False
    print(f"\n{'='*45}\n")
            
    #== ADD ARTICLE TO VECTOR DATABASE ==
    txt_collection.add(
        documents=document,
        metadatas={
            "newspaper":data['newspaper'],
            "url"      :data['url'],
            "title"    :data['title'],
            "img_ids"  :",".join(img_ids), #Add reference to image entries in image database
            "body"     :data['body'],
            "author"   :data['author'],
            "date"     :data['date']
        },
        
        #ID is the hashed document, so we can detect any changes in the article.
        ids=article_id
    )
    
    return article_id