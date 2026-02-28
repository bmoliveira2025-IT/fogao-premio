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

def add_arthur_cabral():
    print("Adding Arthur Cabral to squad...")
    
    player_id = "arthur-cabral"
    
    player_doc = {
        "name": "Arthur Cabral",
        "group": "Atacantes", 
        "position": "A", 
        "specific_position": "Centroavante",
        "number": "99", # Update with correct number if known, default to 99
        "age": "26",
        "country": "Brasil",
        "image": "https://img.a.transfermarkt.technology/portrait/medium/390638-1701333640.jpg?lm=1",
        "source": "manual",
        "updated_at": firestore.SERVER_TIMESTAMP
    }
    
    doc_ref = db.collection('squad').document(player_id)
    doc_ref.set(player_doc)
    print("Arthur Cabral successfully added!")

if __name__ == "__main__":
    add_arthur_cabral()
