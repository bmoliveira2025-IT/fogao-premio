import json
import unittest
from datetime import datetime
from unittest.mock import Mock, mock_open, patch

from backend import update_results


class FixedDateTime(datetime):
    @classmethod
    def now(cls, tz=None):
        return cls(2026, 8, 28, 12, tzinfo=tz)


class ScheduleResultsTests(unittest.TestCase):
    def test_athletico_aliases_do_not_match_atletico_mineiro(self):
        for name in ('Athletico Paranaense', 'Athletico-PR', 'Athletico',
                     'Atlético Paranaense', 'Atlético-PR'):
            with self.subTest(name=name):
                self.assertEqual(update_results.slugify(name), 'athletico-pr')
        self.assertEqual(update_results.slugify('Atlético-MG'), 'atletico-mg')

    def test_red_bull_bragantino_matches_ge_popular_name(self):
        self.assertEqual(update_results.slugify('Red Bull Bragantino'), 'bragantino')
        self.assertEqual(update_results.slugify('Bragantino'), 'bragantino')

    def test_fallback_urls_use_ge_team_name(self):
        urls = update_results.get_urls_for_match(
            '24/08/2026', 'Botafogo', 'Athletico Paranaense', 'Campeonato Brasileiro'
        )
        self.assertTrue(urls)
        self.assertTrue(all('/24-08-2026/botafogo-athletico-pr.ghtml' in url for url in urls))

    def test_agenda_result_updates_full_team_name_without_changing_other_match(self):
        finished = {
            'date': '24/08/2026', 'homeTeam': 'Botafogo',
            'awayTeam': 'Athletico Paranaense',
            'competition': 'Campeonato Brasileiro', 'time': '20:00', 'round': 24,
        }
        upcoming = {
            'date': '30/08/2026', 'dateIso': '2026-08-30T16:00:00-03:00',
            'homeTeam': 'Flamengo', 'awayTeam': 'Botafogo',
            'competition': 'Campeonato Brasileiro', 'time': '16:00',
        }
        source = '\n'.join(json.dumps(item) + ',' for item in (finished, upcoming))
        payload = {'matches': [{'match': {
            'startDate': '2026-08-24',
            'firstContestant': {'popularName': 'Botafogo'},
            'secondContestant': {'popularName': 'Athletico-PR'},
            'scoreboard': {'home': 2, 'away': 3},
            'transmission': {'broadcastStatus': {'id': 'ENCERRADA'}},
        }}]}
        response = Mock(text='window.byTeamScheduleTeamData = ' + json.dumps(payload))
        file = mock_open(read_data=source)
        with patch.object(update_results, 'datetime', FixedDateTime), \
             patch.object(update_results.os.path, 'exists', return_value=True), \
             patch('builtins.open', file), \
             patch.object(update_results.requests, 'get', return_value=response), \
             patch.object(update_results, 'fetch_result') as fallback:
            self.assertTrue(update_results.update_schedule_results())
        fallback.assert_not_called()
        written = file().write.call_args.args[0]
        rows = [json.loads(line.rstrip(',')) for line in written.splitlines()]
        self.assertEqual(rows[0], {**finished, 'result': '2 - 3'})
        self.assertEqual(rows[1], upcoming)

    def test_future_agenda_match_updates_date_time_and_location(self):
        scheduled = {
            'date': '05/09/2026', 'homeTeam': 'Botafogo',
            'awayTeam': 'Palmeiras', 'competition': 'Campeonato Brasileiro',
            'time': 'A definir', 'dateTbd': True,
        }
        source = json.dumps(scheduled) + ','
        payload = {'matches': [{'match': {
            'startDate': '2026-09-06',
            'startHour': '18:30:00',
            'firstContestant': {'popularName': 'Botafogo'},
            'secondContestant': {'popularName': 'Palmeiras'},
            'location': {'popularName': 'Nilton Santos (Engenhão)'},
            'round': 26,
            'scoreboard': {'home': None, 'away': None},
            'transmission': {
                'broadcastStatus': {'id': 'PRE_DIA'},
                'url': 'https://ge.globo.com/jogo/botafogo-palmeiras.ghtml',
            },
        }}]}
        response = Mock(text='window.byTeamScheduleTeamData = ' + json.dumps(payload))
        file = mock_open(read_data=source)
        with patch.object(update_results, 'datetime', FixedDateTime), \
             patch.object(update_results.os.path, 'exists', return_value=True), \
             patch('builtins.open', file), \
             patch.object(update_results.requests, 'get', return_value=response), \
             patch.object(update_results, 'fetch_result') as fallback:
            self.assertTrue(update_results.update_schedule_results())

        fallback.assert_not_called()
        row = json.loads(file().write.call_args.args[0].rstrip(','))
        self.assertEqual(row['date'], '06/09/2026')
        self.assertEqual(row['time'], '18:30')
        self.assertEqual(row['dateIso'], '2026-09-06T18:30:00-03:00')
        self.assertEqual(row['location'], 'Nilton Santos (Engenhão)')
        self.assertEqual(row['round'], 26)
        self.assertNotIn('dateTbd', row)


if __name__ == '__main__':
    unittest.main()
