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
            similar_topic_articles = self._get_similar_articles_by_text(data,include_self=True)
            thumbnails_info = [] #Information about the thumbnail of the article
            
            #Extract thumbnail data from the related articles
            for a in similar_topic_articles:
                
                if len(img_ids:=a['img_ids'].split(',')) == 1:
                    #If there are no img_ids, then just skip this similar_topic_article
                    continue
                
                thumbnail = self.img_collection.get(
                    ids=img_ids[0] #First img_id is the thumbnail
                )
                
                thumbnail_bytestring = thumbnail['documents'][0] or self.backup_scraper.scrape(a['url']).data['imgs'][0]['data']
                #                                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                #If no thumbnail bytestring was found assosciated with the entry, just redownload it
                
                thumbnail_data = self._bytestring2image(thumbnail_bytestring), #Load image from bytestring
                
                thumbnails_info.append({
                    #"data": thumbnail_data,
                    "selector": thumbnail['metadatas'][0]['selector'],
                    "url": a['url'],
                    "newspaper": a['newspaper'],
                    
                    
                    #Get Thumbnail Similarity Score to Title of article
                    "title-simil": self._img_text_matching({"data":thumbnail_data,"alt":a['title']})[0],
                    
                    #Get Thumbnail Similarity Score to Body of article
                    "body-simil": self._img_text_matching({"data":thumbnail_data,"alt":a['body']})[0]
                })
            
            
            #Extract image data for every image in the key article
            similar_image_articles_per_img = self._get_similar_articles_by_images(data,include_self=True)
            
            #Must be same length as number of images in key article
            images_info = [] #Information about the images of the article
            
            #Loop through the results of every image in the key article
            for sim_image_articles_info in similar_image_articles_per_img:
                
                #Will hold the info of the retrieved similar images for this image in the key article
                this_image_info = []
                
                #One image in the key article has multiple similar images
                for one_sim_img_infos in sim_image_articles_info:
                    #One similar image has multiple occurences. (We need to list these all)
                    for i,article_metadata in enumerate(one_sim_img_infos['article_metadatas']):
                        this_image_info.append({
                            "caption-simil": self._img_text_matching({
                                "data": one_sim_img_infos['bytestring'],
                                "alt" : one_sim_img_infos['captions'][i],
                            }),
                            "selector" : one_sim_img_infos['selectors'][i],
                            "newspaper": article_metadata['newspaper'],
                            "url"      : article_metadata['newspaper'],
                        })
                
                images_info.append(this_image_info)
                       
                
                
                    
                    # x = sim_image_articles_info 
                    
                    # #A list of similarity scores for every caption the image has across many newspapers.
                    # caption_simils = self._img_text_matching([
                    #     {"data":x['bytestring'], "alt":caption}
                    #     for caption in x['alt']
                    # ])
                    
                    # for i 
                    
                    # images_info.extend({
                    #     "urls": [article_metadata[]for article_metadata in x['article_metadatas']]
                    # })
                    
                    # images_info.append({
                    #     "urls"      : [metadata['url']       for metadata in articles['metadatas']],
                    #     "selectors" : [metadata['selector']  for metadata in articles['metadatas']],
                    #     "newspapers": [metadata['newspaper'] for metadata in articles['metadatas']],
                    # })
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
        
            #TODO: from here
            
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
        
    # TODO: Look up similair articles (by text or image) and use the articles as additional context when calculating the scores
   
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
 
 
    def _get_similar_articles_by_images(self,data:dict,
                                       include_self:str=""):      
        
        def get_similar_images(img_bytestring:str):
                        
            related = []           

            #Get top-k similar images
            retrieved_images = self.img_collection.query(
                self.img_collection._embedding_function(img_bytestring), #Għax jigi bil-ħara man, afdani
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
        
        #Every element of this list corresponds to every image in the article
        articles_per_img = []
        
        for img in data['imgs']:
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
                    "caption"   : [img['alt']],
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
                    "selectors" : json.loads(sim_img['selector']), #This is a list
                    
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
                       
    def _get_similar_articles_by_text(self,data:dict,
                                      include_self:bool=True):
        
        #Include the key article as part of the results.
        if include_self: 
            #NOTE: We have to do this because the key article might not be currently indexed by the vectorDB
            key_article_metadatas = {
                "distance" : 0,
                "url"      : data['url'],
                "newspaper": data['newspaper'],
                "title"    : data['title'],
                "body:"    : data['body'],
                
                #TODO:I am copying the same process in `listener.py`. I should put this in a function
                "img_ids"  : ",".join([
                    data2id(img_payload["data"])
                    for img_payload in data['imgs']
                ])
            }
            related.append(key_article_metadatas)
            
        
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
  