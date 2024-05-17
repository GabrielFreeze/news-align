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
from common.payload import Payload, GPU_Payload
from common.article_scraper import ArticleScraper
from lavis.models import load_model_and_preprocess
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction, format_document

class GPU_Backend():
    def __init__(self) -> None:
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Device: {self.device}")
        
        client = chromadb.HttpClient(host="localhost",port=8000)
        
        
        self.backup_scraper = ArticleScraper()       
        
        self.text_fn = TextEmbeddingFunction(remote=True)
        self.text_collection = client.get_or_create_collection(name="text_collection",embedding_function=self.text_fn)

        #Initialise Image Vector Database
        self.img_fn = ImageEmbeddingFunction(remote=True)
        self.img_collection = client.get_or_create_collection(name="img_collection",embedding_function=self.img_fn)
        
        self.itm_model, self.itm_vis, _ = load_model_and_preprocess(name="blip2_image_text_matching",
                                                                           model_type="pretrain", is_eval=True,
                                                                           device=self.device)     
        
        self.i2t_model, self.i2t_vis, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco",
                                                                    is_eval=True, device=self.device)     
    
    def __call__(self,payload:GPU_Payload) -> GPU_Payload:
        s=time()
        data = {}
        error = ""
        this_job_no = -1

        try:    
            data        = payload.data
            this_job_no = payload.job_no
                        
            #Get similar articles by text (key_article included)
            similar_topic_articles = self._get_similar_articles_by_text(data)
            thumbnail_infos = []
            
            #Extract thumbnail data from the related articles
            for a in similar_topic_articles:
                thumbnail = self.img_collection.get(
                    ids=a['img_ids'].split(',')[0]
                )
                
                thumbnail_bytestring = thumbnail['documents'][0] or self.backup_scraper.scrape(a['url']).data['imgs'][0]['data']
                #                                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                #Older entries in the vector database dont have their bytestring, so we re-download it.
                
                thumbnail_data = self._bytestring2image(thumbnail_bytestring), #Load image from bytestring
                
                thumbnail_infos.append({
                    #"data": thumbnail_data,
                    "selector": thumbnail['metadatas'][0]['selector'],
                    "url": a['url'],
                    "newspaper": a['newspaper'],
                    
                    
                    #Get Thumbnail Similarity Score to Title of article
                    "title-simil": self._img_text_matching({"data":thumbnail_data,"alt":a['title']}),
                    
                    "body-simil": self._img_text_matching({"data":thumbnail_data,"alt":a['body']})
                })
            
            
            #Extract image data for every image in the key article
            similar_image_articles = self._get_similar_articles_by_images
                    
            #TODO: From here

            
           
            # #Get selector of thumbnail article
            # thumbnail = self.img_collection.get(
            #     #ID of thumbnail is first in list
            #     ids=metadata['img_ids'].split(',')[0] #Get the first image id aka the thumbnail
            #     #                                 ^^^ 
            # )
            
            # thumbnail_selector = thumbnail['metadatas'][0]['selector']
            # thumbnail_caption  = thumbnail['metadatas'][0]['caption']
            # thumbnail_data     = thumbnail['documents'][0] or self.backup_scraper.scrape(metadata['url']).data['imgs'][0]['data']
            # #                                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            # #Older entries in the vector database dont have their bytestring, so we re-download it.
            
            # related.append({
            #     "rating": 1-d, #Turns distance into score
            #     "alt":    thumbnail_caption,
            #     "data":   self._bytestring2image(
            #         thumbnail_data
            #     ),
            #     "css-selector": thumbnail_selector,
            #     "newspaper":    metadata['newspaper'],
            #     "url":          metadata['url'],
            # })
        
            
            #Compute for front image and title
            front_body = self._img_text_matching(
                {"data":data['imgs'][0]['data'],
                 "alt":data['body'],
                 "css-selector":data['imgs'][0]['css-selector']}
            )
            
            #Compute for all img_txt pairs
            img_txt = self._img_text_matching(
                data['imgs']
            )
            
            print(f'[{this_job_no}] Images Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            s=time()
            
            #Format data              
            data = {"front_title"  : front_title,
                    "front_body"   : front_body ,
                    "img_txt"      : img_txt    }
                        
        except Exception as e:
            traceback.print_exc()
            error = f"Unexpected Error: {traceback.format_exc()}"
                
        return GPU_Payload(job_no=this_job_no,
                           payload=Payload(data=data,error=error))
    
    #TODO: Look up similair articles (by text or image) and use the articles as additional context when calculating the scores
   
    def _img_text_matching(self,imgs:Union[List[dict],dict]) -> List[dict]:
        
        if not type(imgs) is list:
            imgs = [imgs]
        
        scores = []
        for img in imgs:
            
            #Image Data and Image Alt
            if img['data'] and img['alt']:
                img_data = self.itm_vis["eval"](img['data']).unsqueeze(0).to(self.device)
                score = self.itm_model({"image":img_data, "text_input": img['alt']}, match_head="itm")
                score = softmax(score,dim=1)[:,1].item()
                img['score'] = score
                            
            else:
                img['score'] = -1
                        
            #Add element to result
            scores.append(img)
            
        return scores
 
 
    def _get_similar_articles_by_images(self,imgs:list,
                                       include_self:bool=True):      
        
        def get_similar_images(img_bytestring:str):
                        
            related = []
            if include_self:
                key_img = self.img_collection.get(ids=data2id(img_bytestring))
                related.append(key_img['metadatas'][0])
            
            '''We pass as `query_texts` instead of `query_images` because
            the search_img is represented as a bytesting,
            which will then be converted to an image by `img_fn`'''
            
            #Get top-k similar images
            retrieved_images = self.img_collection.query(
                query_texts=img_bytestring,
                n_results=15,                
            )
                    
            #Get the metadatas of every similar image retrieved
            related += [metadata
                        for d,metadata in zip(retrieved_images['metadatas'][0],
                                              retrieved_images['metadatas'][0])
                        if d]
            #              ^^^
            #TODO: implement a threshold
               
            return related
        
        articles_per_img = []
        
        for img in imgs:
            corresponding_articles_per_sim_img = []
            similar_images = get_similar_images(img['data'])
            
            for sim_img in similar_images:    
                
                #This list contains information on where every sim_img appears.
                corresponding_articles_per_sim_img.append({
                    
                    #Get all articles where sim_img appears
                    "metadatas":  self.text_collection.get(
                        ids=json.loads(sim_img['article_ids'])
                    )['metadatas'],
                    
                    #Get the selectors of the image within the articles
                    "selectors" : json.loads(sim_img['selector']) #This is a list
                })
            
            articles_per_img.append(
                corresponding_articles_per_sim_img
            )
        
        return articles_per_img
                
                
                
            
            
            
            
            
            
            
            
            
        
        
        # related_articles_per_img = [
        #     {
        #         "article_metadata": self.text_collection.get(
        #             ids=get_related_article_ids_by_one_image(img['data'])
        #         )["metadatas"],
                
        #     }
            
            
            
        #     for img in imgs #For every image (in the key article)
        # ]

        return related_articles_per_img
            
    def _get_similar_articles_by_text(self,data:dict,
                                      include_self:bool=True):
        
        #Include the key article as part of the results.
        if include_self: 
            key_article = self.text_collection.get(ids=data2id(data))
            key_article["metadatas"][0]["distance"] = key_article['distances'][0]
            related.append(key_article["metadatas"][0])
            
        
        #Get top-k similar articles
        search_doc = format_document(data,query=True)
        retrieved_articles = self.text_collection.query(
            query_texts=search_doc,
            n_results=15,
        )
        
        related = []
        
        for d,metadata in zip(retrieved_articles['distances'][0],
                              retrieved_articles['metadatas'][0]):
            
            #If key article and retrieved article do not talk about the same event
            if d > 0.4:
                continue
            
            #If key article and retrieved article are duplicate
            if d <= 0.05 and data['newspaper'] == metadata['newspaper']:
                continue
            
            #Add distance to article info
            metadata['distance'] = d
            
            related.append(metadata)
            
        return related
  
    def _get_gencap(self, img:Image.Image, max_length:int=70) ->  str:
        
        img = self.i2t_vis["eval"](img).unsqueeze(0).to(self.device)
        
        #Perform image-to-text on every image
        return self.i2t_model.generate({"image":img},
                                       max_length=max_length)
   
    #Decode Images
    def _bytestring2image(self,bytestring:str):
        return Image.open(BytesIO(b64decode(
            bytestring
        ))).convert("RGB")
  