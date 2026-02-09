import requests
import re

def find_taca_guanabara():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return

        text = response.text
        # Look for "Taça Guanabara"
        matches = re.findall(r'Taça Guanabara', text)
        print(f"Found 'Taça Guanabara' {len(matches)} times.")
        
        # Look for script tags that mention it
        scripts = re.findall(r'<script.*?>.*?</script>', text, re.DOTALL)
        for i, s in enumerate(scripts):
            if "Taça Guanabara" in s and "classificacao" in s:
                print(f"Script {i} contains 'Taça Guanabara' and 'classificacao'!")
                # Save just this script for inspection
                with open("taca_guanabara_script.txt", "w", encoding="utf-8") as f:
                    f.write(s)
                print("Saved to taca_guanabara_script.txt")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_taca_guanabara()
