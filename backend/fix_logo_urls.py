import firebase_admin
from firebase_admin import credentials, firestore
import os
import requests
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def check_and_fix():
    print("--- CHECKING CURRENT LOGOS ---")
    doc = db.collection('matches').document('next_match').get()
    data = doc.to_dict()
    
    h_logo = data.get('home_team_logo')
    a_logo = data.get('away_team_logo')
    
    print(f"Current Home: {h_logo}")
    print(f"Current Away: {a_logo}")
    
    # Verify validity
    try:
        r_h = requests.head(h_logo, timeout=5)
        print(f"Home URL Status: {r_h.status_code}")
    except:
        print("Home URL Failed connection")

    try:
        r_a = requests.head(a_logo, timeout=5)
        print(f"Away URL Status: {r_a.status_code}")
    except:
        print("Away URL Failed connection")

    # UPDATE WITH STABLE LOGOS
    print("\n--- UPDATING TO STABLE LOGOS (V3) ---")
    
    # Official CDN or highly stable PNGs
    # Botafogo: Wikipedia Thumb is usually reliable
    new_bot = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg/200px-Botafogo_de_Futebol_e_Regatas_logo.svg.png"
    
    # Cruzeiro: Official SVG Thumb
    new_cru = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cruzeiro_Esporte_Clube_%282021%29.svg/200px-Cruzeiro_Esporte_Clube_%282021%29.svg.png"

    db.collection('matches').document('next_match').update({
        'home_team_logo': new_bot,
        'away_team_logo': new_cru
    })
    print(f"Updated Home to: {new_bot}")
    print(f"Updated Away to: {new_cru}")

if __name__ == "__main__":
    check_and_fix()
