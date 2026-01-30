
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def find_matches():
    docs = db.collection('matches').stream()
    print("--- Searching for Bangu and Cruzeiro ---")
    for doc in docs:
        data = doc.to_dict()
        ht = data.get('home_team', '')
        at = data.get('away_team', '')
        if 'Bangu' in [ht, at] or 'Cruzeiro' in [ht, at]:
            print(f"ID: {doc.id} | {ht} x {at} | Date: {data.get('date')} | Status: {data.get('status')} | Score: {data.get('home_score')}-{data.get('away_score')}")

if __name__ == "__main__":
    find_matches()
