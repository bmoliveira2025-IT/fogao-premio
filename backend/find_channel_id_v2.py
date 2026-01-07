
import requests
from bs4 import BeautifulSoup

# Helper to find channel ID from a video page
def get_channel_id(video_url):
    try:
        response = requests.get(video_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Try meta tags
        channel_id_meta = soup.find('meta', itemprop='channelId')
        if channel_id_meta:
            return channel_id_meta['content']
        
        # Try link tags
        channel_url_link = soup.find('link', itemprop='url', href=True)
        # Often canonical url includes channel id or handle
        
        return "Not found in meta"
    except Exception as e:
        return str(e)

# Recent video from search results
video_url = "https://www.youtube.com/watch?v=k_lGz-7Q5wQ" # Example recent video ID if I had one, but I don't have a specific URL yet.
# Let's try to search specifically for the channel page itself or use a known recent video ID if I can guess one or search for it.
# The search result gave titles but not direct URLs I can easily copy-paste guarantee. 
# "From Ashes to Fire | EP. 06 | Botafogo Films"
# I will try to fetch the channel page directly using the handle if possible. 
# Handle: @BotafogoTV

url = "https://www.youtube.com/@getv"
print(f"Checking {url}...")
try:
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    # Use meta property="og:url" which often contains the channel ID version
    og_url = soup.find('meta', property='og:url')
    if og_url:
        print(f"OG URL: {og_url['content']}")
    
    # Also look for channelId in content
    if 'channelId' in response.text:
        # Extract simplisticly
        import re
        match = re.search(r'"channelId":"(UC[\w-]+)"', response.text)
        if match:
            print(f"FOUND_CHANNEL_ID: {match.group(1)}")
            
except Exception as e:
    print(f"Error: {e}")
