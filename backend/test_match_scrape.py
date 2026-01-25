
import requests
import re
import json

def test_scrape_match_page(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return

    # In match pages, GE often uses window.__INITIAL_STATE__
    match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.*?});', response.text, re.DOTALL)
    if match:
        print("Found INITIAL_STATE data!")
        with open("match_initial_state.json", "w", encoding="utf-8") as f:
            f.write(match.group(1))
        print("Saved match_initial_state.json")
    else:
        # Check for other markers
        match = re.search(r'const\s+dadosJogo\s*=\s*({.*?});', response.text, re.DOTALL)
        if match:
             print("Found dadosJogo data!")
             with open("match_dados_jogo.json", "w", encoding="utf-8") as f:
                  f.write(match.group(1))
        else:
             print("No known JSON data found in match page.")

if __name__ == "__main__":
    # Use the URL found in script_26.js
    test_scrape_match_page("https://ge.globo.com/rj/futebol/campeonato-carioca/jogo/24-01-2026/botafogo-bangu.ghtml")
