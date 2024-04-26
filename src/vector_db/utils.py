import torch
import numpy as np
from numpy import ndarray
from typing import Union, List
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from chromadb import Documents, EmbeddingFunction, Embeddings

# Image Types
ImageDType = Union[np.uint, np.int_, np.float_]
Image = ndarray[ImageDType]
Images = List[Image]

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


class MultimodalEmbeddingFunction(EmbeddingFunction):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.model = SentenceTransformer("nomic-ai/nomic-embed-text-v1",
        #                                  trust_remote_code=True,device=device)
    
    def __call__(self, input: Union[Documents, Images,None]) -> Embeddings:
        print(f"Device: {device}")
                
        return None
        
class TextEmbeddingFunction(EmbeddingFunction):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.model = SentenceTransformer("nomic-ai/nomic-embed-text-v1",
                                         trust_remote_code=True,device=device)
    
    def __call__(self, input: Documents) -> Embeddings:
        print(f"Device: {device}")
            
        embeddings = self.model.encode(input, device=device, batch_size=8,
                                       show_progress_bar=True, normalize_embeddings=True)
        
        return embeddings.tolist()
        