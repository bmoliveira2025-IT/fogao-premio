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

def dump_config():
    coll = db.collection('config')
    docs = coll.stream()
    for doc in docs:
        print(f"Doc: {doc.id}")
        print(doc.to_dict())

if __name__ == "__main__":
    dump_config()
