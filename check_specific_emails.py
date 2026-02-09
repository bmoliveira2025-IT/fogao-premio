import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH") or "backend/service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

emails_to_check = [
    "premio@fogaopremio.com.br",
    "premio@gmail.com",
    "contato@fogaopremio.com.br",
    "admin@fogaopremio.com.br",
    "suporte@fogaopremio.com.br",
    "fogaopremio@gmail.com"
]

def check_emails():
    for email in emails_to_check:
        try:
            user = auth.get_user_by_email(email)
            print(f"FOUND: {email} | UID: {user.uid}")
        except auth.UserNotFoundError:
            print(f"NOT FOUND: {email}")
        except Exception as e:
            print(f"ERROR for {email}: {e}")

if __name__ == "__main__":
    check_emails()
