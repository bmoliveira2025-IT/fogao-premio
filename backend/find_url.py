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

print("Finding problematic GE news...")
docs = db.collection('news').where('source', '==', 'Globo Esporte').order_by('created_at', direction=firestore.Query.DESCENDING).limit(5).get()

for doc in docs:
    data = doc.to_dict()
    print(f"Title: {data.get('title')} | Image: {data.get('image')} | URL: {data.get('original_url')}")
