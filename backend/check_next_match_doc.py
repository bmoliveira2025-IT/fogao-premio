
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

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
