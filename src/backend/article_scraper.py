#TO FIX: the -1 thing is not returning as dict and as a result thew payload is just -1 and not the score=-1, which hence cant be displayed
#Just switch hover to JS bro. You tried, its just not worth it

import re
import json
import requests
import traceback
from time import time
from lxml import html
from base64 import b64encode
from utils import Payload
from lxml.html import HtmlElement

class ArticleScraper:
    def __init__(self):
        self.headers = {'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.86 Safari/537.36"}
        
    def scrape(self, url:str) -> Payload:
        scraper_map = {"timesofmalta":self.scrape_tom,
                       "theshiftnews":self.scrape_ts,
                       "maltatoday"  :self.scrape_mt}
        match = re.search(r"(?:https?:\/\/)(?:www\.)?([a-zA-Z0-9-]+)\.com", url)

        #Ensure that the provided website is valid
        if match and (key:=match.group(1)) in scraper_map.keys():
            return scraper_map[key](url)
        else:
            return Payload(error=f"{url} does not belong to the following domain names: {list(scraper_map.keys())}")
        
    def scrape_tom(self,url:str):        
        
        if (k:="timesofmalta.com/article/") not in url:
            return Payload(error=f"URL does not include sub-string {k}")
        
        try:
            #Get article
            content = requests.get(url,headers=self.headers).content.decode('utf-8')
            tree = html.fromstring(content)          

            #Get Title
            title = tree.xpath('/html/head/title')[0].text
            script = json.loads(tree.xpath('//*[@id="article-ld"]')[0].text)            
            
            #There exists multiple versions of a given image.
            #Get all images with the same caption as the first image (the thumbnail)
            all_imgs = script['@graph'][0]['image']
            all_imgs = [img for img in all_imgs
                        if all_imgs[0]['caption'] == img['caption']]
            
            #Get the thumbnail image with the highest resolution
            thumbnail = sorted(all_imgs,key=lambda img: img['height']*img['width'],
                               reverse=True)[0]
            
            #Save byte data of thumbnail
            thumbnail_bytes = {"data":self.url_to_bytestring(thumbnail['@id']),
                               "alt": thumbnail['caption'],
                               "css-selector":'.ar-ArticleHeader-Standard_sub > picture > img'}
            
            #Save byte data of images
            imgs_bytes = [{"data":self.url_to_bytestring(img.attrib['src']),
                           "alt": img.attrib['alt'],
                           "css-selector": f"div.image img"}
                          for i,img in enumerate(tree.cssselect('.image img'))]
            
            #Save byte data of slider images
            slider_bytes = [{"data":self.url_to_bytestring(img.cssselect('img')[0].attrib['src']),
                             "alt": img.cssselect('.caption-text')[0].text,
                             "css-selector":    f"div.swiper-slide img"}
                            for i,img in enumerate(tree.cssselect('.swiper-slide'))]
                                
            #Get Body
            body = self.get_nested_text(tree.xpath('/html/body/div/main/article/div[2]/div')[0])

        except Exception as e:
            traceback.print_exc()
            return Payload(error=f"Unexpected Error: {traceback.format_exc()}")

                                # Join thumbnail and image data    vvv
        return Payload(data={"title":title, "imgs":[thumbnail_bytes]+imgs_bytes+slider_bytes, "body" :body})

    def scrape_ts(self,url:str):
        
        if not re.search(r"(?:https?:\/\/)(?:www\.)?theshiftnews\.com\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/",url):
            return Payload(error=f"URL is not a valid TheShiftNews article")
        
        try:
            content = requests.get(url,headers=self.headers).content.decode('utf-8')
            tree = html.fromstring(content)
            
            #Skip Maltese Articles
            if tree.cssselect('.content > p:nth-child(1) > i:nth-child(1) > a:nth-child(1)'):
                return {}

            title = tree.cssselect('.title')[0].text

            #Get Body
            body = self.get_nested_text(tree.cssselect('div.content')[0], theshift=True)
            body = body.replace("Aqra dan l-artiklu bil-Malti.",'')
            
                                   
            #Get Images, Captions, and CSS Selector
            thumbnail_css = 'div.featured_posts'
            thumbnail = tree.cssselect(thumbnail_css)[0]
            
            imgs = [{ #Save byte data of thumbnail
                "data": self.url_to_bytestring(thumbnail.cssselect('img')[0].attrib['src']),
                "alt" : thumbnail.cssselect('p')[0].text,
                "css-selector":    f'{thumbnail_css} img',
                "parent-selector": f'{thumbnail_css}'
            }]
            
            
            #Save byte data of images to list
            for i,img in enumerate(tree.cssselect(css:='div.wp-caption')):
                imgs.append({
                    "data": self.url_to_bytestring(img.cssselect('img')[0].attrib['src']),
                    "alt" : img.cssselect('p')[0].text,
                    "css-selector": f'{css} img',
                })
            
        
        except Exception as e:
            traceback.print_exc()
            return Payload(f"Unexpected Error: {traceback.format_exc()}")
        
        return Payload(data={"title":title, "imgs":imgs, "body" :body})

    def scrape_mt(self,url:str):
        if not re.search(r"(?:https?:\/\/)(?:www\.)?maltatoday\.com\.mt\/(news|environment)\/[a-zA-Z0-0-]*\/[0-9]{6}\/",url):
            return Payload(error=f"URL is not a valid MaltaToday article")
        
        try:
            content = requests.get(url,headers=self.headers).content.decode('utf-8')
            
            with open("test.html","w", encoding="utf-8") as f:
                f.write(content)
            
            tree = html.fromstring(content)

            # title = tree.xpath('//*[@id="content"]/section/div/div[1]/div/div/div[2]/div/div/div/h1')[0].text
            title = tree.cssselect('.article-heading > div:nth-child(1) > div:nth-child(1) > h1:nth-child(1)')[0].text
            
            #Get Body
            # body = self.get_nested_text(tree.xpath('/html/body/div[1]/section/div/div[2]/div[2]/div/div[1]/div[1]/div')[0])            
            body = self.get_nested_text(tree.cssselect('.content')[0])            
            
            #Get Images,Captions, and CSS Selector
            
            #Save byte data of thumbnail
            thumbnail_css = 'div[data-module-name="article_cover"] div.cover-photo'
            thumbnail = tree.cssselect(f'{thumbnail_css} img')[0]
            
            imgs = [{
                "data":self.url_to_bytestring("https:"+thumbnail.attrib['src']),
                "alt": thumbnail.attrib['alt'],
                "css-selector": f'{thumbnail_css} img',
            }] 
            
            css = 'div[data-module-name="full_article"] div.cover-photo'
            for i,img in enumerate(tree.cssselect(css)):
                
                img = img.cssselect(f'img')[0]
                
                imgs.append({
                    "data":self.url_to_bytestring("https:"+img.attrib['src']),
                    "alt": img.attrib['alt'],
                    "css-selector": f'{css} img',
                })

        
        except Exception as e:
            traceback.print_exc()
            return Payload(f"Unexpected Error: {traceback.format_exc()}")
        
        return Payload(data={"title":title, "imgs":imgs, "body" :body})
    
    
    def get_nested_text(self,element:HtmlElement, theshift:bool=False):            
        
        return " ".join(
            [(child.text or "") + self.get_nested_text(child,theshift) + (child.tail or "")
            for child in element.iterchildren()
            if child.tag in ['p','strong','i','b','u','em','a','span' if theshift else ""]]
        )
        
    def url_to_bytestring(self,url:str):
        t = time()
        while len(img_data := requests.get(url).content) <= 146 and time()-t < 5:
            pass

        return b64encode(img_data).decode("ascii")