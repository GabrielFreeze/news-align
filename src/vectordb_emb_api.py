
"""
Command to start this api:
    `web-extension\src > uvicorn vectordb_api:app --host=localhost --port=8001`
"""

import json
import numpy as np
from PIL import Image
from io import BytesIO
from fastapi import FastAPI
from base64 import b64decode
from vector_db.utils import TextEmbeddingFunction, ImageEmbeddingFunction

app = FastAPI()


_txt_fn = None
txt_init = False

_img_fn = None
img_init = False

@app.get('/text')
def txt_fn(input:str=""):
    global txt_init,_txt_fn
    
    if not txt_init:
        _txt_fn = TextEmbeddingFunction()
        txt_init = True
    
    return json.dumps(
        _txt_fn(input)
    )
    
@app.get('/img')
def img_fn(input:str=""):
    global img_init,_img_fn
    if not img_init:
        _img_fn = ImageEmbeddingFunction()
        img_init = True
        
    #Decode the image bytestring
    img = np.array(
        Image.open(BytesIO(b64decode(input))).convert("RGB")
    )
    
    return json.dumps(
        _img_fn(img)
    )