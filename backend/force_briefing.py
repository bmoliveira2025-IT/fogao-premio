
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
import scraper

# Initialize only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("service-account.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')

print(f"Forcing generation for date: {today_str}")

# Delete existing
doc_ref = db.collection('daily_briefings').document(today_str)
if doc_ref.get().exists:
    print("Deleting existing briefing to force regeneration...")
    doc_ref.delete()
else:
    print("No existing briefing found.")

# Run generation
print("Running generate_daily_briefing()...")
scraper.generate_daily_briefing()
print("Done!")
