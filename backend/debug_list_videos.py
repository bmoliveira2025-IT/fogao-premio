
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("service-account-new.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("--- Listing All Videos ---")
docs = db.collection('videos').stream()

for doc in docs:
    data = doc.to_dict()
    print(f"ID: {doc.id} | Title: {data.get('title')}")

print("--- End of List ---")
