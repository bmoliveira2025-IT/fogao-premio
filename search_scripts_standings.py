import re

def search_scripts_for_standings():
    try:
        with open("full_page_source.txt", "r", encoding="utf-8") as f:
            text = f.read()

        scripts = re.findall(r'<script.*?>\s*(.*?)\s*</script>', text, re.DOTALL)
        print(f"Total scripts extracted: {len(scripts)}")
        
        for i, s in enumerate(scripts):
            if "Botafogo" in s and "pontos" in s:
                print(f"Script {i} matches Botafogo AND pontos!")
                with open(f"candidate_script_{i}.js", "w", encoding="utf-8") as out:
                    out.write(s)
            elif "Botafogo" in s and "classification" in s:
                print(f"Script {i} matches Botafogo AND classification!")
            elif "Botafogo" in s and "grupos" in s:
                print(f"Script {i} matches Botafogo AND grupos!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_scripts_for_standings()
