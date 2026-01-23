
import firebase_admin
from firebase_admin import credentials, firestore
import os

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("--- Inspecting Botafogo TV Videos ---")
docs = db.collection('videos').where('source', '==', 'Botafogo TV').limit(5).get()

if docs:
    for doc in docs:
        print(f"ID: {doc.id}")
        data = doc.to_dict()
        print(f"Title: {repr(data.get('title'))}")
        print(f"Thumbnail: {repr(data.get('thumbnail'))}")
        print("-" * 20)
else:
    print("No Botafogo TV videos found.")
