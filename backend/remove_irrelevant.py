import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase
cred_path = os.getenv("SERVICE_ACCOUNT_PATH")

if not cred_path or not os.path.exists(cred_path):
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "service-account-new.json"),
        os.path.join(os.path.dirname(__file__), "service-account.json"),
        os.path.join(os.getcwd(), "backend", "service-account.json"),
        "service-account.json"
    ]
    for p in possible_paths:
        if os.path.exists(p):
            cred_path = p
            break

print(f"Loading credentials from: {cred_path}")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def is_relevant(title, content):
    keywords = [
        'botafogo', 'glorioso', 'fogo', 'alvinegro', 'estrela solitária', 
        'nilton santos', 'john textor', 'artur jorge', 'eagle football',
        'bfr', 'camisa 7'
    ]
    text = (title + " " + content).lower()
    return any(k in text for k in keywords)

def remove_irrelevant():
    print("Scanning for irrelevant news...")
    
    docs = db.collection('news').stream()
    
    count = 0
    deleted = 0
    batch = db.batch()
    batch_count = 0
    
    for doc in docs:
        count += 1
        data = doc.to_dict()
        title = data.get('title', '')
        
        content_raw = data.get('content', '')
        if isinstance(content_raw, list):
            content = " ".join([str(c) for c in content_raw])
        else:
            content = str(content_raw)
            
        # Hard check for the specific user request (WSL/Surfe/F1)
        # Also check general relevance
        
        should_delete = False
        
        # specific exclusion keywords
        exclude_keywords = ['wsl', 'surfe', 'fórmula 1', 'f1', 'verstappen', 'medina', 'circuit mundial', 'basquete', 'vôlei']
        if any(k in (title + content).lower() for k in exclude_keywords):
            should_delete = True
            print(f"Flagged [Excluded Keyword]: {title}")
            
        # general relevance check (if it fails this, it might be irrelevant)
        # BUT be careful not to delete just because it lacks a keyword if it's actually about Botafogo but obscure.
        # However, the user wants to remove THIS specific news.
        # Let's trust is_relevant IF it's not a False Negative risk.
        # If is_relevant is False, it means NO botafogo keywords found.
        elif not is_relevant(title, content):
            should_delete = True
            print(f"Flagged [Not Relevant]: {title}")
            
        if should_delete:
            batch.delete(doc.reference)
            batch_count += 1
            deleted += 1
            
            if batch_count >= 400:
                batch.commit()
                batch = db.batch()
                batch_count = 0

    if batch_count > 0:
        batch.commit()
        
    print(f"Scanned {count} articles. Deleted {deleted} irrelevant articles.")

if __name__ == "__main__":
    remove_irrelevant()
