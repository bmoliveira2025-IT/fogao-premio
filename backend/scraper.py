import os
import json
import sys
import firebase_admin
from firebase_admin import credentials, firestore, messaging
from newspaper import Article

import google.generativeai as genai
from dotenv import load_dotenv
import requests
import re
from bs4 import BeautifulSoup
import time
from datetime import datetime, timezone, timedelta
from cleanup import cleanup_old_news # Import cleanup logic
from fetch_podcasts import fetch_podcasts # Import Podcast logic
from fetch_brasileirao import fetch_brasileirao # Import Brasileirão logic
from update_results import update_schedule_results # Auto-update match results in schedule.ts
from fetch_table import fetch_table # Import Carioca logic
import subprocess
import pytz

# Load environment variables
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

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
    # Local Execution: Load from file
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    
    # Verify if provided path exists, if not, try to find it
    if not cred_path or not os.path.exists(cred_path):
        # Common locations to check
        possible_paths = [
            os.path.join(os.path.dirname(__file__), "service-account-new.json"), # New Creds
            os.path.join(os.path.dirname(__file__), "service-account.json"), # Same dir as script
            os.path.join(os.getcwd(), "backend", "service-account.json"),    # backend subdir
            os.path.join(os.getcwd(), "service-account.json"),               # root dir
            "service-account.json"
        ]
        
        found = False
        for p in possible_paths:
            if os.path.exists(p):
                cred_path = p
                found = True
                break
        
        if not found:
             print(f"Error: Credentials not found. Checked: {possible_paths}")
             sys.exit(1)
             
    print(f"DEBUG: Loading credentials from: {cred_path}")
    cred = credentials.Certificate(cred_path)

if not firebase_admin._apps:
    try:
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully.")
    except ValueError as e:
        print(f"Warning: Firebase init skipped (already initialized?): {e}")

try:
    db = firestore.client()
except Exception as e: # Fallback if client creation fails
     print(f"Error getting Firestore client: {e}")
     # Try to get existing app
     app = firebase_admin.get_app()
     db = firestore.client(app=app)


# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found. AI features will fail.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Quota and Model Management
# Note: gemini-2.5-flash has a 20 req/day limit. gemini-2.0-flash is available with higher quotas.
DEFAULT_MODEL_NAME = 'gemini-2.5-flash'
quota_exhausted = False


try:
    model = genai.GenerativeModel(DEFAULT_MODEL_NAME)
    print(f"Gemini model initialized: {DEFAULT_MODEL_NAME}")
except Exception as e:
    print(f"Error initializing Gemini model: {e}")
    model = None

# Config for newspaper to avoid 403
from newspaper import Config
def get_scraper_config():
    config = Config()
    config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    config.request_timeout = 15
    return config

def check_connectivity():
    try:
        requests.get("https://www.google.com", timeout=5)
        return True
    except Exception:
        return False

# ... (rest of imports/functions unchanged until main) ...

def clean_text(text):
    if not text:
        return ""
    
    # Remove common ad noise patterns (case insensitive)
    noise_patterns = [
        r'continua após a publicidade',
        r'continua depois da publicidade',
        r'leia mais:.*',
        r'confira também:.*',
        r'veja também:.*',
        r'publicidade',
        r'anúncio',
    ]
    
    cleaned = text
    for pattern in noise_patterns:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Remove markdown bold/italic
    cleaned = cleaned.replace('**', '').replace('*', '')
    
    return cleaned.strip()
    cleaned = re.sub(r'\*\*|__', '', cleaned) # Remove bold
    
    # Remove multiple spaces/newlines
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

# NOTE: The rest of the file content (functions) remains the same until main block. 
# Since this tool requires replacing contiguous blocks, and I need to update imports AND main, 
# I will use multi_replace for safety in next step if this was only partial. 
# BUT, looking at the previous view_file, the imports are at top.
# let's only replace the credential part here, then do the main block separately or use multi_replace.
# Actually, I'll use multi_replace for the whole file refactor to be safe and clean.


def process_with_ai(original_title, original_content):
    prompt = f"""
    Atue como Editor-Chefe de um portal de notícias profissional (Fogão Prêmio), com foco em clareza, escaneabilidade e experiência do leitor em desktop, tablet e mobile.
    Receberá um texto bruto de notícia sobre o Botafogo.

    Sua tarefa é reorganizar, revisar e formatar o conteúdo, sem alterar os fatos, seguindo rigorosamente estas diretrizes:

    1. Estrutura editorial
    - Criar um **Título Jornalístico Objetivo** (sem clickbait).
    - Criar um **Subtítulo Explicativo** (curto).
    - Organizar o texto em parágrafos curtos.
    - Inserir **Intertítulos** (use **negrito** nos títulos de seção, ex: **O que aconteceu**) para separar os temas.

    2. Qualidade jornalística
    - Manter tom informativo, imparcial e profissional.
    - Preservar datas, valores, nomes e declarações.
    - Corrigir fluidez, coesão e redundâncias.
    - Usar aspas corretamente para falas diretas.

    3. Escaneabilidade e UX
    - Destaque números e valores relevantes com **negrito** (ex: **R$ 50 milhões**, **3 gols**).
    - Utilizar listas quando fizer sentido.
    - O campo 'summary' será usado como um "Box de Resumo da situação".

    4. Público e plataforma
    - Texto otimizado para leitura digital.
    - Adequado para sites de notícias premium.
    - Linguagem clara e objetiva.

    5. Restrições
    - Não adicionar opinião.
    - Não inventar informações.
    - Não remover fatos relevantes.

    Notícia Original para processar:
    {original_content}
    
    Título Original: {original_title}

    Retorne APENAS um JSON válido seguindo esta estrutura exata:
    {{
        "title": "Seu Título Jornalístico Objetivo",
        "summary": ["Ponto chave 1 do resumo", "Ponto chave 2 do resumo", "Ponto chave 3 do resumo"],
        "content": "Seu texto completo formatado. Use quebras de linha duplas para parágrafos. Use **asteriscos duplos** para negrito. NÃO use # Markdown Headers, use **negrito** para intertítulos.",
        "tags": ["Tag1", "Tag2"],
        "sentiment": "Positivo/Neutro/Negativo"
    }}
    """
    
    global quota_exhausted
    if quota_exhausted:
         print("Skipping AI processing: Quota already exhausted in this run.")
         return {
            "title": original_title,
            "summary": [original_content[:200] + "..."],
            "content": original_content,
            "tags": ["Botafogo"],
            "sentiment": "Neutro"
        }

    try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                if not model:
                     raise Exception("Gemini model not initialized (missing key?)")

                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                break # Success
            except Exception as e:
                # Basic error handling for Gemini
                if attempt == max_retries - 1: raise e
                
                print(f"Gemini API connection failed (Attempt {attempt+1}/{max_retries}). Error: {e}")
                
                # Check for Quota/Rate Limit Errors
                error_str = str(e).lower()
                if "429" in error_str or "quota" in error_str or "resource exhausted" in error_str:
                     print("CRITICAL: Quota exceeded. Turning off AI features for this session.")
                     quota_exhausted = True
                     break # Exit retry loop
                else:
                     if not check_connectivity():
                          print("Network check failed: Internet seems to be down.")
                     print("Retrying in 10s...")
                     time.sleep(10)
        
        if quota_exhausted:
             raise Exception("Quota exhausted during retries")
    
        content = response.text
        # Basic cleanup just in case, though response_mime_type handles most
        content = content.replace('```json', '').replace('```', '').strip()
        
        result = json.loads(content)
        # Clean Title specifically
        if 'title' in result:
             result['title'] = result['title'].replace('**', '').replace('__', '')
        return result
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
            "summary": [original_content[:200] + "..."],
            "content": original_content, # Fallback to FULL content, no truncation
            "tags": ["Botafogo"],
            "sentiment": "Neutro"
        }

def is_relevant(title, content):
    keywords = [
        'botafogo', 'glorioso', 'fogo', 'alvinegro', 'estrela solitária', 
        'nilton santos', 'john textor', 'artur jorge', 'eagle football',
        'bfr', 'camisa 7'
    ]
    text = (title + " " + content).lower()
    return any(k in text for k in keywords)

def scrape_news(url):

    try:
        config = get_scraper_config()
        article = Article(url, config=config)
        article.download()
        
        # Fallback if download failed but didn't raise
        if not article.html:
             raise Exception("Empty HTML content")
             
        article.parse()
        
        # Custom extraction for better image accuracy (prioritize og:image, then twitter:image)
        soup = BeautifulSoup(article.html, 'html.parser')
        og_image = soup.find('meta', attrs={'property': 'og:image'}) or soup.find('meta', attrs={'name': 'og:image'})
        twitter_image = soup.find('meta', attrs={'name': 'twitter:image'}) or soup.find('meta', attrs={'property': 'twitter:image'})
        
        image = None
        if og_image and og_image.get('content'):
            image = og_image['content']
        elif twitter_image and twitter_image.get('content'):
            image = twitter_image['content']
        else:
            image = article.top_image

        # Fallback: if still no image, look for large images in soup
        if not image or image == 'None':
            all_imgs = soup.find_all('img', src=True)
            for img in all_imgs:
                src = img['src']
                if 'glbimg.com' in src or 'fogaonet' in src: # Known good sources
                    image = src
                    break

        title = article.title
        content = clean_text(article.text)

        # Relevance Check
        if not is_relevant(title, content):
            print(f"Skipping irrelevant article: {title}")
            return None

        # Exclude specific unwanted titles
        blacklisted_patterns = ["Night Live Especial", "Night Live", "LIVE ESPECIAL", "LIVE |"]
        if any(pattern.upper() in title.upper() for pattern in blacklisted_patterns):
            print(f"Skipping blacklisted article (LIVE): {title}")
            return None
            
        # Generic LIVE check (case insensitive)
        if "LIVE" in title.upper():
            print(f"Skipping generic LIVE article: {title}")
            return None

        # Date Check (Recency Filter)
        if article.publish_date:
            try:
                # Ensure timezone awareness for comparison
                pub_date = article.publish_date
                if pub_date.tzinfo is None:
                    pub_date = pub_date.replace(tzinfo=timezone.utc)
                
                now = datetime.now(timezone.utc)
                # Accept articles from the full four-day archive shown in the app.
                if (now - pub_date).total_seconds() > 345600: # 96 hours
                    print(f"Skipping old article ({pub_date}): {article.title}")
                    return None
            except Exception as e:
                print(f"Date comparison warning: {e}")
                
        return {
            "title": title,
            "content": content,
            "image": image,
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
                og_image = soup.find('meta', attrs={'property': 'og:image'}) or soup.find('meta', attrs={'name': 'og:image'})
                twitter_image = soup.find('meta', attrs={'name': 'twitter:image'}) or soup.find('meta', attrs={'property': 'twitter:image'})
                
                if og_image and og_image.get('content'):
                    image = og_image['content']
                elif twitter_image and twitter_image.get('content'):
                    image = twitter_image['content']
                
                if not image:
                    # Look for first large-looking image
                    img_tags = soup.find_all('img', src=True)
                    for img in img_tags:
                        if 'glbimg' in img['src'] or 'static' in img['src']:
                            image = img['src']
                            break
                
                if title and text:
                     return {
                        "title": title,
                        "content": clean_text(text),
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
        "https://br.bolavip.com/botafogo",
        "https://odia.ig.com.br/esporte/botafogo",

        # "https://www.espn.com.br/futebol/time/_/id/6086/botafogo" # Disabled by user request
    ]
    
    for source in sources:
        print(f"Checking source: {source}")
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(source, headers=headers, timeout=20)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            links = []
            
            # Strategy for GE Botafogo
            if "globo.com" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/noticia/' in a['href']][:10]
                # Filter out obvious non-football sections
                links = [l for l in links if not any(x in l for x in ['/motor/', '/surfe/', '/volei/', '/olimpiadas/', '/basquete/'])]
            
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
                # Filter out the section page itself
                links = [l for l in links if l.strip('/') != source.strip('/')]

            # Strategy for Terra
            elif "terra.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esportes/' in a['href'] and ('botafogo' in a['href'] or 'futebol' in a['href'])][:5]
                # Fix relative URLs
                links = [f"https://www.terra.com.br{l}" if l.startswith('/') else l for l in links]
                # Filter out live feeds, section page, and Botafogo-SP
                links = [l for l in links if '/ao-vivo/' not in l and l.strip('/') != source.strip('/') and 'botafogo-sp' not in l]

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
                # Filter out tables, results, games
                links = [l for l in links if '/tabelas' not in l and '/jogos' not in l and '/resultados' not in l]

            # Strategy for O Dia
            elif "odia.ig.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esporte/botafogo/' in a['href'] and '.html' in a['href']][:5]
                links = [f"https://odia.ig.com.br{l}" if l.startswith('/') else l for l in links]

            # Strategy for ESPN
            elif "espn.com.br" in source:
                # Find links that contain 'botafogo' in href OR text, and look like articles
                links = []
                for a in soup.find_all('a', href=True):
                    href = a['href']
                    text = a.get_text().lower()
                    if '/artigo/' in href or '/futebol/time/' in href: # broad check first
                        if 'botafogo' in href.lower() or 'botafogo' in text:
                            links.append(href)
                
                links = links[:5]
                # Fix relative URLs
                links = [f"https://www.espn.com.br{l}" if l.startswith('/') else l for l in links]

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

                elif "espn.com.br" in link: source_name = "ESPN"

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
                
                update_time, doc_ref = db.collection('news').add(news_doc)
                print(f"Saved: {ai_data['title']}")

                # Send Push Notification
                try:
                    message = messaging.Message(
                        notification=messaging.Notification(
                            title="Fogão Prêmio - Nova Notícia",
                            body=ai_data['title'],
                            image=raw_data['image'] if raw_data['image'] else None,
                        ),
                        data={
                            'url': f"https://info-sphere-pro.vercel.app/news/{doc_ref.id}",
                            'click_action': f"https://info-sphere-pro.vercel.app/news/{doc_ref.id}"
                        },
                        topic='news'
                    )
                    response = messaging.send(message)
                    print('Successfully sent message:', response)
                except Exception as e:
                    print('Error sending message:', e)
            else:
                print(f"Skipped {link}: ", end="")
                if not raw_data: print("Failed to scrape.")
                elif not raw_data.get('content'): print("No content found.")
                else: print(f"Content too short ({len(raw_data['content'])} chars).")

def fetch_youtube_videos():
    # Channel Configurations
    channels = [
        {
            "id": "UCFxjZDrLCOCHkUCu632AmMQ",
            "name": "Botafogo TV",
            "filter": None # No filter, get all videos
        },
        {
            "id": "UCqzaT59nBHOSoK1nikip_Gg", # Arena Alvinegra
            "name": "Arena Alvinegra",
            "filter": None,
            "limit": 2
        },
        {
            "id": "UC_JIxHLpOkTGw6LDjq50_oQ", # Setor Visitante
            "name": "Setor Visitante",
            "filter": None
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
            response = requests.get(url, headers=headers, timeout=20)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'xml')
                entries = soup.find_all('entry')
                
                # Apply channel specific limit if exists
                limit = channel.get('limit')
                if limit:
                    entries = entries[:limit]

                for entry in entries:
                    video_id = entry.find('videoId').text
                    title = entry.find('title').text
                    published = entry.find('published').text
                    
                    # Global Filter: Remove Botafogo-SP content
                    if "botafogo-sp" in title.lower() or "botafogo sp" in title.lower():
                        print(f"Skipping Botafogo-SP video: {title}")
                        continue

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
                    
                    db.collection('videos').document(video_id).set(video_doc)
                    print(f"Saved Video ({channel['name']}): {title}")
                    
        except Exception as e:
            print(f"Error fetching videos for {channel['name']}: {e}")

def fetch_ge_next_match():
    url = "https://ge.globo.com/futebol/times/botafogo/agenda-de-jogos-do-botafogo/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        match = re.search(r'window\.dataSportsSchedule\s*=\s*({.*?});', response.text, re.DOTALL)
        if not match:
            match = re.search(r'dataSportsSchedule\s*=\s*({.*?});', response.text, re.DOTALL)
            
        if not match:
            print("GE Scraper: Could not find dataSportsSchedule in page.")
            return None
            
        js_content = match.group(0)
        
        backend_dir = os.path.dirname(__file__)
        temp_js = os.path.join(backend_dir, "temp_ge_data.js")
        parse_script = os.path.join(backend_dir, "parse_ge.js")
        
        with open(temp_js, "w", encoding="utf-8") as f:
            f.write(js_content)
        
        result = subprocess.run(['node', parse_script, temp_js], capture_output=True, text=True, encoding="utf-8")
        
        if os.path.exists(temp_js):
            os.remove(temp_js)
            
        if result.returncode != 0:
            print(f"GE Scraper: Node helper error: {result.stderr}")
            return None
            
        data = json.loads(result.stdout)
        future_matches = data.get('scheduleTeam', {}).get('teamAgenda', {}).get('future', [])
        if not future_matches:
            print("GE Scraper: No future matches found.")
            return None
            
        next_m = future_matches[0]
        m = next_m.get('match', {})
        
        home_team = m.get('firstContestant', {}).get('popularName', 'A definir')
        away_team = m.get('secondContestant', {}).get('popularName', 'A definir')
        start_date = m.get('startDate', '')
        start_time = m.get('startHour', '')
        stadium = m.get('location', {}).get('popularName', 'A definir')
        championship = m.get('phase', {}).get('championshipEdition', {}).get('championship', {}).get('name', '')
        
        transmissions = []
        sources = m.get('liveWatchSources', [])
        if sources:
            for src in sources:
                name = src.get('name', '')
                desc = src.get('description', '')
                if desc:
                    transmissions.append(f"{name} ({desc})")
                else:
                    transmissions.append(name)
        
        transmission_str = ", ".join(transmissions) if transmissions else "A definir"
        
        # Format display time
        display_time = "A definir"
        dt_obj = None
        if start_date and start_time:
            try:
                dt_str = f"{start_date} {start_time}"
                dt_obj = datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
                # Add timezone info (assuming it's BRT/local)
                tz = pytz.timezone('America/Sao_Paulo')
                dt_obj = tz.localize(dt_obj)
                display_time = dt_obj.strftime('%d/%m às %H:%M')
            except:
                display_time = f"{start_date} {start_time}"

        return {
            'home_team': home_team,
            'away_team': away_team,
            'date': dt_obj if dt_obj else start_date,
            'display_time': display_time,
            'stadium': stadium,
            'location': stadium, # For compatibility
            'championship': championship,
            'transmission': transmission_str,
            'status': 'upcoming'
        }

    except Exception as e:
        print(f"GE Scraper: Error: {e}")
        return None

def update_next_match():
    print("Searching for next match...")
    try:
        # Get current time in Sao Paulo
        tz = pytz.timezone('America/Sao_Paulo')
        now = datetime.now(tz)
        print(f"Current Time: {now}")

        # Get all matches
        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        future_matches = []
        
        for doc in docs:
            if doc.id == 'next_match': continue
            
            data = doc.to_dict()
            if 'date' not in data: continue
            
            match_date_raw = data['date']
            try:
                if isinstance(match_date_raw, str):
                    clean_date = match_date_raw.replace('Z', '+00:00')
                    match_date = datetime.fromisoformat(clean_date)
                else:
                    match_date = match_date_raw
                
                if match_date.tzinfo is None:
                    match_date = match_date.replace(tzinfo=pytz.UTC)
            except Exception as e:
                print(f"Date parse error {match_date_raw}: {e}")
                continue

            match_date_sp = match_date.astimezone(tz)
            
            # Include matches that started in the last 2.5 hours
            if match_date_sp > (now - timedelta(hours=2.5)):
                data['match_id'] = doc.id
                future_matches.append((match_date_sp, data))

        # Sort by date
        future_matches.sort(key=lambda x: x[0])
        
        if not future_matches:
            print("No future matches found.")
            return

        # Pick the absolute next match (that isn't already finished)
        next_match_candidates = [m for _, m in future_matches if m.get('status') not in ['ENCERRADA', 'Finalizado', 'FINALIZADO']]
        
        if not next_match_candidates:
            print("No upcoming (non-finished) matches found.")
            return

        next_match = next_match_candidates[0]
        
        # Check current next_match
        current_next = db.collection('matches').document('next_match').get()
        if current_next.exists:
            current_data = current_next.to_dict()
            
            # If current next_match is ALREADY FINISHED, we MUST update it
            if current_data.get('status') in ['ENCERRADA', 'Finalizado', 'FINALIZADO']:
                print(f"Current next_match ({current_data.get('home_team')} x {current_data.get('away_team')}) is already finished. Updating...")
            else:
                current_date_raw = current_data.get('date')
                if current_date_raw:
                    try:
                        if isinstance(current_date_raw, str):
                            current_match_dt = datetime.fromisoformat(current_date_raw.replace('Z', '+00:00'))
                        else:
                            current_match_dt = current_date_raw
                        
                        if current_match_dt.tzinfo is None:
                            current_match_dt = current_match_dt.replace(tzinfo=pytz.UTC)
                            
                        current_match_sp = current_match_dt.astimezone(tz)
                        
                        # If current match is today AND hasn't finished (allow 3h), KEEP IT
                        if current_match_sp.date() == now.date() and now < (current_match_sp + timedelta(hours=3.5)):
                            print(f"KEEPING TODAY'S MATCH: {current_data.get('home_team')} x {current_data.get('away_team')}")
                            # BUT, even then, we should check if it just finished
                            return
                    except:
                        pass

        # 2. ALSO fetch from GE for live transmission info
        ge_match = fetch_ge_next_match()
        if ge_match:
            print(f"GE Match Found: {ge_match['home_team']} x {ge_match['away_team']}")
            # If GE match matches our next candidate's teams, we can merge/enrich
            # Or just use GE as source of truth for next_match
            next_match = ge_match
        else:
            print("Falling back to Firestore matches collection for next_match")

        db.collection('matches').document('next_match').set(next_match)
        print("Successfully updated 'matches/next_match'")

    except Exception as e:
        print(f"Error in update_next_match: {e}")

def map_position(pos_text):
    pos_text = pos_text.lower()
    if 'goleiro' in pos_text:
        return 'Goleiros', 'G'
    elif 'zagueiro' in pos_text or 'lateral' in pos_text or 'defensor' in pos_text:
        return 'Defensores', 'D'
    elif 'meia' in pos_text or 'volante' in pos_text or 'medio' in pos_text:
        return 'Meio-Campistas', 'M'
    elif 'atacante' in pos_text or 'ponta' in pos_text or 'avançado' in pos_text:
        return 'Atacantes', 'A'
    return 'Desconhecido', '?'

def scrape_squad():
    url = "https://www.transfermarkt.com.br/botafogo-fr-rio-de-janeiro/startseite/verein/537"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print(f"Fetching squad from {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=20)
        if response.status_code != 200:
            print(f"Failed to fetch content: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table', class_='items')
        
        if not table:
            print("No table with class 'items' found.")
            return

        # NEW: Delete all existing players first to remove outdated ones
        print("Cleaning up old squad data...")
        docs = db.collection('squad').list_documents()
        del_batch = db.batch()
        for doc in docs:
            del_batch.delete(doc)
        del_batch.commit()
        print("Old squad cleared.")

        batch = db.batch()
        count = 0
        
        rows = table.find_all('tr', class_=['odd', 'even'])
        print(f"Found {len(rows)} player rows. Processing...")

        for i, row in enumerate(rows):
            cols = row.find_all('td')
            if not cols: continue

            # Restore missing parsing logic
            number_div = row.find('div', class_='rn_nummer')
            number = number_div.get_text().strip() if number_div else None
            if number == "-": number = None
            
            pos_cell = cols[1]
            inline_table = pos_cell.find('table', class_='inline-table')
            
            name = "Unknown"
            specific_pos = "Unknown"
            image_url = None
            
            if inline_table:
                img_tag = inline_table.find('img')
                if img_tag:
                    image_url = img_tag.get('data-src') or img_tag.get('src')
                    name = img_tag.get('title') or img_tag.get('alt')
                
                trs = inline_table.find_all('tr')
                if len(trs) > 1:
                    specific_pos = trs[1].get_text().strip()
            
            if name == "Unknown": continue

            group, pos_code = map_position(specific_pos)
            age = cols[2].get_text().strip() if len(cols) > 2 else ""
            if "(" in age: age = age.split("(")[0].strip()
            country = "Brasil"
            for col in cols:
                flags = col.find_all('img', class_='flaggenrahmen')
                if flags:
                    country = flags[0].get('title', 'Brasil')
                    break

            print(f"Scraped: {name} | Pos: {pos_code} | Country: {country}")

            player_id = name.lower().replace(' ', '-')
            
            player_doc = {
                "name": name,
                "group": group, 
                "position": pos_code, 
                "specific_position": specific_pos,
                "number": number,
                "age": age,
                "country": country,
                "image": image_url,
                "source": "transfermarkt",
                "updated_at": firestore.SERVER_TIMESTAMP
            }
            
            doc_ref = db.collection('squad').document(player_id)
            batch.set(doc_ref, player_doc)
            count += 1

        # MANUAL OVERRIDES (Players missing from Transfermarkt default page)
        arthur_cabral = {
            "name": "Arthur Cabral",
            "group": "Atacantes", 
            "position": "A", 
            "specific_position": "Centroavante",
            "number": "99",
            "age": "26",
            "country": "Brasil",
            "image": "https://img.a.transfermarkt.technology/portrait/medium/390638-1701333640.jpg?lm=1",
            "source": "manual",
            "updated_at": firestore.SERVER_TIMESTAMP
        }
        batch.set(db.collection('squad').document('arthur-cabral'), arthur_cabral)
        count += 1
        
        # Override Cristian Medina's number
        medina = db.collection('squad').document('cristian-medina').get()
        if medina.exists:
             medina_data = medina.to_dict()
             medina_data['number'] = "5"
             batch.set(db.collection('squad').document('cristian-medina'), medina_data)

        batch.commit()
        
        # Update metadata for next run
        db.collection('config').document('scraper_state').set({
            "last_squad_update": firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        print(f"Successfully updated {count} players.")

    except Exception as e:
        print(f"Error scraping squad: {e}")

def should_update_squad():
    doc = db.collection('config').document('scraper_state').get()
    if not doc.exists: return True
    
    last_update = doc.to_dict().get('last_squad_update')
    if not last_update: return True
    
    # last_update is a datetime object
    now = datetime.now(timezone.utc)
    delta = now - last_update
    return delta.total_seconds() > 82800 # 23 hours (giving a 1h buffer)
    
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

def generate_daily_briefing(force=False):
    print("Checking Daily Briefing status...")
    
    # 1. Check if briefing for today already exists
    today_utc = datetime.now(timezone.utc)
    today_brt = today_utc - timedelta(hours=3)
    current_hour = today_brt.hour
    
    # Define Slots
    briefing_slot = None
    slot_label = ""
    
    if current_hour >= 7 and current_hour < 11:
        briefing_slot = "07h"
        slot_label = "Edição da Manhã"
    elif current_hour >= 18 and current_hour < 22:
        briefing_slot = "18h"
        slot_label = "Edição da Tarde/Noite"
    elif current_hour >= 22 or current_hour < 2: # 22h - 02h (Night/Next Day Start)
        briefing_slot = "24h"
        slot_label = "Edição de Fechamento"
    
    if not force and not briefing_slot:
        print(f"Current time ({today_brt.strftime('%H:%M')} BRT) does not match any briefing slot (07h, 18h, 24h). Skipping.")
        return

    today_str = today_brt.strftime('%Y-%m-%d')
    # Use specific ID for each slot to allow multiple per day
    doc_id = f"{today_str}_{briefing_slot}" if briefing_slot else f"{today_str}_forced"
    
    doc_ref = db.collection('daily_briefings').document(doc_id)
    
    existing_doc = doc_ref.get()
    if existing_doc.exists and not force:
        data = existing_doc.to_dict()
        if data and data.get('editorial_summary') and len(data.get('editorial_summary')) > 10:
            print(f"Briefing for {doc_id} already exists and is valid. Skipping.")
            return
        else:
            print(f"Briefing for {doc_id} exists but seems invalid/empty. Regenerating...")

    # 2. Fetch news from the last 24 hours (for context)
    dashboard_time = datetime.now(timezone.utc) - timedelta(days=1)
    
    docs = db.collection('news').where('created_at', '>=', dashboard_time).get()
    
    if len(docs) < 3:
        print("Not enough news to generate a briefing (need at least 3).")
        return

    print(f"Generating ({slot_label or 'Forced'}) from {len(docs)} articles...")
    
    # 3. Prepare input for AI
    articles_text = ""
    articles_map = {}
    
    for i, d in enumerate(docs):
        data = d.to_dict()
        data['_firestore_id'] = d.id 
        article_id = i 
        articles_map[article_id] = data
        articles_text += f"[ID {article_id}] {data.get('title')}: {data.get('summary', [''])[0]}\n"

    # Fetch next match dynamic info
    try:
        match_snap = db.collection('matches').document('next_match').get()
        if match_snap.exists:
            m_data = match_snap.to_dict()
            home_team = m_data.get('home_team', 'Botafogo')
            away_team = m_data.get('away_team', 'Adversário')
            display_time = m_data.get('display_time', 'A definir')
            championship = m_data.get('championship', 'Campeonato')
            stadium = m_data.get('location', 'Indefinido')
            transmission = m_data.get('transmission', 'A definir')
            
            next_match_str = f"{display_time} vs {away_team if home_team == 'Botafogo' else home_team}"
            context_match = f"- Próximo Jogo: {home_team} vs {away_team}, {display_time}.\n    - Competição: {championship}.\n    - Local: {stadium}.\n    - Transmissão (Onde Assistir): {transmission}."
        else:
            next_match_str = "A definir"
            context_match = "- Próximo Jogo: A definir"
            stadium = "A definir"
            transmission = "A definir"
    except Exception as e:
        print(f"Error fetching next match for briefing context: {e}")
        next_match_str = "A definir"
        context_match = "- Próximo Jogo: A definir"
        stadium = "A definir"
        transmission = "A definir"

    # 4. Prompt AI
    prompt = f"""
    Atue como Editor-Chefe de Conteúdo Esportivo Premium do Botafogo.
    Sua especialidade é curadoria de notícias, leitura estratégica e comunicação direta para assinantes exigentes.
    
    Gere um "Daily Premium" com base exclusivamente nas notícias fornecidas, seguindo rigorosamente estas diretrizes:
    
    Horário: {slot_label} ({briefing_slot})
    Clube: Botafogo
    Data: {today_str}

    OBJETIVO:
    Entregar um resumo objetivo, criativo, direto e de alto padrão, sem excesso de opinião, sem sensacionalismo e sem repetição.
    
    CONTEXTO OBRIGATÓRIO (Use para Próximo Jogo/Indicadores):
    {context_match}

    INSTRUÇÃO ESPECIAL PARA O PRÓXIMO JOGO:
    - Se encontrar notícias sobre um jogo MAIS PRÓXIMO ou MAIS RELEVANTE de qualquer competição (Libertadores, Brasileirão, Carioca, Copa do Brasil, etc.), PRIORIZE os dados das notícias para os campos "next_match", "location" e "transmission".
    - Mantenha o formato exato: "{next_match_str}"

    ESTRUTURA DE SAÍDA (JSON):
    Você deve retornar um JSON com os campos abaixo. 
    
    1. "editorial_summary": Combine as seções "Abertura", "Destaques do Dia" e "Radar Rápido" em um único texto formatado com Markdown.
       - Abertura: 🎯 Uma frase forte que contextualize o momento.
       - Destaques: ⭐ Liste 2-3 pontos de alto impacto (use bullets).
       - Radar: 📊 Um dado ou curiosidade tática breve.
       (Mantenha tudo isso concatenado no campo 'editorial_summary', use quebras de linha \\n).
       (Se houver informações sobre jogos da Libertadores ou Brasileirão nas notícias, inclua-as no Radar ou Destaques).

    2. "indicators": Preencha com os dados do próximo jogo e os indicadores rápidos.
        - next_match: "{next_match_str}"
        - location: "{stadium}"
        - transmission: "{transmission}" 
       - dm: APENAS lesões, tratamentos, cirurgias e recuperações médicas; use "Sem novidades" quando não houver informação médica
       - discipline: Suspensões, cartões amarelos/vermelhos, expulsões e disponibilidade após cumprir suspensão; use "Sem novidades" quando não houver
       - market: Status rápido de transferências
       - additional_info: Outra informação objetiva relevante que não pertença aos campos anteriores; use "Sem novidades" quando não houver

       REGRA DE CLASSIFICAÇÃO: nunca coloque cartões, suspensões ou expulsões em "dm". Esses assuntos pertencem exclusivamente a "discipline".

    3. "top_stories": Selecione as 3 manchetes mais essenciais (Manchetes Essenciais).
       - rank, source_id (baseado na lista abaixo), title (curto e objetivo), category.

    DIRETRIZES DO TEXTO:
    - Linguagem moderna, clara e confiante.
    - Frases curtas.
    - Sem clichês.
    - Tom profissional e envolvente.

    Notícias Disponíveis:
    {articles_text[:12000]} 

    Retorne APENAS um JSON válido:
    {{
        "date": "{today_str}",
        "edition": "{briefing_slot}",
        "editorial_summary": "🎯 [Abertura]\\n\\n⭐ [Destaque 1]\\n⭐ [Destaque 2]\\n\\n📊 [Radar]",
        "reading_time": "~1 min",
        "indicators": {{ "next_match": "...", "location": "...", "transmission": "...", "dm": "...", "discipline": "...", "market": "...", "additional_info": "..." }},
        "top_stories": [
             {{ "rank": 1, "source_id": 0, "title": "...", "category": "..." }},
             {{ "rank": 2, "source_id": 1, "title": "...", "category": "..." }},
             {{ "rank": 3, "source_id": 2, "title": "...", "category": "..." }}
        ]
    }}
    """

    
    global quota_exhausted
    if quota_exhausted:
         print("Skipping Daily Briefing generation: Quota exhausted.")
         return

    try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                if not model: raise Exception("Gemini model not initialized")

                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                break # Success
            except Exception as e:
                if attempt == max_retries - 1: raise e
                
                print(f"Gemini API (Briefing) connection failed (Attempt {attempt+1}/{max_retries}). Error: {e}")
                
                error_str = str(e).lower()
                if "429" in error_str or "quota" in error_str or "resource exhausted" in error_str:
                     print("CRITICAL: Quota exceeded during briefing. Turning off AI features.")
                     quota_exhausted = True
                     break
                
                if not check_connectivity():
                     print("Network check failed: Internet seems to be down.")
                
                print("Retrying in 5s...")
                time.sleep(5)
        
        if quota_exhausted:
             return
        
        content = response.text
        briefing_data = json.loads(content)
        
        # 5. Enrich with REAL images from source
        if 'top_stories' in briefing_data:
            for story in briefing_data['top_stories']:
                src_id = story.get('source_id')
                if src_id is not None and int(src_id) in articles_map:
                    # Assign the real image from the original article
                    source_data = articles_map[int(src_id)]
                    story['image'] = source_data.get('image')
                    story['id'] = source_data.get('_firestore_id') # Assign Real Firestore ID
                else:
                    # Fallback if AI hallucinates an ID or leaves it null
                    story['image'] = None # Frontend handles placeholder
                    story['id'] = None

        
        # Validate structure
        if 'top_stories' in briefing_data and len(briefing_data['top_stories']) >= 3:
             # Save to Firestore
             briefing_data['created_at'] = firestore.SERVER_TIMESTAMP
             
             # Add formatted timestamp (BRT)
             now_brt = datetime.now(timezone.utc) - timedelta(hours=3)
             briefing_data['generated_at_formatted'] = now_brt.strftime('%d/%m às %H:%M')
             
             doc_ref.set(briefing_data)
             print(f"Daily Briefing for {today_str} saved successfully! (Timestamp: {briefing_data['generated_at_formatted']})")
             
             # Notify? existing logic handles per-news, this is a daily aggregate.
             # Maybe send a special push? "Resumo do Dia disponível!" (Future)
        
    except Exception as e:
        print(f"Error generating daily briefing: {e}")

    
# Check if running in GitHub Actions (or any cloud "single run" environment)
# Check if running in GitHub Actions OR explicitly requested Single Run
if __name__ == "__main__":
    if os.getenv("GITHUB_ACTIONS") == "true" or os.getenv("SINGLE_RUN") == "true":
        print(f"Running in Single Execution Mode (Source: {'GitHub Actions' if os.getenv('GITHUB_ACTIONS') == 'true' else 'Scheduler/Env'})...")
        update_schedule_results() # Fetch & write match results into schedule.ts
        update_next_match()
        fetch_brasileirao() # Fetch Brasileirão Table
        fetch_table() # Fetch Carioca Table
        fetch_youtube_videos()
        fetch_podcasts(db) # Fetch Podcasts
        monitor_sources()
        generate_daily_briefing() # Check/Gen Briefing
        
        if should_update_squad():
            print("Updating Squad (24h period reached)...")
            scrape_squad()
        else:
            print("Skipping Squad update (already updated today).")
            
        # Run cleanup
        cleanup_old_news(db)

        print("Scraping finished. Exiting.")
    else:
        # Local Loop Mode
        print("Starting continuous monitoring... (Interval: 22 minutes)")
        update_next_match() # Initial run
        
        while True:
            try:
                print("--- Starting Cycle ---")
                fetch_brasileirao()
                fetch_youtube_videos()
                monitor_sources()
                generate_daily_briefing()
                
                if should_update_squad():
                    scrape_squad()
                    
                # Run cleanup
                cleanup_old_news(db)
                
                print("Cycle finished. Sleeping for 22 minutes...")
                time.sleep(1320) # 22 minutes
            except Exception as e:
                print(f"Error in main loop: {e}")
                time.sleep(60) # Wait 1 min on error before retry
