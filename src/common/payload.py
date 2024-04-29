import json
from warnings import warn

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