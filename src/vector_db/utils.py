import torch
import numpy as np
from numpy import ndarray
import torch.nn.functional as F
from typing import Union, List, Tuple
from transformers import AutoTokenizer, AutoModel
from lavis.models import load_model_and_preprocess
from chromadb import Documents, EmbeddingFunction, Embeddings

# Image Types
ImageDType = Union[np.uint, np.int_, np.float_]
Image = ndarray[ImageDType]
Images = List[Image]

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Device: {device}")

class MultimodalEmbeddingFunction(EmbeddingFunction):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.model, self.vis_processors, self.txt_processors = (
            load_model_and_preprocess(name="blip2_feature_extractor",model_type="pretrain",is_eval=True,device=device)
        )
        self.model.eval()
        

    def __call__(self, input:Tuple[Image,str]) -> Embeddings:

        img = self.vis_processors["eval"](input[0]).unsqueeze(0).to(device)
        txt = self.txt_processors["eval"](input[1])

        embedding = self.model.extract_features(
            {"image": img,"text_input": [txt]},mode='multimodal'
        ).multimodal_embeds.squeeze().flatten().tolist()
        
        return embedding
        
class TextEmbeddingFunction(EmbeddingFunction):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
                
        self.embedding_prompt = "Represent this news article for searching relevant passages about events, people, dates, and facts."
        
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.model = AutoModel.from_pretrained("nomic-ai/nomic-embed-text-v1", trust_remote_code=True)
        self.model.eval()
    
    def __call__(self, input: Documents) -> Embeddings:
            
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

        