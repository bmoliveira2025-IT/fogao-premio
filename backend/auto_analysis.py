import json
import os
import random

def analyze_match_data(data):
    """
    Enriches the match data with analysis (MOTM, GK stats, Pass stats)
    if the match is finished and analysis is missing.
    Returns the modified data object (or the same if no changes).
    """
    # Only generate if finished
    # Note: 'FINALIZADO' or 'ENCERRADA' are common statuses
    status = data.get("status", "").upper()
    if status not in ["ENCERRADA", "FINALIZADO"]:
        print(f"Match status '{status}' is not finished. Skipping analysis.")
        return data

    if "motm_data" in data and "pass_stats" in data:
        # Analysis already exists
        return data

    print("Generating Post-Match Analysis...")

    # 1. Determine MOTM (Man of the Match)
    home_players = data.get("player_stats", {}).get("home", [])
    if home_players:
        # Sort by rating (descending)
        # Handle cases where rating might be None or missing
        sorted_players = sorted(
            [p for p in home_players if p.get("rating") is not None], 
            key=lambda x: float(x.get("rating", 0)), 
            reverse=True
        )
        
        if sorted_players:
            best_player = sorted_players[0]
            
            contribution_text = "Teve uma atuação sólida."
            goals = int(best_player.get("goals", 0))
            assists = int(best_player.get("assists", 0))
            rating = float(best_player.get("rating", 0))

            if goals > 0:
                contribution_text = f"Decisivo com {goals} gol(s)."
            elif assists > 0:
                contribution_text = f"O maestro do time com {assists} assistência(s)."
            elif rating > 8.0:
                contribution_text = "Dominou as ações e controlou o ritmo do jogo."

            data["motm_data"] = {
                "name": best_player.get("name", "Desconhecido"),
                "rating": rating,
                "position": best_player.get("position", "?"),
                "contribution": contribution_text
            }
    
    # 2. Generate GK Stats
    # Safely get nested keys
    stats = data.get("stats", {})
    shots_on_target = stats.get("shots_on_target", {})
    away_shots = int(shots_on_target.get("away", 0))
    away_score = int(data.get("away_score", 0))
    
    saves = max(0, away_shots - away_score) 
    
    # Correction: If shots < score (e.g. missing stats), assume shots = score + saves
    if away_shots < away_score:
        # If we have no shot data, assume at least equal to goals + some saves
        away_shots = away_score + 2
        saves = 2
    
    # Find home GK
    gk = next((p for p in home_players if p.get("position") == "GOL"), {"name": "Goleiro"})
    
    data["goalkeeper_stats"] = {
        "name": gk.get("name", "Goleiro"),
        "saves": saves,
        "saves_inside_box": max(0, saves - 1),
        "punched_clear": random.randint(0, 3),
        "high_claims": random.randint(1, 5),
        "clean_sheet": away_score == 0
    }

    # 3. Generate Pass Stats
    # Estimate based on possession
    possession = stats.get("possession", {})
    poss_home = int(possession.get("home", 50))
    
    base_passes_home = poss_home * 8 # approx 480 for 60%
    base_passes_away = (100 - poss_home) * 8
    
    corners = stats.get("corners", {})
    home_corners = int(corners.get("home", 0))
    away_corners = int(corners.get("away", 0))

    data["pass_stats"] = {
        "accurate_passes": {
            "home": int(base_passes_home * 0.9), "away": int(base_passes_away * 0.85),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "sideways_passes": {
            "home": int(base_passes_home * 0.3), "away": int(base_passes_away * 0.3),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "final_third_entries": {
            "home": int(base_passes_home * 0.15), "away": int(base_passes_away * 0.10),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "final_third_accuracy": {
            "home": 82, "away": 70, "home_total": 100, "away_total": 100
        },
        "long_passes": {
            "home": int(base_passes_home * 0.05), "away": int(base_passes_away * 0.08),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "crosses": {
            "home": home_corners * 3, "away": away_corners * 3,
            "home_total": 0, "away_total": 0
        }
    }

    return data

def generate_analysis(file_path):
    if not os.path.exists(file_path):
        print("File not found.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Use the separated logic
    updated_data = analyze_match_data(data)

    # Save back
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(updated_data, f, indent=4, ensure_ascii=False)
        
    print("Analysis process completed.")

if __name__ == "__main__":
    generate_analysis(os.path.join(os.path.dirname(__file__), "manual_live_game.json"))
