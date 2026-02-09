import os

def find_standings_in_source():
    source_path = "full_page_source.txt"
    if not os.path.exists(source_path):
        print("Source file missing")
        return

    with open(source_path, "r", encoding="utf-8") as f:
        text = f.read()
    
    search_term = '"nome_popular":"Fluminense"'
    pos = text.find(search_term)
    matches_found = 0
    while pos != -1:
        # Grab a large context
        context = text[max(0, pos-2000):pos+8000]
        if '"pontos"' in context and '"jogos"' in context:
            matches_found += 1
            filename = f"standings_context_{pos}.txt"
            with open(filename, "w", encoding="utf-8") as out:
                out.write(context)
            print(f"SUCCESS: Saved {filename}")
        
        pos = text.find(search_term, pos + 1)
        if pos == -1 or matches_found > 10: break

    if matches_found == 0:
        print("No matches with points/jogos found.")

if __name__ == "__main__":
    find_standings_in_source()
