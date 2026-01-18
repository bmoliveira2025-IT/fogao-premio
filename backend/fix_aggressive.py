import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def force_get_image(url):
    print(f"Scraping: {url}")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"HTTP Error: {response.status_code}")
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 1. OpenGraph
        og = soup.find('meta', property='og:image') or soup.find('meta', attrs={'name': 'og:image'})
        if og and og.get('content'):
            print("Found via OG")
            return og['content']
            
        # 2. Twitter Card
        tw = soup.find('meta', name='twitter:image') or soup.find('meta', attrs={'property': 'twitter:image'})
        if tw and tw.get('content'):
            print("Found via Twitter")
            return tw['content']
            
        # 3. Direct IMG search for GE/Globo
        if 'globo.com' in url:
            img = soup.find('img', class_='content-media__image')
            if img and img.get('src'):
                print("Found via GE class")
                return img['src']
            
        # 4. Large images
        imgs = soup.find_all('img', src=True)
        for img in imgs:
            src = img['src']
            if 'glbimg' in src and ('1200x' in src or '800x' in src or 'share' in src):
                print("Found via GLBIMG large")
                return src

        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

docs = db.collection('news').where('image', '==', 'None').get()
print(f"Fixing {len(docs)} items...")

for doc in docs:
    url = doc.to_dict().get('original_url')
    if not url: continue
    
    img = force_get_image(url)
    if img:
        db.collection('news').document(doc.id).update({'image': img})
        print(f"UPDATED: {doc.id}")
    else:
        print(f"FAILED: {doc.id}")

print("Done.")
