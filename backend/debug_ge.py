
import requests
import re

url = "https://ge.globo.com/futebol/brasileirao-serie-a/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

response = requests.get(url, headers=headers)
print(f"Status: {response.status_code}")
print(f"Length: {len(response.text)}")

match = re.search(r'const classificacao\s*=\s*({.*?});', response.text)
if match:
    print("Found 'const classificacao'!")
    print(match.group(1)[:200] + "...")
else:
    print("'const classificacao' NOT FOUND.")
    # Search for any large script
    scripts = re.findall(r'<script.*?>.*?</script>', response.text, re.DOTALL)
    print(f"Number of scripts: {len(scripts)}")
    for i, s in enumerate(scripts):
        if 'classificacao' in s.lower() or 'tabela' in s.lower():
            print(f"Script {i} matches keywords.")
            print(s[:300] + "...")
