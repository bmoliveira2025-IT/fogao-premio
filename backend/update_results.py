"""
Automatically fetches Botafogo match results from GE Globo
and updates portal/src/data/schedule.ts with the final scores.

Runs every 22 minutes via the scraper GitHub Actions workflow.
"""

import re
import os
import json
import requests
import unicodedata
from datetime import datetime, timezone, timedelta

BRT = timezone(timedelta(hours=-3))  # Brasília time (UTC-3)

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/120.0.0.0 Safari/537.36'
    )
}

GE_TEAM_AGENDA_URL = (
    'https://ge.globo.com/futebol/times/botafogo/'
    'agenda-de-jogos-do-botafogo/'
)

# ─── helpers ────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    """Convert a team name to a GE-compatible URL slug."""
    # Decompose unicode (remove accents)
    nfkd = unicodedata.normalize('NFKD', name)
    ascii_str = nfkd.encode('ascii', 'ignore').decode('ascii')
    slug = (
        ascii_str.lower()
        .replace(' ', '-')
        .replace("'", '')
        .replace('.', '')
        .replace('/', '-')
    )
    # The local schedule uses the full name, while GE uses Athletico-PR.
    # Normalize both agenda keys and fallback URLs; never alias Atletico-MG.
    aliases = {
        'athletico-paranaense': 'athletico-pr',
        'atletico-paranaense': 'athletico-pr',
        'athletico': 'athletico-pr',
        'atletico-pr': 'athletico-pr',
    }
    return aliases.get(slug, slug)

def get_urls_for_match(date_str: str, home: str, away: str, competition: str) -> list:
    """
    Build a list of candidate GE Globo URLs for a given match.
    Tries multiple path patterns to account for GE's inconsistencies.
    """
    d = datetime.strptime(date_str, "%d/%m/%Y")
    date_fmt = d.strftime("%d-%m-%Y")
    slug = f"{slugify(home)}-{slugify(away)}"
    comp = competition.lower()

    urls = []

    if 'sudamericana' in comp or 'sul-americana' in comp or 'sulamericana' in comp:
        urls.append(f"https://ge.globo.com/futebol/copa-sul-americana/jogo/{date_fmt}/{slug}.ghtml")

    if 'copa' in comp and 'brasil' in comp and 'brasileir' not in comp:
        urls.append(f"https://ge.globo.com/futebol/copa-do-brasil/jogo/{date_fmt}/{slug}.ghtml")

    if 'libertadores' in comp:
        urls.append(f"https://ge.globo.com/futebol/libertadores/jogo/{date_fmt}/{slug}.ghtml")

    if 'brasileir' in comp:
        # Try with RJ state prefix first (Botafogo's home state), then without
        urls.append(f"https://ge.globo.com/rj/futebol/brasileirao-serie-a/jogo/{date_fmt}/{slug}.ghtml")
        urls.append(f"https://ge.globo.com/futebol/brasileirao-serie-a/jogo/{date_fmt}/{slug}.ghtml")

    if 'carioca' in comp:
        urls.append(f"https://ge.globo.com/rj/futebol/campeonato-carioca/jogo/{date_fmt}/{slug}.ghtml")

    return urls


FINISHED_STATUSES = ('ENCERRADA', 'FINALIZADO', 'FINISHED', 'FIM', 'REAL_TIME')


def fetch_agenda_results() -> dict:
    """Return finished Botafogo results embedded in GE's team agenda page."""
    results = {}
    try:
        response = requests.get(GE_TEAM_AGENDA_URL, headers=HEADERS, timeout=20)
        response.raise_for_status()
        text = response.text
        decoder = json.JSONDecoder()

        # The main object uses JavaScript keys, but the scheduleTeam value is
        # valid JSON. Current matches live in a separate JSON variable.
        sports_start = text.find('window.dataSportsSchedule =')
        markers = (
            ('scheduleTeam:', sports_start),
            ('window.byTeamScheduleTeamData =', 0),
        )
        for marker, search_from in markers:
            start = text.find(marker, max(search_from, 0))
            if start < 0:
                continue
            start += len(marker)
            payload, _ = decoder.raw_decode(text[start:].lstrip())

            matches = payload.get('matches', [])
            team_agenda = payload.get('teamAgenda', {})
            if team_agenda:
                matches += team_agenda.get('past', [])
                matches += team_agenda.get('now', [])

            for item in matches:
                match = item.get('match', item)
                transmission = match.get('transmission') or {}
                status_data = transmission.get('broadcastStatus') or {}
                status = status_data.get('id', '')
                scoreboard = match.get('scoreboard') or {}
                home = (match.get('firstContestant') or {}).get('popularName', '')
                away = (match.get('secondContestant') or {}).get('popularName', '')
                date_iso = match.get('startDate', '')

                if status not in FINISHED_STATUSES or not date_iso:
                    continue
                if scoreboard.get('home') is None or scoreboard.get('away') is None:
                    continue

                date_key = datetime.strptime(date_iso, '%Y-%m-%d').strftime('%d/%m/%Y')
                results[(date_key, slugify(home), slugify(away))] = {
                    'home': int(scoreboard['home']),
                    'away': int(scoreboard['away']),
                }
    except Exception as e:
        print(f'[update_results] Could not read GE team agenda: {e}')

    return results


def fetch_result(url: str, home_team: str = '', away_team: str = '') -> dict | None:
    """
    Try to fetch home/away score from a GE match page.

    Strategy 1 — JSON blobs inside the page (preferred).
    Strategy 2 — page <title> when GE redirects to highlights page
                 (title format: "Team A N x M Team B | Competition: …").

    Returns {'home': int, 'away': int} if the game is finished, else None.
    """
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        if r.status_code != 200:
            return None

        text = r.text

        # ── Strategy 1: structured JSON ────────────────────────────────────
        st = re.search(r'"status":"([^"]+)"', text)
        status = st.group(1) if st else ''

        ht = re.search(r'"homeTeam":\{[^}]*"score":(\d+)', text)
        at = re.search(r'"awayTeam":\{[^}]*"score":(\d+)', text)

        if status in FINISHED_STATUSES and ht and at:
            return {'home': int(ht.group(1)), 'away': int(at.group(1))}

        # ── Strategy 2: parse score from <title> ────────────────────────────
        # GE title format: "Team A N x M Team B | Competition: melhores momentos"
        title_tag = re.search(r'<title>([^<]+)</title>', text)
        if title_tag:
            title = title_tag.group(1)
            m = re.search(
                r'(.+?)\s+(\d+)\s+[xX×]\s+(\d+)\s+(.+?)\s*\|',
                title
            )
            if m:
                t1_name = m.group(1).strip()
                score1  = int(m.group(2))
                score2  = int(m.group(3))
                t2_name = m.group(4).strip()

                # Determine which score belongs to home vs away
                # by checking which team name appears first in the title
                h_slug = slugify(home_team)
                a_slug = slugify(away_team)
                t1_slug = slugify(t1_name)

                if h_slug and h_slug in t1_slug or t1_slug in h_slug:
                    return {'home': score1, 'away': score2}
                elif a_slug and a_slug in t1_slug or t1_slug in a_slug:
                    return {'home': score2, 'away': score1}
                else:
                    # Fallback: assume title order matches schedule order
                    return {'home': score1, 'away': score2}

    except Exception as e:
        print(f"  Error fetching {url}: {e}")

    return None


# ─── main logic ─────────────────────────────────────────────────────────────

def update_schedule_results() -> bool:
    """
    Scan schedule.ts for past Botafogo games that still have no result.
    For each one, try to fetch the score from GE Globo and update the file.

    Returns True if schedule.ts was modified.
    """
    schedule_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'portal', 'src', 'data', 'schedule.ts'
    )

    if not os.path.exists(schedule_path):
        print(f"[update_results] schedule.ts not found at: {schedule_path}")
        return False

    with open(schedule_path, 'r', encoding='utf-8') as f:
        content = f.read()

    now_brt = datetime.now(BRT)
    changed = False
    agenda_results = fetch_agenda_results()
    print(f'[update_results] Loaded {len(agenda_results)} finished matches from GE agenda.')

    # Parse complete one-line schedule objects. Extra fields such as round,
    # stadium and source URL must not prevent a result from being detected.
    pattern = re.compile(r'^\s*(\{[^\r\n]+\})\s*,?\s*$', re.MULTILINE)

    for m in list(pattern.finditer(content)):
        raw_entry = m.group(1)
        try:
            match_data = json.loads(raw_entry)
        except json.JSONDecodeError:
            continue

        if 'result' in match_data or 'time' not in match_data:
            continue

        date_str = match_data.get('date', '')
        home = match_data.get('homeTeam', '')
        away = match_data.get('awayTeam', '')
        competition = match_data.get('competition', '')
        time_str = match_data.get('time', '')

        if not all((date_str, home, away, competition, time_str)):
            continue

        # Parse game kick-off in Brasília time
        try:
            if ':' in time_str and time_str != 'A definir':
                game_dt = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M")
            else:
                game_dt = datetime.strptime(date_str, "%d/%m/%Y")
            game_dt = game_dt.replace(tzinfo=BRT)
        except Exception:
            continue

        # Start checking at kick-off. fetch_result only returns a score when
        # the source explicitly marks the match as finished, so waiting three
        # hours unnecessarily delays shorter matches and games without much
        # added time.
        if game_dt > now_brt:
            print(f"[update_results] Game has not started yet — skipping: {home} x {away} ({date_str} {time_str})")
            continue

        print(f"[update_results] Fetching result: {home} x {away} ({date_str}  {competition})")

        result = agenda_results.get((date_str, slugify(home), slugify(away)))
        urls = get_urls_for_match(date_str, home, away, competition)

        if result:
            print(f"  OK Found in team agenda: {result['home']} x {result['away']}")

        for url in urls if not result else []:
            print(f"  Trying: {url}")
            result = fetch_result(url, home_team=home, away_team=away)
            if result:
                print(f"  OK Found: {result['home']} x {result['away']}")
                break

        if result:
            match_data['result'] = f'{result["home"]} - {result["away"]}'
            new_entry = json.dumps(match_data, ensure_ascii=False)
            content = content.replace(raw_entry, new_entry, 1)
            changed = True
            print(f"  >> schedule.ts updated: {home} {result['home']}-{result['away']} {away}")
        else:
            print(f"  Result not available yet — will retry on next run.")

    if changed:
        with open(schedule_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("[update_results] schedule.ts saved with new results.")
    else:
        print("[update_results] Nothing to update.")

    return changed


if __name__ == "__main__":
    update_schedule_results()
