import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    if not cred_path:
        print("Error: SERVICE_ACCOUNT_PATH not found in .env")
        exit(1)
    
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def set_premium_by_email(email):
    print(f"Searching for user with email: {email}...")
    
    # Query for the user
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).limit(1)
    results = query.stream()
    
    found = False
    for doc in results:
        found = True
        user_ref = users_ref.document(doc.id)
        
        # Update to Premium
        user_ref.update({
            'is_premium': True,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        print(f"✅ User found (ID: {doc.id}) and upgraded to PREMIUM!")
        print("Please refresh the /premium page to see the changes.")
        
    if not found:
        print(f"❌ User with email '{email}' not found.")
        print("Please make sure you have logged in at least once.")

import sys

if __name__ == "__main__":
    print("--- Tool to Make User Premium ---")
    
    if len(sys.argv) > 1:
        email_input = sys.argv[1]
    else:
        email_input = input("Enter the user email: ").strip()
    
    if email_input:
        set_premium_by_email(email_input)
    else:
        print("No email provided.")
