import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("Checking recent news images...")
docs = db.collection('news').order_by('created_at', direction=firestore.Query.DESCENDING).limit(10).get()

for doc in docs:
    data = doc.to_dict()
    print(f"Source: {data.get('source')} | Title: {data.get('title')[:30]}... | Image: {data.get('image')}")
