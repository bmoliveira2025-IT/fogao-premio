import requests
from bs4 import BeautifulSoup
import re

url = "https://www.botafogo.com.br/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

try:
    print(f"Fetching {url }...")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Check all links for youtube
    links = [a['href'] for a in soup.find_all('a', href=True)]
    yt_links = [l for l in links if 'youtube.com' in l or 'youtu.be' in l]
    
    print(f"YouTube links found: {len(yt_links)}")
    for l in yt_links:
        print(l)
        
    # If we find a channel URL, we can use it.
    # Common format: youtube.com/user/botafogooficial OR youtube.com/channel/UC...
    
except Exception as e:
    print(f"Error: {e}")
