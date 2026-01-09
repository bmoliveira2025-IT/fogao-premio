import firebase_admin
from firebase_admin import credentials, firestore
import os

if not firebase_admin._apps:
    cred = credentials.Certificate("service-account-new.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
docs = db.collection('news').stream()
count = sum(1 for _ in docs)
print(f"Total news documents: {count}")
