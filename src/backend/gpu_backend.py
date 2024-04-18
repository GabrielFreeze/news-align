import os
import sys
import torch
import traceback
import pandas as pd
from time import time
from PIL import Image
from io import BytesIO
from base64 import b64decode
from utils import color, Payload,GPU_Payload
from typing import Union, List, Tuple
from torch.nn.functional import softmax
from lavis.models import load_model_and_preprocess


class GPU_Backend():
    def __init__(self) -> None:
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Device: {self.device}")
        
        self.itm_model, self.itm_vis, _ = load_model_and_preprocess(name="blip2_image_text_matching",
                                                                           model_type="pretrain", is_eval=True,
                                                                           device=self.device)     
        
        self.i2t_model, self.i2t_vis, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco",
                                                                    is_eval=True, device=self.device)     
           
          
    def _img_text_matching(self,imgs:Union[List[dict],dict]) -> List[dict]:
        
        if not type(imgs) is list:
            imgs = [imgs]
        
        result:List[dict] = [{}]*len(imgs)
        
        for i,img in enumerate(imgs):
            
            element = {}
            
            #Guard clause against images with no captions
            if not img['alt']:
                result[i] = -1
                continue
            
            img_data = self.itm_vis["eval"](img['data']).unsqueeze(0).to(self.device)
            img_txt  = img['alt']
            
            score = self.itm_model({"image":img_data, "text_input": img_txt}, match_head="itm")
            score = softmax(score,dim=1)[:,1].item()
            
            element['score'] = score
            element['css-selector'] = img['css-selector']
            
            result[i] = element
            
        return result
        
       
    def _get_gencap(self, imgs:List[Image.Image]) ->  List[str]:
        
        #Perform image-to-text on every image
        return [self.i2t_model.generate({"image": self.i2t_vis["eval"](img).unsqueeze(0).to(self.device)},
            max_length=50)
                for img in imgs]
        
    def __call__(self,payload:GPU_Payload) -> GPU_Payload:
        s=time()
        data = {}
        error = ""
        this_job_no = -1

        try:    
            data        = payload.data
            this_job_no = payload.job_no
            
                        
            #Decode Images
            for i,img in enumerate(data['imgs']):
                data['imgs'][i]['data'] = Image.open(BytesIO(b64decode(img['data']))).convert("RGB")
                
            #Compute for front image and title
            front_title = self._img_text_matching(
                {"data":data['imgs'][0]['data'],
                 "alt":data['title'],
                 "css-selector":data['imgs'][0]['css-selector']}
            )
            
            # Compute for front image and title
            front_body = self._img_text_matching(
                {"data":data['imgs'][0]['data'],
                 "alt":data['body'],
                 "css-selector":data['imgs'][0]['css-selector']},
            )
            
            #Compute for all img_txt pairs
            img_txt = self._img_text_matching(
                data['imgs']
            )
            
            print(f'[{this_job_no}] ITM Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            s=time()
            
            gen_txt = self._get_gencap(
                [img['data'] for img in data['imgs']]
            )
 
            
            print(f'[{this_job_no}] I2T Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            
            #Format data              
            data = {"front_title"  : front_title,
                    "front_body"   : front_body ,
                    "img_txt"      : img_txt    ,
                    "gen_txt"      : gen_txt    }
                        
        except Exception as e:
            traceback.print_exc()
            error = f"Unexpected Error: {traceback.format_exc()}"
                
        return GPU_Payload(job_no=this_job_no,
                           payload=Payload(data=data,error=error))

