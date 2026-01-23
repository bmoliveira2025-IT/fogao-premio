
import firebase_admin
from firebase_admin import credentials, firestore
import os
import re

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def clean_videos():
    print("--- Starting Video Data Cleanup ---")
    docs = db.collection('videos').stream()
    
    count_fixed = 0
    count_deleted = 0
    count_kept = 0
    
    # Track video IDs to find duplicates
    video_ids_seen = {} # {video_id: doc_id}

    for doc in docs:
        data = doc.to_dict()
        doc_id = doc.id
        
        # Consistent video_id extraction
        video_id = data.get('video_id')
        if not video_id:
            # Try to get from URL
            url = data.get('url', '')
            match = re.search(r'(?:v=|\/)([a-zA-Z0-9_-]{11})', url)
            if match:
                video_id = match.group(1)
        
        if not video_id:
            print(f"Removing invalid video (no ID): {doc_id} - {data.get('title')}")
            db.collection('videos').document(doc_id).delete()
            count_deleted += 1
            continue

        # Check for duplicates (favor documents where doc_id == video_id)
        if video_id in video_ids_seen:
            existing_doc_id = video_ids_seen[video_id]
            # If current doc_id is the video_id, keep it and delete the other
            if doc_id == video_id:
                print(f"Deleting duplicate for {video_id} (found better id match: {doc_id})")
                db.collection('videos').document(existing_doc_id).delete()
                video_ids_seen[video_id] = doc_id
                count_deleted += 1
            else:
                print(f"Deleting duplicate for {video_id} (already seen {existing_doc_id})")
                db.collection('videos').document(doc_id).delete()
                count_deleted += 1
                continue
        else:
            video_ids_seen[video_id] = doc_id

        # Fix Thumbnail
        thumbnail = data.get('thumbnail', '')
        # Clean up corrupted URLs (like .jpgg or junk after .jpg)
        if '.jpg' in thumbnail:
            clean_thumb = thumbnail.split('.jpg')[0] + '.jpg'
            # Force standard subdomain to avoid future pattern issues (though allowed now)
            # Actually, standardizing to i.ytimg.com is safer
            clean_thumb = re.sub(r'https?://i\d*\.ytimg\.com', 'https://i.ytimg.com', clean_thumb)
            
            if clean_thumb != thumbnail:
                print(f"Fixing thumbnail: {thumbnail} -> {clean_thumb}")
                data['thumbnail'] = clean_thumb
                data['video_id'] = video_id # Ensure video_id is set
                db.collection('videos').document(doc_id).set(data)
                count_fixed += 1
            else:
                # Still ensure video_id is set for consistency
                if 'video_id' not in data:
                    data['video_id'] = video_id
                    db.collection('videos').document(doc_id).set(data)
                    count_fixed += 1
                count_kept += 1
        else:
            # Fallback if thumbnail is missing or totally broken
            data['thumbnail'] = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
            data['video_id'] = video_id
            db.collection('videos').document(doc_id).set(data)
            count_fixed += 1

    print(f"\nSummary:")
    print(f"- Fixed/Updated: {count_fixed}")
    print(f"- Deleted (duped/broken): {count_deleted}")
    print(f"- Kept: {count_kept}")
    print("--- Cleanup Finished ---")

if __name__ == "__main__":
    clean_videos()
