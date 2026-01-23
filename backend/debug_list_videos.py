
import firebase_admin
from firebase_admin import credentials, firestore

import os

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("--- Listing All Videos ---")
docs = db.collection('videos').stream()

for doc in docs:
    data = doc.to_dict()
    print(f"ID: {doc.id}")
    print(f"Title: {data.get('title')}")
    print(f"Thumbnail: {data.get('thumbnail')}")
    print(f"Source: {data.get('source')}")
    print("-" * 20)

print("--- End of List ---")
