import requests
import re

def extract_scripts():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return

        text = response.text
        scripts = re.findall(r'<script.*?>.*?</script>', text, re.DOTALL)
        
        with open("extracted_scripts.txt", "w", encoding="utf-8") as f:
            for i, s in enumerate(scripts):
                if "classificacao" in s and "Botafogo" in s:
                    f.write(f"--- SCRIPT {i} ---\n")
                    f.write(s)
                    f.write("\n\n")
        
        print(f"Extraction complete. Check extracted_scripts.txt")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_scripts()
