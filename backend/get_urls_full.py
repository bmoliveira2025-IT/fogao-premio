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

print("Full URLs for missing images:")
docs = db.collection('news').where('image', '==', 'None').get()

for doc in docs:
    data = doc.to_dict()
    print(f"ID: {doc.id} | URL: {data.get('original_url')}")
