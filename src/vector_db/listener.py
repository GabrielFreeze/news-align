import os
import requests
import chromadb
from indexer import NewspaperIndexer
from utils import MultimodalEmbeddingFunction, TextEmbeddingFunction







# text_fn = TextEmbeddingFunction()

# client = chromadb.PersistentClient(path="vector_db")
# text_collection = client.get_or_create_collection(name="text_collection",embedding_function=text_fn)
# print(text_collection.peek())