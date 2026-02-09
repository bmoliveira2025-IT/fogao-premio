import os
from datetime import datetime
import pytz
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

# São Paulo timezone
tz = pytz.timezone('America/Sao_Paulo')
now = datetime.now(tz)
today_str = now.strftime('%Y-%m-%d')

print(f"Current time: {now.strftime('%Y-%m-%d %H:%M:%S')}")

# 1. Fix Fluminense match championship
print("\n--- Fixing Fluminense x Botafogo ---")
matches = db.collection('matches').stream()
for doc in matches:
    if doc.id == 'next_match': continue
    data = doc.to_dict()
    home = data.get('home_team', '')
    away = data.get('away_team', '')
    if ('Fluminense' in home and 'Botafogo' in away) or ('Botafogo' in home and 'Fluminense' in away):
        db.collection('matches').document(doc.id).update({
            'championship': 'Brasileirão'
        })
        print(f"✅ Document {doc.id} updated to Brasileirão")

# 2. Fix Vasco match details
print("\n--- Fixing Vasco x Botafogo ---")
vasco_match_id = "vas_v_bot_2026_02_08"
vasco_date = "2026-02-08T18:00:00-03:00"
vasco_data = {
    'match_id': vasco_match_id,
    'home_team': 'Vasco',
    'away_team': 'Botafogo',
    'date': vasco_date,
    'championship': 'Campeonato Carioca',
    'stadium': 'São Januário',
    'location': 'São Januário',
    'transmission': 'Globo e Premier',
    'status': 'Agendado',
    'home_score': 0,
    'away_score': 0,
    'home_team_logo': '/logos/vasco.png',
    'away_team_logo': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg'
}
db.collection('matches').document(vasco_match_id).set(vasco_data)
print(f"✅ Match doc {vasco_match_id} set correctly.")

# 3. Explicitly set next_match
db.collection('matches').document('next_match').set(vasco_data)
print(f"✅ next_match document set to Vasco match.")

print("\nDONE!")
