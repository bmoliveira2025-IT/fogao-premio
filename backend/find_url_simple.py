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

print("Finding problematic GE news (simplified)...")
docs = db.collection('news').where('source', '==', 'Globo Esporte').limit(20).get()

found = False
for doc in docs:
    data = doc.to_dict()
    if data.get('image') == 'None' or not data.get('image'):
        print(f"Title: {data.get('title')} | Image: {data.get('image')} | URL: {data.get('original_url')}")
        found = True

if not found:
    print("No news with 'None' image found in the last 20 GE news.")
