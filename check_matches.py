
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def check_recent_matches():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("Credentials not found.")
            return

    db = firestore.client()
    matches = db.collection('match_stats').order_by('date', direction=firestore.Query.DESCENDING).limit(5).stream()
    
    print("Recent matches in match_stats:")
    for m in matches:
        data = m.to_dict()
        print(f"ID: {m.id} | Date: {data.get('date')} | Teams: {data.get('home_team')} x {data.get('away_team')} | Status: {data.get('status')}")

if __name__ == "__main__":
    check_recent_matches()
