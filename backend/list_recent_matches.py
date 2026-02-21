import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def list_recent_matches():
    # Initialize Firebase
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("No credentials found!")
            return

    db = firestore.client()
    
    matches_ref = db.collection("matches").order_by("date", direction=firestore.Query.DESCENDING).limit(5)
    docs = matches_ref.stream()
    
    matches = []
    for doc in docs:
        data = doc.to_dict()
        matches.append({
            "id": doc.id,
            "home": data.get("home_team"),
            "away": data.get("away_team"),
            "home_logo": data.get("home_team_logo"),
            "away_logo": data.get("away_team_logo"),
            "date": str(data.get("date"))
        })
    
    print(json.dumps(matches, indent=2))

if __name__ == "__main__":
    list_recent_matches()
