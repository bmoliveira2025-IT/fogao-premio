import os
import firebase_admin
from firebase_admin import credentials, firestore

def dump_all_matches():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        print("=== ALL MATCHES ===")
        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        for doc in docs:
            data = doc.to_dict()
            home = data.get('home_team', 'N/A')
            away = data.get('away_team', 'N/A')
            date = data.get('date', 'N/A')
            status = data.get('status', 'N/A')
            print(f"ID: {doc.id}")
            print(f"  Match: {home} vs {away}")
            print(f"  Date: {date}")
            print(f"  Status: {status}")
            print("-" * 20)
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    dump_all_matches()
