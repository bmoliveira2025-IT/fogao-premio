
import requests
from bs4 import BeautifulSoup
import re

def get_channel_id(handle_url):
    print(f"Checking {handle_url}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(handle_url, headers=headers)
        
        # 1. Look for channelId in content using Regex (most reliable for YouTube's current layout)
        match = re.search(r'"channelId":"(UC[\w-]+)"', response.text)
        if match:
            print(f"FOUND_CHANNEL_ID: {match.group(1)}")
            return match.group(1)
            
        # 2. Try OG URL
        soup = BeautifulSoup(response.text, 'html.parser')
        og_url = soup.find('meta', property='og:url')
        if og_url:
            print(f"OG URL: {og_url['content']}")
            # Extract ID if OG URL is in /channel/ format
            if '/channel/' in og_url['content']:
                cid = og_url['content'].split('/channel/')[-1]
                print(f"Extracted from OG: {cid}")
                return cid

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_channel_id("https://www.youtube.com/@Arena.Alvinegra")
