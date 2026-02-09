import requests

def search_botafogo():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Error {response.status_code}")
            return

        text = response.text
        print(f"Total length: {len(text)}")
        
        # Search for Botafogo
        pos = text.find("Botafogo")
        if pos != -1:
            print(f"Found 'Botafogo' at position {pos}")
            context = text[pos-500:pos+500]
            print("--- Context Around Botafogo ---")
            print(context)
            print("--- End Context ---")
        else:
            print("'Botafogo' not found.")

        # Search for classificacao in a different way
        if "classificacao" in text:
            print("'classificacao' found.")
            # find all script tags
            scripts = re.findall(r'<script.*?>.*?</script>', text, re.DOTALL)
            print(f"Found {len(scripts)} scripts.")
            for i, s in enumerate(scripts):
                if "Botafogo" in s:
                    print(f"Script {i} contains 'Botafogo'!")
                    # Print first 200 chars of this script
                    print(s[:200] + "...")

    except Exception as e:
        print(f"Error: {e}")

import re
if __name__ == "__main__":
    search_botafogo()
