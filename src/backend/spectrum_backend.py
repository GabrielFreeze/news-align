import json
import torch
import chromadb
import traceback
import numpy as np
from time import time
from PIL import Image
from io import BytesIO
from base64 import b64encode
from common.color import color
from common.payload import data2id
from typing import Union, List, Tuple
from torch.nn.functional import softmax
from backend.gradcam_backend import GradCamManager
from common.article_scraper import ArticleScraper
from lavis.models import load_model_and_preprocess
from common.payload import Payload, GPU_Payload, bytestring2image
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction, add_article

def human_align(input_data):
    
    input_data = np.array([input_data])
    
    #Avoid division by zero by clipping the data slightly
    x = input_data.clip(1e-9,1-1e-9)
    
    #Only apply transformation if its larger than x
    x = np.maximum(
        x - 6 * (x - np.log( x/(1-x) )) + 55,
        input_data*100
    )
    
    x = x.clip(0,100)
    x = x[0]/100
    
    return x.item()

class GPU_Backend():
    def __init__(self) -> None:
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Device: {self.device}")
        
        client = chromadb.HttpClient(host="localhost",port=8000)
        
        self.backup_scraper = ArticleScraper()       
        
        #Initialise Article Vector Database
        self.text_fn = TextEmbeddingFunction(remote=True)
        self.text_collection = client.get_or_create_collection(name="text_collection",embedding_function=self.text_fn)

        #Initialise Image Vector Database
        self.img_fn = ImageEmbeddingFunction(remote=True)
        self.img_collection = client.get_or_create_collection(name="img_collection",embedding_function=self.img_fn)
        
        #To compute similarity scores
        self.itm_model, self.itm_vis, _ = load_model_and_preprocess(name="blip2_image_text_matching",
                                                                    model_type="pretrain", is_eval=True,
                                                                    device=self.device)     
        #To compute generated caption
        self.i2t_model, self.i2t_vis, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco",
                                                                    is_eval=True, device=self.device)

        #The goal of this class is to leverage the already instantiated BLIP model
        #in order not to re-load them to memory while also being compatible with the gradcam library
        class GradCamModelInterface(torch.nn.Module):
            def __init__(self, parent:GPU_Backend):
                super(GradCamModelInterface, self).__init__()

                self.parent = parent
                self.device = self.parent.device
                self.itm_model, self.itm_vis = self.parent.itm_model, self.parent.itm_vis
                self.label = "" #This is set by GradCamManager

                self.targets = [
                    # self.itm_model.visual_encoder.blocks[-1].norm1,
                    # self.itm_model.Qformer.cls.predictions.transform.LayerNorm,
                    self.itm_model.Qformer.bert.encoder.layer[ 0 ].crossattention.self.value,
                    # self.itm_model.Qformer.bert.encoder.layer[-2 ].crossattention.self.value,
                    # self.itm_model.Qformer.bert.encoder.layer[-4 ].crossattention.self.value,
                    # self.itm_model.Qformer.bert.encoder.layer[-6 ].crossattention.self.value,
                    # self.itm_model.Qformer.bert.encoder.layer[-8 ].crossattention.self.value,
                    # self.itm_model.Qformer.bert.encoder.layer[-10].crossattention.self.value,
                ]


            def forward(self, img):   
                outputs = self.itm_model({
                    "image"     : self.itm_vis["eval"](img).unsqueeze(0).to(self.device),
                    "text_input": self.label
                }, match_head="itm")

                prob = outputs.softmax(dim=1)
                return prob
            
            def reshape(self,input_tensor, height=16, width=16):
                remove_cls_token = input_tensor.shape[1] == (height*width)+1
                input_tensor = input_tensor[:, remove_cls_token:, :].reshape(
                    input_tensor.size(0),height, width, input_tensor.size(2)
                )
                
                #Bring the channels to the first dimension, like in CNNs.
                input_tensor = input_tensor.transpose(2, 3).transpose(1, 2)
                return torch.tensor(input_tensor,dtype=torch.float32,device=self.device)

        gradcamModelInterface = GradCamModelInterface(parent=self)
        self.gradcamManager = GradCamManager(gradcamModelInterface)

    
    def __call__(self,payload:GPU_Payload) -> GPU_Payload:
        s=time()
        input_data = {}
        output_data = {}
        error = ""
        this_job_no = -1

        try:    
            input_data  = payload.data
            this_job_no = payload.job_no
            
            #Get similar articles by text
            similar_topic_articles = self._get_similar_articles_by_text(input_data)
            
            #Add this article to the vector database
            article_id = add_article(input_data,self.text_collection,self.img_collection)
            
            if article_id is False:
                print(f'{color.RED}Error while trying to add {color.YELLOW}{input_data["url"]}{color.RED} to vector database {color.ESC}')
                article_id = -1 #This is to specify to the chatbot that this article is not added to the vector database
            
            
            thumbnail_info = [] #Information about the thumbnail of the article
            
            #Extract thumbnail data from the related articles
            for a in similar_topic_articles:

                #If there are no img_ids, then just skip this similar_topic_article
                if a['img_ids'] == "":
                    continue
                                
                img_ids = a['img_ids'].split(',')
                
                thumbnail = self.img_collection.get(
                    ids=img_ids[0], #First img_id is the thumbnail
                )
                
                if thumbnail['documents']:
                    thumbnail_bytestring = thumbnail['documents'][0]
                else:
                    #TODO: Add thumbnail to vector datbase if img_collection.get() returned empty
                    continue #TEMP
                    thumbnail = self.backup_scraper.scrape(a['url']).data
                    thumbnail_bytestring = thumbnail['imgs'][0]['data']
                
                thumbnail_data = bytestring2image(thumbnail_bytestring) #Load image from bytestring
                
                #Load metadata.
                #TEMP: Curerently multiple instances of an image are recorded as a JSON encoded string in the values,
                #instead of having a seperate table with a one-to-many relationship.
                thumbnail_metadata = {key:json.loads(value) for key,value in thumbnail['metadatas'][0].items()}
                
                #An image can have multiple selectors corresponding to different uses of the image across many articles
                #We want to get the selector that corresponds to the article we found the image from /only/.
                #We don't want the selectors of the other articles.
                thumbnail_selector = [
                    selector
                    for i,selector in enumerate(thumbnail_metadata['selectors'])
                    if thumbnail_metadata['article_ids'][i] == a['id']
                    #  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    #Get the selector which corresponds to the similar article we found, by comparing the article_id
                ][0]
                                  
                thumbnail_info.append({
                    "id"       : a['id'],
                    "selector" : thumbnail_selector,
                    "url"      : a['url'],
                    "newspaper": a['newspaper'],
                    "title"    : a['title'],
                    
                    #Get Thumbnail Similarity Score to Title of article
                    "title_simil": human_align( #Perform transformation on the scores to be more aligned with human preferences
                        self._img_text_matching({"data":thumbnail_data, "alt":a['title']})[0]
                    ),
                    
                    #Get Thumbnail Similarity Score to Body of article
                    "body_simil": human_align(
                        self._img_text_matching({"data":thumbnail_data, "alt":a['body']})[0]
                    )
                })
                
            
            #                                   ╔═══════════════╗
            #                                   ↓               ║ 
            #Adding the thumbnail of the current article as if it was a similar topic article.
            #                            ^^^^^^^^^^^^^^^       ^^
            this_thumbnail_data = bytestring2image(input_data['imgs'][0]['data'])
            thumbnail_info.insert(0,{
                "id"         : article_id, #NOTE:article_id = the id of the newly added current article
                "selector"   : (k:=input_data['imgs'][0]['css-selector']),
                "selector_id": data2id(k), #I only need the selector_id for the current thumbnail.
                "url"        : input_data['url'],
                "newspaper"  : input_data['newspaper'],
                "title"      : input_data['title'],
                
                "title_simil": human_align(
                    self._img_text_matching({"data":this_thumbnail_data, "alt":input_data['title']})[0]
                ),
                "body_simil" : human_align(
                    self._img_text_matching({"data":this_thumbnail_data, "alt":input_data['body']})[0]
                ),
                
                "title_simil_gradcam": numpy2bytestring(
                    self.gradcamManager(img=this_thumbnail_data,txt=input_data['title'],aug_smooth=True,eigen_smooth=True)
                )
            })
            
            
            print(f'[{this_job_no}] Similair Articles ({len(thumbnail_info)}) By Text Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            s=time()
            
            #Extract image data for every image in the key article
            similar_image_articles_per_img = self._get_similar_articles_by_images(input_data,include_self=True)
            
            #Number of keys must be same length as number of images in article
            images_info = {} #Information about the images of the article
            
            image_counter = 0
            
            #Loop through the results of every image in the key article
            for key_img, sim_image_articles_info in zip(
                input_data['imgs'], #The image in the article
                similar_image_articles_per_img #The retrieved images similair to that image
            ):
                #Will hold the info of the retrieved similar images for this image in the key article
                this_image_info = []
                #One image in the key article has multiple similar images
                for one_sim_img_infos in sim_image_articles_info:

                    #One similar image has multiple occurences. (We need to list these all)
                    for i,article_metadata in enumerate(one_sim_img_infos['article_metadatas']):
                        image_counter += 1
                        #All values in the dictionary that is being appended are single scalar values
                        this_image_info.append({                               # ^^^^^^^^^^^^^^^^^^^^
                            "caption_simil": human_align(
                                self._img_text_matching({
                                    "data": one_sim_img_infos['bytestring'],
                                    "alt" : one_sim_img_infos['captions'][i]
                                })
                            ),
                            "gen_txt"      : self._get_gencap(one_sim_img_infos['bytestring']),
                            "selector"     : (k:=one_sim_img_infos['selectors'][i]),
                            "selector_id"  : data2id(k),
                            "newspaper"    : article_metadata['newspaper'],
                            "url"          : article_metadata['url'],
                        })
                
                #Add key_img entry
                if (img_selector:=key_img['css-selector']) not in images_info:
                    images_info[img_selector] = []
                images_info[img_selector].append(this_image_info)
            
            print(f'[{this_job_no}] Similair Articles ({image_counter}) By Images Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            
            #Format output data              
            output_data = {"thumbnail_info": thumbnail_info,
                           "images_info"   : images_info}
                        
        except Exception as e:
            traceback.print_exc()
            error = f"Unexpected Error: {traceback.format_exc()}"
                
        return GPU_Payload(job_no=this_job_no,
                           payload=Payload(data=output_data,error=error))
        
    # TODO: Look up similair articles (by text or image) and use the articles as additional context when calculating the scores
    def _img_text_matching(self,imgs:Union[List[dict],dict]) -> List[dict]:
        
        if not type(imgs) is list:
            imgs = [imgs]
        
        scores = []
        for img in imgs:
            
            #Image Data and Image Alt
            if img['data'] and img['alt']:
                
                if type(img['data']) is str:
                    img['data'] = bytestring2image(img['data'])
            
                score = self.itm_model({
                    "image"     : self.itm_vis["eval"](img['data']).unsqueeze(0).to(self.device),
                    "text_input": img['alt']
                }, match_head="itm")
                score = softmax(score,dim=1)[:,1].item()       
                            
            else:
                score = -1
                        
            #Add element to result
            scores.append(score)
            
        return scores
  
    def _get_gencap(self, img:Union[Image.Image,str], max_length:int=70) ->  str:
        
        if type(img) is str:
            img = bytestring2image(img)
        
        img = self.i2t_vis["eval"](img).unsqueeze(0).to(self.device)
        
        #Perform image-to-text on every image
        return self.i2t_model.generate({"image":img},
                                       max_length=max_length)

    def _get_similar_articles_by_text(self, data:dict):
            
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

    def _get_similar_articles_by_images(self,data:dict,
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
    
def format_document(payload_data:dict,query:bool=False):
        captions = json.dumps([img['alt'] or "" for img in payload_data['imgs']])
        return f"search_{['document','query'][query]}:{payload_data['title']}. {payload_data['body']}. {captions}"

def numpy2bytestring(img:np.array, img_format="JPEG") -> str:
    assert len(img.shape) == 3

    with BytesIO() as buffer:
        Image.fromarray(img).save(buffer, format=img_format)
        base64_string = b64encode(buffer.getvalue()).decode("ascii")
    
    return base64_string