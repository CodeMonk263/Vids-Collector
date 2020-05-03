from bs4 import BeautifulSoup # BeautifulSoup is in bs4 package 
import requests
from selenium import webdriver 
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC 
from selenium.common.exceptions import TimeoutException
import time

option = webdriver.ChromeOptions()
option.add_argument(" — incognito")
# option.add_argument("headless")

def get_src(link):

    browser = webdriver.Chrome(options=option)
    browser.get(link)
    # Wait 20 seconds for page to load
    timeout = 20
    try:
        WebDriverWait(browser, timeout).until(EC.visibility_of_element_located((By.XPATH, "//a[@class='btn download-btn']")))
    except TimeoutException:
        print("Timed out waiting for page to load")
        browser.quit()

    titles_href = browser.find_elements_by_xpath("//a[@class='btn download-btn']")[0]

    titles_href.click()
    time.sleep(5)

    titles_href = browser.find_elements_by_xpath("//a[@class='btn download-btn']")[0]
    vid_src = titles_href.get_attribute('href')
    browser.close()
    browser.quit()
    return (vid_src)
    #print (vid_src)

def get_vids(url):
    content = requests.get(url)

    soup = BeautifulSoup(content.text, 'html.parser')

    rows = soup.find_all("h2", { "class" : "entry-title"})
    rows2 = soup.find_all("div", {"class": "grid-box-img"})

    titles = []
    hrefs = []
    thumbnails_src = []

    for row in rows:
        title = row.find("a", href=True).get_text()
        title = (title[:58] + '..') if len(title) > 60 else title
        titles.append(title)
        href = row.find("a",href=True)['href']
        #time.sleep(2)
        sub_content = requests.get(href)
        sub_soup = BeautifulSoup(sub_content.text, 'html.parser')
        sub_links = sub_soup.find("span", {"style":"color: #000000;"}).find_all("a",href=True)
        #print(title+"  :  ", '\n')
        #print(sub_links[1].get_text()+" - "+sub_links[1]['href'],'\n')
        vid_link = sub_links[1]['href'] + "?download"
        hrefs.append(vid_link)
        #print (get_src(vid_link),'\n')

    for row2 in rows2:
        thumbnail_src = row2.find("a",href=True).find("img")['src']
        thumbnails_src.append(thumbnail_src)

    #print (titles,'\n',hrefs,'\n',thumbnails_src,'\n')

    return (titles, hrefs, thumbnails_src)

#get_vids('https://xmoviesforyou.video/')
#get_src('https://mixdrop.co/f/1v9qvg90u0p7e0?download')
