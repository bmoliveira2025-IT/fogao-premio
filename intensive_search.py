import re
import json

def intensive_search():
    try:
        with open("full_page_source.txt", "r", encoding="utf-8") as f:
            text = f.read()

        # Botafogo is often escaped as "Botafogo" or in unicode
        targets = ["Botafogo", "BOTAFOGO", "botafogo"]
        
        for target in targets:
            matches = list(re.finditer(re.escape(target), text))
            print(f"Found '{target}' {len(matches)} times.")
            for match in matches:
                start = match.start()
                # Grab context
                context = text[max(0, start-1000):start+1000]
                if '"pontos"' in context or '"vitorias"' in context or '"wins"' in context:
                    print(f"  POTENTIAL MATCH at {start}!")
                    # Try to see if this is within a script
                    script_start = text.rfind('<script', 0, start)
                    if script_start != -1:
                        script_end = text.find('</script>', script_start)
                        if script_end > start:
                            print(f"  MATCH IS IN SCRIPT {script_start}")
                            with open(f"script_match_{script_start}.js", "w", encoding="utf-8") as out:
                                out.write(text[script_start:script_end+9])
                            print(f"  Saved to script_match_{script_start}.js")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    intensive_search()
