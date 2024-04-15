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
           
          
    def _img_text_matching(self,
                           img_txt:Union[List[Tuple[Image.Image,str]],
                                         Tuple[Image.Image,str]],
                          ) -> Union[List[float],float]:
        
        is_list = type(img_txt) is list
        
        if not is_list:
            img_txt = [img_txt]
                
        #Perform Image-Text Matching for every pair
        result = [softmax(self.itm_model({
                              "image": self.itm_vis["eval"](img).unsqueeze(0).to(self.device),
                              "text_input" : txt
                              },match_head="itm"),
                      dim=1)[:,1].item()
                    
                  if txt else -1
                  for img,txt in img_txt]
        
        return result if is_list else result[0]
        
       
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
            
            #Decode Image, and pair with corresponding Text
            img_txt_pairs = [(Image.open(BytesIO(b64decode(img['img']['data']))).convert("RGB"),
                             img['alt'])
                            for img in data['imgs']]

            #Compute for front image and title
            front_title = self._img_text_matching(
                (img_txt_pairs[0][0], data['title'])
            )
            
            # Compute for front image and title
            front_body = self._img_text_matching(
                (img_txt_pairs[0][0], data['body']),
            )
            front_body=0
            
            #Compute for all img_txt pairs
            img_txt = self._img_text_matching(
                img_txt_pairs
            )               
            
            print(f'[{this_job_no}] ITM Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            s=time()
            
            gen_txt = self._get_gencap([img for img,_ in img_txt_pairs])
 
            
            print(f'[{this_job_no}] I2T Processed: {color.GREEN}{round(time()-s,2)}s{color.ESC}')
            
            #Format data              
            data = {"front_title":front_title,
                    "front_body" :front_body ,
                    "img_txt"    :img_txt    ,
                    "gen_txt"    :gen_txt}
                        
        except Exception as e:
            traceback.print_exc()
            error = f"Unexpected Error: {traceback.format_exc()}"
                
        return GPU_Payload(job_no=this_job_no,
                           payload=Payload(data=data,error=error))

