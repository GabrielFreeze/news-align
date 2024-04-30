import os
import json
import datetime
import chromadb
import traceback
import pandas as pd
from PIL import Image
from tqdm import tqdm
from io import BytesIO
from time import sleep
from hashlib import md5
from base64 import b64decode
from vector_db.indexer import NewspaperIndexer
from common.article_scraper import ArticleScraper
from vector_db.utils import MultimodalEmbeddingFunction, TextEmbeddingFunction

def doc2id(txt:str):
    return md5(txt.encode()).hexdigest()

client = chromadb.PersistentClient(path=os.path.join("vector_db","vector_db"))

#Initialise Text Vector Database
text_fn = TextEmbeddingFunction()
text_collection = client.get_or_create_collection(name="text_collection",embedding_function=text_fn)

#Initialise Image Vector Database
img_fn = MultimodalEmbeddingFunction()
img_collection = client.get_or_create_collection(name="img_collection",embedding_function=img_fn)

#Initialise objects to retrieve+download latest news articles
newsIndexer = NewspaperIndexer()
artScraper  = ArticleScraper()

first = True

#Periodically check newspapers for latest news articles
while first or not sleep(1*3600):
    try:
        first=False
        
        #Add new articles to vector database   
        documents = []
        metadatas = []
        ids       = []
        urls      = []
        
        #Get article URLS
        for newspaper in ["timesofmalta","theshift","maltatoday"]:
            urls += [url for url in newsIndexer.get_latest_urls(newspaper,30)]
        
        #Download articles
        for url in tqdm(urls,unit="article"):
            
            payload = artScraper.scrape(url)
            if payload.error:
                continue
            
            data = payload.data
            captions = json.dumps([img['alt'] or "" for img in data['imgs']])
            document = f"search_document:{data['title']}. {data['body']}. {captions}"
            text_id = doc2id(document)
            
            #Discard non-unique articles
            if text_id in text_collection.get()['ids']:
                continue
            
            #Add any new articles to vector database
            text_collection.add(
                documents=document,
                metadatas={
                    "newspaper":newspaper,
                    "url"      :url,
                    "title"    :data['title'],
                    "captions" :captions,
                    "body"     :data['body'],
                },
                
                #ID is the hashed document, so we can detect any changes in the article.
                ids=doc2id(document) 
            )
                      
            
            idx = []
            img_ids = []
            for i,img in enumerate(data['imgs']):
                
                img_id = doc2id(img["data"]+img["alt"])
                
                #Make note of unique ids
                if img_id not in img_collection.get()['ids']:
                    img_ids.append(img_id)
                    idx.append(i)
            
            #Discard non-unique image-text pairs (regardless of article)
            data['imgs'] = [data['imgs'][i] for i in idx]
            
            #Preparing img-txt pairs
            img_txt_pairs = [(Image.open(BytesIO(b64decode(img['data']))).convert("RGB"), img['alt'] or "")
                             for img in data['imgs']]
            
                
            #Add img-txt pairs to image_collection
            img_collection.add(
                
                #Embedding img-txt pairs
                embeddings=img_fn(img_txt_pairs), 
                
                #Adding the caption, url and css-selector to the metadata.
                metadatas=[{
                    "newspaper":newspaper,
                    "captions" :img['alt'],
                    "selector" :img['css-selector'],
                    "url":url
                } for img in data['imgs']],
                
                #ID is the hashed img+txt.
                ids=img_ids
            )
            
        print(f'[{datetime.datetime.now().time()}]{"="*40}')
            
        #Update
                
        #Saving list of urls.
        all_urls = set(
            pd.read_csv("urls.csv")["urls"].to_list() + urls
        )
        pd.DataFrame(all_urls,columns=["urls"]).to_csv("urls.csv",index=False)
        
    except Exception as e:
        traceback.print_exc()