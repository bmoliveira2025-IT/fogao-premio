
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
import sys

# Suppress stderr to avoid gRPC warnings
sys.stderr = open(os.devnull, 'w')

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

docs = db.collection('videos').where('source', '==', 'Botafogo TV').limit(10).get()

results = []
for doc in docs:
    data = doc.to_dict()
    data['id'] = doc.id
    # Convert timestamps
    for k, v in data.items():
        if hasattr(v, 'isoformat'):
            data[k] = v.isoformat()
    results.append(data)

# Print as clean JSON to stdout
print(json.dumps(results, indent=2, ensure_ascii=False))
