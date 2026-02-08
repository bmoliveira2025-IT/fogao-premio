import os
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Logo URLs
vasco_logo = "/logos/vasco.png"
botafogo_logo = "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg"

# Update next_match
next_match_ref = db.collection('matches').document('next_match')
next_match_doc = next_match_ref.get()

if next_match_doc.exists:
    data = next_match_doc.to_dict()
    if 'Vasco' in data.get('home_team', ''):
        next_match_ref.update({
            'home_team_logo': vasco_logo,
            'away_team_logo': botafogo_logo
        })
    elif 'Vasco' in data.get('away_team', ''):
        next_match_ref.update({
            'home_team_logo': botafogo_logo,
            'away_team_logo': vasco_logo
        })
    print("✅ Updated next_match logos")

# Update all Vasco x Botafogo matches in the collection
matches_ref = db.collection('matches')
for doc in matches_ref.stream():
    if doc.id == 'next_match': continue
    
    data = doc.to_dict()
    home = data.get('home_team', '')
    away = data.get('away_team', '')
    
    if ('Vasco' in home and 'Botafogo' in away):
        db.collection('matches').document(doc.id).update({
            'home_team_logo': vasco_logo,
            'away_team_logo': botafogo_logo
        })
        print(f"✅ Updated logos for match document {doc.id}")
    elif ('Botafogo' in home and 'Vasco' in away):
        db.collection('matches').document(doc.id).update({
            'home_team_logo': botafogo_logo,
            'away_team_logo': vasco_logo
        })
        print(f"✅ Updated logos for match document {doc.id}")

print("DONE!")
