import os
import firebase_admin
from firebase_admin import credentials, firestore

def enrich_matches():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # Enriched data mapping
        enrichment = {
            "boavista_botafogo_feb21": {
                "search": {"home_team": "Boavista", "away_team": "Botafogo", "date_partial": "2026-02-21"},
                "stadium": "Elcyr Resende",
                "transmission": "sportv, Premiere, Globoplay"
            },
            "botafogo_potosi_feb25": {
                "search": {"home_team": "Botafogo", "away_team": "Nacional Potosí", "date_partial": "2026-02-25"},
                "stadium": "Nilton Santos",
                "transmission": "Disney+, Globoplay, Ge TV"
            },
            "botafogo_boavista_feb28": {
                "search": {"home_team": "Botafogo", "away_team": "Boavista", "date_partial": "2026-02-28"},
                "stadium": "Nilton Santos",
                "transmission": "sportv, Premiere, Globoplay"
            },
            "athletico_botafogo_mar11": {
                "search": {"home_team": "Athletico-PR", "away_team": "Botafogo", "date_partial": "2026-03-11"},
                "stadium": "Ligga Arena",
                "transmission": "CazéTV, Rede Furacão"
            },
            "botafogo_flamengo_mar14": {
                "search": {"home_team": "Botafogo", "away_team": "Flamengo", "date_partial": "2026-03-14"},
                "stadium": "Nilton Santos",
                "transmission": "Prime Video"
            },
            "palmeiras_botafogo_mar18": {
                "search": {"home_team": "Palmeiras", "away_team": "Botafogo", "date_partial": "2026-03-18"},
                "stadium": "Allianz Parque",
                "transmission": "sportv, Premiere, Globoplay"
            },
            "bragantino_botafogo_mar21": {
                "search": {"home_team": "Bragantino", "away_team": "Botafogo", "date_partial": "2026-03-21"},
                "stadium": "Nabi Abi Chedid",
                "transmission": "Premiere, Globoplay"
            }
        }

        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        updated_count = 0
        for doc in docs:
            if doc.id == 'next_match': continue
            data = doc.to_dict()
            
            for key, info in enrichment.items():
                match_info = info['search']
                if (data.get('home_team') == match_info['home_team'] and 
                    data.get('away_team') == match_info['away_team'] and 
                    str(data.get('date')).startswith(match_info['date_partial'])):
                    
                    matches_ref.document(doc.id).update({
                        "stadium": info['stadium'],
                        "location": info['stadium'],
                        "transmission": info['transmission']
                    })
                    print(f"Updated match: {data.get('home_team')} x {data.get('away_team')} ({doc.id})")
                    updated_count += 1
                    
                    # If this match is the current next_match, update that too
                    next_match_ref = db.collection('matches').document('next_match')
                    next_match_doc = next_match_ref.get()
                    if next_match_doc.exists:
                        nm_data = next_match_doc.to_dict()
                        if (nm_data.get('home_team') == match_info['home_team'] and 
                            nm_data.get('away_team') == match_info['away_team']):
                            next_match_ref.update({
                                "stadium": info['stadium'],
                                "location": info['stadium'],
                                "transmission": info['transmission']
                            })
                            print("Updated 'next_match' document as well.")
        
        print(f"Enrichment complete. Total matches updated: {updated_count}")
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    enrich_matches()
