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

def fix_duplicates():
    print("--- FIXING DUPLICATES ---")
    docs = db.collection('matches').stream()
    
    next_match_ref = db.collection('matches').document('next_match')
    
    for doc in docs:
        data = doc.to_dict()
        h = data.get('home_team', '')
        a = data.get('away_team', '')
        
        # Check for Botafogo vs Cruzeiro variants
        if ('BOT' in h.upper() or 'BOTAFOGO' in h.upper()) and ('CRU' in a.upper() or 'CRUZEIRO' in a.upper()):
            
            if doc.id == 'next_match':
                print(f"Updating 'next_match' to use full names...")
                # Update next_match to have proper names
                next_match_ref.update({
                    'home_team': 'Botafogo',
                    'away_team': 'Cruzeiro'
                })
            else:
                print(f"Deleting duplicate ID: {doc.id}")
                db.collection('matches').document(doc.id).delete()
            
    print("Cleanup finished. 'next_match' updated and duplicates removed.")

if __name__ == "__main__":
    fix_duplicates()
