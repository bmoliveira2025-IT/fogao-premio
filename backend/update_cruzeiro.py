import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def update_cruzeiro_logo():
    print("--- UPDATING CRUZEIRO LOGO (User Request) ---")
    
    # Keep Botafogo SVG (from previous step)
    botafogo_logo = "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg"
    
    # New Cruzeiro PNG
    cruzeiro_logo = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Escudo_do_Cruzeiro_1942.png"

    db.collection('matches').document('next_match').update({
        'home_team_logo': botafogo_logo,
        'away_team_logo': cruzeiro_logo
    })
            
    print(f"Cruzeiro logo updated to: {cruzeiro_logo}")

if __name__ == "__main__":
    update_cruzeiro_logo()
