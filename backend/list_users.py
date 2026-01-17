import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os

load_dotenv()
cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

users = db.collection('users').stream()
print("--- USERS ---")
for u in users:
    data = u.to_dict()
    print(f"{u.id}: {data.get('email', 'No Email')}")
