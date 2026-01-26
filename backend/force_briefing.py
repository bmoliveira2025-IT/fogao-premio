
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone, timedelta
import scraper

# Initialize only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("service-account.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
# Document ID logic synced with scraper.py
# If current time is not in a slot, it uses _forced
today_utc = datetime.now(timezone.utc)
today_brt = today_utc - timedelta(hours=3)
current_hour = today_brt.hour

briefing_slot = None
if 7 <= current_hour < 11: briefing_slot = "07h"
elif 18 <= current_hour < 22: briefing_slot = "18h"
elif current_hour >= 22 or current_hour < 2: briefing_slot = "24h"

today_date_str = today_brt.strftime('%Y-%m-%d')
doc_id = f"{today_date_str}_{briefing_slot}" if briefing_slot else f"{today_date_str}_forced"

print(f"Forcing generation for ID: {doc_id}")

# Delete existing
doc_ref = db.collection('daily_briefings').document(doc_id)
if doc_ref.get().exists:
    print(f"Deleting existing briefing {doc_id} to force regeneration...")
    doc_ref.delete()
else:
    print(f"No existing briefing found for {doc_id}.")

# Run generation
print("Updating Next Match Data...")
scraper.update_next_match()

print("Running generate_daily_briefing()...")
scraper.generate_daily_briefing(force=True)
print("Done!")
