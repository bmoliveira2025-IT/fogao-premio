import requests
from bs4 import BeautifulSoup

url = "https://www.botafogo.com.br/"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Identify video section - usually Look for iframes or specific classes
    # Common patterns: youtube.com/embed, sections named 'tv', 'video'
    
    iframes = soup.find_all('iframe')
    print(f"Total iframes found: {len(iframes)}")
    
    for iframe in iframes:
        src = iframe.get('src', '')
        if 'youtube' in src:
            print(f"YouTube Video found: {src}")
            
    # Also check for links to youtube
    youtube_links = [a['href'] for a in soup.find_all('a', href=True) if 'youtube.com' in a['href'] or 'youtu.be' in a['href']]
    print(f"YouTube links found: {len(youtube_links)}")
    for l in youtube_links[:5]:
        print(l)

    # Check for specific "botafogo-tv" section if possible (by ID or class)
    tv_section = soup.find(id="botafogo-tv") or soup.find(class_="botafogo-tv")
    if tv_section:
        print("Found #botafogo-tv section!")
        # Extract from within
        
except Exception as e:
    print(f"Error: {e}")
