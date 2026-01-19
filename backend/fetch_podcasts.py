import firebase_admin
from firebase_admin import credentials, firestore
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import os
import sys

def get_db_client():
    # Check if already initialized
    if firebase_admin._apps:
        try:
            return firestore.client()
        except Exception:
            pass # Try to get app or re-init if needed (unlikely if _apps exists)

    # Load credentials
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    
    if not cred_path or not os.path.exists(cred_path):
        # Common locations to check
        possible_paths = [
            os.path.join(os.path.dirname(__file__), "service-account-new.json"), 
            os.path.join(os.path.dirname(__file__), "..", "service-account-new.json"),
            os.path.join(os.path.dirname(__file__), "service-account.json"),
            os.path.join(os.path.dirname(__file__), "..", "service-account.json"),
            "service-account.json"
        ]
        
        for p in possible_paths:
            if os.path.exists(p):
                cred_path = p
                break
        
    try:
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
        else:
            # Try default (e.g. Cloud Environment)
            firebase_admin.initialize_app()
            return firestore.client()
            
    except Exception as e:
        print(f"Error initializing Firebase in fetch_podcasts: {e}")
        return None

def fetch_podcasts(db=None):
    if db is None:
        db = get_db_client()
        if not db:
            print("Database client not available. Skipping podcasts.")
            return

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
        items = channel.findall('item') if channel is not None else []
        
        for item in items:
            title = item.find('title').text
            description = item.find('description').text if item.find('description') is not None else ""
            pubDate = item.find('pubDate').text
            
            # Extract audio URL from enclosure
            enclosure = item.find('enclosure')
            audio_url = enclosure.attrib.get('url') if enclosure is not None else ""
            
            # Image usually in itunes:image - skipping for now as per original
            
            # Parse Date
            dt = datetime.now()
            try:
                # Format: Tue, 09 Jan 2024 10:00:00 -0300
                dt = datetime.strptime(pubDate, "%a, %d %b %Y %H:%M:%S %z")
            except:
                try:
                     # Try without timezone if first fails, or other formats?
                     # Original was ignoring errors mostly, passing dt=now() on fail
                     pass
                except:
                     pass

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
