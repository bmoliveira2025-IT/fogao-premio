import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("service-account-new.json") # Try new first
        firebase_admin.initialize_app(cred)
    except:
        cred = credentials.Certificate("service-account.json")
        firebase_admin.initialize_app(cred)

db = firestore.client()

def clean_gazeta():
    print("Deleting news from Gazeta Botafogo...")
    
    # Strategy 1: Delete by 'source' field (if exactly 'Gazeta Botafogo')
    # Strategy 2: Delete by 'url' containing 'gazetabotafogo'
    
    # Let's verify what we find first
    docs = db.collection('news').stream()
    
    deleted_count = 0
    batch = db.batch()
    
    for doc in docs:
        data = doc.to_dict()
        url = data.get('url', '')
        source = data.get('source', '')
        
        if 'gazetabotafogo' in url or 'Gazeta Botafogo' in source:
             print(f"Deleting: {data.get('title', 'No Title')} ({url})")
             batch.delete(doc.reference)
             deleted_count += 1
             
             if deleted_count % 400 == 0:
                 batch.commit()
                 batch = db.batch()
    
    if deleted_count > 0:
        batch.commit()
        print(f"Successfully deleted {deleted_count} articles from Gazeta Botafogo.")
    else:
        print("No articles found from Gazeta Botafogo.")

if __name__ == "__main__":
    clean_gazeta()
