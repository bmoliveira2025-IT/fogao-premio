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

def dump_all_users():
    users_ref = db.collection('users')
    docs = users_ref.stream()
    
    print(f"{'UID':<30} | {'Email':<40} | {'Premium':<10} | {'Name'}")
    print("-" * 100)
    for doc in docs:
        data = doc.to_dict()
        uid = doc.id
        email = data.get('email', 'N/A')
        is_premium = data.get('is_premium', False)
        display_name = data.get('displayName', data.get('name', 'N/A'))
        print(f"{uid:<30} | {email:<40} | {str(is_premium):<10} | {display_name}")

if __name__ == "__main__":
    dump_all_users()
