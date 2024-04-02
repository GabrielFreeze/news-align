import os
import re
import requests
import traceback
from lxml import html
from base64 import b64encode
from lxml.html import HtmlElement
from utils import color, get_img_ext
from selenium.webdriver.common.by import By
from fastapi import FastAPI,APIRouter, Query

class ArticleScraper:
    def __init__(self):
        self.headers = {'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.86 Safari/537.36"}
        
        self.router = APIRouter()
        self.router.add_api_route("/", self.scrape, methods=["GET"])


    def scrape(self, url:str = Query(...)):        
        scraper_map = {"timesofmalta":self.scrape_tom,
                       "theshiftnews":self.scrape_ts}
        match = re.search(r"(?:https?:\/\/)(?:www\.)?([a-zA-Z0-9-]+)\.com", url)

        #Ensure that the provided website is valid
        if match and (key:=match.group(1)) in scraper_map.keys():
            return scraper_map[key](url)
        else:
            return {'status':400, 'data':{}, 'error':f"{url} does not belong to the following domain names: {list(scraper_map.keys())}"}
        
    def scrape_tom(self,url:str):
        
        if (k:="timesofmalta.com/article/") not in url:
            return {'status':400, 'data':{}, 'error':f"URL does not include sub-string {k}"}
        
        try:
            #Get article
            content = requests.get(url,headers=self.headers).content.decode('utf-8')

            tree = html.fromstring(content)

            #Get Title
            title = tree.xpath('/html/head/title')[0].text

            #Get links to Thumbnail + Images
            img_links = tree.xpath('//*[@id="observer"]/main/article/div[2]/div/*/img') + \
                        tree.xpath(f'//img[@class="wi-WidgetSubCompType_13-img wi-WidgetImage loaded"]')

            #Save byte data of images to list
            imgs = [{"img": {"data":b64encode(requests.get(k:=img.attrib['src']).content),
                             "file":get_img_ext(k)},
                     "alt": img.attrib['alt']}
                    for img in img_links]
        
            #Get Body
            body = self.get_nested_text(tree.xpath('/html/body/div/main/article/div[2]/div')[0])

        except Exception as e:
            traceback.print_exc()
            error = traceback.format_exc()
            return {'status':400, 'data':{}, 'error':f"Unexpected Error: {error}"}

        print(f"{color.BLUE}HEYY{color.ESC}")
        return {"status":200, "data":{"title":title, "imgs":imgs, "body" :body}, 'error':""}

    def scrape_ts(self,url:str):
        
        self.driver.get(url)

        title = self.driver.find_element(By.XPATH,'//*[@id="container"]/h2').text
        body  = self.driver.find_element(By.XPATH,'//*[@id="container"]/div[4]').text

        #Get Images + Captions
        img_links = self.driver.find_elements(By.CLASS_NAME,'featured_image') + \
                    self.driver.find_elements(By.CLASS_NAME,'wp-caption alignnone')

        imgs = []

        for img_link in enumerate(img_links):
            img_data =  requests.get(img_link.find_element(By.TAG_NAME,'img')
                                             .get_attribute('src')).content
            img_caption = img_link.find_element(By.CLASS_NAME,"wp-caption-text").text
            imgs.append((img_data,img_caption))
        
        return {"title":title, "imgs":imgs, "body" :body}

    def get_nested_text(self,element:HtmlElement): 
        return "".join([(child.text or "") + self.get_nested_text(child) + (child.tail or "")
                        for child in element.iterchildren()
                        if child.tag in ['p','strong','i','b','u','em','a']])
       
app = FastAPI()
artScraper = ArticleScraper()
app.include_router(artScraper.router)
