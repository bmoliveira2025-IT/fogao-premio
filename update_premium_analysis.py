
import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

def update_premium_analysis():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # 1. Delete the old analysis document
        old_id = "NhuQrWCgIOBmo00lFVE"
        db.collection('news').document(old_id).delete()
        print(f"Deleted old news document: {old_id}")
        
        # 2. Create the new analysis document
        new_analysis = {
            "title": "ANÁLISE: Botafogo vence o Grêmio com brilho de Danilo e Luiz Henrique",
            "summary": "O Glorioso dominou a Arena do Grêmio e saiu com uma vitória importante por 2 a 1, com grande atuação do seu novo volante.",
            "content": "Em uma partida taticamente perfeita, o Botafogo superou o Grêmio fora de casa. Luiz Henrique abriu o placar aos 12 minutos, e após o empate de Soteldo, Danilo garantiu o triunfo aos 34'. O time mostrou uma solidez defensiva impressionante e transições rápidas que desnortearam a defesa gremista.",
            "image": "https://img.freepik.com/fotos-premium/estadio-de-futebol-lotado-a-noite-com-luzes-brilhantes-e-jogadores-em-campo_911620-137.jpg", # Placeholder image
            "is_premium": True,
            "category": "Análise Tática",
            "created_at": firestore.SERVER_TIMESTAMP,
            "match_id": "gre_v_bot_2026_02_06", # Link to the stats page
            "author": "IA Glorioso 360"
        }
        
        # Using the match_id as document ID or letting Firestore generate one
        new_doc_ref = db.collection('news').add(new_analysis)
        print(f"Created new premium analysis: {new_doc_ref[1].id}")
        
    else:
        print("Credentials not found")

if __name__ == "__main__":
    update_premium_analysis()
