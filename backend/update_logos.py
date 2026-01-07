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

def update_logos_svg():
    print("--- UPDATING LOGOS TO DIRECT SVG (V4) ---")
    
    # Official SVG URLs (Direct)
    botafogo_logo = "https://upload.wikimedia.org/wikipedia/commons/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg"
    cruzeiro_logo = "https://upload.wikimedia.org/wikipedia/commons/b/bf/Cruzeiro_Esporte_Clube_%282021%29.svg"

    db.collection('matches').document('next_match').update({
        'home_team_logo': botafogo_logo,
        'away_team_logo': cruzeiro_logo
    })
            
    print(f"Logos updated to SVG versions.")

if __name__ == "__main__":
    update_logos_svg()
