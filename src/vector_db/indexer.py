import re
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
                         
                         "theshift"    :["https://theshiftnews.com/wp-sitemap-posts-post-4.xml"],
                         
                         "newsbook"    :["https://newsbook.com.mt/sitemap_index.xml"],
                         
                         "independent" :["https://www.independent.com.mt/local?pg="]
                        }
        
        self.get_map = {"timesofmalta":self._get_tom,
                        "theshift"    :self._get_ts,
                        "maltatoday"  :self._get_mt,
                        "newsbook"    :self._get_nb,
                        "independent" :self._get_ind}
        
        self.headers = {
            'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    def get_latest_urls(self,newspaper:str,latest:int=30):
        urls = []
        
        for sitemap in self.sitemaps[newspaper]:
            try:
                urls += self.get_map[newspaper](sitemap,latest)
            except Exception as e:
                traceback.print_exc()
                print(f"Could not extract urls from {sitemap}")
        
        return urls   
    
    def _get_tom(self,sitemap,latest):
        content = requests.get(sitemap,headers=self.headers).content
        article_urls = [url['loc'] for url in xmltodict.parse(content)['urlset']['url']]

        return article_urls[-latest:]
      
    def _get_ts(self,sitemap,latest):
        content = requests.get(sitemap,headers=self.headers).content
        article_urls = [url['loc'] for url in xmltodict.parse(content)['urlset']['url']]
                  
        return article_urls[-latest:]
        
    def _get_mt(self,sitemap,latest):
        
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
        
        return article_urls[-latest:]
    
    def _get_nb(self,sitemap,latest):
        content = requests.get(sitemap,headers=self.headers).content        
               
               
        all_sitemaps = [(a['loc'],match.group(1))
                        for a in xmltodict.parse(content)['sitemapindex']['sitemap']
                        if (match:=re.match("https:\/\/newsbook\.com\.mt\/post-sitemap([0-9]+).xml",a['loc']))]
                
        #Sort the list by their idx. Higher idx = Newer Sitemaps
        all_sitemaps.sort(key=lambda s_idx: int(s_idx[1]), reverse=True)
        
        urls = []
        
        #Iterate through all sitemaps and urls (starting from the latest one) until the amount is reached.
        for s,_ in all_sitemaps:
            content = requests.get(s,headers=self.headers).content.decode('utf-8')
            
            sitemap_urls = xmltodict.parse(content)['urlset']['url']
            
            for a in reversed(sitemap_urls):
            
                if re.match("https:\/\/newsbook\.com\.mt\/en\/",a['loc']):
                    
                    #Check if article belongs to the Local tag
                    tree = html.fromstring(
                        requests.get(a['loc'],headers=self.headers).content.decode('utf-8')
                    )
                    all_categories = [category.text for category in tree.cssselect("li.entry-category a")]
                    if "Local" not in all_categories:
                        continue
                    
                    urls.append(a['loc'])
                    print(str(len(urls)).zfill(4),end='\r')
                    if len(urls) >= latest:
                        return urls
        
        return urls
    
    def _get_ind(self,sitemap,latest):
        
        urls = []
        pg_num = 0
        articles_remaining = []
        while len(urls) < latest:
            try:
                print(str(len(urls)).zfill(6),end='\r')
                if not articles_remaining:
                    pg_num += 1
                    tree = html.fromstring(
                        requests.get(f'{sitemap}{pg_num}',headers=self.headers).content.decode('utf-8')
                    )
                    
                    articles_remaining = tree.cssselect("div.image-section a")
                    
                urls.append(
                    f"https://www.independent.com.mt/{articles_remaining.pop(0).attrib['href']}"
                )
            except Exception:
                traceback.print_exc()
        return urls