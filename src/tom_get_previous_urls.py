'''
This is an edited version of `scrapers/tom_scraper.py`
Times Of Malta changed their website such that you can't navigate to any page directly from the URL
Moreover, old articles are articles (~2 weeks) are not listed on their sitemap.xml which is how `listener.py` finds the articles to begin with.
As a result this script spins a Selenium Chrome Drive and gathers urls by navigating the pages iteratively
The URLS are stored in `tom_additional.csv` and can be then passed to listener.py by enabling the `add_additional` flag.
'''

import os
import re
import sys
import signal
import requests
import traceback
import pandas as pd
from time import sleep
from selenium import webdriver
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By


# class color:
#     WHITE = '\033[95m'
#     BLUE = '\033[94m'
#     CYAN = '\033[96m'
#     GREEN = '\033[92m'
#     YELLOW = '\033[93m'
#     RED = '\033[91m'
#     ESC = '\033[0m'
#     BOLD = '\033[1m'
#     UNDERLINE = '\033[4m'

CSV_PATH = os.path.join('vector_db','urls','additional_tom.csv')

def signal_handler(sig,frame):
    print('SIG Received - Saving..')
    pd.DataFrame(columns=['URL'],
            data=data).to_csv(CSV_PATH, index=False)
    sys.exit()

# Since chromedriver is in PATH we dont have specify it location otherwise webdriver.Chrome('path/chromedriver.exe')
driver = webdriver.Chrome(os.path.join('..','chromedriver.exe'))
action = webdriver.ActionChains(driver)

# Opening required website to scrape content
pg_screen = 'https://timesofmalta.com/articles/tags/national'  #This variable keeps track of the last page screen.
driver.get(pg_screen)

#Closing pop-ups
print('Closing initial pop-ups: ',end='')
driver.find_element(By.XPATH,'/html/body/div[3]/div[2]/div[2]/div[2]/div[2]/button[1]').click()
print('[OK]')


data = []
img_count = 0
pg_article_sz = 17

start_till_pg = 30 #Scrape initial x pages
skip_to_pg = 250 #Dont continue scraping until page x

num_pgs = 500  # 30(?) articles per page
save_every = 5
assert num_pgs%save_every == 0

columns = ['Title','Author','Date','Image Name','Caption','Body','URL']


for pg_idx in range(num_pgs+skip_to_pg+1):
    
    #^C Handler to save on signal.
    signal.signal(signal.SIGINT, signal_handler)
  
    #Open next page
    if pg_idx:                              
        driver.get(pg_screen)#vv Update current page screen            Choose `Next` Button vvv
        driver.get(pg_screen := driver.find_elements(By.CSS_SELECTOR,"a.page-link")[bool(pg_idx-1)]
                                      .get_attribute("href"))
    
    print(f'Next page: {str(pg_idx+1).zfill(4)}',end='\r')
    if start_till_pg < pg_idx < skip_to_pg:
        continue
    
    try: 
        #Remove donation message 😡
        try: driver.find_element(By.XPATH,'//*[@id="eng-accept"]').click()
        except: pass

        #Get links to all articles in page
        links = [i.find_element(By.TAG_NAME,'a').get_attribute('href') 
                for i in driver.find_elements(By.CLASS_NAME,"li-ListingArticles_sub")]
        data += links
        
        #Save to csv
        if pg_idx%save_every == 0:
            print('\nSaving...')
            pd.DataFrame(columns=['URL'],data=data).to_csv(CSV_PATH, index=False)

    except Exception as e:
        traceback.print_exc()
        print(f'[ERR]')

