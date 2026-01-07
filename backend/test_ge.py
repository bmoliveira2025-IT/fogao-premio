import requests
from bs4 import BeautifulSoup

url = "https://ge.globo.com/futebol/times/botafogo/"
headers = {'User-Agent': 'Mozilla/5.0'}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

links = [a['href'] for a in soup.find_all('a', href=True) if '/noticia/' in a['href']]

print(f"Found {len(links)} links:")
for l in links[:10]:
    print(l)
