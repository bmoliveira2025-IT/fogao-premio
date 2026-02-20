import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase (Prioritizing correct new credentials)
if not firebase_admin._apps:
    cred_path = "service-account-new.json"
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase with {cred_path}: {e}")
        # Try fallback
        try:
             cred = credentials.Certificate("service-account.json")
             firebase_admin.initialize_app(cred)
        except Exception as e2:
             print(f"Fallback failed: {e2}")
             exit(1)

db = firestore.client()

def seed_squad():
    print("Seeding squad...")
    
    # Botafogo Squad Data (Scraped from Transfermarkt 2026)
    raw_players = [
      {"name":"Léo Linck","position":"Goleiro","image":"https://img.a.transfermarkt.technology/portrait/medium/742034-1725390828.jpg?lm=1"},
      {"name":"Neto","position":"Goleiro","image":"https://img.a.transfermarkt.technology/portrait/medium/111819-1725051877.jpg?lm=1"},
      {"name":"Cristhian Loor","position":"Goleiro","image":"https://img.a.transfermarkt.technology/portrait/medium/1074501-1739213776.png?lm=1"},
      {"name":"Raul","position":"Goleiro","image":"https://img.a.transfermarkt.technology/portrait/medium/520093-1660833546.jpg?lm=1"},
      {"name":"David Ricardo","position":"Zagueiro","image":"https://img.a.transfermarkt.technology/portrait/medium/985172-1674750485.jpg?lm=1"},
      {"name":"Alexander Barboza","position":"Zagueiro","image":"https://img.a.transfermarkt.technology/portrait/medium/379752-1680009523.jpg?lm=1"},
      {"name":"Kaio","position":"Zagueiro","image":"https://img.a.transfermarkt.technology/portrait/medium/523363-1721724314.png?lm=1"},
      {"name":"Bastos","position":"Zagueiro","image":"https://img.a.transfermarkt.technology/portrait/medium/195810-1633193060.png?lm=1"},
      {"name":"Kawan","position":"Zagueiro","image":"https://img.a.transfermarkt.technology/portrait/medium/996691-1747446491.jpg?lm=1"},
      {"name":"Ythallo","position":"Zagueiro","image":"/players/ythallo.png"},
      {"name":"Alex Telles","position":"Lateral Esq.","image":"https://img.a.transfermarkt.technology/portrait/medium/255755-1659559306.jpg?lm=1"},
      {"name":"Marçal","position":"Lateral Esq.","image":"https://img.a.transfermarkt.technology/portrait/medium/137745-1682960861.jpg?lm=1"},
      {"name":"Vitinho","position":"Lateral Dir.","image":"https://img.a.transfermarkt.technology/portrait/medium/468249-1626767682.jpg?lm=1"},
      {"name":"Mateo Ponte","position":"Lateral Dir.","image":"https://img.a.transfermarkt.technology/portrait/medium/856047-1676634597.jpg?lm=1"},
      {"name":"Danilo","position":"Volante","image":"https://img.a.transfermarkt.technology/portrait/medium/808509-1694614735.jpg?lm=1"},
      {"name":"Newton","position":"Volante","image":"https://img.a.transfermarkt.technology/portrait/medium/811219-1716603349.jpg?lm=1"},
      {"name":"Allan","position":"Volante","image":"https://img.a.transfermarkt.technology/portrait/medium/126422-1448529525.jpg?lm=1"},
      {"name":"Álvaro Montoro","position":"Meia Ofensivo","image":"https://img.a.transfermarkt.technology/portrait/medium/1228194-1720648057.jpg?lm=1"},
      {"name":"Santiago Rodríguez","position":"Meia Ofensivo","image":"https://img.a.transfermarkt.technology/portrait/medium/465819-1710583524.jpg?lm=1"},
      {"name":"Jordan Barrera","position":"Meia Ofensivo","image":"https://img.a.transfermarkt.technology/portrait/medium/1087334-1748210461.jpg?lm=1"},
      {"name":"Kauan Lindes","position":"Meia Ofensivo","image":"https://img.a.transfermarkt.technology/portrait/medium/1222625-1739971195.jpg?lm=1"},
      {"name":"Matheus Martins","position":"Ponta Esquerda","image":"https://img.a.transfermarkt.technology/portrait/medium/668228-1671029844.jpg?lm=1"},
      {"name":"Jeffinho","position":"Ponta Esquerda","image":"https://img.a.transfermarkt.technology/portrait/medium/884072-1668287183.jpg?lm=1"},
      {"name":"Artur","position":"Ponta Direita","image":"https://img.a.transfermarkt.technology/portrait/medium/440658-1759774159.jpg?lm=1"},
      {"name":"Nathan Fernandes","position":"Ponta Direita","image":"https://img.a.transfermarkt.technology/portrait/medium/1083600-1708125134.jpg?lm=1"},
      {"name":"Lucas Villalba","position":"Ponta Direita","image":"https://img.a.transfermarkt.technology/portrait/medium/874844-1724301713.jpg?lm=1"},
      {"name":"Joaquín Correa","position":"Seg. Atacante","image":"https://img.a.transfermarkt.technology/portrait/medium/227081-1724826843.jpg?lm=1"},
      {"name":"Arthur Cabral","position":"Centroavante","image":"https://img.a.transfermarkt.technology/portrait/medium/390638-1701333640.jpg?lm=1"},
      {"name":"Chris Ramos","position":"Centroavante","image":"https://img.a.transfermarkt.technology/portrait/medium/538810-1681583076.jpg?lm=1"},
      {"name":"Kadir Barría","position":"Centroavante","image":"https://img.a.transfermarkt.technology/portrait/medium/1464878-1763605872.jpg?lm=1"}
    ]

    players = []
    for rp in raw_players:
        # Mapping Logic
        pos_raw = rp['position']
        if 'Goleiro' in pos_raw:
            pos_code = 'G'
            group_name = 'Goleiros'
        elif 'Zagueiro' in pos_raw or 'Lateral' in pos_raw:
            pos_code = 'D'
            group_name = 'Defensores'
        elif 'Volante' in pos_raw or 'Meia' in pos_raw:
            pos_code = 'M'
            group_name = 'Meio-Campistas'
        else: # Ponta, Centroavante, Seg. Atacante
            pos_code = 'A'
            group_name = 'Atacantes'
            
        players.append({
            "name": rp['name'],
            "position": pos_code,
            "group": group_name,
            "image": rp['image'],
            "country": "BRA", # Defaulting to BRA for now
            "age": "25", # Default
            "number": None 
        })

    # Batch Write to prevent partial failures and optimize speed
    batch = db.batch()
    
    # Optional: Delete existing squad first? Or just overwrite/add?
    # Let's clean up first to avoid duplicates
    print("Cleaning old squad...")
    docs = db.collection('squad').list_documents()
    for doc in docs:
        batch.delete(doc)
    
    batch.commit()
    print("Old squad cleaned.")
    
    batch = db.batch()
    print(f"Adding {len(players)} players...")
    
    for player in players:
        doc_ref = db.collection('squad').document() # Auto-ID
        batch.set(doc_ref, player)
        
    batch.commit()
    print("Squad seeding complete!")

if __name__ == "__main__":
    seed_squad()
