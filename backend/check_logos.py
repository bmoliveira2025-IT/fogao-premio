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

def check_match():
    doc = db.collection('matches').document('next_match').get()
    if doc.exists:
        data = doc.to_dict()
        print(f"Home: {data.get('home_team')} | Logo: {data.get('home_team_logo')}")
        print(f"Away: {data.get('away_team')} | Logo: {data.get('away_team_logo')}")
    else:
        print("Document not found.")

if __name__ == "__main__":
    check_match()
