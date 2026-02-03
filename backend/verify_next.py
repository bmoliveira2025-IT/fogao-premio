import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

if not firebase_admin._apps:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(script_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def check_next():
    doc = db.collection('matches').document('next_match').get()
    if doc.exists:
        print(json.dumps(doc.to_dict(), indent=2, ensure_ascii=False))
    else:
        print("next_match document NOT FOUND")

if __name__ == "__main__":
    check_next()
