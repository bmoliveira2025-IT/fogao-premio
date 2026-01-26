import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def remove_duplicate():
    doc_id = "xkSlOHO6lumzCWR4LAn2"
    doc_ref = db.collection('matches').document(doc_id)
    doc = doc_ref.get()
    
    if doc.exists:
        print(f"Deleting document: {doc_id} ({doc.to_dict().get('home_team')} x {doc.to_dict().get('away_team')} - {doc.to_dict().get('date')})")
        doc_ref.delete()
        print("Document deleted successfully.")
    else:
        print(f"Document {doc_id} not found.")

if __name__ == "__main__":
    remove_duplicate()
