import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables (for Service Account)
load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(script_dir, "service-account-new.json")
             
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase with {cred_path}: {e}")
        # Try fallback
        try:
             cred_path_fallback = os.path.join(script_dir, "service-account.json")
             cred = credentials.Certificate(cred_path_fallback)
             firebase_admin.initialize_app(cred)
        except Exception as e2:
             print(f"Fallback failed: {e2}")
             exit(1)

db = firestore.client()

def seed_matches():
    # Logo Mapping (High Quality URLs)
    logos = {
        "Botafogo": "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",
        "Portuguesa-RJ": "/logos/portuguesa-rj.png", # Local user provided file
        "Sampaio Corrêa-RJ": "/logos/sampaio-correa-rj.png", # Local user provided file
        "Volta Redonda": "/logos/volta-redonda.png", # Local user provided file
        "Bangu": "/logos/bangu.png", # Local user provided file
        "Cruzeiro": "/logos/cruzeiro.png", # Local user provided file
        "Fluminense": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Fluminense_FC_escudo.png",
        "Grêmio": "/logos/gremio.png", # Local user provided file
        "Vasco": "/logos/vasco.png", # Local user provided file
        "Nacional Potosí": "/logos/nacional-potosi.png", # Local user provided file
        "Vitória": "/logos/vitoria.png", # Local user provided file
        "Athletico-PR": "/logos/athletico-pr.png", # Local user provided file
        "Flamengo": "/logos/flamengo.png", # Local user provided file
        "Palmeiras": "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
        "Bragantino": "/logos/bragantino.png", # Local user provided file
        "Mirassol": "/logos/mirassol.png", # Local user provided file
        "Coritiba": "/logos/coritiba.png", # Local user provided file
        "Chapecoense": "/logos/chapecoense.png", # Local user provided file
        "Internacional": "/logos/internacional.png", # Local user provided file
        "Remo": "/logos/remo.png", # Local user provided file
        "Atlético-MG": "https://upload.wikimedia.org/wikipedia/commons/2/27/Clube_Atlético_Mineiro_logo.svg",
        "Corinthians": "/logos/corinthians.png", # Local user provided file
        "São Paulo": "/logos/sao-paulo.png", # Local user provided file
        "Bahia": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Esporte_Clube_Bahia_logo.svg",
        "Santos": "https://upload.wikimedia.org/wikipedia/commons/1/15/Santos_Logo.png"
    }

    def get_logo(team):
         return logos.get(team, "https://via.placeholder.com/64?text=" + team[:3])

    # Initial known matches list
    matches = [
        # JANEIRO 2026
        { "date": "2026-01-15T19:00:00", "championship": "Campeonato Carioca", "location": "Luso-Brasileiro", "home_team": "Portuguesa-RJ", "away_team": "Botafogo", "round": "Rodada 1" },
        { "date": "2026-01-18T20:30:00", "championship": "Campeonato Carioca", "location": "Lourivaldão", "home_team": "Sampaio Corrêa-RJ", "away_team": "Botafogo", "round": "Rodada 2" },
        { "date": "2026-01-21T19:00:00", "championship": "Campeonato Carioca", "location": "Nilton Santos", "home_team": "Botafogo", "away_team": "Volta Redonda", "round": "Rodada 3" },
        { "date": "2026-01-24T21:00:00", "championship": "Campeonato Carioca", "location": "Nilton Santos", "home_team": "Botafogo", "away_team": "Bangu", "round": "Rodada 4" },
        { "date": "2026-01-28T16:00:00", "championship": "Brasileirão 2026", "location": "A definir", "home_team": "Botafogo", "away_team": "Cruzeiro", "round": "Rodada 1" },
        # FEVEREIRO 2026
        { "date": "2026-02-01T20:30:00-03:00", "championship": "Campeonato Carioca", "location": "Nilton Santos", "home_team": "Botafogo", "away_team": "Fluminense", "round": "Rodada 5", "status": "ENCERRADA", "home_score": 0, "away_score": 1, "display_time": "FIM DE JOGO" },
        { "date": "2026-02-04T21:30:00-03:00", "championship": "Brasileirão 2026", "location": "Arena do Grêmio", "home_team": "Grêmio", "away_team": "Botafogo", "round": "Rodada 2" },
        { "date": "2026-02-08T18:00:00-03:00", "championship": "Campeonato Carioca", "location": "São Januário", "home_team": "Vasco", "away_team": "Botafogo", "round": "Rodada 6" },
        { "date": "2026-02-12T19:30:00-03:00", "championship": "Brasileirão", "location": "Maracanã", "home_team": "Fluminense", "away_team": "Botafogo", "round": "Rodada 7" },
        { "date": "2026-02-18T21:30:00-03:00", "championship": "Libertadores", "location": "Víctor Ugarte", "home_team": "Nacional Potosí", "away_team": "Botafogo", "round": "Fase Preliminar" },
        { "date": "2026-02-25T21:30:00-03:00", "championship": "Libertadores", "location": "Nilton Santos", "home_team": "Botafogo", "away_team": "Nacional Potosí", "round": "Fase Preliminar" },
        # MARÇO 2026
        { "date": "2026-03-11T16:00:00", "championship": "Brasileirão 2026", "location": "Ligga Arena", "home_team": "Athletico-PR", "away_team": "Botafogo", "round": "Rodada 5" },
        { "date": "2026-03-14T16:00:00", "championship": "Brasileirão 2026", "location": "Nilton Santos", "home_team": "Botafogo", "away_team": "Flamengo", "round": "Rodada 6" },
        { "date": "2026-03-18T16:00:00", "championship": "Brasileirão 2026", "location": "Allianz Parque", "home_team": "Palmeiras", "away_team": "Botafogo", "round": "Rodada 7" },
        { "date": "2026-03-22T16:00:00", "championship": "Brasileirão 2026", "location": "Nabi Abi Chedid", "home_team": "Bragantino", "away_team": "Botafogo", "round": "Rodada 8" }
    ]
    
    # Text block provided by user for remaining matches
    raw_text = """
01/04
Campeonato BrasileiroRodada 9

Botafogo

Mirassol
05/04
Campeonato BrasileiroRodada 10

Vasco

Botafogo
12/04
Campeonato BrasileiroRodada 11

Botafogo

Coritiba
19/04
Campeonato BrasileiroRodada 12

Chapecoense

Botafogo
26/04
Campeonato BrasileiroRodada 13

Botafogo

Internacional
03/05
Campeonato BrasileiroRodada 14

Botafogo

Remo
10/05
Campeonato BrasileiroRodada 15

Atlético-MG

Botafogo
17/05
Campeonato BrasileiroRodada 16

Botafogo

Corinthians
24/05
Campeonato BrasileiroRodada 17

São Paulo

Botafogo
31/05
Campeonato BrasileiroRodada 18

Bahia

Botafogo
22/07
Campeonato BrasileiroRodada 19

Botafogo

Santos
26/07
Campeonato BrasileiroRodada 20

Cruzeiro

Botafogo
29/07
Campeonato BrasileiroRodada 21

Botafogo

Grêmio
09/08
Campeonato BrasileiroRodada 22

Botafogo

Fluminense
16/08
Campeonato BrasileiroRodada 23

Vitória

Botafogo
23/08
Campeonato BrasileiroRodada 24

Botafogo

Athletico-PR
30/08
Campeonato BrasileiroRodada 25

Flamengo

Botafogo
06/09
Campeonato BrasileiroRodada 26

Botafogo

Palmeiras
13/09
Campeonato BrasileiroRodada 27

Botafogo

Bragantino
20/09
Campeonato BrasileiroRodada 28

Mirassol

Botafogo
07/10
Campeonato BrasileiroRodada 29

Botafogo

Vasco
11/10
Campeonato BrasileiroRodada 30

Coritiba

Botafogo
18/10
Campeonato BrasileiroRodada 31

Botafogo

Chapecoense
25/10
Campeonato BrasileiroRodada 32

Internacional

Botafogo
28/10
Campeonato BrasileiroRodada 33

Remo

Botafogo
04/11
Campeonato BrasileiroRodada 34

Botafogo

Atlético-MG
18/11
Campeonato BrasileiroRodada 35

Corinthians

Botafogo
22/11
Campeonato BrasileiroRodada 36

Botafogo

São Paulo
29/11
Campeonato BrasileiroRodada 37

Botafogo

Bahia
02/12
Campeonato BrasileiroRodada 38

Santos

Botafogo
"""
    
    lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
    i = 0
    while i < len(lines):
        try:
            date_line = lines[i]
            champ_line = lines[i+1]
            team1 = lines[i+2]
            team2 = lines[i+3]
            
            day, month = date_line.split('/')
            year = "2026"
            iso_date = f"{year}-{month}-{day}T16:00:00"
            
            if 'Rodada' in champ_line:
                c_name, c_round = champ_line.split('Rodada')
                championship = c_name.strip()
                round_name = f"Rodada{c_round}"
            else:
                championship = champ_line
                round_name = ""

            matches.append({
                "date": iso_date,
                "championship": championship,
                "location": "A definir",
                "home_team": team1,
                "away_team": team2,
                "round": round_name
            })
            i += 4
        except IndexError:
            break

    # Sort matches by date
    matches.sort(key=lambda x: x.get('date', ''))

    # Seeding
    print("Deleting old matches...")
    docs = db.collection('matches').list_documents()
    for doc in docs:
        doc.delete()

    print(f"Seeding {len(matches)} matches...")
    now_iso = "2026-02-03T00:00:00-03:00" # Approximate "now" for seeding logic
    next_match = None

    for m in matches:
        m['home_team_logo'] = get_logo(m['home_team'])
        m['away_team_logo'] = get_logo(m['away_team'])
        
        # Ensure status is set for finished games
        if m.get('home_score') is not None or m.get('away_score') is not None:
             m['status'] = "ENCERRADA"
             m['display_time'] = "FIM DE JOGO"
        else:
             m['status'] = m.get('status', "AGENDADO")
             
        # Add to collection
        db.collection('matches').add(m)
        print(f" > {m['home_team']} vs {m['away_team']} ({m['date']})")
        
        # Identify next match (first one after now_iso that isn't finished)
        if not next_match and m.get('status') == "AGENDADO" and m['date'] >= now_iso:
            next_match = m

    if next_match:
        print(f"Setting next_match document: {next_match['home_team']} vs {next_match['away_team']}")
        db.collection('matches').document('next_match').set(next_match)
    else:
        print("Warning: No upcoming next_match found!")
        
    print("Seed complete!")

if __name__ == "__main__":
    seed_matches()
