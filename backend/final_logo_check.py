
import firebase_admin
from firebase_admin import credentials, firestore
import os

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
    return firestore.client()

db = init_firebase()

def check_logos():
    doc = db.collection('matches').document('next_match').get()
    if doc.exists:
        data = doc.to_dict()
        print("--- next_match ---")
        print(f"Match: {data.get('home_team')} x {data.get('away_team')}")
        print(f"home_logo: {data.get('home_logo')}")
        print(f"away_logo: {data.get('away_logo')}")
        print(f"home_team_logo: {data.get('home_team_logo')}")
        print(f"away_team_logo: {data.get('away_team_logo')}")
    else:
        print("next_match doc missing")

if __name__ == "__main__":
    check_logos()
