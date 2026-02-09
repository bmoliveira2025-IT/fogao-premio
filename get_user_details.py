import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH") or "backend/service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_user_details(email):
    query = db.collection('users').where('email', '==', email).limit(1).stream()
    for doc in query:
        print(f"UID: {doc.id}")
        print(doc.to_dict())
        return
    print(f"User {email} not found.")

if __name__ == "__main__":
    get_user_details("alexcarapia86@gmail.com")
    print("---")
    get_user_details("bmoliveira2025@gmail.com")
