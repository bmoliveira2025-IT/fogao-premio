
import os
import firebase_admin
from firebase_admin import credentials, firestore

def update_scorers_final():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # Update the existing definitive card
        premium_news = db.collection('news').where('match_id', '==', 'gre_v_bot_2026_02_06').stream()
        
        card_found = False
        for doc in premium_news:
            db.collection('news').document(doc.id).update({
                "title": "ANÁLISE: Danilo brilha com 2 gols em jogaço de 5 a 3 na Arena",
                "summary": "O volante Danilo comandou a reação do Botafogo com dois gols, mas não foi o suficiente para superar o hat-trick de Carlos Vinícius em 2026.",
                "content": "Em uma partida histórica válida pela temporada 2026, Grêmio e Botafogo protagonizaram um duelo de 8 gols. O grande destaque do Glorioso foi o volante Danilo, que balançou as redes duas vezes e comandou o meio-campo com maestria (nota 8.6). Arthur Cabral também marcou, mas o hat-trick de Carlos Vinícius para o tricolor garantiu o 5 a 3 no placar final. Uma demonstração de poder ofensivo das duas equipes."
            })
            print(f"Updated premium card {doc.id} with Danilo's 2 goals.")
            card_found = True
            
        if not card_found:
            print("Card not found, creating a new definitive one...")
            new_analysis = {
                "title": "ANÁLISE: Danilo brilha com 2 gols em jogaço de 5 a 3 na Arena",
                "summary": "O volante Danilo comandou a reação do Botafogo com dois gols, mas não foi o suficiente para superar o hat-trick de Carlos Vinícius em 2026.",
                "content": "Em uma partida histórica válida pela temporada 2026, Grêmio e Botafogo protagonizaram um duelo de 8 gols. O grande destaque do Glorioso foi o volante Danilo, que balançou as redes duas vezes e comandou o meio-campo com maestria (nota 8.6). Arthur Cabral também marcou, mas o hat-trick de Carlos Vinícius para o tricolor garantiu o 5 a 3 no placar final. Uma demonstração de poder ofensivo das duas equipes.",
                "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop", 
                "is_premium": True,
                "category": "Análise Premium",
                "created_at": firestore.SERVER_TIMESTAMP,
                "match_id": "gre_v_bot_2026_02_06", 
                "author": "Equipe Glorioso 360"
            }
            db.collection('news').add(new_analysis)
    else:
        print("Credentials not found")

if __name__ == "__main__":
    update_scorers_final()
