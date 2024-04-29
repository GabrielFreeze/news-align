import os
import chromadb
import traceback
import pandas as pd
from tqdm import tqdm
from time import sleep
from hashlib import md5
from vector_db.indexer import NewspaperIndexer
from common.article_scraper import ArticleScraper
from vector_db.utils import MultimodalEmbeddingFunction, TextEmbeddingFunction

def doc2id(txt:str):
    return md5(txt.encode()).hexdigest()

#Initialise Text Vector Database
text_fn = TextEmbeddingFunction()
client = chromadb.PersistentClient(path=os.path.join("vector_db","vector_db"))
text_collection = client.get_or_create_collection(name="text_collection",embedding_function=text_fn)

#Initialise objects to retrieve+download latest news articles
newsIndexer = NewspaperIndexer()
artScraper  = ArticleScraper()
embedding_prompt = "Represent this news article for searching relevant passages about events, people, dates, and facts."

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
            
            payload = artScraper.scrape(url,ignore_imgs=True)
            if payload.error:
                continue
            
            data = payload.data
            data['imgs'] = '. '.join( #We only need the alt-text of the images
                [img['alt'] for img in data['imgs'] if img['alt']]
            )
            data['newspaper'] = newspaper #Add newspaper name
            data['url'] = url
            
            #Includes title, imgs (list of alt-text), body, and newspaper name.
            metadatas.append(data)
            
            document = f"{embedding_prompt} search_document:{data['title']}. {data['body']}. {data['imgs']}"
            documents.append(document)
            
            #ID is the hashed document, so we can detect any changes in the article.
            ids.append(doc2id(document))
            
        
        #Add any new articles to vector database
        text_collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print("="*30)
                
        #Saving list of urls.
        pd.DataFrame(urls,columns=["urls"]).to_csv("urls.csv",mode="a+",index=False)
        
        
        
    except Exception as e:
        traceback.print_exc()