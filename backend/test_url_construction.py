
import requests
from datetime import datetime

def test_urls():
    # Candidates for today's match (simulated date 29-01-2026)
    # Real live URL provided by user might be helpful to analyze, but I don't have it.
    # Assuming standard pattern:
    
    base_ge = "https://ge.globo.com"
    
    # Variations
    # 1. Standard Serie A
    # 2. State specific?
    
    date_str = "29-01-2026"
    teams = "botafogo-cruzeiro"
    
    candidates = [
        f"{base_ge}/rj/futebol/brasileirao-serie-a/jogo/{date_str}/{teams}.ghtml",
        f"{base_ge}/futebol/brasileirao-serie-a/jogo/{date_str}/{teams}.ghtml",
        f"{base_ge}/sp/futebol/brasileirao-serie-a/jogo/{date_str}/{teams}.ghtml", # unlikely
        f"{base_ge}/mg/futebol/brasileirao-serie-a/jogo/{date_str}/{teams}.ghtml", # unlikely
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    print("Testing URL construction...")
    for url in candidates:
        try:
            r = requests.head(url, headers=headers, timeout=5)
            print(f"[{r.status_code}] {url}")
            if r.status_code == 200:
                print(">>> FOUND VALID URL!")
        except Exception as e:
            print(f"[ERR] {url}: {e}")

if __name__ == "__main__":
    test_urls()
