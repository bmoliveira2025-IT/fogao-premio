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

def update_cruzeiro_v2():
    print("--- UPDATING CRUZEIRO LOGO (User Request V2) ---")
    
    # New Cruzeiro PNG (Thumb/Standard)
    cruzeiro_logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/250px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png"

    db.collection('matches').document('next_match').update({
        'away_team_logo': cruzeiro_logo
    })
            
    print(f"Cruzeiro logo updated to: {cruzeiro_logo}")

if __name__ == "__main__":
    update_cruzeiro_v2()
