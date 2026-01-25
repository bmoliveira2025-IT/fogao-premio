
import requests
import re
import json

def test_deep_scrape_match(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return

    print(f"Page size: {len(response.text)}")
    
    # Save the WHOLE page to be sure
    with open("match_page_full.html", "w", encoding="utf-8") as f:
        f.write(response.text)
    
    # Search for stats-related keywords and their positions
    keywords = ["posse", "chute", "finaliza", "escanteio", "faltas", "passes"]
    for kw in keywords:
        found = response.text.lower().count(kw)
        first_pos = response.text.lower().find(kw)
        print(f"Keyword '{kw}' found {found} times. First at: {first_pos}")

    # Search for match ID
    match_id = "346192"
    id_pos = response.text.find(match_id)
    print(f"Match ID '{match_id}' position: {id_pos}")
    
    if id_pos != -1:
        print("Context around match ID:")
        print(response.text[max(0, id_pos-100):min(len(response.text), id_pos+500)])

if __name__ == "__main__":
    test_deep_scrape_match("https://ge.globo.com/rj/futebol/campeonato-carioca/jogo/24-01-2026/botafogo-bangu.ghtml")
