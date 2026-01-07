import requests
from bs4 import BeautifulSoup

url = "https://br.bolavip.com/botafogo"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Try finding all links
    links = [a['href'] for a in soup.find_all('a', href=True)]
    
    # Filter for potential article links
    # Bolavip usually has /botafogo/article-title-date.html or similar
    article_links = [l for l in links if '/botafogo/' in l and l.count('/') > 4] # heuristic for deeper paths
    
    print(f"Total links found: {len(links)}")
    print(f"Potential article links: {len(article_links)}")
    
    for l in article_links[:10]:
        print(l)
        
except Exception as e:
    print(f"Error: {e}")
