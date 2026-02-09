import os
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()
doc = db.collection('matches').document('next_match').get()

if doc.exists:
    data = doc.to_dict()
    print("MATCH CONTENT FOR NEXT_MATCH:")
    for k, v in data.items():
        print(f"  {k}: {v} ({type(v)})")
else:
    print("ERROR: next_match document does not exist!")
