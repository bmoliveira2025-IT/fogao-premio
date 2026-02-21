
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, timedelta
import pytz
import uuid

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
        else:
            print("Credentials not found")
            exit(1)
    return firestore.client()

db = init_firebase()

def fix_matches():
    tz = pytz.timezone('America/Sao_Paulo')
    today_cutoff = tz.localize(datetime(2026, 2, 20, 0, 0))
    
    print(f"Cleanup cutoff: {today_cutoff}")

    matches_ref = db.collection('matches')
    docs = matches_ref.stream()

    to_delete = []
    to_update = {} # ID -> new_data
    
    # Matches to specifically update or check
    updates_needed = [
        {"home": "Athletico-PR", "away": "Botafogo", "new_date": tz.localize(datetime(2026, 3, 11, 19, 0)), "comp": "Brasileirão"},
        {"home": "Botafogo", "away": "Flamengo", "new_date": tz.localize(datetime(2026, 3, 14, 20, 30)), "comp": "Brasileirão"},
        {"home": "Palmeiras", "away": "Botafogo", "new_date": tz.localize(datetime(2026, 3, 18, 19, 0)), "comp": "Brasileirão"},
        {"home": "Bragantino", "away": "Botafogo", "new_date": tz.localize(datetime(2026, 3, 21, 16, 0)), "comp": "Brasileirão"},
    ]

    found_updates = [False] * len(updates_needed)

    for doc in docs:
        if doc.id == 'next_match': continue
        
        data = doc.to_dict()
        match_date_raw = data.get('date')
        if not match_date_raw: continue

        try:
            if isinstance(match_date_raw, str):
                match_date = datetime.fromisoformat(match_date_raw.replace('Z', '+00:00'))
            else:
                match_date = match_date_raw
            
            if match_date.tzinfo is None:
                match_date = match_date.replace(tzinfo=pytz.UTC)
            
            match_date_sp = match_date.astimezone(tz)
        except Exception as e:
            print(f"Error parsing date for {doc.id}: {e}")
            continue

        # 1. Cleanup past matches
        if match_date_sp < today_cutoff:
            print(f"DELETING past match: {data.get('home_team')} x {data.get('away_team')} ({match_date_sp})")
            to_delete.append(doc.id)
            continue

        # Migrate old field names if they exist
        update_data = {}
        if 'home_logo' in data and 'home_team_logo' not in data:
            update_data['home_team_logo'] = data['home_logo']
        if 'away_logo' in data and 'away_team_logo' not in data:
            update_data['away_team_logo'] = data['away_logo']
            
        # Ensure Botafogo logo is set to local path
        if data.get('home_team') == 'Botafogo' and (not data.get('home_team_logo') or 'glbimg' in str(data.get('home_team_logo'))):
            update_data['home_team_logo'] = '/logos/botafogo.png'
        if data.get('away_team') == 'Botafogo' and (not data.get('away_team_logo') or 'glbimg' in str(data.get('away_team_logo'))):
            update_data['away_team_logo'] = '/logos/botafogo.png'
            
        if update_data:
            to_update[doc.id] = update_data

        # 2. Check for matches to update
        for i, up in enumerate(updates_needed):
            if data.get('home_team') == up['home'] and data.get('away_team') == up['away']:
                print(f"UPDATING match: {up['home']} x {up['away']} to {up['new_date']}")
                to_update[doc.id] = {
                    "date": up['new_date'].isoformat(),
                    "home_team": up['home'],
                    "away_team": up['away'],
                    "competition": up['comp'],
                    "home_team_logo": "/logos/athletico-pr.png" if up['home'] == "Athletico-PR" else "/logos/botafogo.png",
                    "away_team_logo": "/logos/botafogo.png" if up['away'] == "Botafogo" else "/logos/flamengo.png" # simplified logic for these specific games
                }
                found_updates[i] = True

    # 3. Add missing matches
    # 3. Add missing matches
    new_matches_to_add = [
        {
            "home_team": "Boavista",
            "away_team": "Botafogo",
            "date": tz.localize(datetime(2026, 2, 21, 21, 0)).isoformat(),
            "competition": "Campeonato Carioca",
            "home_team_logo": "/logos/boavista.png",
            "away_team_logo": "/logos/botafogo.png"
        },
        {
            "home_team": "Botafogo",
            "away_team": "Boavista",
            "date": tz.localize(datetime(2026, 2, 28, 19, 30)).isoformat(),
            "competition": "Campeonato Carioca",
            "home_team_logo": "/logos/botafogo.png",
            "away_team_logo": "/logos/boavista.png"
        }
    ]

    final_new_matches = []
    
    # Check if these "new" matches already exist
    for nm in new_matches_to_add:
        exists = False
        # Re-scan current matches for this specific game
        # (Alternatively, we could have built a list of current games earlier)
        docs_copy = matches_ref.stream()
        for d in docs_copy:
            if d.id == 'next_match': continue
            dat = d.to_dict()
            if dat.get('home_team') == nm['home_team'] and dat.get('away_team') == nm['away_team']:
                # Already exists, update it instead of adding
                print(f"Match {nm['home_team']} x {nm['away_team']} already exists, marking for update.")
                to_update[d.id] = nm
                exists = True
                break
        if not exists:
            nm['id'] = str(uuid.uuid4())
            final_new_matches.append(nm)

    # Handle updates not found in stream
    for i, found in enumerate(found_updates):
        if not found:
            up = updates_needed[i]
            # Check if it was already added in this run to to_update or final_new_matches
            already_covered = any(u['home_team'] == up['home'] and u['away_team'] == up['away'] for u in to_update.values())
            if not already_covered:
                print(f"ADDING match (not found in DB): {up['home']} x {up['away']}")
                final_new_matches.append({
                    "id": str(uuid.uuid4()),
                    "home_team": up['home'],
                    "away_team": up['away'],
                    "date": up['new_date'].isoformat(),
                    "competition": up['comp'],
                    "home_team_logo": f"/logos/{up['home'].lower().replace(' ', '-')}.png",
                    "away_team_logo": f"/logos/{up['away'].lower().replace(' ', '-')}.png"
                })

    # PROCEED WITH CHANGES
    print(f"\nProceeding with {len(to_delete)} deletions, {len(to_update)} updates, and {len(final_new_matches)} additions...")

    for doc_id in to_delete:
        matches_ref.document(doc_id).delete()
    
    for doc_id, data in to_update.items():
        matches_ref.document(doc_id).update(data)
    
    for m in final_new_matches:
        m_id = m.pop('id')
        matches_ref.document(m_id).set(m)

    print("Finnished fixing matches.")

if __name__ == "__main__":
    fix_matches()
