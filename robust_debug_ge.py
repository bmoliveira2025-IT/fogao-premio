import requests
import re
import json

def robust_debug():
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

        match = re.search(r'const classificacao\s*=\s*({.*?});', response.text)
        if match:
            json_str = match.group(1)
            data = json.loads(json_str)
            print(f"Keys: {list(data.keys())}")
            
            fases = data.get('fases', [])
            print(f"Num Fases: {len(fases)}")
            
            for i, fase in enumerate(fases):
                fase_name = fase.get('nome_fase')
                fase_keys = list(fase.keys())
                print(f"Fase {i}: {fase_name} (Keys: {fase_keys})")
                
                # Check for grupos or classificacao inside fase
                for sub_key in ['grupos', 'classificacao', 'tabela']:
                    sub_val = fase.get(sub_key)
                    if sub_val:
                        print(f"  Found {sub_key} in fase {i}! Type: {type(sub_val)} - Size: {len(sub_val) if hasattr(sub_val, '__len__') else 'N/A'}")
                        if isinstance(sub_val, list) and len(sub_val) > 0:
                            print(f"  First item keys: {list(sub_val[0].keys())}")
                            if 'classificacao' in sub_val[0]:
                                print(f"  Nested classificacao size: {len(sub_val[0]['classificacao'])}")
        else:
            print("Regex fail")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    robust_debug()
