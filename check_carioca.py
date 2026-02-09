import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH") or "backend/service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def inspect_table():
    doc_ref = db.collection('championship_table').document('carioca_2026')
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        print(f"Document ID: {doc.id}")
        print(f"Name: {data.get('name')}")
        print(f"Updated At: {data.get('updated_at')}")
        standings = data.get('standings', [])
        print(f"Count: {len(standings)}")
        if standings:
            print("First row:", standings[0])
    else:
        print("Document carioca_2026 does not exist in championship_table collection.")

if __name__ == "__main__":
    inspect_table()
