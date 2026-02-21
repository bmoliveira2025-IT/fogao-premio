
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
        else:
            print("Credentials not found")
            exit(1)
    return firestore.client()

db = init_firebase()

def debug_fields():
    print("--- next_match doc keys ---")
    doc = db.collection('matches').document('next_match').get()
    if doc.exists:
        data = doc.to_dict()
        print(list(data.keys()))
        print(f"home_logo: {data.get('home_logo')}")
        print(f"home_team_logo: {data.get('home_team_logo')}")
    
    print("\n--- All matches keys ---")
    docs = db.collection('matches').stream()
    for d in docs:
        if d.id == 'next_match': continue
        data = d.to_dict()
        print(f"ID: {d.id} | Keys: {list(data.keys())}")

if __name__ == "__main__":
    debug_fields()
