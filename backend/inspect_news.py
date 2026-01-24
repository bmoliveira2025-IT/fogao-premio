
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

news_docs = db.collection('news').order_by('created_at', direction=firestore.Query.DESCENDING).limit(50).get()

print("--- Recent News Images ---")
for doc in news_docs:
    data = doc.to_dict()
    print(f"ID: {doc.id}")
    print(f"Title: {data.get('title')[:50]}...")
    print(f"Image URL: {data.get('image')}")
    print(f"Source: {data.get('source')}")
    print("-" * 30)
