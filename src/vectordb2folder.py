import os
import json
import random
import chromadb
import numpy as np
import pandas as pd
from time import time
from tqdm import tqdm
from datetime import datetime
from common.color import color
from common.payload import bytestring2image
from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction, format_document

#Initialising ChromaDB
s=time()
print(f'Initialising ChromaDB HTTP Client: ',end='')

client = chromadb.HttpClient(host="localhost",port=8000)

txt_fn = TextEmbeddingFunction(remote=True)
txt_collection = client.get_or_create_collection(name="text_collection",embedding_function=txt_fn)

img_fn = ImageEmbeddingFunction()
img_collection = client.get_or_create_collection(name="img_collection",embedding_function=img_fn)

print(f'{color.YELLOW}{round(time()-s,2)}s{color.ESC}')
SAVE_DIR = os.path.join("..","vectordb_data")
if not os.path.isdir(SAVE_DIR):
    os.mkdir(SAVE_DIR)


#Retrieving `limit` articles each time
LIMIT=1000
MAX_ITEMS=50_000

data = []
num_imgs = 0

for offset in range(0,MAX_ITEMS,LIMIT):
        
    articles = txt_collection.get(
        limit=LIMIT, offset=offset,
        include=["metadatas"]
    )

    if articles['ids'] == []:
        break #Limit has been reached

    #Ensures articles are randomely retrieved
    for i in tqdm(random.sample(range(LIMIT),LIMIT)):
        article_id         = articles["ids"][i]
        article_metadata   = articles["metadatas"][i]

        #Retrieve the img_collection entries relating to each image in the current article, and save to disk.
        img_names = []
        for img_id in article_metadata['img_ids'].split(','):
            
            #TODO: There are some duplicate entries. We are ignoring these for now
            try:
                imgs = img_collection.get(ids=img_id)
            except Exception:
                continue

            for img_bytestring,img_metadata in zip(imgs['documents'],imgs["metadatas"]):
                img_name = f'{str(num_imgs).zfill(6)}.png'
                img_data = bytestring2image(img_bytestring)
                img_data.save(os.path.join(SAVE_DIR,img_name))
                img_names.append(img_name)
                num_imgs += 1

        #Standardize date format
        try:
            date = pd.to_datetime(article_metadata["date"],dayfirst=True,yearfirst=False,format='ISO8601',utc=True).strftime('%d-%m-%Y')
        except ValueError:
            date = article_metadata["date"] #Date is already in desired format

        data.append([
            article_metadata["title"],
            article_metadata["newspaper"],
            article_metadata["url"],
            date,
            ",".join(img_names),
            article_metadata["body"],
            article_metadata["author"],
            article_metadata["tags"] if "tags" in article_metadata else ""
        ])
            
        #Save data every X articles
        if (i+1)%200:
            pd.DataFrame(data,columns=["title","newspaper","url","date","imgs","body","author","tags"])\
            .to_csv(os.path.join(SAVE_DIR,"data.csv"),index=False, encoding='utf-8')

pd.DataFrame(data,columns=["title","newspaper","url","date","imgs","body","author","tags"])\
    .to_csv(os.path.join(SAVE_DIR,"data.csv"),index=False)
