import re
import json
import requests
import traceback
from lxml import html
from base64 import b64encode
from selenium import webdriver
from lxml.html import HtmlElement
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from utils import color, get_img_ext, Payload

class ArticleScraper:
    def __init__(self):
        self.headers = {'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.86 Safari/537.36"}
        
        #Initialise Selenium webdriver in cases were JS is required to fully load page.
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--log-level=3")
        
    def scrape(self, url:str) -> Payload:
        scraper_map = {"timesofmalta":self.scrape_tom,
                       "theshiftnews":self.scrape_ts}
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

            with open('test.html','w') as f:
                f.write(content)
            
            tree = html.fromstring(content)          

            #Get Title
            title = tree.xpath('/html/head/title')[0].text
            script = json.loads(tree.xpath('//*[@id="article-ld"]')[0].text)
            print(json.dumps(script,indent=1)) #TODO: IN here is the link to the image which will allow me to circumvent using Selenium. I need to implement this
            
            #//*[@id="observer"]/main/article/div[2]/div/*/img
            # thumbnail = tree.xpath('//meta[@property="og:image"]').attrib['content']
            # imgs = tree.xpath(f'//img[@class="wi-WidgetSubCompType_13-img wi-WidgetImage loaded"]')

            
            # #Save byte data of images to list
            # imgs_bytes = [{"img": {"data":b64encode(requests.get(k:=img.attrib['src']).content).decode("ascii"),
            #                        "file":get_img_ext(k)},
            #                "alt": img.get_attribute('alt')}
            #               for img in imgs]
            
            #Get links to Thumbnail + Images
            self.driver = webdriver.Chrome(options=self.chrome_options)
            self.driver.get(url) #ToM websites are rendered using JavaScript so we have to use Selenium.
            img_links = self.driver.find_elements(By.XPATH,'//*[@id="article-head"]/div/picture/img') + \
                        self.driver.find_elements(By.XPATH,'//*[@id="observer"]/main/article/div[2]/div/*/img')
            
            #Save byte data of images to list
            imgs = [{"img": {"data":b64encode(requests.get(k:=img.get_attribute('src')).content).decode("ascii"),
                             "file":get_img_ext(k)},
                     "alt": img.get_attribute('alt')}
                    for img in img_links]
                    
            #Get Body
            body = self.get_nested_text(tree.xpath('/html/body/div/main/article/div[2]/div')[0])

        except Exception as e:
            traceback.print_exc()
            return Payload(error=f"Unexpected Error: {traceback.format_exc()}")

        return Payload(data={"title":title, "imgs":imgs, "body" :body})

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

            #Get Images + Captions
            img_links = tree.xpath('//*[@class="featured_image"]')[:1] + \
                        tree.xpath('//*[@class="wp-caption alignnone"]')

            #Save byte data of images to list
            imgs = [{"img": {"data":b64encode(requests.get(k:=img.xpath('./img')[0].attrib['src']).content),
                             "file":get_img_ext(k)},
                    "alt": img.xpath('./p')[0].text}
                    for img in img_links]
        
        except Exception as e:
            traceback.print_exc()
            return Payload(f"Unexpected Error: {traceback.format_exc()}")
        
        return Payload(data={"title":title, "imgs":imgs, "body" :body})

    def get_nested_text(self,element:HtmlElement): 
        return "".join([(child.text or "") + self.get_nested_text(child) + (child.tail or "")
                        for child in element.iterchildren()
                        if child.tag in ['p','strong','i','b','u','em','a']])
       
