
import requests
import json

def test_api_urls():
    urls = [
        "https://api.ge.globo.com/stats/v1/campeonatos/campeonato-carioca/jogos",
        "https://falkor-cda.ge.globo.com/futebol/campeonato/campeonato-carioca/edicao/2025/jogos",
        "https://falkor-cda.ge.globo.com/futebol/campeonato/campeonato-carioca/edicao/2026/jogos",
        "https://falkor-cda.ge.globo.com/tenis/evento/campeonato-carioca/jogos" # Generic test
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    for url in urls:
        print(f"Testing URL: {url}")
        try:
            response = requests.get(url, headers=headers, timeout=10)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Success! Size: {len(response.text)}")
                with open(f"api_test_{url.split('/')[-2]}.json", "w", encoding="utf-8") as f:
                    f.write(response.text[:1000])
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_api_urls()
