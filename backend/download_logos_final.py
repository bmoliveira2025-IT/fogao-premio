import requests
import os

# Correct Raw URLs
logos = {
    "botafogo.svg": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg",
    "cruzeiro.svg": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Cruzeiro_Esporte_Clube_%282021%29.svg"
}

output_dir = "d:/Projetos/Fogão-Premio/portal/public/logos"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

headers = {
    'User-Agent': 'Mozilla/5.0'
}

for filename, url in logos.items():
    try:
        print(f"Downloading {filename} from {url}...")
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
             with open(os.path.join(output_dir, filename), "wb") as f:
                f.write(response.content)
             print(f"Saved {filename}")
        else:
             print(f"Failed {filename}: {response.status_code}")
             
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
