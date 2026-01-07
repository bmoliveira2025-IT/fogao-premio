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

def list_and_fix():
    print("--- SEARCHING FOR DUPLICATES ---")
    docs = db.collection('matches').stream()
    
    bot_cru_matches = []
    
    for doc in docs:
        data = doc.to_dict()
        h = data.get('home_team', '')
        a = data.get('away_team', '')
        date = data.get('date', '')
        
        # Check for Botafogo vs Cruzeiro variants
        if ('BOT' in h.upper() or 'BOTAFOGO' in h.upper()) and ('CRU' in a.upper() or 'CRUZEIRO' in a.upper()):
            print(f"FOUND: ID={doc.id} | {h} x {a} | Date: {date}")
            bot_cru_matches.append(doc.id)
            
    print(f"Total found: {len(bot_cru_matches)}")

if __name__ == "__main__":
    list_and_fix()
