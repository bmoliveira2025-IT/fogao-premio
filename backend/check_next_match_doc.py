
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

if not firebase_admin._apps:
    current_dir = os.getcwd()
    # Try multiple paths
    possible_paths = [
        os.getenv("SERVICE_ACCOUNT_PATH"),
        "backend/service-account-new.json",
        "service-account-new.json",
        os.path.join(os.path.dirname(__file__), "service-account-new.json")
    ]
    
    loaded = False
    for p in possible_paths:
        if p and os.path.exists(p):
            try:
                cred = credentials.Certificate(p)
                firebase_admin.initialize_app(cred)
                print(f"Loaded credentials from: {p}")
                loaded = True
                break
            except Exception as e:
                print(f"Failed to load {p}: {e}")
    if not loaded:
        print("Credentials not found")
        exit(1)

db = firestore.client()

def check_next_match():
    doc = db.collection('matches').document('next_match').get()
    if doc.exists:
        print("--- matches/next_match content ---")
        print(json.dumps(doc.to_dict(), indent=4, default=str))
    else:
        print("matches/next_match does not exist.")

if __name__ == "__main__":
    check_next_match()
