import requests
import json

def test_api():
    url = "https://api.globoesporte.globo.com/tabela/d1/futebol/clube/botafogo/jogos"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://ge.globo.com/',
        'Origin': 'https://ge.globo.com'
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("API Success!")
            print(json.dumps(data, indent=2)[:500]) # Print first 500 chars
        else:
            print(f"API Failed: {response.status_code} - {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

test_api()
