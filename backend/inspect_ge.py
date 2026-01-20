import requests
from bs4 import BeautifulSoup
import re

url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print(f"Fetching {url}...")
try:
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    scripts = soup.find_all('script')
    found = False
    
    for i, script in enumerate(scripts):
        if script.string and "classificacao" in script.string:
            print(f"Found 'classificacao' in script index {i}")
            with open("backend/dump_script.js", "w", encoding="utf-8") as f:
                f.write(script.string)
            print("Saved to backend/dump_script.js")
            found = True
            break
            
    if not found:
        print("Script with classification not found.")

except Exception as e:
    print(f"Error: {e}")
