import os
import firebase_admin
from firebase_admin import credentials, firestore

def main():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    cred = credentials.Certificate(cred_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    matches = db.collection('matches').stream()
    
    for m in matches:
        data = m.to_dict()
        home = data.get('home_team', '')
        away = data.get('away_team', '')
        if 'Internacional' in home or 'Internacional' in away:
            print(f"ID: {m.id} | {home} {data.get('home_score')} x {data.get('away_score')} {away} | Status: {data.get('status')} | Date: {data.get('date')}")

if __name__ == "__main__":
    main()
