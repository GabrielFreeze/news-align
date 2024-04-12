import json
from warnings import warn

class color:
    WHITE = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ESC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

    
def get_img_ext(img_link):
    if img_link.endswith('.jpeg'):
        return '.jpeg'
    elif img_link.endswith('.jpg'):
        return '.jpg'
    elif img_link.endswith('.png'):
        return '.png'
    else: return ""
    
    
class Payload():
    def __init__(self,error:str="",data:dict={}):
         
        self.error:str = error
        self.data:dict = data
        
        if not error and not data:
            warn("An empty payload was initialised")    
        
    def to_dict(self) -> dict:
        return {"data":self.data,"error":self.error}
    
    
class GPU_Payload(Payload):
    def __init__(self,job_no:int,payload:Payload):
        super().__init__(error=payload.error,
                         data=payload.data)
        
        self.job_no = job_no
        