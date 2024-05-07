import os
import json
import datetime
import chromadb
import traceback
import numpy as np
import pandas as pd
from time import time
from PIL import Image
from io import BytesIO
from time import sleep
from hashlib import md5
from random import randint
from base64 import b64decode
from common.color import color
from vector_db.indexer import NewspaperIndexer
from common.article_scraper import ArticleScraper
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction, format_document

import warnings
warnings.filterwarnings("ignore")

def doc2id(txt:str):
    return md5(txt.encode()).hexdigest()
def get_additonal_urls():
    p = os.path.join('vector_db','urls')
    urls = []
    
    for f in os.listdir(p):
        if f.startswith("additional_"):
            urls += pd.read_csv(os.path.join(p,f))['URL'].tolist()
    
    print(f"Scraping {len(urls)} additional URLs")
    return urls
            
first = True
add_additional = False

#INITIALISE
client = chromadb.PersistentClient(path=os.path.join("vector_db","vector_db"))

#Initialise Text Vector Database
text_fn = TextEmbeddingFunction() 
text_collection = client.get_or_create_collection(name="text_collection",embedding_function=text_fn)

#Initialise Image Vector Database
img_fn = ImageEmbeddingFunction() 
img_collection = client.get_or_create_collection(name="img_collection",embedding_function=img_fn)

#Initialise objects to retrieve+download latest news articles
newsIndexer = NewspaperIndexer() 
artScraper  = ArticleScraper()

#Periodically check newspapers for latest news articles
while first or not sleep(1*3600):
        
    urls = []
    img_count = 0
    additional_urls = []
    
    try:
        #Download articles
        for newspaper in ["timesofmalta","theshift","maltatoday"]:
            
            to_index = newsIndexer.get_latest_urls(newspaper,50)
            if first and add_additional: to_index += get_additonal_urls()
            
            #Get article URLS
            for url in to_index: 
                try:
                    first=False
                    
                    # == SCRAPE ==
                    payload = artScraper.scrape(url)
                    if payload.error:
                        print(f"{color.RED}{payload.error}{color.ESC}")
                        print(f"Skipping article...")
                        continue
                    
                    data = payload.data
                    
                    # == GET ARTICLE ID ==
                    document = format_document(payload.data)
                    # _captions = json.dumps([img['alt'] or "" for img in data['imgs']])
                    # document = f"search_document:{data['title']}. {data['body']}. {_captions}"
                    article_id = doc2id(json.dumps(payload.data)) #Encode entire payload. If id is different, then the article is new/(was updated).
                    
                    #Discard non-unique articles. Non-unique articles mean that the img-txt pairs are not unique
                    if article_id in text_collection.get()['ids']:
                        print(f"{color.YELLOW}Article is non-unique... Skipping: {str(randint(0,2048)).zfill(4)}{color.ESC}",end='\r')
                        # print("="*40)
                        continue     
                    
                    print(f"{color.UNDERLINE}{data['title'][:50]}...{color.ESC}")
                    img_ids = []
                    
                    #== ADD IMAGES TO VECTOR DATABASE ==
                    for i,img_payload in enumerate(data['imgs']):
                        
                        s=time()
                        txt = img_payload['alt'] or ""
                        byte_string = img_payload["data"]
                        
                        if byte_string == "":
                            print(f"{color.YELLOW}Image data is empty... Skipping{color.ESC}")
                            continue

                        img_id = doc2id(byte_string)
                        img_ids.append(img_id) #Keep track of ALL image_ids
                        
                        #Discard non-unique ids
                        if img_id in img_collection.get()['ids']:
                            print(f"{color.YELLOW}Image is non-unique... Skipping{color.ESC}")
                            continue
                        
                        #Add image to vector database
                        img = np.array(
                            Image.open(BytesIO(b64decode(byte_string))).convert("RGB")
                        )
                        
                        img_collection.add(
                            
                            embeddings=img_fn(img), 
                            
                            #Adding the caption, url and css-selector to the metadata.
                            metadatas={
                                "newspaper" :newspaper,
                                "article_id":article_id, #Add reference to article entry in article database
                                "caption"   :txt,
                                "selector"  :img_payload['css-selector'],
                            },
                            
                            #ID is the hashed img.
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
                except Exception as e:
                    traceback.print_exc()
        
        
        now = datetime.datetime.now()
        print(f"Added {color.CYAN} {len(urls)} Articles {color.ESC} and {color.CYAN} {img_count} Images {color.ESC}")    
        print(f'{color.BLUE}{"="*20}{color.ESC}[{now.date()} {now.time()}]{color.BLUE}{"="*20}{color.ESC}')
                
        #Saving list of urls.
        p = os.path.join('vector_db','urls',"urls.csv")
        all_urls = set(
            pd.read_csv(p)["urls"].to_list() + urls
        )
        
        (pd.DataFrame(all_urls,columns=["urls"])
            .to_csv(p,index=False))
            
    except Exception as e:
        traceback.print_exc()