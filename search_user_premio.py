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

def search_premio_users():
    users_ref = db.collection('users')
    docs = users_ref.stream()
    
    found = False
    for doc in docs:
        data = doc.to_dict()
        data_str = str(data).lower()
        if 'premio' in data_str:
            print(f"MATCH FOUND in doc {doc.id}:")
            print(data)
            found = True
            
    if not found:
        print("No user documents found containing 'premio'.")

if __name__ == "__main__":
    search_premio_users()
