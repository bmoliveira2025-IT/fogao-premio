import requests
import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Reliable PNG Thumb URLs
logos = {
    "botafogo.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg/500px-Botafogo_de_Futebol_e_Regatas_logo.svg.png",
    "cruzeiro.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cruzeiro_Esporte_Clube_%282021%29.svg/500px-Cruzeiro_Esporte_Clube_%282021%29.svg.png"
}

output_dir = "d:/Projetos/Fogão-Premio/portal/public/logos"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

headers = {
    'User-Agent': 'Mozilla/5.0'
}

for filename, url in logos.items():
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
             with open(os.path.join(output_dir, filename), "wb") as f:
                f.write(response.content)
             print(f"Saved {filename}")
        else:
             print(f"Failed {filename}: {response.status_code}")
             
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("Updating Firestore to use local PNG paths...")
db.collection('matches').document('next_match').update({
    'home_team_logo': '/logos/botafogo.png',
    'away_team_logo': '/logos/cruzeiro.png'
})
print("Firestore updated.")
