import re
import json
import requests
import traceback
from lxml import html
from time import time,sleep
from base64 import b64encode
from lxml.html import HtmlElement
from common.payload import Payload
from dateutil.parser import parse as date_parse

class ArticleScraper:
    def __init__(self):
        self.headers = {'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.86 Safari/537.36"}
        
    def scrape(self, url:str,ignore_imgs:bool=False) -> Payload:
        scraper_map = {"timesofmalta":self._scrape_tom,
                       "theshiftnews":self._scrape_ts,
                       "maltatoday"  :self._scrape_mt,
                       "independent" :self._scrape_ind,
                       "newsbook"    :self._scrape_nb}

        match = re.search(r"(?:https?:\/\/)(?:www\.)?([a-zA-Z0-9-]+)\.com", url)

        #Ensure that the provided website is valid
        if match and (key:=match.group(1)) in scraper_map.keys():
            return scraper_map[key](url,ignore_imgs)
        else:
            return Payload(error=f"{url} does not belong to the following domain names: {list(scraper_map.keys())}")
        
    def _scrape_tom(self,url:str,ignore_imgs:bool=False):        
        
        if (k:="timesofmalta.com/article/") not in url:
            return Payload(error=f"{url} does not include sub-string {k}")
        
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
            thumbnail_bytes = {"data":self.url_to_bytestring(thumbnail['@id'],
                                                             return_empty=ignore_imgs),
                               "alt": thumbnail['caption'],
                               "css-selector":'.ar-ArticleHeader-Standard_sub > picture > img'}
            
            #Save byte data of images
            imgs_bytes = [{"data":self.url_to_bytestring(img.attrib['src'],
                                                         return_empty=ignore_imgs),
                           "alt": img.attrib['alt'],
                           "css-selector": f"div.image img"}
                          for i,img in enumerate(tree.cssselect('.image img'))]
            
            #Save byte data of slider images
            slider_bytes = [{"data":self.url_to_bytestring(img.cssselect('img')[0].attrib['src'],
                                                           return_empty=ignore_imgs),
                             "alt": img.cssselect('.caption-text')[0].text,
                             "css-selector":    f"div.swiper-slide img"}
                            for i,img in enumerate(tree.cssselect('.swiper-slide'))]
                                
            #Get Body
            body = self.get_nested_text(tree.xpath('/html/body/div/main/article/div[2]/div')[0])

            #Get date
            date = tree.cssselect('meta[property="article:published_time"]')[0].attrib['content']
            date = self.format_date(date)
            
        except Exception as e:
            traceback.print_exc()
            return Payload(error=f"Unexpected Error: {repr(e)}")

                                # Join thumbnail and image data    vvv
        return Payload(data={"title":title,
                             "imgs" :[thumbnail_bytes]+imgs_bytes+slider_bytes,
                             "body" :body,
                             "date" :date})

    def _scrape_ts(self,url:str,ignore_imgs:bool=False):
        
        if not re.search(r"(?:https?:\/\/)(?:www\.)?theshiftnews\.com\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/",url):
            return Payload(error=f"{url} is not a valid TheShiftNews article")
        
        try:
            content = requests.get(url,headers=self.headers).content.decode('utf-8')
            tree = html.fromstring(content)
            
            #Skip Maltese Articles            
            if tree.cssselect('div.content:nth-child(1) > p:nth-child(1) > em:nth-child(1) > a:nth-child(1)'):
                return Payload(f"English is the only supported language but {url} is in Maltese")

            title = tree.cssselect('.title')[0].text

            #Get Body
            body = self.get_nested_text(tree.cssselect('div.content')[0], theshift=True)
            body = body.replace("Aqra dan l-artiklu bil-Malti.",'')
            
                                   
            #Get Images, Captions, and CSS Selector
            thumbnail_css = 'div.featured_posts'
            thumbnail = tree.cssselect(thumbnail_css)[0]
            
            imgs = [{ #Save byte data of thumbnail
                "data": self.url_to_bytestring(thumbnail.cssselect('img')[0].attrib['src'],
                                               return_empty=ignore_imgs),
                "alt" : thumbnail.cssselect('p')[0].text,
                "css-selector":    f'{thumbnail_css} img'
            }]
            
            
            #Save byte data of images to list
            for i,img in enumerate(tree.cssselect(css:='div.wp-caption')):
                imgs.append({
                    "data": self.url_to_bytestring(img.cssselect('img')[0].attrib['src'],
                                                   return_empty=ignore_imgs),
                    "alt" : img.cssselect('p')[0].text,
                    "css-selector": f'{css} img',
                })
            
            #Get date
            date = tree.cssselect("div.date")[0].text
            date = self.format_date(date)            
            
        except Exception as e:
            traceback.print_exc()
            return Payload(f"Unexpected Error: {repr(e)}")
        
        return Payload(data={"title":title,
                             "imgs" :imgs,
                             "body" :body,
                             "date" :date})

    def _scrape_mt(self,url:str,ignore_imgs:bool=False):
        if not re.search(r"(?:https?:\/\/)(?:www\.)?maltatoday\.com(\.mt)?(\/)*(?:news|environment)\/[a-zA-Z0-9_-]*\/[0-9]{6}\/",url):
            return Payload(error=f"{url} is not a valid MaltaToday article")
        
        try:
            content = requests.get(url,headers=self.headers,verify=False).content.decode('utf-8')
            tree = html.fromstring(content)            

            title = tree.cssselect('#content > section > div > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div > h1')[0].text
            
            #Get Body
            body = self.get_nested_text(tree.cssselect('.content')[0])
            
            #Get Date
            try: date = tree.cssselect(".date")[0].text
            except: date = tree.cssselect(".date_last_published")[0].text.replace("Last updated on ","")
            date = self.format_date(date)
            
            #Get Images,Captions, and CSS Selector
            #Save byte data of thumbnail
            thumbnail_css = 'div[data-module-name="article_cover"] div.cover-photo'
            thumbnail = tree.cssselect(f'{thumbnail_css} img')[0]
            
            imgs = [{
                "data":self.url_to_bytestring("https:"+thumbnail.attrib['src'],
                                              return_empty=ignore_imgs),
                "alt": thumbnail.attrib['alt'],
                "css-selector": f'{thumbnail_css} img',
            }] 
            
            css = 'div[data-module-name="full_article"] div.cover-photo'
            for i,img in enumerate(tree.cssselect(css)):
                
                img = img.cssselect(f'img')[0]
                
                imgs.append({
                    "data": self.url_to_bytestring("https:"+img.attrib['src'],
                                                  return_empty=ignore_imgs),
                    "alt": img.attrib['alt'],
                    "css-selector": f'{css} img',
                })

        except Exception as e:
            print(url)
            traceback.print_exc()
            return Payload(f"Unexpected Error: {repr(e)}")
        
        return Payload(data={"title":title,
                             "imgs" :imgs,
                             "body" :body,
                             "date" :date})
    
    def _scrape_ind(self,url:str,ignore_imgs:bool=False):
        if not re.search(r"(?:https?:\/\/)(?:www\.)?independent\.com(\.mt)?(\/)*articles\/[0-9]{4}-[0-9]{2}-[0-9]{2}\/local-news\/*",url):
            return Payload(error=f"{url} is not a valid Malta Independent article")
        
        try:
            content = requests.get(url,headers=self.headers,verify=False).content.decode('utf-8')
            tree = html.fromstring(content)
                        
            title = tree.cssselect("head > title")[0].text
            body  = self.get_nested_text(
                tree.cssselect(".text-container")[0]
            )
            date = self.format_date(
                tree.cssselect(".date-published")[0].text
            )
            
            #Thumbnail
            thumbnail_link = tree.cssselect("meta[property='og:image']")[0].attrib['content']
            imgs = [{
                "data": self.url_to_bytestring(thumbnail_link,return_empty=ignore_imgs),
                "alt": "",
                "css-selector": "article.entry-wrapper > div.image-section > img"
            }]
            
            #Rest of the images
            img_links = [f"https://www.independent.com.mt{img.attrib['src']}"
                         for img in tree.cssselect("span > img")]
                        
            for img_link in img_links:
                imgs.append({
                    "data": self.url_to_bytestring(img_link,return_empty=ignore_imgs),
                    "alt": "", #Malta Independent images do not have captions as of 5/6/2024
                    "css-selector": f"span img"
                })
        except Exception as e:
            print(url)
            traceback.print_exc()
            return Payload(f"Unexpected Error: {repr(e)}")
        
        return Payload(data={"title":title,
                             "imgs" :imgs,
                             "body" :body,
                             "date" :date})
    
    def _scrape_nb(self,url:str,ignore_imgs:bool=False):
        if not re.search(r"(?:https?:\/\/)(?:www\.)?newsbook\.com(\.mt)?\/en\/*",url):
            return Payload(error=f"{url} is not a valid /english/ NewsBook article")

        try:
            content = requests.get(url,headers=self.headers,verify=False).content.decode('utf-8')
            tree = html.fromstring(content)            
                        
            title = tree.cssselect("h1.entry-title")[0].text
            body  = self.get_nested_text(
                tree.cssselect(".td-post-content")[0]
            )
            date  = tree.cssselect("meta[property='article:modified_time']")[0].attrib['content']

            #Gets the highest resolution image from a srcset
            srcset_to_bytestring = lambda srcset: \
                self.url_to_bytestring(
                    max(
                        map(
                            lambda src: src.split(" "),
                            srcset.split(", ")
                        ),
                        key=lambda src_w: int(src_w[1][:-1])
                    )[0],
                    return_empty=ignore_imgs
                )

            imgs = []
            thumbnail_css = "div.td-post-featured-image > a > img"
            
            #If above selector does not exist,
            #then thumbnail has selector like rest of images
            if thumbnail:=tree.cssselect(thumbnail_css):
                imgs=[{
                    "data": srcset_to_bytestring(
                        thumbnail[0].attrib['srcset']
                    ),
                    "alt": thumbnail[0].attrib['alt'],
                    "css-selector": thumbnail_css
                }]
                        
            img_css = "figure"
            for fig in tree.cssselect(img_css):
                if not (img:=fig.cssselect("img")):
                    continue
                
                img = img[0]
                
                #We will take the alt-text as a caption for newsbook
                txt = img.attrib['alt'].replace('-',' ')
                
                img_data = srcset_to_bytestring(
                    img.attrib['srcset']
                )
                
                imgs.append({
                    "data": img_data,
                    "alt": txt,
                    "css-selector": img_css
                })
                
                

        except Exception as e:
            print(url)
            traceback.print_exc()
            return Payload(f"Unexpected Error: {repr(e)}")
    
        return Payload(data={"title":title,
                             "imgs" :imgs,
                             "body" :body,
                             "date" :date})
        
    def get_nested_text(self,element:HtmlElement, theshift:bool=False):            
        
        return " ".join(
            [(child.text or "") + self.get_nested_text(child,theshift) + (child.tail or "")
            for child in element.iterchildren()
            if child.tag in ['p','strong','i','b','u','em','a','span' if theshift else ""]]
        )
        
    def url_to_bytestring(self,url:str,return_empty:bool=False):
        
        if return_empty:
            return ""
        
        t = time()
        while len(img_data := requests.get(url).content) <= 146 and time()-t < 10:
            sleep(0.2)

        if len(img_data) <= 146:
            return ""
        
        return b64encode(img_data).decode("ascii")

    def format_date(self,date:str):
        
        if date is None:
            return ""
        
        return (date_parse(date,dayfirst=True,ignoretz=True,yearfirst=False)
                .date()
                .strftime("%d-%m-%Y"))