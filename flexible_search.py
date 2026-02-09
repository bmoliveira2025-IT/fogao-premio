import re

def flexible_search():
    try:
        with open("full_page_source.txt", "r", encoding="utf-8") as f:
            text = f.read()

        # Search for "Taça Guanabara" with potential escaping
        # GE sometimes uses \u encoded characters
        search_terms = ["Taça Guanabara", "Ta\u00e7a Guanabara"]
        
        for term in search_terms:
            pos = 0
            while True:
                pos = text.find(term, pos)
                if pos == -1: break
                
                print(f"--- MATCH {term} at {pos} ---")
                # Look for 'grupos' within 2000 chars after the term
                context = text[pos:pos+5000]
                if "grupos" in context:
                    print("  'grupos' found in context!")
                    # Try to find a JSON block starting with { and ending with }
                    # that includes these keywords
                    pass
                pos += 1
                if pos > text.find(term) + 20000: break

        # Another strategy: look for "fases_navegacao"
        nav_pos = text.find('"fases_navegacao"')
        if nav_pos != -1:
            print(f"Found 'fases_navegacao' at {nav_pos}")
            print(text[nav_pos:nav_pos+2000])

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    flexible_search()
