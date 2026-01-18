import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup
from newspaper import Article

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_real_image(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        # Try Newspaper first
        article = Article(url)
        article.download()
        article.parse()
        
        soup = BeautifulSoup(article.html, 'html.parser')
        og_image = soup.find('meta', property='og:image') or soup.find('meta', attrs={'name': 'og:image'})
        twitter_image = soup.find('meta', name='twitter:image') or soup.find('meta', attrs={'property': 'twitter:image'})
        
        image = None
        if og_image and og_image.get('content'):
            image = og_image['content']
        elif twitter_image and twitter_image.get('content'):
            image = twitter_image['content']
        else:
            image = article.top_image

        if not image or image == 'None':
             # BeautifulSoup direct fallback
             response = requests.get(url, headers=headers, timeout=10)
             soup = BeautifulSoup(response.text, 'html.parser')
             img_tags = soup.find_all('img', src=True)
             for img in img_tags:
                if 'glbimg' in img['src'] or 'static' in img['src'] or 'fogaonet' in img['src']:
                    return img['src']
        return image
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

print("Fetching news items with 'None' images...")
docs = db.collection('news').where('image', '==', 'None').get()

print(f"Found {len(docs)} items to fix.")

for doc in docs:
    data = doc.to_dict()
    url = data.get('original_url')
    if not url: continue
    
    print(f"Fixing: {data.get('title')}")
    real_image = get_real_image(url)
    
    if real_image and real_image != 'None':
        db.collection('news').document(doc.id).update({'image': real_image})
        print(f"Successfully updated image: {real_image[:50]}...")
    else:
        print("Failed to find a real image.")

print("Fix completed.")
