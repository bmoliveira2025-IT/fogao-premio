import requests
import re

def find_tr_data():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return

        text = response.text
        # Find all script contents
        scripts = re.findall(r'<script.*?>\s*(.*?)\s*</script>', text, re.DOTALL)
        
        for i, s in enumerate(scripts):
            if "Taça Rio" in s and "grupos" in s:
                print(f"Script {i} contains 'Taça Rio' and 'grupos'!")
                with open(f"taca_rio_script_{i}.js", "w", encoding="utf-8") as f:
                    f.write(s)
                print(f"Saved to taca_rio_script_{i}.js")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_tr_data()
