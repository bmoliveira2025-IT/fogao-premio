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

def list_collections():
    collections = db.collections()
    for coll in collections:
        print(f"Collection: {coll.id}")

if __name__ == "__main__":
    list_collections()
