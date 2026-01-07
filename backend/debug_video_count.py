
import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.path.join(os.path.dirname(__file__), 'service-account.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Try finding it based on scraper location
        pass

db = firestore.client()

# Check DB count
docs = db.collection('videos').stream()
count = sum(1 for _ in docs)
print(f"Videos in DB: {count}")

# Check RSS feed count
url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCFxjZDrLCOCHkUCu632AmMQ"
try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(f"Content Start: {response.text[:200]}")
    soup = BeautifulSoup(response.content, 'xml')
    entries = soup.find_all('entry')
    print(f"Videos in RSS Feed: {len(entries)}")
    for e in entries[:5]:
        print(f"- {e.find('title').text}")
except Exception as e:
    print(f"Error fetching RSS: {e}")
