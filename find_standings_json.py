import requests
import json
import re

def find_standings_json():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return

        text = response.text
        
        # Look for the string that contains standings data
        # Sometimes it's in a script that doesn't start with 'const classificacao ='
        # Let's search for "nome_popular":"Botafogo" (escaped as per GE style)
        botafogo_matches = list(re.finditer(r'"nome_popular"\s*:\s*"Botafogo"', text))
        print(f"Found 'Botafogo' JSON entries: {len(botafogo_matches)}")
        
        for i, match in enumerate(botafogo_matches):
            start = match.start()
            # Find the enclosing object or array
            # We'll grab a larger chunk and try to find a valid JSON block
            chunk = text[max(0, start-10000): min(len(text), start+10000)]
            if '"grupos"' in chunk and '"classificacao"' in chunk:
                print(f"Candidate chunk found at index {start}!")
                # Try to extract the JSON block
                # Search for "classificacao" : {
                class_pos = chunk.find('"classificacao"')
                if class_pos != -1:
                    # Look for the opening brace of the object containing classificacao
                    # GE usually has: "classificacao" : { ... }
                    pass
        
        # Let's save a large chunk of the page to a file for manual/automated inspection of JSON
        with open("full_page_source.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("Full page source saved to full_page_source.txt")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_standings_json()
