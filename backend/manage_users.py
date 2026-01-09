import argparse
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Logic (Standardized)
if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    if not cred_path:
        if os.path.exists("service-account-new.json"):
            cred_path = "service-account-new.json"
        else:
            cred_path = "service-account.json"
            
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Failed to init firebase: {e}")
        exit(1)

db = firestore.client()
print(f"Connected to Firestore Project: {db.project}")

def list_users(premium_only=False):
    print("Fetching users...")
    users_ref = db.collection('users')
    
    if premium_only:
        start_q = users_ref.where('is_premium', '==', True).stream()
    else:
        start_q = users_ref.stream()
        
    count = 0
    print(f"{'EMAIL':<40} | {'PREMIUM':<10} | {'UID'}")
    print("-" * 80)
    
    for doc in start_q:
        data = doc.to_dict()
        email = data.get('email', 'N/A')
        is_prem = data.get('is_premium', False)
        print(f"{email:<40} | {str(is_prem):<10} | {doc.id}")
        count += 1
        
    print(f"\nTotal Users: {count}")

from firebase_admin import auth # Import auth

def set_premium(email, status):
    print(f"{'Enabling' if status else 'Disabling'} premium for: {email}...")
    
    users_ref = db.collection('users')
    
    # 1. Try to find in Firestore
    query = users_ref.where('email', '==', email).limit(1).stream()
    
    found_doc = None
    for doc in query:
        found_doc = doc
        break
        
    if found_doc:
        found_doc.reference.update({'is_premium': status})
        print(f"Success! Updated existing user {found_doc.id} ({email}).")
        return

    # 2. If not in Firestore, check Firebase Auth
    print("User not found in Firestore. Checking Authentication...")
    try:
        user_record = auth.get_user_by_email(email)
        uid = user_record.uid
        print(f"Found user in Auth! UID: {uid}")
        
        # Create Firestore Document
        doc_ref = users_ref.document(uid)
        doc_ref.set({
            'email': email,
            'is_premium': status,
            'created_at': firestore.SERVER_TIMESTAMP,
            'preferences': { 'news': True, 'podcasts': True, 'videos': True } # Defaults
        }, merge=True)
        
        print(f"Success! Created Firestore profile for {uid} ({email}) and set premium.")
        
    except auth.UserNotFoundError:
        print(f"Error: User '{email}' not found in Authentication either.")
        print("Please ask the user to Sign Up / Log In first.")
    except Exception as e:
        print(f"Error accessing Auth: {e}")

def set_premium_uid(uid, status):
    print(f"{'Enabling' if status else 'Disabling'} premium for UID: {uid}...")
    users_ref = db.collection('users')
    doc_ref = users_ref.document(uid)
    
    # Check if exists
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update({'is_premium': status})
        print(f"Success! Updated existing user {uid}.")
    else:
        # Create dummy structure
        print(f"Creating profile for UID {uid}...")
        doc_ref.set({
            'email': 'unknown@uid.manual',
            'is_premium': status,
            'created_at': firestore.SERVER_TIMESTAMP,
            'preferences': { 'news': True, 'podcasts': True, 'videos': True }
        }, merge=True)
        print(f"Success! Created profile for {uid}.")

def delete_user(uid):
    print(f"Deleting user {uid} from Auth and Firestore...")
    
    # 1. Delete from Firestore
    try:
        db.collection('users').document(uid).delete()
        print("Deleted from Firestore.")
    except Exception as e:
        print(f"Firestore delete failed: {e}")
        
    # 2. Delete from Auth
    try:
        auth.delete_user(uid)
        print("Deleted from Authentication.")
    except Exception as e:
        print(f"Auth delete failed: {e}")

def list_all_auth_users():
    print("Listing ALL users to users_dump.txt...")
    with open("users_dump.txt", "w", encoding="utf-8") as f:
        page = auth.list_users()
        while page:
            for user in page.users:
                # Use getattr to avoid potential attribute errors
                email = getattr(user, 'email', 'No Email')
                uid = getattr(user, 'uid', 'No UID')
                f.write(f"Email: {email} | UID: {uid}\n")
            page = page.get_next_page()
    print("Done. Check users_dump.txt")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manage Fogão Prêmio Users")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # List Command
    list_parser = subparsers.add_parser("list", help="List users from Firestore")
    list_parser.add_argument("--premium", action="store_true", help="List only premium users")

    # List Auth Command (New)
    list_auth_parser = subparsers.add_parser("list_auth", help="List users from Authentication")
    
    # Enable/Disable Commands
    enable_parser = subparsers.add_parser("enable", help="Enable premium for an email")
    enable_parser.add_argument("email", help="User email")
    
    enable_uid_parser = subparsers.add_parser("enable_uid", help="Enable premium for a UID")
    enable_uid_parser.add_argument("uid", help="User UID")
    
    disable_parser = subparsers.add_parser("disable", help="Disable premium for an email")
    disable_parser.add_argument("email", help="User email")
    
    # Delete Command
    delete_parser = subparsers.add_parser("delete", help="Delete a user by UID")
    delete_parser.add_argument("uid", help="User UID")

    args = parser.parse_args()
    
    if args.command == "list":
        list_users(args.premium)
    elif args.command == "list_auth":
        list_all_auth_users()
    elif args.command == "enable":
        set_premium(args.email, True)
    elif args.command == "enable_uid":
        set_premium_uid(args.uid, True)
    elif args.command == "disable":
        set_premium(args.email, False)
    elif args.command == "delete":
        delete_user(args.uid)
    else:
        parser.print_help()
