
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
if not cred_path or not os.path.exists(cred_path):
    cred_path = "service-account.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# IDs to delete (keeping TlB8FLqHW6xxrqaCA0Hp)
ids_to_delete = ['5yuM7RaduGNOvFIOqKMU', '8wHOFEZM0SLcANCVAXS9']

for doc_id in ids_to_delete:
    print(f"Deleting duplicate news ID: {doc_id}")
    db.collection('news').document(doc_id).delete()

print("Deletion complete.")
