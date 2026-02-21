import os
import firebase_admin
from firebase_admin import credentials, firestore

def find_specific_match():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        output = []
        found = False
        for doc in docs:
            data = doc.to_dict()
            home = str(data.get('home_team', '')).lower()
            away = str(data.get('away_team', '')).lower()
            
            if 'grêmio' in home or 'grêmio' in away or 'botafogo' in home or 'botafogo' in away:
                output.append(f"ID: {doc.id}")
                output.append(f"  Match: {data.get('home_team')} vs {data.get('away_team')}")
                output.append(f"  Date: {data.get('date')}")
                output.append(f"  Status: {data.get('status')}")
                output.append(f"  Match ID: {data.get('match_id')}")
                output.append("-" * 20)
                found = True
        
        if not found:
            output.append("No matching game found.")
            
        # Also check next_match
        output.append("\nChecking next_match document:")
        nm_doc = db.collection('matches').document('next_match').get()
        if nm_doc.exists:
            data = nm_doc.to_dict()
            output.append(f"Home: {data.get('home_team')}")
            output.append(f"Away: {data.get('away_team')}")
            output.append(f"Date: {data.get('date')}")
            output.append(f"Status: {data.get('status')}")
        else:
            output.append("next_match document not found.")
            
        with open('find_match_output.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(output))
        print("Output written to find_match_output.txt")
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    find_specific_match()
