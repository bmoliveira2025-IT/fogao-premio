import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase with {cred_path}: {e}")
        try:
             cred = credentials.Certificate(os.path.join(current_dir, "service-account.json"))
             firebase_admin.initialize_app(cred)
        except Exception as e2:
             print(f"Fallback failed: {e2}")
             exit(1)

db = firestore.client()

def update_medina_number():
    print("Updating Cristian Medina Number...")
    
    player_id = "cristian-medina"
    
    doc_ref = db.collection('squad').document(player_id)
    doc_snap = doc_ref.get()
    
    if doc_snap.exists:
        doc_ref.update({"number": "5"})
        print("Cristian Medina's number successfully updated to 5!")
    else:
        print("Cristian Medina not found in the database. Please check the ID.")

if __name__ == "__main__":
    update_medina_number()
