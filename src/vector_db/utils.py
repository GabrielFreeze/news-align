import json
import torch
import requests
import numpy as np
from PIL import Image
import torch.nn.functional as F
from common.payload import bytestring2image
from transformers import AutoTokenizer, AutoModel
from lavis.models import load_model_and_preprocess
from chromadb import Embeddings, EmbeddingFunction as _EmbeddingFunction

class EmbeddingFunction(_EmbeddingFunction):    
    def __init__(self, remote:bool=False):
        super().__init__()
        
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.remote = remote
                
    def __call__(self,input):

        if self.remote:
            
            #Request for the input to be embedded then return the response
            endpoint = {TextEmbeddingFunction :'text',
                        ImageEmbeddingFunction:'img'}[type(self)]
            
            
            response = requests.post(
                url=f"http://localhost:8001/{endpoint}",
                json={"input": input}
            )
            
            return response.json()
            
        else:
            return self.process_input(input)
        
    def process_input(self,input):
        raise NotImplementedError("Subclasses must implement `process_input` method")
        



class ImageEmbeddingFunction(EmbeddingFunction):
    def __init__(self,**kwargs) -> None:
        super().__init__(**kwargs)
        
        if not self.remote:
            self.model, self.vis_processors, self.txt_processors = (
                load_model_and_preprocess(name="blip2_feature_extractor",model_type="pretrain",is_eval=True,device=self.device)
            )
            self.model.eval()
        

    def process_input(self, input) -> Embeddings:


        if type(input) is str:
            print(len(input))
            input = bytestring2image(input)
        elif type(input) is np.ndarray:
            input = Image.fromarray(input)
        
        
        embedding = self.model.extract_features({
                "image"     : self.vis_processors["eval"](input).unsqueeze(0).to(self.device),
                "text_input": None
            },mode="image",
        ).image_embeds
        
        return embedding.squeeze().flatten().tolist()
        
class TextEmbeddingFunction(EmbeddingFunction):
    def __init__(self,**kwargs) -> None:
        super().__init__(**kwargs)
        
        self.embedding_prompt = "Represent this news article for searching relevant passages about events, people, dates, and facts."
        
        if not self.remote:
            self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
            self.model = AutoModel.from_pretrained("nomic-ai/nomic-embed-text-v1", trust_remote_code=True)
            self.model.eval()
        
    def process_input(self, input) -> Embeddings:   
        encoded_input = self.tokenizer(input, padding=True,truncation=True, return_tensors='pt')

        with torch.no_grad():
            model_output = self.model(**encoded_input)
            embeddings = self.normalize(model_output,encoded_input['attention_mask'])
        
        return embeddings.tolist()
    
    def normalize(self,model_output, attention_mask):
        
        token_embeddings = model_output[0]
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        
        embeddings = torch.sum(token_embeddings * input_mask_expanded, 1) / \
                     torch.clamp(input_mask_expanded.sum(1), min=1e-9)
                     
        embeddings = F.normalize(embeddings, p=2, dim=1)
        
        return embeddings


def format_document(payload_data:dict,query:bool=False):
    captions = json.dumps([img['alt'] or "" for img in payload_data['imgs']])
    return f"search_{['document','query'][query]}:{payload_data['title']}. {payload_data['body']}. {captions}"