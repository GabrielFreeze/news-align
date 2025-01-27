import os
import pandas as pd
from tqdm import tqdm
from common.color import color
from multiprocessing import cpu_count
from common.payload import bytestring2image

SAVE_DIR = os.path.join("D:","vectordb_data")
if not os.path.isdir(SAVE_DIR):
    os.mkdir(SAVE_DIR)

m = cpu_count()
m=16 #Limiting number of sub-processes
MAX_ITEMS=18_000
LIMIT = MAX_ITEMS//m

#Define Multiprocessing Worker Function
def worker(n:int,offset:int,txt_collection,img_collection,all_img_ids):
    
    #Ensure that the folder for saving this worker's data exists
    this_save_dir = os.path.join(SAVE_DIR,f'{n}')
    if not os.path.isdir(this_save_dir):
        os.mkdir(this_save_dir)

    articles = txt_collection.get(
        limit=LIMIT, offset=offset,
        include=["metadatas"]
    )

    data = []
    num_imgs = offset

    for i, article_metadata in tqdm(enumerate(articles['metadatas']),
                                    total=len(articles['metadatas'])):

        #Retrieve the img_collection entries relating to each image in the current article, and save to disk.
        img_names = []
        for img_id in article_metadata['img_ids'].split(','):
            
            #Check that an image entry actually exists
            if img_id not in all_img_ids:
                continue

            img = img_collection.get(ids=img_id,include=['documents'])
            img_bytestring = img['documents'][0]

            #Check that the img entry contains the image data
            if not img_bytestring:
                continue
        
            img_name = f'{str(num_imgs).zfill(6)}.png'
            img_data = bytestring2image(img_bytestring)
            img_data.save(os.path.join(this_save_dir,img_name))
            img_names.append(img_name)
            num_imgs += 1

        #Standardize date format
        try:
            date = pd.to_datetime(
                article_metadata["date"],
                dayfirst=True,yearfirst=False,
                format='ISO8601',utc=True
            ).strftime('%d-%m-%Y')
            
        except ValueError:
            date = article_metadata["date"] #Date is already in desired format

        data.append([
            articles['ids'][i],
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
        if (i+1)%500:
            pd.DataFrame(data,columns=["id","title","newspaper","url","date","imgs","body","author","tags"])\
            .to_csv(os.path.join(this_save_dir,f"data-{n}.csv"),index=False, encoding='utf-8')

    pd.DataFrame(data,columns=["id","title","newspaper","url","date","imgs","body","author","tags"])\
        .to_csv(os.path.join(this_save_dir,f"data-{n}.csv"),index=False,encoding='utf-8')


    return True


def main():
    import shutil
    import sqlite3
    import chromadb
    from time import time
    from multiprocessing import Process, Manager
    from vector_db.utils import ImageEmbeddingFunction, TextEmbeddingFunction

    
    print(f'Available Cores: {color.BLUE}{m}{color.ESC}')

    #Initialising ChromaDB
    s=time()
    print(f'Initialising ChromaDB HTTP Client: ',end='')

    client = chromadb.HttpClient(host="localhost",port=8000)

    txt_fn = TextEmbeddingFunction(remote=True)
    txt_collection = client.get_or_create_collection(name="text_collection",embedding_function=txt_fn)

    img_fn = ImageEmbeddingFunction(remote=True)
    img_collection = client.get_or_create_collection(name="img_collection",embedding_function=img_fn)

    print(f'{color.YELLOW}{round(time()-s,2)}s{color.ESC}')


    #NOTE: Retrieving the img_ids like this also retrieves deleted entries.
    #Retrieve all image ids to circumvent the costly operation
    #of trying to retrieve something from the database that doesnt exist
    s=time()
    print(f'Retrieving all image ids: ',end='')
    with sqlite3.connect(os.path.join("vector_db","vector_db","chroma.sqlite3")) as con:
        cur = con.cursor()
        sql = f"""
            SELECT *
            FROM embeddings_queue
            WHERE json_valid(metadata) 
            AND json_extract(metadata, '$.article_ids') IS NOT NULL --Only retrieve image entries
        """
        
        #We simulate a dict instead of a set since multiprocessing manager only supports dicts
        all_img_ids = {row[4]:True for row in tqdm(cur.execute(sql))}
        ##             ^^^^^ img_id
    print(f'{color.YELLOW}{round(time()-s,2)}s{color.ESC}')


    with Manager() as manager:
        all_img_ids = manager.dict(all_img_ids)
        jobs = [Process(target=worker,
                        args=(
                            i,
                            int(i*(MAX_ITEMS/m)),
                            txt_collection,
                            img_collection,
                            all_img_ids
                        )
                    ) for i in range(m)]

        s = time()
        for p in jobs: p.start()
        for p in jobs: p.join()
        print(f'Finished multi-processing operation in {color.YELLOW}{round(time()-s,2)}s{color.ESC}')

    s=time()
    print(f'Reorganising folders: ',end='')

    #Join dataset together
    for i in range(m):
        worker_save_dir = os.path.join(SAVE_DIR,f'{i}')
        for file in os.listdir(worker_save_dir):
            shutil.move(
                os.path.join(worker_save_dir, file),
                os.path.join(SAVE_DIR, file)
            )
        #Remove empty subdirectories
        if not os.listdir(worker_save_dir):  # If the directory is empty
            os.rmdir(worker_save_dir)

    #Join all csv's together
    df_paths = [os.path.join(SAVE_DIR,f'data-{i}.csv') for i in range(m)]

    #Save aggregate csv
    pd.concat([pd.read_csv(p) for p in df_paths],ignore_index=True)\
      .to_csv(os.path.join(SAVE_DIR,'data.csv'),index=False)

    #Remove previous workers' csvs
    for p in df_paths:
        os.remove(p)
    print(f'{color.YELLOW}{round(time()-s,2)}s{color.ESC}')


if __name__ == '__main__':
    main()


# s=time()
# print(f'\nRetrieving all articles and images: ',end='')
# with sqlite3.connect(os.path.join("vector_db","vector_db","chroma.sqlite3")) as con:
#     cur = con.cursor()
#     sql = f"""
#         SELECT *
#         FROM embeddings_queue
#         WHERE metadata is not NULL
#     """
    
#     data = {}
#     for row in tqdm(cur.execute(sql)):
#         data[row[4]] = json.loads(row[-1])

# articles = {id:metadata for id,metadata in data.items() if 'title' in metadata}
# images = {id:metadata for id,metadata in data.items() if 'title' not in metadata}
# print(f'{color.YELLOW}{round(time()-s,2)}s{color.ESC}')

# SAVE_DIR = os.path.join("..","vectordb_data")
# if not os.path.isdir(SAVE_DIR):
#     os.mkdir(SAVE_DIR)


# data = []
# num_imgs = 0

# for i,(article_id,article_metadata) in tqdm(enumerate(articles.items())):
#     #Retrieve the img_collection entries relating to each image in the current article, and save to disk.
#     img_names = []
#     for img_id in article_metadata['img_ids'].split(','):
#         try:
#             #TODO: I need to remove image entries with no image bytestring embedded in the document
#             if not (img_id in images and 'chroma:document' in images[img_id]):
#                 continue
#             img_bytestring = images[img_id]['chroma:document']
            
#             if not img_bytestring:
#                 continue

#             img_name = f'{str(num_imgs).zfill(6)}.png'
#             img_data = bytestring2image(img_bytestring)
#             img_data.save(os.path.join(SAVE_DIR,img_name))
#             img_names.append(img_name)
#             num_imgs += 1
#         except Exception as e:
#             traceback.print_exc()
#             print(f'{color.YELLOW}Error while processing image. Skipping...{color.ESC}')

#     #Standardize date format
#     try:
#         date = pd.to_datetime(article_metadata["date"],dayfirst=True,yearfirst=False,format='ISO8601',utc=True).strftime('%d-%m-%Y')
#     except ValueError:
#         date = article_metadata["date"] #Date is already in desired format

#     data.append([
#         article_metadata["title"],
#         article_metadata["newspaper"],
#         article_metadata["url"],
#         date,
#         ",".join(img_names),
#         article_metadata["body"],
#         article_metadata["author"],
#         article_metadata["tags"] if "tags" in article_metadata else ""
#     ])
        
#     #Save data every X articles
#     if (i+1)%200:
#         pd.DataFrame(data,columns=["title","newspaper","url","date","imgs","body","author","tags"])\
#         .to_csv(os.path.join(SAVE_DIR,"data.csv"),index=False, encoding='utf-8')


# pd.DataFrame(data,columns=["title","newspaper","url","date","imgs","body","author","tags"])\
#     .to_csv(os.path.join(SAVE_DIR,"data.csv"),index=False)

