import requests
from bs4 import BeautifulSoup

url = "https://www.lance.com.br/botafogo"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Try finding all links
    links = [a['href'] for a in soup.find_all('a', href=True)]
    
    # Filter for potential article links
    botafogo_links = [l for l in links if '/botafogo/' in l or 'lance.com.br/botafogo/' in l]
    
    print(f"Total links found: {len(links)}")
    print(f"Botafogo related links: {len(botafogo_links)}")
    
    for l in botafogo_links[:10]:
        print(l)
        
except Exception as e:
    print(f"Error: {e}")
