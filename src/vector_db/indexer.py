import traceback
import requests
import xmltodict
from lxml import html

class NewspaperIndexer:
    def __init__(self):       
        self.sitemaps = {"timesofmalta":["https://timesofmalta.com/sitemap_national.xml"],
                         
                         "maltatoday"  :["https://www.maltatoday.com.mt/news/national",
                                         "https://www.maltatoday.com.mt/news/court_and_police",
                                         "https://www.maltatoday.com.mt/news/data_and_surveys",
                                         "https://www.maltatoday.com.mt/news/ewropej"],
                         
                         "theshift"    :["https://theshiftnews.com/wp-sitemap-posts-post-4.xml",
                                         "https://theshiftnews.com/wp-sitemap-posts-post-5.xml"]
                        }
        
        self.get_map = {"timesofmalta":self._get_tom,
                        "theshift"    :self._get_ts,
                        "maltatoday"  :self._get_mt}
        
        self.headers = {
            'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    
    def get_latest_urls(self,newspaper:str):
        urls = []
        
        for sitemap in self.sitemaps[newspaper]:
            try:
                urls += self.get_map[newspaper](sitemap)
            except Exception as e:
                print(f"Could not extract urls from {sitemap}")
        
        return urls   
    
    def _get_tom(self,sitemap):
        content = requests.get(sitemap,headers=self.headers).content
        article_urls = [url['loc'] for url in xmltodict.parse(content)['urlset']['url']]

        return article_urls
      
    def _get_ts(self,sitemap):
        content = requests.get(sitemap,headers=self.headers).content
        article_urls = [url['loc'] for url in xmltodict.parse(content)['urlset']['url'][-40:]]
                  
        return article_urls
        
    def _get_mt(self,sitemap):
        
        content = requests.get(sitemap,headers=self.headers).content.decode('utf-8')                
        tree = html.fromstring(content)        
            
        sections = tree.cssselect(".param1-articles")
            
        if sections == []:
            article_urls = ["https://maltatoday.com"+a.attrib["href"]
                            for a in tree.cssselect("div.large-article a")]
            
        else:
            article_urls = ["https://maltatoday.com"+article.attrib['data-url']
                            for i in [0,1,2,4] # [3]=`Trending Articles`
                                for article in sections[i].cssselect('.news-article')]
        
        return article_urls
        
    