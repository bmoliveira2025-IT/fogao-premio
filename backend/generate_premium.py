
import firebase_admin
from firebase_admin import credentials, firestore
import os
from groq import Groq
import json
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    # Use environment variable or fallback to local key
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH") or os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    if cred_path:
        if os.path.exists(cred_path):
             cred = credentials.Certificate(cred_path)
             firebase_admin.initialize_app(cred)
        # Handle JSON string case if needed (for Vercel), but here we run locally
    else:
        # Hard fallback for local dev if env not set
        cred_path = os.path.join(os.path.dirname(__file__), 'service-account.json')
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)

db = firestore.client()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

articles_to_generate = [
    {
        "title": "Análise Tática: O segredo da defesa",
        "description": "Uma análise profunda sobre o sistema defensivo do Botafogo, destacando a organização tática e o papel dos zagueiros.",
        "image": "/premium/tactics.png"
    },
    {
        "title": "Bastidores do CT: Um dia com o elenco",
        "description": "Uma reportagem especial mostrando a rotina de treinamentos, alimentação e preparação dos jogadores no Lonier.",
        "image": "/premium/ct.png"
    },
    {
        "title": "Coluna: O futuro do Glorioso",
        "description": "Um artigo de opinião projetando os próximos passos do clube, investimentos da SAF e ambições internacionais.",
        "image": "/premium/future.png"
    }
]

# Real images to use (approximations)
# Using generic football/Botafogo-like images or placeholders that look premium
article_images = []
# Note: I should probably just use the generate_image tool or find real URLs if I can.
# For now, I will use high quality seemingly matching images or just re-use standard ones with a query.
# Actually, let's use some specific ones.

def generate_article(item):
    prompt = f"""
    Atue como um Jornalista Esportivo Sênior do Fogão Prêmio.
    Escreva uma notícia completa e PREMIUM com o título: "{item['title']}".
    Contexto: {item['description']}
    
    REGRAS DE ESTILO:
    - O texto deve ser FLUIDO e ELEGANTE.
    - NÃO USE markdown como negrito (**texto**) ou cabeçalhos (###). Apenas texto corrido e parágrafos.
    - Evite listas com marcadores. Prefira texto narrativo.
    - Use um tom sofisticado, analítico e apaixonado.
    
    Retorne apenas JSON:
    {{
        "content": "Texto completo...",
        "summary": "Resumo de 2 linhas",
        "tags": ["Tag1", "Tag2"],
        "sentiment": "Positivo"
    }}
    """
    
    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        response_format={"type": "json_object"}
    )
    
    return json.loads(completion.choices[0].message.content)

# Delete existing premium news to regenerate
print("Deleting existing premium content...")
existing = db.collection('news').where('is_premium', '==', True).get()
for doc in existing:
    db.collection('news').document(doc.id).delete()

print("Generating new premium content...")

for i, item in enumerate(articles_to_generate):
    print(f"Generating {item['title']}...")
    try:
        data = generate_article(item)
        
        # Assign specific premium images
        image_url = item['image']
        
        doc_data = {
            "title": item['title'],
            "summary": data.get('summary', item['description']),
            "content": data.get('content').replace('**', '').replace('###', ''), # Extra cleanup
            "tags": data.get('tags', ["Botafogo", "Premium"]),
            "sentiment": data.get('sentiment', "Positivo"),
            "image": image_url, 
            "source": "Fogão Prêmio Exclusive",
            "is_premium": True,
            "created_at": firestore.SERVER_TIMESTAMP,
            "original_url": "premium-content-" + item['title'].lower().replace(' ', '-')
        }
        
        db.collection('news').add(doc_data)
        print("Saved!")
    except Exception as e:
        print(f"Error generating {item['title']}: {e}")

print("Done.")
