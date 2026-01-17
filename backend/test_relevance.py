from scraper import is_relevant, scrape_news

def test_is_relevant():
    print("Testing is_relevant()...")
    
    # Positive Cases
    assert is_relevant("Botafogo vence o Fla", "O alvinegro jogou muito bem no Nilton Santos.")
    assert is_relevant("John Textor anuncia reforço", "Eagle Football trouxe mais um.")
    assert is_relevant("Novo técnico do Glorioso", "Artur Jorge chega hoje.")
    print("  [PASS] Positive cases")

    # Negative Cases
    assert not is_relevant("Verstappen pole position", "Fórmula 1 em Interlagos foi emocionante.")
    assert not is_relevant("Medina vai pra final", "WSL em Saquarema.")
    assert not is_relevant("Flamengo campeão", "O rubro-negro venceu.") # Might fail if 'fogo' is in 'Botafogo' but strict check? 'fogo' is in list.
    # Wait, 'fogo' is a keyword. If text has 'fogo', it passes. 
    # But usually unrelated news wont have 'fogo' unless 'fogo de chao' etc.
    # The user complained about F1 and WSL.
    print("  [PASS] Negative cases")

    print("\nAll is_relevant tests passed!")

if __name__ == "__main__":
    test_is_relevant()
