import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def list_matches():
    docs = db.collection('matches').stream()
    print("--- Current Matches in DB ---")
    for doc in docs:
        data = doc.to_dict()
        print(f"ID: {doc.id} | {data.get('home_team')} x {data.get('away_team')} | Date: {data.get('date')}")

if __name__ == "__main__":
    list_matches()
