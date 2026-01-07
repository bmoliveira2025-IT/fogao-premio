from http.server import BaseHTTPRequestHandler
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from newspaper import Article
from groq import Groq
from bs4 import BeautifulSoup
import requests

# Initialize Firebase
# Vercel doesn't allow writing files easily, so we rely solely on ENV vars
# If FIREBASE_SERVICE_ACCOUNT is present (JSON string), we use it.
if not firebase_admin._apps:
    if os.environ.get("FIREBASE_SERVICE_ACCOUNT"):
        cred_dict = json.loads(os.environ.get("FIREBASE_SERVICE_ACCOUNT"))
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback for local testing maybe? But likely failing in prod if not set.
        print("Warning: FIREBASE_SERVICE_ACCOUNT not set")

db = firestore.client()

# Initialize Groq
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def process_with_ai(original_title, original_content):
    prompt = f"""
    Atue como um Jornalista Esportivo Sênior do portal "Fogão Prêmio".
    Sua tarefa é REESCREVER a notícia abaixo com suas próprias palavras para criar um conteúdo original e premium.
    NÃO copie o texto. Use parafraseamento inteligente para evitar plágio (Copyright).
    Mantenha todos os fatos, números e nomes corretos.
    O tom deve ser profissional, apaixonado (mas imparcial) e analítico.
    
    Notícia Original: {original_content}
    Título Original: {original_title}
    
    Retorne APENAS um JSON válido:
    {{
        "title": "Título Impactante (Manchete Editorial)",
        "summary": ["Destaque 1", "Destaque 2", "Destaque 3"],
        "content": "Texto completo reescrito (Mínimo 3 parágrafos bem estruturados). Use 'O Botafogo' em vez de 'o time'.",
        "tags": ["Tag1", "Tag2"],
        "sentiment": "Positivo/Neutro/Negativo"
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"}
        )
        content = chat_completion.choices[0].message.content
        content = content.strip()
        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '')
        return json.loads(content)
    except Exception as e:
        print(f"Error in AI: {e}")
        return {
            "title": original_title,
            "summary": ["Resumo indisponível."],
            "content": original_content[:500] + "...",
            "tags": ["Botafogo"],
            "sentiment": "Neutro"
        }

def scrape_news(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return {
            "title": article.title,
            "content": article.text,
            "image": article.top_image,
            "url": url,
            "publish_date": article.publish_date.isoformat() if article.publish_date else None
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        # Fallback manual extraction
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Title fallback
                title = soup.find('h1').text.strip() if soup.find('h1') else None
                if not title:
                     title = soup.find('meta', property='og:title')['content'] if soup.find('meta', property='og:title') else "Título indisponível"
                
                # Content fallback
                paragraphs = soup.find_all('p')
                # Simple heuristic to get article content: paragraphs with substantial text
                text = " ".join([p.text for p in paragraphs if len(p.text) > 50])
                
                # Image fallback
                image = None
                og_image = soup.find('meta', property='og:image')
                if og_image:
                    image = og_image['content']
                
                if title and text:
                     return {
                        "title": title,
                        "content": text,
                        "image": image,
                        "url": url,
                        "publish_date": None
                    }
        except Exception as ex:
             print(f"Fallback failed: {ex}")
        return None

def run_scraper_cycle():
    sources = [
        "https://www.fogaonet.com/",
        "https://ge.globo.com/futebol/times/botafogo/",
        "https://www.botafogo.com.br/noticias.php",
        "https://www.cnnbrasil.com.br/esportes/futebol/botafogo/",
        "https://www.terra.com.br/esportes/botafogo",
        "https://www.lance.com.br/botafogo",
        "https://www.gazetabotafogo.com/",
        "https://br.bolavip.com/botafogo",
        "https://odia.ig.com.br/esporte/botafogo"
    ]
    
    processed_count = 0
    
    for source in sources:
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(source, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            links = []
            
            if "globo.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/noticia/' in a['href']][:5]
            elif "fogaonet.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) 
                        if ('/noticia/' in a['href'] or '/post/' in a['href'] or 'fogaonet.com/20' in a['href'] or '/noticias-do-botafogo/' in a['href']) 
                        and '#comments' not in a['href']][:5]
                links = [f"https://www.fogaonet.com{l}" if l.startswith('/') else l for l in links]
            elif "botafogo.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if 'ler-noticia' in a['href'] or 'noticia.php' in a['href']][:3]
                links = [f"https://www.botafogo.com.br/{l}" if not l.startswith('http') else l for l in links]
            elif "cnnbrasil.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esportes/' in a['href'] and ('botafogo' in a['href'] or 'futebol' in a['href'])][:3]
                links = [f"https://www.cnnbrasil.com.br{l}" if l.startswith('/') else l for l in links]
            elif "terra.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esportes/' in a['href'] and ('botafogo' in a['href'] or 'futebol' in a['href'])][:3]
                links = [f"https://www.terra.com.br{l}" if l.startswith('/') else l for l in links]
            elif "lance.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/botafogo/' in a['href'] and '.html' in a['href']][:3]
                links = [f"https://www.lance.com.br{l}" if l.startswith('/') else l for l in links]
            elif "gazetabotafogo.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '.html' in a['href'] and '/20' in a['href']][:3]
            elif "bolavip.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/botafogo/' in a['href'] and a['href'].count('/') > 4][:3]
                links = [f"https://br.bolavip.com{l}" if l.startswith('/') else l for l in links]
            elif "odia.ig.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esporte/botafogo/' in a['href'] and '.html' in a['href']][:3]
                links = [f"https://odia.ig.com.br{l}" if l.startswith('/') else l for l in links]

            # Unique links
            links = list(set(links))

            for link in links:
                # Check DB
                docs = db.collection('news').where('original_url', '==', link).limit(1).get()
                if len(docs) > 0:
                    continue
                
                raw_data = scrape_news(link)
                if raw_data and raw_data.get('content') and len(raw_data['content']) > 200:
                    ai_data = process_with_ai(raw_data['title'], raw_data['content'])
                    
                    source_name = "Outro"
                    if "globo.com" in link: source_name = "Globo Esporte"
                    elif "fogaonet.com" in link: source_name = "FogãoNET"
                    elif "botafogo.com.br" in link: source_name = "Site Oficial"
                    elif "cnnbrasil.com.br" in link: source_name = "CNN Brasil"
                    elif "terra.com.br" in link: source_name = "Terra"
                    elif "lance.com.br" in link: source_name = "Lance!"
                    elif "gazetabotafogo.com" in link: source_name = "Gazeta Botafogo"
                    elif "bolavip.com" in link: source_name = "Bolavip"
                    elif "odia.ig.com.br" in link: source_name = "O Dia"

                    news_doc = {
                        "title": ai_data['title'],
                        "summary": ai_data['summary'],
                        "content": ai_data['content'],
                        "tags": ai_data['tags'],
                        "sentiment": ai_data['sentiment'],
                        "image": raw_data['image'],
                        "original_url": raw_data['url'],
                        "source": source_name,
                        "created_at": firestore.SERVER_TIMESTAMP
                    }
                    
                    db.collection('news').add(news_doc)
                    processed_count += 1
                    
        except Exception as e:
            print(f"Error source {source}: {e}")
            continue

    try:
        url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCFxjZDrLCOCHkUCu632AmMQ"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'xml')
            entries = soup.find_all('entry')
            for entry in entries:
                video_id = entry.find('videoId').text
                title = entry.find('title').text
                published = entry.find('published').text
                link = f"https://www.youtube.com/watch?v={video_id}"
                thumbnail = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
                
                docs = db.collection('videos').where('video_id', '==', video_id).limit(1).get()
                if len(docs) > 0: continue
                
                db.collection('videos').add({
                    "title": title,
                    "url": link,
                    "video_id": video_id,
                    "thumbnail": thumbnail,
                    "published_at": published,
                    "source": "Botafogo TV",
                    "created_at": firestore.SERVER_TIMESTAMP
                })
                processed_count += 1
    except Exception as e:
        print(f"Error fetching videos: {e}")

    return processed_count

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Basic security check - check for a CRON secret if you wanted
            # if self.headers.get('Authorization') != f"Bearer {os.environ.get('CRON_SECRET')}":
            #    self.send_response(401)
            #    self.end_headers()
            #    return

            count = run_scraper_cycle()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'processed': count}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode())
