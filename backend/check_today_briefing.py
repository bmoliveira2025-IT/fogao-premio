
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
if not cred_path or not os.path.exists(cred_path):
    cred_path = "service-account.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

today_utc = datetime.now(timezone.utc)
today_brt = today_utc - timedelta(hours=3)
today_str = today_brt.strftime('%Y-%m-%d')

print(f"Checking briefings for date: {today_str}")
docs = db.collection('daily_briefings').where('date', '==', today_str).get()

print(f"Found {len(docs)} briefings for {today_str}")
for doc in docs:
    data = doc.to_dict()
    print(f"ID: {doc.id}")
    print(f"Edition: {data.get('edition')}")
    print(f"Title: {data.get('editorial_summary')[:100]}...")
