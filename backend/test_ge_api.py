
import requests
import json

def test_fetch_match_details(match_id):
    # Try different potential GE endpoints for detailed stats
    endpoints = [
        f"https://ge.globo.com/servico/backstage/feeds/foto/ge/jogos/jogo/{match_id}/feed.json",
        f"https://api.ge.globo.com/stats/v1/jogos/{match_id}"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    for url in endpoints:
        print(f"Testing endpoint: {url}")
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"Success! Saved response to match_{match_id}_stats.json")
                with open(f"match_{match_id}_stats.json", "w", encoding="utf-8") as f:
                    json.dump(response.json(), f, indent=4, ensure_ascii=False)
                return
            else:
                print(f"Failed: {response.status_code}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    # Test with Botafogo vs Bangu ID from script_26.js
    test_fetch_match_details("346192")
