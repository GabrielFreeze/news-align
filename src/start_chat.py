import os
import gradio as gr
from time import sleep
from fastapi import FastAPI
from urllib.parse import parse_qs
from fastapi.responses import RedirectResponse
from backend.chat_backend import SessionBackend, GlobalBackend

def start_chat():

    def format_prompt(user_msg,history):
        return history + [[user_msg, None]]       
    def prepare_streamer(history, s_bk):
        s_bk.stop_generation = False
        s_bk.prepare_streamer(history,g_bk)
        return s_bk
    def stream_response(history,s_bk):
        yield from s_bk.stream_response(history,g_bk)
    
    def set_context_docs(request:gr.Request, s_bk:gr.State):
        print("Retrieving Context Docs")
        params = parse_qs(str(request.query_params))
        if "ids" in params:
            s_bk.set_context_docs(params['ids'],g_bk)
        
        return s_bk
    
    def reset(s_bk:SessionBackend):
        s_bk.stop_generation = True
        sleep(0.6)
        s_bk.reset()
        return None,s_bk

    # model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
    model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"
    # model_id = "hugging-quants/Meta-Llama-3.1-8B-Instruct-GPTQ-INT4"
    
    revision = "main"    
    
    g_bk = GlobalBackend(model_id,revision=revision)
    
    with gr.Blocks(theme=gr.themes.Soft()) as demo:
        
        s_bk = gr.State(SessionBackend())
    
        #Retrieve context articles IDs from the GET parameters.
        demo.load(set_context_docs,[s_bk],[s_bk])        
        
        gr.Markdown("""<div style="text-align: center; font-size: 24px;">Malta-7B</div>
                       <div style="text-align: center; font-size: 12px;"><i>L-Università ta' Malta</i></div>""")
        with gr.Column():
            chatbot   = gr.Chatbot(height=400)
            msg       = gr.Textbox(label="User")
            clear     = gr.Button("Start New Topic")

        (
        msg.submit(format_prompt,[msg,chatbot], [chatbot], queue=False)
           .then  (lambda: None, None, [msg])
           .then  (prepare_streamer, [chatbot,s_bk], [s_bk])
           .then  (stream_response, [chatbot,s_bk], [chatbot]) 
        )
        
        #Remove all texts & reset SessionBackend
        clear.click(reset,[s_bk], [chatbot,s_bk], queue=False)       
        
        demo.queue()
        demo.launch(server_name="localhost", server_port=82,
                    share=False, max_threads=1,root_path=f"/ch/{os.environ['AI_EXT_TOKEN']}")

if __name__ == '__main__':
    start_chat()

    
