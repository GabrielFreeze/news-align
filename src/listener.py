import os
import json
import datetime
import chromadb
import traceback
import numpy as np
import pandas as pd
from time import time
from tqdm import tqdm
from PIL import Image
from io import BytesIO
from time import sleep
from random import randint
from base64 import b64decode
from common.color import color
from rich.progress import track
from common.payload import data2id
from vector_db.indexer import NewspaperIndexer
from common.article_scraper import ArticleScraper
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction, format_document

import warnings
warnings.filterwarnings("ignore")

#TODO: Nomic Embed is now multimodal, so preferably the image collection should be merged with the text collection
#TODO: The search prefixes require a space, so all articles should be rembedded with the space after the prefix for best performance

def get_additonal_urls():
    p = os.path.join('vector_db','urls')
    urls = []
    
    for f in ['additional_nb.csv']:
        urls += pd.read_csv(os.path.join(p,f))['URL'].tolist()
    urls = list(set(urls)) #Remove duplicates
        
    print(f"Scraping {len(urls)} additional URLs")
    return urls


first = True
add_additional = False
refresh_mode = False
if refresh_mode:
    print("Running in REFRESH Mode")

#INITIALISE
client = chromadb.HttpClient(host="localhost",port=8000)

#Initialise Text Vector Database
txt_fn = TextEmbeddingFunction(remote=True)
txt_collection = client.get_or_create_collection(name="text_collection",embedding_function=txt_fn)

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
    to_index = []
    
    try:
        if first and add_additional:
            print("Iterating through URLS in local storage")
            to_index += get_additonal_urls()

        #Download articles
        for newspaper in ["timesofmalta","maltatoday","independent","newsbook","theshift"]:
            
            if not first:
                to_index=[]

            to_index += newsIndexer.get_latest_urls(newspaper,latest=30 if not first else 300)
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
                    tags = data['tags'] if "tags" in data else "" #Not all newspapers have tags
                    
                    # == GET ARTICLE ID ==
                    document = format_document(payload.data)
                    #Encode entire payload. If id is different, then the article is new/(was updated).
                    article_id = data2id(payload.data)
                    
                    #Discard non-unique articles. Non-unique articles mean that the img-txt pairs are not unique
                    if txt_collection.get(ids=article_id)['ids']:
                        if refresh_mode:
                            txt_collection.delete(ids=article_id) #Replace previously collected articles
                        else:
                            print(f"{color.YELLOW}Article is non-unique... Skipping: {str(randint(0,2048)).zfill(4)}{color.ESC}",end='\r')
                            continue

                    
                    #If article was already scraped but has a unique hash,
                    #it means the content of the articles were changed, so we update our entry in the database
                    if previous_id:=txt_collection.get(where={"url":url})['ids']:
                        txt_collection.delete(ids=previous_id[0])


                    print(f"[{data['newspaper']}] {color.UNDERLINE}{data['title'][:50]}...{color.ESC}")
                    img_ids = []
                    
                    #== ADD IMAGES TO VECTOR DATABASE ==
                    for i,img_payload in enumerate(data['imgs']):
                        try:
                            s=time()
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

                           #FIXME: You are appending the css-selector in order to locate this image,
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
                                print(f"Updating Image: {color.GREEN}{round(time()-s,2)}s{color.ESC}")

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
                                img_count += 1
                                print(f"Adding Image: {color.GREEN}{round(time()-s,2)}s{color.ESC}")
                                      
                        except Exception as e:
                            traceback.print_exc()
                    print(f"\n{'='*45}\n")
                    #== ADD ARTICLE TO VECTOR DATABASE ==
                    s=time()
                    txt_collection.add(
                        documents=document,
                        metadatas={
                            "newspaper":data['newspaper'],
                            "url"      :url,
                            "title"    :data['title'],
                            "img_ids"  :",".join(img_ids), #Add reference to image entries in image database
                            "body"     :data['body'],
                            "author"   :data['author'],
                            "date"     :data['date'],
                            "tags"     :tags #NOTE: I added this to give to Manuel Fenech. Not all articles will have their tags saved.
                            #           ^^^^ Comma delimited sequence of strings    
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
            pd.read_csv(p)["URL"].to_list() + urls
        )
        
        (pd.DataFrame(all_urls,columns=["URL"])
            .to_csv(p,index=False))
            
    except Exception as e:
        traceback.print_exc()
        
        