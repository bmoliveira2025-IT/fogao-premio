import firebase_admin
from firebase_admin import credentials, firestore
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import os

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.path.join(os.path.dirname(__file__), "..", "service-account-new.json")
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        try: # Fallback
            cred = credentials.Certificate("service-account.json")
            firebase_admin.initialize_app(cred)
        except:
            pass

try:
    db = firestore.client()
    print(f"Firestore initialized with project: {db.project}")
except Exception as e:
    print(f"Firestore connection failed: {e}")
    exit(1)

def fetch_podcasts():
    RSS_URL = "https://audio.globoradio.globo.com/podcast/feed/690/ge-botafogo"
    
    print(f"Fetching podcasts from {RSS_URL}...")
    try:
        response = requests.get(RSS_URL)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch content: {e}")
        return

    try:
        root = ET.fromstring(response.content)
        channel = root.find('channel')
        
        podcasts = []
        
        # namespaces might act up, but usually standard RSS uses <item>
        for item in channel.findall('item'):
            title = item.find('title').text
            description = item.find('description').text
            pubDate = item.find('pubDate').text
            
            # Extract audio URL from enclosure
            enclosure = item.find('enclosure')
            audio_url = enclosure.attrib.get('url') if enclosure is not None else ""
            
            # Image usually in itunes:image
            # Simple hack: scrape description or use default
            image_url = "" 
            # (Parsing namespaces requires registering them, keeping it simple for now)
            
            # Parse Date
            try:
                # Format: Tue, 09 Jan 2024 10:00:00 -0300
                dt = datetime.strptime(pubDate, "%a, %d %b %Y %H:%M:%S %z")
            except:
                dt = datetime.now()

            # Create ID from title or date
            p_id = "pod_" + str(int(dt.timestamp()))
            
            podcasts.append({
                "id": p_id,
                "title": title,
                "description": description,
                "audioUrl": audio_url,
                "published_at": dt,
                "source": "GE Botafogo"
            })
            
            if len(podcasts) >= 10: # Limit to 10 latest
                break
            
        # Batch write
        batch = db.batch()
        count = 0
        for pod in podcasts:
            doc_ref = db.collection('podcasts').document(pod['id'])
            batch.set(doc_ref, pod)
            count += 1
            
        batch.commit()
        print(f"Saved {count} podcasts to Firestore.")
        
    except Exception as e:
        print(f"Error parsing RSS: {e}")

if __name__ == "__main__":
    fetch_podcasts()
