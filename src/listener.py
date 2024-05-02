import os
import json
import datetime
import chromadb
import traceback
import pandas as pd
from time import time
from PIL import Image
from tqdm import tqdm
from io import BytesIO
from time import sleep
from hashlib import md5
from base64 import b64decode
from common.color import color
from vector_db.indexer import NewspaperIndexer
from common.article_scraper import ArticleScraper
from vector_db.utils import MultimodalEmbeddingFunction, TextEmbeddingFunction
from chromadb.utils.embedding_functions import OpenCLIPEmbeddingFunction


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
        img_count = 0
        urls=[]
               
        #Download articles
        for newspaper in ["timesofmalta","theshift","maltatoday"]:
            for url in newsIndexer.get_latest_urls(newspaper,30): #Get article URLS
                
                # == SCRAPE ==
                s=time()
                payload = artScraper.scrape(url)
                if payload.error:
                    continue
                print(f"Downloading: {color.GREEN}{round(time()-s,2)}s{color.ESC}")
                
                data = payload.data
                
                # == GET ARTICLE ID ==
                _captions = json.dumps([img['alt'] or "" for img in data['imgs']])
                document = f"search_document:{data['title']}. {data['body']}. {_captions}"
                article_id = doc2id(json.dumps(payload.data)) #Encode entire payload. If id is different, then the article is new/(was updated).
                
                #Discard non-unique articles. Non-unique articles mean that the img-txt pairs are not unique
                if article_id in text_collection.get()['ids']:
                    print(f"{color.YELLOW}Article is non-unique... Skipping{color.ESC}")
                    print("="*40)
                    continue     
                
                img_ids = []
                
                #== ADD IMAGES TO VECTOR DATABASE ==
                for i,img_payload in enumerate(data['imgs']):
                    
                    s=time()
                    txt = img_payload['alt'] or ""
                    byte_string = img_payload["data"]
                    
                    if byte_string == "":
                        print(f"{color.YELLOW}Image data is empty... Skipping{color.ESC}")
                        continue

                    img_id = doc2id(byte_string+txt) #Image ID is image+caption
                    img_ids.append(img_id) #Keep track of ALL image_ids
                    
                    #Discard non-unique ids
                    if img_id in img_collection.get()['ids']:
                        print(f"{color.YELLOW}Image is non-unique... Skipping{color.ESC}")
                        continue
                    
                    #Add image to vector database
                    img = Image.open(BytesIO(b64decode(byte_string))).convert("RGB")
                    img_collection.add(
                        
                        #Embedding img-txt pairs
                        embeddings=img_fn((img,txt)), 
                        
                        #Adding the caption, url and css-selector to the metadata.
                        metadatas={
                            "newspaper" :newspaper,
                            "article_id":article_id, #Add reference to article entry in article database
                            "caption"   :txt,
                            "selector"  :img_payload['css-selector'],
                        },
                        
                        #ID is the hashed img+txt.
                        ids=img_id
                    )
                    print(f"Adding Image: {color.GREEN}{round(time()-s,2)}s{color.ESC}")
                    img_count += 1
                    print(f"\n{'='*45}\n")
                    
                                            
                #== ADD ARTICLE TO VECTOR DATABASE ==
                s=time()
                text_collection.add(
                    documents=document,
                    metadatas={
                        "newspaper":newspaper,
                        "url"      :url,
                        "title"    :data['title'],
                        "img_ids"  :",".join(img_ids), #Add reference to image entries in image database
                        "body"     :data['body'],
                    },
                    
                    #ID is the hashed document, so we can detect any changes in the article.
                    ids=article_id
                )
                print(f"Adding Article: {color.GREEN}{round(time()-s,2)}s{color.ESC}")
                urls.append(url) #Keep track of successfully downloaded urls
        
        
        now = datetime.datetime.now()
        print(f"Added {color.CYAN} {len(urls)} Articles {color.ESC} and {color.CYAN} {img_count} Images {color.ESC}")    
        print(f'{color.BLUE}{"="*20}{color.ESC}[{now.date()} {now.time()}]{color.BLUE}{"="*20}{color.ESC}')
                
        #Saving list of urls.
        all_urls = set(
            pd.read_csv("urls.csv")["urls"].to_list() + urls
        )
        pd.DataFrame(all_urls,columns=["urls"]).to_csv("urls.csv",index=False)
        
    except Exception as e:
        traceback.print_exc()