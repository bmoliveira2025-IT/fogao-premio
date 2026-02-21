import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def find_match():
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
    
    matches_ref = db.collection("matches").where("home_team", "==", "Boavista").where("away_team", "==", "Botafogo").stream()
    
    for doc in matches_ref:
        print(f"Match ID: {doc.id}")
        print(json.dumps(doc.to_dict(), indent=2, default=str))

    # Also search for next_match doc as it might be special
    print("--- Checking next_match doc ---")
    doc = db.collection("matches").document("next_match").get()
    if doc.exists:
        print(json.dumps(doc.to_dict(), indent=2, default=str))

if __name__ == "__main__":
    find_match()
