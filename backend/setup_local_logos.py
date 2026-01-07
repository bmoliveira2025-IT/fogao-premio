import requests
import os

# URLs to download
logos = {
    "botafogo.svg": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg",
    "cruzeiro.svg": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Cruzeiro_Esporte_Clube_%282021%29.svg"
}

output_dir = "d:/Projetos/Fogão-Premio/portal/public/logos"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename, url in logos.items():
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url)
        response.raise_for_status()
        
        with open(os.path.join(output_dir, filename), "wb") as f:
            f.write(response.content)
        print(f"Saved {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("Updating Firestore to use local paths...")
db.collection('matches').document('next_match').update({
    'home_team_logo': '/logos/botafogo.svg',
    'away_team_logo': '/logos/cruzeiro.svg'
})
print("Firestore updated.")
