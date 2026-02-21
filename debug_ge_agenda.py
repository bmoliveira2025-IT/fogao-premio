import requests
import os

def debug_ge_agenda():
    url = "https://ge.globo.com/futebol/times/botafogo/agenda-de-jogos-do-botafogo/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        
        with open("agenda_page.html", "w", encoding="utf-8") as f:
            f.write(response.text)
        print("Saved source to agenda_page.html")
        
        # Look for common GE data patterns
        if "const " in response.text:
            print("Found 'const ' in source.")
        if "__GLOBO_DATA__" in response.text:
            print("Found '__GLOBO_DATA__' in source.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_ge_agenda()
