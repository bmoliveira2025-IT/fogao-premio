import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase (Prioritizing correct new credentials)
if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
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
      {"name":"Léo Linck","position":"Goleiro","number":"24","country":"BRA","age":"24","image":"https://img.a.transfermarkt.technology/portrait/medium/742034-1725390828.jpg?lm=1"},
      {"name":"Neto","position":"Goleiro","number":"22","country":"BRA","age":"36","image":"https://img.a.transfermarkt.technology/portrait/medium/111819-1725051877.jpg?lm=1"},
      {"name":"Cristhian Loor","position":"Goleiro","number":"40","country":"ECU","age":"19","image":"https://img.a.transfermarkt.technology/portrait/medium/1074501-1739213776.png?lm=1"},
      {"name":"Raul","position":"Goleiro","number":"1","country":"BRA","age":"28","image":"https://img.a.transfermarkt.technology/portrait/medium/520093-1660833546.jpg?lm=1"},
      {"name":"Alexander Barboza","position":"Zagueiro","number":"20","country":"ARG","age":"30","image":"https://img.a.transfermarkt.technology/portrait/medium/379752-1680009523.jpg?lm=1"},
      {"name":"Kaio","position":"Zagueiro","number":"31","country":"BRA","age":"30","image":"https://img.a.transfermarkt.technology/portrait/medium/523363-1721724314.png?lm=1"},
      {"name":"Bastos","position":"Zagueiro","number":"15","country":"ANG","age":"34","image":"https://img.a.transfermarkt.technology/portrait/medium/195810-1633193060.png?lm=1"},
      {"name":"Ythallo","position":"Zagueiro","number":"3","country":"BRA","age":"21","image":"https://img.a.transfermarkt.technology/portrait/medium/default.jpg?lm=1"},
      {"name":"Alex Telles","position":"Lateral Esq.","number":"13","country":"BRA","age":"33","image":"https://img.a.transfermarkt.technology/portrait/medium/255755-1659559306.jpg?lm=1"},
      {"name":"Marçal","position":"Lateral Esq.","number":"21","country":"BRA","age":"37","image":"https://img.a.transfermarkt.technology/portrait/medium/137745-1682960861.jpg?lm=1"},
      {"name":"Jhoan Hernández","position":"Lateral Esq.","number":"67","country":"COL","age":"20","image":"https://img.a.transfermarkt.technology/portrait/medium/1112486-1712101124.JPG?lm=1"},
      {"name":"Vitinho","position":"Lateral Dir.","number":"2","country":"BRA","age":"26","image":"https://img.a.transfermarkt.technology/portrait/medium/468249-1626767682.jpg?lm=1"},
      {"name":"Mateo Ponte","position":"Lateral Dir.","number":"4","country":"URU","age":"22","image":"https://img.a.transfermarkt.technology/portrait/medium/856047-1676634597.jpg?lm=1"},
      {"name":"Danilo","position":"Volante","number":"8","country":"BRA","age":"24","image":"https://img.a.transfermarkt.technology/portrait/medium/808509-1694614735.jpg?lm=1"},
      {"name":"Newton","position":"Volante","number":"28","country":"BRA","age":"25","image":"https://img.a.transfermarkt.technology/portrait/medium/811219-1716603349.jpg?lm=1"},
      {"name":"Allan","position":"Volante","number":"25","country":"BRA","age":"35","image":"https://img.a.transfermarkt.technology/portrait/medium/126422-1448529525.jpg?lm=1"},
      {"name":"Wallace Davi","position":"Volante","number":"55","country":"BRA","age":"18","image":"https://img.a.transfermarkt.technology/portrait/medium/1279908-1766773174.png?lm=1"},
      {"name":"Cristian Medina","position":"Meia Central","number":"-","country":"ARG","age":"23","image":"https://img.a.transfermarkt.technology/portrait/medium/661133-1739827027.jpg?lm=1"},
      {"name":"Edenilson","position":"Meia Central","number":"88","country":"BRA","age":"36","image":"https://img.a.transfermarkt.technology/portrait/medium/169052-1662689029.jpg?lm=1"},
      {"name":"Santiago Rodríguez","position":"Meia Ofensivo","number":"23","country":"URU","age":"26","image":"https://img.a.transfermarkt.technology/portrait/medium/465819-1710583524.jpg?lm=1"},
      {"name":"Jordan Barrera","position":"Meia Ofensivo","number":"14","country":"COL","age":"19","image":"https://img.a.transfermarkt.technology/portrait/medium/1087334-1748210461.jpg?lm=1"},
      {"name":"Álvaro Montoro","position":"Ponta Esquerda","number":"10","country":"ARG","age":"18","image":"https://img.a.transfermarkt.technology/portrait/medium/1228194-1720648057.jpg?lm=1"},
      {"name":"Matheus Martins","position":"Ponta Esquerda","number":"11","country":"BRA","age":"22","image":"https://img.a.transfermarkt.technology/portrait/medium/668228-1671029844.jpg?lm=1"},
      {"name":"Artur","position":"Ponta Direita","number":"7","country":"BRA","age":"28","image":"https://img.a.transfermarkt.technology/portrait/medium/440658-1759774159.jpg?lm=1"},
      {"name":"Nathan Fernandes","position":"Ponta Direita","number":"16","country":"BRA","age":"21","image":"https://img.a.transfermarkt.technology/portrait/medium/1083600-1708125134.jpg?lm=1"},
      {"name":"Lucas Villalba","position":"Ponta Direita","number":"77","country":"URU","age":"24","image":"https://img.a.transfermarkt.technology/portrait/medium/874844-1724301713.jpg?lm=1"},
      {"name":"Joaquín Correa","position":"Seg. Atacante","number":"30","country":"ARG","age":"31","image":"https://img.a.transfermarkt.technology/portrait/medium/227081-1724826843.jpg?lm=1"},
      {"name":"Arthur Cabral","position":"Atacante","number":"19","country":"BRA","age":"27","image":"https://img.a.transfermarkt.technology/portrait/medium/390638-1701333640.jpg?lm=1"},
      {"name":"Chris Ramos","position":"Atacante","number":"9","country":"ESP","age":"29","image":"https://img.a.transfermarkt.technology/portrait/medium/538810-1681583076.jpg?lm=1"},
      {"name":"Kadir Barría","position":"Atacante","number":"37","country":"PAN","age":"18","image":"https://img.a.transfermarkt.technology/portrait/medium/1464878-1763605872.jpg?lm=1"}
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
            "country": rp.get('country', 'BRA'),
            "age": rp.get('age', '25'),
            "number": rp.get('number')
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
