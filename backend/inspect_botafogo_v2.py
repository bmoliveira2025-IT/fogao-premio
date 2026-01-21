
import requests
from bs4 import BeautifulSoup
import time

url = "https://www.botafogo.com.br/elenco/futebol"

# Copying headers from a real browser visit
headers = {
    'authority': 'www.botafogo.com.br',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'max-age=0',
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}

try:
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers, timeout=15)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for names
        print("Searching for names...")
        # Common player name tags
        names = soup.find_all(['h3', 'h4', 'span'], class_=lambda x: x and ('name' in x.lower() or 'nome' in x.lower() or 'title' in x.lower()))
        
        if not names:
             # Try generic match
             print("No specific classes found. searching for 'Gatito'...")
             if "Gatito" in response.text:
                 print("Found 'Gatito'! Dumping surrounding text...")
                 start = response.text.find("Gatito")
                 print(response.text[start-200:start+200])
             else:
                 print("Gatito not found.")
        
        for n in names[:5]:
            print(f"Found potential name: {n.get_text().strip()}")
            
    else:
        print("Failed.")

except Exception as e:
    print(f"Error: {e}")
