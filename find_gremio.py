import os
import firebase_admin
from firebase_admin import credentials, firestore

def find_gremio_match():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        print("Searching for matches with Grêmio...")
        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        found = False
        for doc in docs:
            data = doc.to_dict()
            home = data.get('home_team', '')
            away = data.get('away_team', '')
            if 'Grêmio' in home or 'Grêmio' in away or 'Gremio' in home or 'Gremio' in away:
                print(f"ID: {doc.id}")
                print(f"  Match: {home} vs {away}")
                print(f"  Date: {data.get('date')}")
                print(f"  Status: {data.get('status')}")
                print(f"  Championship: {data.get('championship')}")
                print("-" * 20)
                found = True
        
        if not found:
            print("No match found with Grêmio.")
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    find_gremio_match()
