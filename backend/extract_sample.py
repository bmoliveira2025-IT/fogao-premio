
import re
import os
import json

filepath = "ge_carioca.html"
if not os.path.exists(filepath):
    print(f"File {filepath} not found")
else:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'const classificacao\s*=\s*({.*?});', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        data = json.loads(json_str)
        for g in data.get('grupos', []):
            for t in g.get('classificacao', []):
                print(f"Keys for {t.get('nome_popular')}: {t.keys()}")
                print(f"Example Logo: {t.get('escudo')}")
                break
            break
    else:
        print("Not found")
