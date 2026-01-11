import os
import json
import sys
import firebase_admin
from firebase_admin import credentials, firestore, messaging
from newspaper import Article
from groq import Groq
from dotenv import load_dotenv
import requests
import re
from bs4 import BeautifulSoup
import time
from datetime import datetime, timezone, timedelta
from cleanup import cleanup_old_news # Import cleanup logic

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


# Initialize Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
    
    try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.1-8b-instant",
                    response_format={"type": "json_object"}
                )
                break # Success, exit loop
            except Exception as e:
                if attempt == max_retries - 1: raise e # Re-raise if last attempt
                print(f"Groq API connection failed (Attempt {attempt+1}/{max_retries}). Retrying in 2s...")
                time.sleep(2)
    
        content = chat_completion.choices[0].message.content
        # Basic cleanup to attempt to fix common json issues from LLMs
        content = content.strip()
        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '')
        
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

def scrape_news(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        
        # Custom extraction for better image accuracy (prioritize og:image)
        soup = BeautifulSoup(article.html, 'html.parser')
        og_image = soup.find('meta', property='og:image')
        image = og_image['content'] if og_image and 'content' in og_image.attrs else article.top_image

        return {
            "title": article.title,
            "content": clean_text(article.text),
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
                og_image = soup.find('meta', property='og:image')
                if og_image:
                    image = og_image['content']
                
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
        "https://fogonarede.com.br/",
        # "https://www.espn.com.br/futebol/time/_/id/6086/botafogo" # Disabled by user request
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
                # Filter out the section page itself
                links = [l for l in links if l.strip('/') != source.strip('/')]

            # Strategy for Terra
            elif "terra.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) if '/esportes/' in a['href'] and ('botafogo' in a['href'] or 'futebol' in a['href'])][:5]
                # Fix relative URLs
                links = [f"https://www.terra.com.br{l}" if l.startswith('/') else l for l in links]
                # Filter out live feeds and section page
                links = [l for l in links if '/ao-vivo/' not in l and l.strip('/') != source.strip('/')]

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

            # Strategy for Fogo na Rede
            elif "fogonarede.com.br" in source:
                links = [a['href'] for a in soup.find_all('a', href=True) 
                        if ('/noticias-do-botafogo/' in a['href'] or '/coluna-do-editor/' in a['href'])
                        and '/category/' not in a['href']][:5]
                # Fix relative URLs
                links = [f"https://fogonarede.com.br{l}" if l.startswith('/') else l for l in links]

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
                elif "fogonarede.com.br" in link: source_name = "Fogo na Rede"
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
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch content: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table', class_='items')
        
        if not table:
            print("No table with class 'items' found.")
            return

        batch = db.batch()
        count = 0
        
        # We don't clear the whole collection to avoid flicker, 
        # but in this specific script's original logic it did. 
        # I'll keep the "update" logic but using batch for efficiency.
        
        rows = table.find_all('tr', class_=['odd', 'even'])
        print(f"Found {len(rows)} player rows. Processing...")

        for row in rows:
            cols = row.find_all('td')
            if not cols: continue
            
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
            if len(cols) > 3:
                flags = cols[3].find_all('img', class_='flaggenrahmen')
                if flags:
                    country = flags[0].get('title', 'Brasil')

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

def generate_daily_briefing():
    print("Checking Daily Briefing status...")
    
    # 1. Check if briefing for today already exists
    today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    doc_ref = db.collection('daily_briefings').document(today_str)
    
    if doc_ref.get().exists:
        print(f"Daily Briefing for {today_str} already exists. Skipping.")
        return

    # 2. Fetch news from the last 24 hours (Yesterday's cycle)
    # Actually, let's take everything from yesterday 00:00 to 23:59 local time roughly, or just last 24h
    dashboard_time = datetime.now(timezone.utc) - timedelta(days=1)
    
    docs = db.collection('news').where('created_at', '>=', dashboard_time).get()
    
    if len(docs) < 3:
        print("Not enough news to generate a briefing (need at least 3).")
        return

    print(f"Generating Briefing from {len(docs)} articles...")
    
    # 3. Prepare input for AI
    articles_text = ""
    # Create a lookup map for easy access later
    articles_map = {}
    
    for i, d in enumerate(docs):
        data = d.to_dict()
        data['_firestore_id'] = d.id # Store real ID
        # Use simple integer index as ID for the prompt context
        article_id = i 
        articles_map[article_id] = data
        articles_text += f"[ID {article_id}] {data.get('title')}: {data.get('summary', [''])[0]}\n"

    # 4. Prompt AI
    prompt = f"""
    Atue como Editor-Chefe do Fogão Prêmio.
    Analise as notícias abaixo (do dia anterior) e crie um "Resumo do Dia" (Daily Briefing) altamente curado.
    
    Sua missão é selecionar as TOP 5 histórias mais importantes e gerar um resumo executivo.

    Notícias Disponíveis (Use o ID para referência):
    {articles_text[:12000]} 

    Retorne APENAS um JSON válido com esta estrutura:
    {{
        "date": "{today_str}",
        "general_summary": "A rich, engaging editorial summary of the day's events (max 400 chars). Do NOT use markdown bold or asterisks.",
        "top_stories": [
            {{
                "rank": 1,
                "source_id": 0, // O ID da notícia original usada (inteiro)
                "title": "Manchete Curta e Impactante",
                "category": "Mercado/Jogo/Bastidores" 
            }},
            {{
                "rank": 2,
                "source_id": 1, // O ID da notícia original
                "title": "Manchete",
                "category": "Categoria"
            }},
            {{
                "rank": 3,
                "source_id": 2, // O ID da notícia original
                "title": "Manchete",
                "category": "Categoria"
            }}
        ]
    }}
    """
    
    try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.1-8b-instant",
                    response_format={"type": "json_object"}
                )
                break # Success
            except Exception as e:
                if attempt == max_retries - 1: raise e
                print(f"Groq API (Briefing) connection failed (Attempt {attempt+1}/{max_retries}). Retrying in 2s...")
                time.sleep(2)
        
        content = chat_completion.choices[0].message.content
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
             doc_ref.set(briefing_data)
             print(f"Daily Briefing for {today_str} saved successfully!")
             
             # Notify? existing logic handles per-news, this is a daily aggregate.
             # Maybe send a special push? "Resumo do Dia disponível!" (Future)
        
    except Exception as e:
        print(f"Error generating daily briefing: {e}")

    
# Check if running in GitHub Actions (or any cloud "single run" environment)
if os.getenv("GITHUB_ACTIONS") == "true":
    print("Running in Cloud Mode (Single Execution)...")
    update_next_match()
    fetch_youtube_videos()
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
