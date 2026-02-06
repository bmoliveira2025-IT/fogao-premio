
import os
import firebase_admin
from firebase_admin import credentials, firestore

def update_score_to_5_3():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # Update the existing definitive card (or create if missing)
        # We'll search for the card with title containing "C. Vinícius" or "Hat-trick" or match_id
        premium_news = db.collection('news').where('match_id', '==', 'gre_v_bot_2026_02_06').stream()
        
        card_found = False
        for doc in premium_news:
            db.collection('news').document(doc.id).update({
                "title": "ANÁLISE: Show de Gols na Arena! Grêmio 5 x 3 Botafogo",
                "summary": "Em um jogo histórico de 8 gols, o Grêmio superou o Botafogo por 5 a 3. Carlos Vinícius comandou a vitória tricolor, enquanto o Glorioso lutou até o fim.",
                "content": "A Arena do Grêmio foi palco de um espetáculo raro. Com 8 gols marcados, o Grêmio venceu o Botafogo por 5 a 3. Carlos Vinícius foi o destaque absoluto com um hat-trick e nota 9.8. Pelo Botafogo, Arthur Cabral marcou duas vezes e Danilo anotou um golaço, mantendo o time vivo na disputa até os minutos finais. Uma aula de futebol ofensivo que ficará na memória do torcedor."
            })
            print(f"Updated premium card {doc.id} with corrected 5-3 score.")
            card_found = True
            
        if not card_found:
            print("Definitive card not found, creating a new one...")
            new_analysis = {
                "title": "ANÁLISE: Show de Gols na Arena! Grêmio 5 x 3 Botafogo",
                "summary": "Em um jogo histórico de 8 gols, o Grêmio superou o Botafogo por 5 a 3. Carlos Vinícius comandou a vitória tricolor, enquanto o Glorioso lutou até o fim.",
                "content": "A Arena do Grêmio foi palco de um espetáculo raro. Com 8 gols marcados, o Grêmio venceu o Botafogo por 5 a 3. Carlos Vinícius foi o destaque absoluto com um hat-trick e nota 9.8. Pelo Botafogo, Arthur Cabral marcou duas vezes e Danilo anotou um golaço, mantendo o time vivo na disputa até os minutos finais. Uma aula de futebol ofensivo que ficará na memória do torcedor.",
                "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop", 
                "is_premium": True,
                "category": "Análise Premium",
                "created_at": firestore.SERVER_TIMESTAMP,
                "match_id": "gre_v_bot_2026_02_06", 
                "author": "Equipe Glorioso 360"
            }
            db.collection('news').add(new_analysis)
            print("Created new corrected analysis card.")
        
    else:
        print("Credentials not found")

if __name__ == "__main__":
    update_score_to_5_3()
