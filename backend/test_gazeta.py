import requests
from bs4 import BeautifulSoup

url = "https://www.gazetabotafogo.com/"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Try finding all links
    links = [a['href'] for a in soup.find_all('a', href=True)]
    
    # Filter for potential article links (usually /yyyy/mm/ or .html)
    # Gazeta Botafogo seems to be a Blogger/Blogspot site often
    article_links = [l for l in links if '.html' in l and '/20' in l]
    
    print(f"Total links found: {len(links)}")
    print(f"Potential article links: {len(article_links)}")
    
    for l in article_links[:10]:
        print(l)
        
except Exception as e:
    print(f"Error: {e}")
