
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.path.join(os.path.dirname(__file__), 'service-account.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Try env var
        pass

db = firestore.client()

# Query Gazeta articles
docs = db.collection('news').where('source', '==', 'Gazeta Botafogo').limit(5).get()

print(f"Found {len(docs)} Gazeta articles:")
for doc in docs:
    data = doc.to_dict()
    print(f"Title: {data.get('title')}")
    print(f"Image URL: {data.get('image')}")
    print(f"Original URL: {data.get('original_url')}")
    print("-" * 30)
