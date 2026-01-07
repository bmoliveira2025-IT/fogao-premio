
import requests
from bs4 import BeautifulSoup

url = "https://www.youtube.com/@BotafogoTV"
print(f"Fetching {url}...")
try:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    res = requests.get(url, headers=headers)
    print(f"Status: {res.status_code}")
    
    soup = BeautifulSoup(res.text, 'html.parser')
    rss_link = soup.find('link', type='application/rss+xml')
    
    if rss_link:
        print(f"FOUND RSS LINK: {rss_link['href']}")
    else:
        print("RSS link not found in head.")
        # Search for channelId in text again to be sure
        import re
        ids = re.findall(r'"channelId":"(UC[\w-]+)"', res.text)
        print(f"Channel IDs found in text: {list(set(ids))}")
        
except Exception as e:
    print(f"Error: {e}")
