
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def create_premium_analysis_news():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("Credentials not found.")
            return

    db = firestore.client()
    
    # News content
    news_doc = {
        "title": "ANÁLISE: Botafogo luta mas cai no Rio Grande do Sul em jogaço de 8 gols",
        "summary": [
            "Botafogo marca 3 vezes fora de casa mas não segura o ataque gremista.",
            "Kadir Barría brilha com dois gols e assume protagonismo.",
            "Análise tática completa e estatísticas detalhadas da partida."
        ],
        "content": "**O Jogo**\n\nEm um dos jogos mais emocionantes do campeonato até aqui, Grêmio e Botafogo protagonizaram um espetáculo de 8 gols no Rio Grande do Sul. O Alvinegro mostrou poder de reação, buscando o empate por duas vezes, mas acabou sucumbindo ao hat-trick de Luis Suárez.\n\n**Destaque Individual**\n\nKadir Barría foi o grande nome do Botafogo, demonstrando faro de gol e oportunismo. Matheus Martins também teve boa atuação, participando ativamente das jogadas ofensivas.\n\n**Estatísticas Detalhadas**\n\nO Botafogo teve 55% de posse de bola e finalizou 22 vezes, mas a eficácia do adversário falou mais alto. Acesse a aba de estatísticas para a análise completa do mapa de calor e passes.",
        "tags": ["Botafogo", "Brasileirão", "Análise"],
        "sentiment": "Neutro",
        "image": "https://p2.trrsf.com/image/fget/cf/1200/675/middle/images.terra.com.br/2024/11/09/1731191599813.jpg", # Placeholder image of Botafogo match
        "is_premium": True,
        "source": "Fogão Prêmio",
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    update_time, doc_ref = db.collection('news').add(news_doc)
    print(f"Premium News created with ID: {doc_ref.id}")

if __name__ == "__main__":
    create_premium_analysis_news()
