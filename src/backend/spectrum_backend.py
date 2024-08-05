import json
import torch
import chromadb
import traceback
from time import time
from PIL import Image
from io import BytesIO
from base64 import b64decode
from common.color import color
from common.payload import data2id
from typing import Union, List, Tuple
from torch.nn.functional import softmax
from common.article_scraper import ArticleScraper
from lavis.models import load_model_and_preprocess
from common.payload import Payload, GPU_Payload, bytestring2image
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction,\
                            get_similar_articles_by_text,get_similar_articles_by_images

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
            
            thumbnail_info = [] #Information about the thumbnail of the article
            
            #Extract thumbnail data from the related articles
            for a in similar_topic_articles:

                if a['img_ids'] == "":
                    #If there are no img_ids, then just skip this similar_topic_article
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
                    #"data": thumbnail_data,
                    "selector" : thumbnail_selector,
                    "url"      : a['url'],
                    "newspaper": a['newspaper'],
                    "title"    : a['title'],
                    
                    #Get Thumbnail Similarity Score to Title of article
                    "title_simil": self._img_text_matching({"data":thumbnail_data, "alt":a['title']})[0],
                    
                    #Get Thumbnail Similarity Score to Body of article
                    "body_simil": self._img_text_matching({"data":thumbnail_data, "alt":a['body']})[0]
                })
            
            #                                   ╔═══════════════╗
            #                                   ↓               ║ 
            #Adding the thumbnail of the current article as if it was a similar topic article.
            #                            ^^^^^^^^^^^^^^^       ^^
            this_thumbnail_data = bytestring2image(input_data['imgs'][0]['data'])
            thumbnail_info.insert(0,{
                "selector"   : (k:=input_data['imgs'][0]['css-selector']),
                "selector_id": data2id(k), #I only need the selector_id for the current thumbnail.
                "url"        : input_data['url'],
                "newspaper"  : input_data['newspaper'],
                "title"      : input_data['title'],
                
                "title_simil": self._img_text_matching({"data":this_thumbnail_data, "alt":input_data['title']})[0],
                "body_simil" : self._img_text_matching({"data":this_thumbnail_data, "alt":input_data['body']}) [0]
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
                            "caption_simil": self._img_text_matching({
                                "data": one_sim_img_infos['bytestring'],
                                "alt" : one_sim_img_infos['captions'][i],
                            }),
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
  
    def _get_similar_articles_by_images(self,data:dict,
                                       include_self:bool=False):      
        
        return get_similar_articles_by_images(self.text_collection,data,include_self)

                       
    def _get_similar_articles_by_text(self,data:dict):
        return get_similar_articles_by_text(self.text_collection,data)
  
    def _get_gencap(self, img:Union[Image.Image,str], max_length:int=70) ->  str:
        
        if type(img) is str:
            img = bytestring2image(img)
        
        img = self.i2t_vis["eval"](img).unsqueeze(0).to(self.device)
        
        #Perform image-to-text on every image
        return self.i2t_model.generate({"image":img},
                                       max_length=max_length)
