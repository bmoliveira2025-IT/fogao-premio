import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import datetime

load_dotenv()

cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
db = firestore.client()

video_id = "2_a2XJMkAtI"
title = "Das Cinzas ao Fogo | EP. 06 | Botafogo Films"
url = "https://www.youtube.com/watch?v=2_a2XJMkAtI"
thumbnail = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
# Use a very recent date to ensure it shows up first
published_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

video_doc = {
    "title": title,
    "url": url,
    "video_id": video_id,
    "thumbnail": thumbnail,
    "published_at": published_at,
    "source": "Botafogo TV",
    "created_at": firestore.SERVER_TIMESTAMP
}

# Check if exists
docs = db.collection('videos').where('video_id', '==', video_id).get()
if len(docs) > 0:
    print(f"Video {video_id} already exists. Updating...")
    docs[0].reference.update(video_doc)
else:
    db.collection('videos').add(video_doc)
    print(f"Added video: {title}")
