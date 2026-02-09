import os
import requests
import re
import json

def debug_fetch():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            return

        # Let's see if we can find the 'classificacao' string
        print("Searching for 'const classificacao'...")
        match = re.search(r'const classificacao\s*=\s*({.*?});', response.text)
        if match:
            print("Found 'const classificacao'!")
            json_str = match.group(1)
            print(f"JSON string length: {len(json_str)}")
            # print(f"Preview: {json_str[:200]}...")
            
            data = json.loads(json_str)
            print(f"Keys in data: {list(data.keys())}")
            
            # Check for common variants
            for key in ['grupos', 'fases', 'classificacao', 'tabela']:
                val = data.get(key)
                if val:
                    print(f"Key '{key}' found! Type: {type(val)} - Length/Size: {len(val) if hasattr(val, '__len__') else 'N/A'}")

            groups = data.get('grupos', [])
            if not groups and 'fases' in data:
                print("Groups empty, checking 'fases'...")
                fases = data.get('fases', [])
                for i, fase in enumerate(fases):
                    print(f"Fase {i+1}: {fase.get('nome_fase')}")
                    print(f"  Fase keys: {list(fase.keys())}")
                    fase_groups = fase.get('grupos', [])
                    print(f"  Groups in this fase: {len(fase_groups)}")
                    if fase_groups:
                        groups = fase_groups # Prioritize these groups
                        break

            for i, group in enumerate(groups):
                group_name = group.get('nome_grupo', 'Geral')
                teams = group.get('classificacao', [])
                print(f"Group {i+1}: {group_name} - {len(teams)} teams")
        else:
            print("Could NOT find 'const classificacao'!")
            # Alternative search
            print("Checking if 'classificacao' exists in any form...")
            if 'classificacao' in response.text:
                print("'classificacao' found in text, but regex didn't match.")
                # Print some context around 'classificacao'
                pos = response.text.find('classificacao')
                print(f"Context: {response.text[pos:pos+500]}")
            else:
                print("'classificacao' NOT found in text at all.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_fetch()
