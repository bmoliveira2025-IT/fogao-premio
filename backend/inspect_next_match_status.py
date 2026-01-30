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

doc_ref = db.collection("matches").document("next_match")
doc = doc_ref.get()

if doc.exists:
    data = doc.to_dict()
    print(f"Status: {data.get('status')}")
    print(f"Home Score: {data.get('home_score')}")
    print(f"Display Time: {data.get('display_time')}")
    print(f"Match ID: {data.get('match_id')}")
else:
    print("matches/next_match document does not exist.")
