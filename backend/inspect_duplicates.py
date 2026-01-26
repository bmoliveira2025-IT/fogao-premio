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

def inspect_duplicates():
    ids = ["next_match", "xkSlOHO6lumzCWR4LAn2"]
    for doc_id in ids:
        doc = db.collection('matches').document(doc_id).get()
        if doc.exists:
            print(f"--- Document ID: {doc_id} ---")
            print(doc.to_dict())
        else:
            print(f"Document {doc_id} not found.")

if __name__ == "__main__":
    inspect_duplicates()
