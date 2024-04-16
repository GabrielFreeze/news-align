import re
import json
import requests
import traceback
from lxml import html
from cssify import cssify
from base64 import b64encode
from lxml.html import HtmlElement
from utils import color, get_img_ext, Payload

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

            with open('test.html','w',encoding='utf-8') as f:
                f.write(content)
            
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
            thumbnail_bytes = {"data":b64encode(requests.get(thumbnail['@id']).content).decode("ascii"),
                               "file":get_img_ext(k),
                               "alt": thumbnail['caption'],
                               "css-selector":'article-head > div > span'}
            
            #Save byte data of images
            xpath = '//img[@class="wi-WidgetSubCompType_13-img wi-WidgetImage loaded"]'
            imgs = tree.xpath(xpath)
            imgs_bytes = [{"data":b64encode(requests.get(k:=img.attrib['src']).content).decode("ascii"),
                           "alt": img.get_attribute('alt'),
                           "css-selector": cssify(xpath)}
                          for img in imgs]
                                
            #Get Body
            body = self.get_nested_text(tree.xpath('/html/body/div/main/article/div[2]/div')[0])

        except Exception as e:
            traceback.print_exc()
            return Payload(error=f"Unexpected Error: {traceback.format_exc()}")

                                # Join thumbnail and image data    vvv
        return Payload(data={"title":title, "imgs":[thumbnail_bytes]+imgs_bytes, "body" :body})

    def scrape_ts(self,url:str):
        
        if not re.search(r"(?:https?:\/\/)(?:www\.)?theshiftnews\.com\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/",url):
            return Payload(error=f"URL is not a valid TheShiftNews article")
        
        try:
            content = requests.get(url,headers=self.headers).content.decode('utf-8')
            
            with open("test.html","w", encoding="utf-8") as f:
                f.write(content)
            
            tree = html.fromstring(content)
            
            #Skip Maltese Articles
            if tree.xpath('//*[@id="container"]/div[4]/p[1]/em'):
                return {}

            title = tree.xpath('//*[@id="container"]/h2')[0].text

            #Get Body
            body = ' '.join([b.text for b in tree.xpath('//*[@id="container"]/div[4]/p') if type(b.text) == str])
            
            
            #Get Images, Captions, and CSS Selector
            img_tags = [(tree.xpath(k:=f'//*[@class="featured_image"]/img')[0],
                         cssify(k))] + \
                       [(img_tag,
                         cssify('//*[@class="wp-caption alignnone"]/img'))
                        for img_tag in tree.xpath(f'//*[@class="wp-caption alignnone"]/img')]

            #Save byte data of images to list
            imgs = [{"data":b64encode(requests.get(k:=img.attrib['src']).content).decode("ascii"),
                     "alt": img.xpath('./p')[0].text,
                     "css-selector": css}
                    for img,css in img_tags]
        
        except Exception as e:
            traceback.print_exc()
            return Payload(f"Unexpected Error: {traceback.format_exc()}")
        
        return Payload(data={"title":title, "imgs":imgs, "body" :body})

    def scrape_mt(self,url:str):
        if not re.search(r"(?:https?:\/\/)(?:www\.)?maltatoday\.com\.mt\/news\/national\/[0-9]{6}\/",url):
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
            
            #Get Images,Captions, and XPATH
            img_tags = []
            for class_name in ["media-item show ", "media-item show", "media-item"]:
                for i,img_tag in enumerate(tree.cssselect(k:=f'.{class_name} img')):
                    img_tags.append((img_tag, f'{k}'))

                
            #Save byte data of images to list
            imgs = [{"data":b64encode(requests.get(k:=("https:"+img.attrib['src'])).content).decode("ascii"),
                     "alt": img.attrib['alt'],
                     "css-selector": css}
                    for img,css in img_tags]
        
        except Exception as e:
            traceback.print_exc()
            return Payload(f"Unexpected Error: {traceback.format_exc()}")
        
        return Payload(data={"title":title, "imgs":imgs, "body" :body})
    
    
    def get_nested_text(self,element:HtmlElement): 
        return "".join([(child.text or "") + self.get_nested_text(child) + (child.tail or "")
                        for child in element.iterchildren()
                        if child.tag in ['p','strong','i','b','u','em','a']])
        
    