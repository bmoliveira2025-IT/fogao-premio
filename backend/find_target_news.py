
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
if not cred_path or not os.path.exists(cred_path):
    cred_path = "service-account.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

query = db.collection('news').where('title', '>=', 'Textor promete pagar transfer ban').where('title', '<=', 'Textor promete pagar transfer ban' + '\uf8ff').get()

print(f"Found {len(query)} news items matching 'Textor promete pagar transfer ban'")
for doc in query:
    data = doc.to_dict()
    print(f"ID: {doc.id}")
    print(f"Title: {data.get('title')}")
    print(f"Original URL: {data.get('original_url')}")
    print(f"Created At: {data.get('created_at')}")
    print("-" * 20)
