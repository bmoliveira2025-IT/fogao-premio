import requests
from bs4 import BeautifulSoup
import re

# Known handles/urls
urls = [
    "https://www.youtube.com/user/botafogooficial",
    "https://www.youtube.com/@BotafogoTV"
]
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for url in urls:
    try:
        print(f"Checking {url}...")
        response = requests.get(url, headers=headers)
        
        # Look for channel constant
        # usually <meta itemprop="channelId" content="UC..."
        
        match = re.search(r'itemprop="channelId" content="([^"]+)"', response.text)
        if match:
            print(f"FOUND Channel ID: {match.group(1)}")
            break
        
        # also check simpler pattern
        if "UC" in response.text:
             # loose check
             pass
             
    except Exception as e:
        print(f"Error {url}: {e}")
