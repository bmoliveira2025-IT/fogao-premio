import firebase_admin
from firebase_admin import credentials
import json
import os

# Load from environment variable for safety
creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if creds_json:
    try:
        cred_dict = json.loads(creds_json)
        cred = credentials.Certificate(cred_dict)
        app = firebase_admin.initialize_app(cred)
        print("SUCCESS: Firebase initialized from Environment Variable!")
    except Exception as e:
         print(f"FAILED to initialize from Env Var: {e}")
else:
    print("WARNING: FIREBASE_CREDENTIALS_JSON not set. Cannot test connection.")
