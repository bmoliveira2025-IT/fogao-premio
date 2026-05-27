import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

def main():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    matches = db.collection('matches').where('date', '<=', datetime.now().isoformat()).order_by('date', direction=firestore.Query.DESCENDING).limit(10).stream()
    
    print("Recent past matches in 'matches' collection:")
    for m in matches:
        data = m.to_dict()
        print(f"ID: {m.id} | Date: {data.get('date')} | {data.get('home_team')} {data.get('home_score')} x {data.get('away_score')} {data.get('away_team')} | Status: {data.get('status')}")

if __name__ == "__main__":
    main()
