import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()
load_dotenv(".env.local")

cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
if not cred_path or not os.path.exists(cred_path):
    possible_paths = [
        "backend/service-account-new.json",
        "backend/service-account.json",
        "service-account.json"
    ]
    for p in possible_paths:
        if os.path.exists(p):
            cred_path = p
            break

if not cred_path:
    print("Credentials not found.")
    exit(1)

cred = credentials.Certificate(cred_path)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
videos = db.collection('videos').get()

domains = {}
for doc in videos:
    data = doc.to_dict()
    thumbnail = data.get('thumbnail', '')
    if thumbnail:
        try:
            from urllib.parse import urlparse
            domain = urlparse(thumbnail).netloc
            domains[domain] = domains.get(domain, 0) + 1
        except:
            pass

print("Thumbnail Domains Count:")
for d, count in domains.items():
    print(f"- {d}: {count}")

print("\nSample URLs per Domain:")
for d in domains:
    sample = next((v.to_dict().get('thumbnail') for v in videos if urlparse(v.to_dict().get('thumbnail')).netloc == d), "N/A")
    print(f"- {d}: {sample}")
