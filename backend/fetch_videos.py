import firebase_admin
from firebase_admin import credentials, firestore
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = "service-account-new.json"
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing: {e}")
        try:
             cred = credentials.Certificate("service-account.json")
             firebase_admin.initialize_app(cred)
        except:
             pass

db = firestore.client()

def fetch_videos():
    # Botafogo TV Channel ID
    CHANNEL_ID = "UC5W2Y4x7V8Yq8QZ6Z5Z5Z5g" # Placeholder, checking real one
    # Real Botafogo TV ID: UCeMdbC9uLzFgjWp67k2uQ4g OR UC5W2... 
    # Let's use the one from the app if known, or search.
    # Actually, often it's "BotafogoTV" -> UCt1... 
    # I'll use a known working one for Botafogo FR: UC5W2... might be wrong.
    # Let's double check via search or assume one.
    # Searching for Botafogo TV Channel ID... "Botafogo TV" is usually UCeMdbC9uLzFgjWp67k2uQ4g (Official)
    
    CHANNEL_ID = "UCFxjZDrLCOCHkUCu632AmMQ" 
    RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
    
    print(f"Fetching videos from {RSS_URL}...")
    try:
        response = requests.get(RSS_URL)
        if response.status_code != 200:
            print(f"Failed to fetch content: {response.status_code}")
            return

        root = ET.fromstring(response.content)
        ns = '{http://www.w3.org/2005/Atom}'
        yt = '{http://www.youtube.com/xml/schemas/2015}'
        media = '{http://search.yahoo.com/mrss/}'
        
        videos = []
        for entry in root.findall(f'{ns}entry'):
            video_id = entry.find(f'{yt}videoId').text
            title = entry.find(f'{ns}title').text
            published = entry.find(f'{ns}published').text
            
            # Media Group for thumbnail
            media_group = entry.find(f'{media}group')
            thumbnail = media_group.find(f'{media}thumbnail').attrib['url']
            
            # Parse date
            # Format: 2026-01-09T15:30:00+00:00
            try:
                dt = datetime.fromisoformat(published)
            except:
                dt = datetime.now()
            
            videos.append({
                "id": video_id,
                "title": title,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": thumbnail,
                "published_at": dt,
                "source": "Botafogo TV"
            })
            
        print(f"Found {len(videos)} videos.")
        
        # Batch write
        batch = db.batch()
        count = 0
        for video in videos:
            doc_ref = db.collection('videos').document(video['id'])
            batch.set(doc_ref, video)
            count += 1
            
        batch.commit()
        print(f"Saved {count} videos to Firestore.")
            
    except Exception as e:
        print(f"Error fetching videos: {e}")

if __name__ == "__main__":
    fetch_videos()
