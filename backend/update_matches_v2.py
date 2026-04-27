import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os

# Initialize Firebase
cred = credentials.Certificate('backend/service-account-new.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def update_matches():
    print("Updating matches via Python...")
    matches_ref = db.collection('matches')

    # 1. Mark Botafogo x Internacional as finished
    # We'll search for matches involving both teams
    docs = matches_ref.stream()
    for doc in docs:
        data = doc.to_dict()
        home = data.get('home_team', '')
        away = data.get('away_team', '')
        
        if (('Botafogo' in home and 'Internacional' in away) or ('Internacional' in home and 'Botafogo' in away)):
            doc.reference.update({
                'status': 'FINALIZADO',
                'display_time': 'FIM DE JOGO'
            })
            print(f"Updated {doc.id} (Inter) to FINALIZADO")

        # 2. Revert Remo to Campeonato Brasileiro (as requested by user)
        if (('Botafogo' in home and 'Remo' in away) or ('Remo' in home and 'Botafogo' in away)):
            doc.reference.update({
                'championship': 'Campeonato Brasileiro',
                'status': 'AGENDADO'
            })
            print(f"Updated {doc.id} (Remo) to Campeonato Brasileiro")

    # 3. Add Sulamericana match
    sula_data = {
        'home_team': "Botafogo",
        'away_team': "Independiente Petrolero",
        'home_team_logo': "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",
        'away_team_logo': "https://via.placeholder.com/64?text=IND",
        'date': "2026-04-28T19:00:00-03:00",
        'championship': "Copa Sul-Americana",
        'location': "Estádio Nilton Santos",
        'stadium': "Nilton Santos",
        'status': "AGENDADO",
        'display_time': "19:00"
    }
    # Check if already exists to avoid duplicates
    exists = False
    docs = matches_ref.where('home_team', '==', 'Botafogo').where('away_team', '==', 'Independiente Petrolero').get()
    if len(docs) > 0:
        exists = True
    
    if not exists:
        db.collection('matches').add(sula_data)
        print("Added Sulamericana match.")
    else:
        print("Sulamericana match already exists.")

if __name__ == "__main__":
    update_matches()
