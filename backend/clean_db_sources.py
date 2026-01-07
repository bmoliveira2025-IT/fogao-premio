
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

sources = ['Lance!', 'Gazeta Botafogo', 'Bolavip', 'O Dia'] # Include others just in case

for source in sources:
    docs = db.collection('news').where('source', '==', source).limit(20).get()
    print(f"Deleting {len(docs)} docs from {source}...")
    for doc in docs:
        db.collection('news').document(doc.id).delete()
        
print("Deletion complete.")
