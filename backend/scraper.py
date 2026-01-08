import os
import json
import sys
import firebase_admin
from firebase_admin import credentials, firestore
from newspaper import Article
from groq import Groq
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import time

# Load environment variables
load_dotenv()

# Initialize Firebase
cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
# Cloud Execution: Load credentials from environment variable if available
firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if firebase_creds_json:
    try:
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
    except json.JSONDecodeError as e:
        print(f"Error parsing FIREBASE_CREDENTIALS_JSON: {e}")
        sys.exit(1)
else:
    # Check if running in GitHub Actions without credentials
    if os.getenv("GITHUB_ACTIONS") == "true":
        print("CRITICAL ERROR: FIREBASE_CREDENTIALS_JSON secret is missing in GitHub Actions.")
        print("Please add the 'FIREBASE_CREDENTIALS_JSON' secret to your repository.")
        sys.exit(1)

    # Local Execution: Load from file
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    if not cred_path:
        # Default to checking local file if env var not set
        local_cred_path = os.path.join(os.path.dirname(__file__), "service-account.json")
        if os.path.exists(local_cred_path):
            cred_path = local_cred_path
        else:
             print("Error: SERVICE_ACCOUNT_PATH not set and service-account.json not found.")
             sys.exit(1)
             
    cred = credentials.Certificate(cred_path)

firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ... (rest of imports/functions unchanged until main) ...

# NOTE: The rest of the file content (functions) remains the same until main block. 
# Since this tool requires replacing contiguous blocks, and I need to update imports AND main, 
# I will use multi_replace for safety in next step if this was only partial. 
# BUT, looking at the previous view_file, the imports are at top.
# let's only replace the credential part here, then do the main block separately or use multi_replace.
# Actually, I'll use multi_replace for the whole file refactor to be safe and clean.


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
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        response_format={"type": "json_object"}
    )
    
    try:
        content = chat_completion.choices[0].message.content
        # Basic cleanup to attempt to fix common json issues from LLMs
        content = content.strip()
        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '')
        
        return json.loads(content)
    except json.JSONDecodeError:
        print("Failed to decode JSON from AI response. Falling back to raw text.")
        return {
            "title": original_title,
            "summary": ["Resumo indisponível."],
            "content": original_content[:500] + "...",
            "tags": ["Botafogo"],
            "sentiment": "Neutro"
        }
    except Exception as e:
        print(f"Error in AI processing: {e}")
        return {
            "title": original_title,
            "summary": ["Erro no processamento."],
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

def monitor_sources():
    # Example sources (RSS or direct links for MVP)
    sources = [
        "https://www.fogaonet.com/",
        "https://ge.globo.com/futebol/times/botafogo/",
        "https://www.botafogo.com.br/noticias.php",
        "https://www.cnnbrasil.com.br/esportes/futebol/botafogo/",
        "https://www.terra.com.br/esportes/botafogo",
        "https://www.lance.com.br/botafogo",
        "https://www.gazetabotafogo.com/",
        "https://br.bolavip.com/botafogo",
        "https://odia.ig.com.br/esporte/botafogo",
        "https://fogonarede.com.br/"
    ]
    
    for source in sources:
        print(f"Checking source: {source}")
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(source, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            links = []
            
            # Strategy for GE Botafogo
            if "globo.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/noticia/' in a['href']][:10]
            
            # Strategy for FogãoNET
            elif "fogaonet.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) 
                        if ('/noticia/' in a['href'] or '/post/' in a['href'] or 'fogaonet.com/20' in a['href'] or '/noticias-do-botafogo/' in a['href']) 
                        and '#comments' not in a['href']][:10]
                # Fix relative URLs
                links = [f"https://www.fogaonet.com{l}" if l.startswith('/') else l for l in links]
            
            # Strategy for Botafogo Official
            elif "botafogo.com.br" in source:
                # Usually look for /ler-noticia.php or similar patterns, or just generic check since we target /noticias.php
                links = [a['href'] for a in soup.find_all('a', href=True) if 'ler-noticia' in a['href'] or 'noticia.php' in a['href']][:5]
                # Fix relative URLs
                links = [f"https://www.botafogo.com.br/{l}" if not l.startswith('http') else l for l in links]

            # Strategy for CNN Brasil
            elif "cnnbrasil.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esportes/' in a['href'] and ('botafogo' in a['href'] or 'futebol' in a['href'])][:5]
                # Fix relative URLs
                links = [f"https://www.cnnbrasil.com.br{l}" if l.startswith('/') else l for l in links]

            # Strategy for Terra
            elif "terra.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esportes/' in a['href'] and ('botafogo' in a['href'] or 'futebol' in a['href'])][:5]
                # Fix relative URLs
                links = [f"https://www.terra.com.br{l}" if l.startswith('/') else l for l in links]

            # Strategy for Lance!
            elif "lance.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/botafogo/' in a['href'] and '.html' in a['href']][:5]
                # Fix relative URLs (though Lance usually has full URLs, it's safe to check)
                links = [f"https://www.lance.com.br{l}" if l.startswith('/') else l for l in links]

            # Strategy for Gazeta Botafogo
            elif "gazetabotafogo.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '.html' in a['href'] and '/20' in a['href']][:5]
                # Fix relative URLs
                links = [f"https://www.gazetabotafogo.com{l}" if l.startswith('/') else l for l in links]

            # Strategy for Bolavip
            elif "bolavip.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/botafogo/' in a['href'] and a['href'].count('/') > 4][:5]
                links = [f"https://br.bolavip.com{l}" if l.startswith('/') else l for l in links]

            # Strategy for O Dia
            elif "odia.ig.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esporte/botafogo/' in a['href'] and '.html' in a['href']][:5]
                links = [f"https://odia.ig.com.br{l}" if l.startswith('/') else l for l in links]

            # Strategy for Fogo na Rede
            elif "fogonarede.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) 
                        if ('/noticias-do-botafogo/' in a['href'] or '/coluna-do-editor/' in a['href'])
                        and '/category/' not in a['href']][:5]
                # Fix relative URLs
                links = [f"https://fogonarede.com.br{l}" if l.startswith('/') else l for l in links]

        except Exception as e:
            print(f"Error fetching {source}: {e}")
            continue

        # Remove duplicates
        links = list(set(links))

        for link in links:
            # Check if exists in DB
            docs = db.collection('news').where('original_url', '==', link).get()
            if len(docs) > 0:
                print(f"Skipping existing: {link}")
                continue
                
            print(f"New article found: {link}")
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
                elif "fogonarede.com.br" in link: source_name = "Fogo na Rede"

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
                print(f"Saved: {ai_data['title']}")

                print(f"Saved: {ai_data['title']}")

def fetch_youtube_videos():
    # Channel Configurations
    channels = [
        {
            "id": "UCFxjZDrLCOCHkUCu632AmMQ",
            "name": "Botafogo TV",
            "filter": None # No filter, get all videos
        },
        {
            "id": "UCgCKagVhzGnZcuP9bSMgMCg", # ge TV / Globo Esporte
            "name": "ge TV",
            "filter": "botafogo" # Only videos with "Botafogo" in title (case-insensitive)
        }
    ]

    for channel in channels:
        url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel['id']}"
        print(f"Fetching YouTube Feed for {channel['name']}: {url}")
        
        try:
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
                    
                    # Apply Filter if exists
                    if channel['filter']:
                        if channel['filter'].lower() not in title.lower():
                            print(f"Skipping video (filter mismatch): {title}")
                            continue

                    # Check if exists
                    docs = db.collection('videos').where('video_id', '==', video_id).get()
                    if len(docs) > 0:
                        continue
                    
                    video_doc = {
                        "title": title,
                        "url": link,
                        "video_id": video_id,
                        "thumbnail": thumbnail,
                        "published_at": published,
                        "source": channel['name'],
                        "created_at": firestore.SERVER_TIMESTAMP
                    }
                    
                    db.collection('videos').add(video_doc)
                    print(f"Saved Video ({channel['name']}): {title}")
                    
        except Exception as e:
            print(f"Error fetching videos for {channel['name']}: {e}")

def update_next_match():
    # In a real scenario, this would scrape 'https://api.globoesporte.globo.com/tabela/d1/...'
    # For this MVP/Demo, and since scraping failed, we update the DB with the requested "Brasileirão 2026" data.
    
    match_data = {
        "home_team": "Botafogo",
        "away_team": "Cruzeiro",
        "home_team_logo": "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",
        "away_team_logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/250px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png",
        "home_score": 0,
        "away_score": 0,
        "date": "2026-01-28T16:00:00Z", # Date from user image (28/01)
        "location": "Estádio Nilton Santos • Rio de Janeiro",
        "championship": "Brasileirão 2026",
        "status": "scheduled" 
    }
    
    # Update or create the 'next_match' document
    db.collection('matches').document('next_match').set(match_data)
    print("Match data updated in Firestore.")
    
import subprocess

def deploy_to_vercel():
    print("Starting Vercel deployment...")
    try:
        # Define the path to the portal directory
        portal_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'portal')
        
        # Run the deployment command
        # --yes flag skips confirmation prompts
        result = subprocess.run(
            ["npx", "vercel", "deploy", "--prod", "--yes"], 
            cwd=portal_dir, 
            capture_output=True, 
            text=True, 
            shell=True
        )
        
        if result.returncode == 0:
            print("Deployment successful!")
            print(result.stdout)
        else:
            print("Deployment failed.")
            print(result.stderr)
            
    except Exception as e:
        print(f"Error during deployment: {e}")

if __name__ == "__main__":
    update_next_match()
    fetch_youtube_videos()
    
    # Check if running in GitHub Actions (or any cloud "single run" environment)
    if os.getenv("GITHUB_ACTIONS") == "true":
        print("Running in Cloud Mode (Single Execution)...")
        monitor_sources()
        print("Scraping finished. Exiting.")
    else:
        # Local Loop Mode
        print("Starting continuous monitoring... (Interval: 15 minutes)")
        while True:
            monitor_sources()
            print("Cycle finished. Sleeping for 15 minutes...")
            time.sleep(900)
