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
    try:
        # Try finding the service account in multiple locations
        cred_locations = ["service-account-new.json", "service-account.json", "../service-account-new.json", "../service-account.json"]
        cred = None
        for loc in cred_locations:
            if os.path.exists(loc):
                cred = credentials.Certificate(loc)
                break
        
        if cred:
            firebase_admin.initialize_app(cred)
        else:
            # Fallback for environments where creds might be in env vars or default
            firebase_admin.initialize_app()
    except Exception as e:
        print(f"Firebase initialization error: {e}")
else:
    print("Firebase already initialized.")

db = firestore.client()

CHANNELS = [
    {"name": "Botafogo TV", "id": "UCFxjZDrLCOCHkUCu632AmMQ"},
    {"name": "Fogão do Meu Coração", "id": "UCGYyVRRxyMn-7YuConcWEqYQ"}
]

def fetch_channel_videos(channel):
    name = channel["name"]
    channel_id = channel["id"]
    # Handle specific channels that might have different RSS patterns or handles
    if name == "Fogão do Meu Coração":
        rss_url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCGYyVRxyMn-7YuConcWEqYQ"
    else:
        rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    
    print(f"Fetching videos from {name} ({rss_url})...")
    try:
        response = requests.get(rss_url)
        if response.status_code != 200:
            print(f"Failed to fetch {name}: {response.status_code}")
            # If RSS fails, the channel ID might be correct but RSS disabled/hidden. 
            # This is rare. Let's try to double check the ID.
            return []

        root = ET.fromstring(response.content)
        ns = '{http://www.w3.org/2005/Atom}'
        yt = '{http://www.youtube.com/xml/schemas/2015}'
        media = '{http://search.yahoo.com/mrss/}'
        
        videos = []
        for entry in root.findall(f'{ns}entry'):
            video_id = entry.find(f'{yt}videoId').text
            title = entry.find(f'{ns}title').text
            published = entry.find(f'{ns}published').text
            
            # Normalize thumbnail
            thumbnail = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
            
            # Parse date
            try:
                dt = datetime.fromisoformat(published.replace('Z', '+00:00'))
            except:
                dt = datetime.now()
            
            videos.append({
                "video_id": video_id,
                "title": title,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": thumbnail,
                "published_at": dt,
                "source": name,
                "created_at": firestore.SERVER_TIMESTAMP
            })
            
        return videos
            
    except Exception as e:
        print(f"Error fetching videos for {name}: {e}")
        return []

def main():
    all_videos = []
    for channel in CHANNELS:
        videos = fetch_channel_videos(channel)
        print(f"Found {len(videos)} videos for {channel['name']}.")
        all_videos.extend(videos)
    
    if not all_videos:
        print("No videos found to save.")
        return

    # Batch write
    batch = db.batch()
    count = 0
    for video in all_videos:
        doc_ref = db.collection('videos').document(video['video_id'])
        batch.set(doc_ref, video)
        count += 1
        
        # Firestore batch limit is 500
        if count % 500 == 0:
            batch.commit()
            batch = db.batch()
            
    batch.commit()
    print(f"Total: Saved {count} videos to Firestore.")

if __name__ == "__main__":
    main()
