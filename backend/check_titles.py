import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()
load_dotenv(".env.local")

# Initialize Firebase
cred_path = os.getenv("SERVICE_ACCOUNT_PATH") or "backend/service-account-new.json"
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("Checking last 5 news titles in Firestore...")
docs = db.collection('news').order_by('created_at', direction=firestore.Query.DESCENDING).limit(5).get()

for doc in docs:
    data = doc.to_dict()
    print(f"ID: {doc.id}")
    print(f"Title: {data.get('title')}")
    print(f"Source: {data.get('source')}")
    print("-" * 20)
