
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def check_match():
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
    
    doc_ref = db.collection("matches").document("next_match")
    doc = doc_ref.get()
    
    if doc.exists:
        data = doc.to_dict()
        print(f"Data in matches/next_match:")
        print(json.dumps(data, indent=2, default=str))
    else:
        print("matches/next_match document does not exist!")

if __name__ == "__main__":
    check_match()
