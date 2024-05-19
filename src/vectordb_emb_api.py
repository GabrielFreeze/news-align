"""
Command to start this api:
    `web-extension\src > uvicorn vectordb_emb_api:app --host=localhost --port=8001`
"""

import json
from fastapi import FastAPI, Request
from vector_db.utils import TextEmbeddingFunction, ImageEmbeddingFunction

app = FastAPI()


_txt_fn = None
txt_init = False

_img_fn = None
img_init = False

@app.post('/text')
async def txt_fn(request:Request):
    global txt_init,_txt_fn
    
    if not txt_init:
        _txt_fn = TextEmbeddingFunction()
        txt_init = True
    
    data = await request.json()
    input = data.get("input", "")
    
    
    return _txt_fn(input)
    
@app.post('/img')
async def img_fn(request:Request):
    global img_init,_img_fn
    
    if not img_init:
        _img_fn = ImageEmbeddingFunction()
        img_init = True
    
    data = await request.json()
    input = data.get("input", "")[0]
    
    return _img_fn(input) #Bytestring is converted to image by img_fn
    