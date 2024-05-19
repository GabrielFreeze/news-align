import json
from PIL import Image
from io import BytesIO
from hashlib import md5
from warnings import warn
from base64 import b64decode

class Payload():
    def __init__(self,error:str="",data:dict={}):
         
        self.error:str = error
        self.data:dict = data
        
        if not error and not data:
            warn("An empty payload was initialised")    
        
    def to_dict(self) -> dict:
        return {"data":self.data,"error":self.error}
    
    def print(self) -> None:
        print(json.dumps(self.to_dict(), indent=1))
        
class GPU_Payload(Payload):
    def __init__(self,job_no:int,payload:Payload):
        super().__init__(error=payload.error,
                         data=payload.data)
        
        self.job_no = job_no
        
        
def data2id(data):
    if type(data) is dict:
        data = json.dumps(data)
    return md5(data.encode()).hexdigest()

def bytestring2image(bytestring:str):
    #It is important to add the below altchars since we will be passing the bytestring in a URL, and slashes would break it.
    return Image.open(
        BytesIO(b64decode(bytestring, altchars=b'-_'))
    ).convert("RGB")