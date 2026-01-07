
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

docs = db.collection('videos').limit(50).get()
print(f"Deleting {len(docs)} videos...")
for doc in docs:
    db.collection('videos').document(doc.id).delete()
    
print("Deletion complete.")
