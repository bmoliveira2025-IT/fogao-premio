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

    # 1. Determine which team is Botafogo
    home_team_name = data.get("home_team", "").upper()
    away_team_name = data.get("away_team", "").upper()
    
    is_botafogo_home = "BOTAFOGO" in home_team_name
    botafogo_side = "home" if is_botafogo_home else "away"
    rival_side = "away" if is_botafogo_home else "home"

    # 2. Determine MOTM (Man of the Match) - Always from Botafogo
    players = data.get("player_stats", {}).get(botafogo_side, [])
    if players:
        # Sort by rating (descending)
        sorted_players = sorted(
            [p for p in players if p.get("rating") is not None], 
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
    
    # 3. Generate GK Stats - Always for Botafogo's Keeper
    stats = data.get("stats", {})
    shots_on_target = stats.get("shots_on_target", {})
    # Rival's shots on target (which Botafogo's keeper must save)
    rival_shots = int(shots_on_target.get(rival_side, 0))
    # Rival's score (goals conceded by Botafogo)
    rival_score = int(data.get(f"{rival_side}_score", 0))
    
    saves = max(0, rival_shots - rival_score) 
    
    if rival_shots < rival_score:
        rival_shots = rival_score + 2
        saves = 2
    
    # Find Botafogo GK
    gk = next((p for p in players if p.get("position") == "GOL"), {"name": "Goleiro"})
    
    data["goalkeeper_stats"] = {
        "name": gk.get("name", "Goleiro"),
        "saves": saves,
        "saves_inside_box": max(0, saves - 1),
        "punched_clear": random.randint(0, 3),
        "high_claims": random.randint(1, 5),
        "clean_sheet": rival_score == 0
    }

    # 4. Generate Pass Stats
    # Estimate based on possession
    possession = stats.get("possession", {})
    poss_home = int(possession.get("home", 50))
    poss_away = int(possession.get("away", 50))
    
    base_passes_home = poss_home * 8
    base_passes_away = poss_away * 8
    
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
            "home_total": (home_corners * 3) + random.randint(5, 10), "away_total": (away_corners * 3) + random.randint(5, 10)
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
