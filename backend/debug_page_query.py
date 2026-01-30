import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, timedelta

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

# Check what the page.tsx query would return
matchThreshold = datetime.now() - timedelta(hours=3)
print(f"Query threshold: {matchThreshold.isoformat()}")

matches_ref = db.collection('matches').where('date', '>=', matchThreshold.isoformat()).order_by('date', direction=firestore.Query.ASCENDING).limit(1)
matches = list(matches_ref.stream())

print(f"\nFound {len(matches)} match(es)")
for doc in matches:
    data = doc.to_dict()
    print(f"\nMatch ID: {doc.id}")
    print(f"Home: {data.get('home_team')}")
    print(f"Away: {data.get('away_team')}")
    print(f"Date: {data.get('date')}")
    print(f"Status: {data.get('status')}")
    print(f"Home Score: {data.get('home_score')}")
    print(f"Away Score: {data.get('away_score')}")
    print(f"Match ID field: {data.get('match_id')}")
