
import firebase_admin
from firebase_admin import credentials, firestore
import os
from urllib.parse import urlparse

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

news_docs = db.collection('news').order_by('created_at', direction=firestore.Query.DESCENDING).limit(100).get()

domains = set()
fogaonet_no_i = []
for doc in news_docs:
    img_url = doc.to_dict().get('image')
    if img_url:
        if 'fogaonet.com' in img_url and 'i.fogaonet.com' not in img_url:
            fogaonet_no_i.append(img_url)
        if img_url.startswith('http'):
            domain = urlparse(img_url).netloc
            domains.add(domain)

print("--- Unique Image Domains ---")
for d in sorted(list(domains)):
    print(d)

if fogaonet_no_i:
    print("\n--- fogaonet.com (no i.) Found ---")
    for url in fogaonet_no_i:
        print(url)
else:
    print("\nNo fogaonet.com (no i.) found.")
