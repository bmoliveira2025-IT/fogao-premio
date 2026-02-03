import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH", "backend/service-account-new.json")
    if not os.path.exists(cred_path):
        cred_path = "backend/service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def list_matches():
    print(f"{'ID':<20} | {'Date':<20} | {'Tournament':<20} | {'Match':<40}")
    print("-" * 105)
    
    docs = db.collection('matches').stream()
    matches = []
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        matches.append(d)
    
    # Sort by date
    matches.sort(key=lambda x: x.get('date', ''))
    
    for m in matches:
        match_str = f"{m.get('home_team')} x {m.get('away_team')}"
        print(f"{m['id']:<20} | {m.get('date', ''):<20} | {m.get('championship', ''):<20} | {match_str:<40}")

if __name__ == "__main__":
    list_matches()
