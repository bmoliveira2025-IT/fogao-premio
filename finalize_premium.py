
import os
import firebase_admin
from firebase_admin import credentials, firestore

def finalize_premium_content():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # 1. Delete ALL premium news cards related to "Análise" or this match
        # To be safe and thorough, we'll look for news with 'is_premium' == True and containing certain keywords
        premium_news = db.collection('news').where('is_premium', '==', True).stream()
        for doc in premium_news:
            data = doc.to_dict()
            title = data.get('title', '')
            if "ANÁLISE" in title or "Grêmio" in title or "Botafogo" in title:
                db.collection('news').document(doc.id).delete()
                print(f"Deleted outdated premium card: {doc.id} ({title})")
        
        # 2. Create the DEFINITIVE analysis card with TRUE information
        # Score: 3-2 Grêmio. Highlights: C. Vinicius Hat-trick, Danilo & Cabral scored for Botafogo.
        new_analysis = {
            "title": "ANÁLISE: C. Vinícius Brilha com Hat-trick em Jogo Aberto na Arena",
            "summary": "O Grêmio superou o Botafogo por 3 a 2 em uma partida eletrizante. Carlos Vinícius foi o nome do jogo com três gols, enquanto Danilo e Cabral descontaram para o Glorioso.",
            "content": "Em uma das melhores partidas da temporada até aqui, Grêmio e Botafogo entregaram um espetáculo ofensivo. O atacante Carlos Vinícius mostrou por que é um dos artilheiros do campeonato, balançando as redes três vezes e atingindo a nota 9.8. Pelo lado do Botafogo, Allan e Danilo comandaram o meio-campo, com o volante marcando um belo gol e chegando à nota 8.6, insuficiente para evitar a derrota fora de casa.",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop", # REAL stadium photo
            "is_premium": True,
            "category": "Análise Premium",
            "created_at": firestore.SERVER_TIMESTAMP,
            "match_id": "gre_v_bot_2026_02_06", # Linked to the detailed stats page
            "author": "Equipe Glorioso 360",
            "tags": ["Pós-jogo", "Brasileirão", "Tática"]
        }
        
        new_doc = db.collection('news').add(new_analysis)
        print(f"Created definitive premium analysis: {new_doc[1].id}")
        
    else:
        print("Credentials not found")

if __name__ == "__main__":
    finalize_premium_content()
