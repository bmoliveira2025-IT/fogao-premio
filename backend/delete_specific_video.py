
import firebase_admin
from firebase_admin import credentials, firestore
import os

def main():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
             cred_path = "service-account-new.json"
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    docs = db.collection('videos').get()
    
    target = "✈️ #VamosGLORIOSAS"
    to_delete = []
    
    print(f"Searching for videos containing '{target}'...")
    for doc in docs:
        title = doc.to_dict().get('title', '')
        if target in title or "VamosGLORIOSAS" in title:
            print(f"FOUND: ID={doc.id} | Title={title}")
            to_delete.append(doc.id)
            
    if not to_delete:
        print("No matching videos found.")
        return

    print(f"Deleting {len(to_delete)} videos...")
    for doc_id in to_delete:
        db.collection('videos').document(doc_id).delete()
        print(f"Deleted {doc_id}")

if __name__ == "__main__":
    main()
