export interface MatchData {
    id: string;
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    date: string;
    location: string;
    championship: string;
    status: string;
    home_team_logo?: string;
    away_team_logo?: string;
    match_id?: string;
    display_time?: string;
}

const rawSchedule = [
  {"date": "29/01/2026", "homeTeam": "Botafogo", "awayTeam": "Cruzeiro", "competition": "Campeonato Brasileiro", "result": "4 - 0"},
  {"date": "04/02/2026", "homeTeam": "Grêmio", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "5 - 3"},
  {"date": "12/02/2026", "homeTeam": "Fluminense", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "1 - 0"},
  {"date": "14/03/2026", "homeTeam": "Botafogo", "awayTeam": "Flamengo", "competition": "Campeonato Brasileiro", "result": "0 - 3"},
  {"date": "18/03/2026", "homeTeam": "Palmeiras", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "2 - 1"},
  {"date": "21/03/2026", "homeTeam": "Red Bull Bragantino", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "1 - 2"},
  {"date": "29/03/2026", "homeTeam": "Athletico Paranaense", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "4 - 1"},
  {"date": "01/04/2026", "homeTeam": "Botafogo", "awayTeam": "Mirassol", "competition": "Campeonato Brasileiro", "result": "3 - 2"},
  {"date": "04/04/2026", "homeTeam": "Vasco da Gama", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "1 - 2"},
  {"date": "09/04/2026", "homeTeam": "Botafogo", "awayTeam": "Caracas FC", "competition": "CONMEBOL Sudamericana", "result": "1 - 1"},
  {"date": "12/04/2026", "homeTeam": "Botafogo", "awayTeam": "Coritiba", "competition": "Campeonato Brasileiro", "result": "2 - 2"},
  {"date": "15/04/2026", "homeTeam": "Racing Club", "awayTeam": "Botafogo", "competition": "CONMEBOL Sudamericana", "result": "2 - 3"},
  {"date": "18/04/2026", "homeTeam": "Chapecoense", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "result": "1 - 4"},
  {"date": "21/04/2026", "homeTeam": "Botafogo", "awayTeam": "Chapecoense", "competition": "Copa do Brasil", "result": "1 - 0"},
  {"date": "25/04/2026", "homeTeam": "Botafogo", "awayTeam": "Internacional", "competition": "Campeonato Brasileiro", "result": "2 - 2"},
  {"date": "28/04/2026", "homeTeam": "Botafogo", "awayTeam": "Ind. Petrolero", "competition": "CONMEBOL Sudamericana", "result": "3 - 0"},
  {"date": "02/05/2026", "homeTeam": "Botafogo", "awayTeam": "Remo", "competition": "Campeonato Brasileiro", "result": "1 - 2"},
  {"date": "06/05/2026", "homeTeam": "Botafogo", "awayTeam": "Racing Club", "competition": "CONMEBOL Sudamericana", "time": "21:30"},
  {"date": "10/05/2026", "homeTeam": "Atlético-MG", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "16:00"},
  {"date": "14/05/2026", "homeTeam": "Chapecoense", "awayTeam": "Botafogo", "competition": "Copa do Brasil", "time": "18:00"},
  {"date": "17/05/2026", "homeTeam": "Botafogo", "awayTeam": "Corinthians", "competition": "Campeonato Brasileiro", "time": "16:00"},
  {"date": "20/05/2026", "homeTeam": "Ind. Petrolero", "awayTeam": "Botafogo", "competition": "CONMEBOL Sudamericana", "time": "21:00"},
  {"date": "23/05/2026", "homeTeam": "São Paulo", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "17:00"},
  {"date": "27/05/2026", "homeTeam": "Caracas FC", "awayTeam": "Botafogo", "competition": "CONMEBOL Sudamericana", "time": "19:00"},
  {"date": "30/05/2026", "homeTeam": "Bahia", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "22/07/2026", "homeTeam": "Botafogo", "awayTeam": "Santos", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "25/07/2026", "homeTeam": "Cruzeiro", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "29/07/2026", "homeTeam": "Botafogo", "awayTeam": "Grêmio", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "08/08/2026", "homeTeam": "Botafogo", "awayTeam": "Fluminense", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "15/08/2026", "homeTeam": "Vitória", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "22/08/2026", "homeTeam": "Botafogo", "awayTeam": "Athletico Paranaense", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "29/08/2026", "homeTeam": "Flamengo", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "05/09/2026", "homeTeam": "Botafogo", "awayTeam": "Palmeiras", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "12/09/2026", "homeTeam": "Botafogo", "awayTeam": "Red Bull Bragantino", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "19/09/2026", "homeTeam": "Mirassol", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "07/10/2026", "homeTeam": "Botafogo", "awayTeam": "Vasco da Gama", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "10/10/2026", "homeTeam": "Coritiba", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "17/10/2026", "homeTeam": "Botafogo", "awayTeam": "Chapecoense", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "24/10/2026", "homeTeam": "Internacional", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "28/10/2026", "homeTeam": "Remo", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "04/11/2026", "homeTeam": "Botafogo", "awayTeam": "Atlético-MG", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "18/11/2026", "homeTeam": "Corinthians", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "21/11/2026", "homeTeam": "Botafogo", "awayTeam": "São Paulo", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "28/11/2026", "homeTeam": "Botafogo", "awayTeam": "Bahia", "competition": "Campeonato Brasileiro", "time": "A definir"},
  {"date": "02/12/2026", "homeTeam": "Santos", "awayTeam": "Botafogo", "competition": "Campeonato Brasileiro", "time": "A definir"}
];

function parseDate(dateStr: string, timeStr?: string): string {
    const [day, month, year] = dateStr.split('/').map(Number);
    let hours = 0;
    let minutes = 0;
    
    if (timeStr && timeStr !== 'A definir' && timeStr.includes(':')) {
        [hours, minutes] = timeStr.split(':').map(Number);
    }
    
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toISOString();
}

export const botafogoSchedule: MatchData[] = rawSchedule.map((m, index) => {
    let home_score = 0;
    let away_score = 0;
    let status = 'AGENDADO';
    
    if (m.result) {
        const [h, a] = m.result.split(' - ').map(s => parseInt(s.trim()));
        home_score = h;
        away_score = a;
        status = 'FINALIZADO';
    }

    const getLogo = (name: string) => {
        const map: Record<string, string> = {
            'Botafogo': '/logos/botafogo.png',
            'Cruzeiro': '/logos/cruzeiro.png',
            'Grêmio': '/logos/gremio.png',
            'Vasco da Gama': '/logos/vasco.png',
            'Flamengo': '/logos/flamengo.png',
            'Palmeiras': '/logos/palmeiras.png',
            'Red Bull Bragantino': '/logos/bragantino.png',
            'Athletico Paranaense': '/logos/athletico-pr.png',
            'Mirassol': '/logos/mirassol.png',
            'Coritiba': '/logos/coritiba.png',
            'Chapecoense': '/logos/chapecoense.png',
            'Internacional': '/logos/internacional.png',
            'Remo': '/logos/remo.png',
            'Corinthians': '/logos/corinthians.png',
            'São Paulo': '/logos/sao-paulo.png',
            'Vitória': '/logos/vitoria.png',
            'Fluminense': '/logos/fluminense.png',
            'Bahia': '/logos/bahia.png',
            'Santos': '/logos/santos.png',
            'Atlético-MG': '/logos/atletico-mg.png',
            'Barcelona SC': '/logos/barcelona-sc.png',
            'Caracas FC': '/logos/caracas-fc.png',
            'Racing Club': '/logos/racing-club.png',
            'Ind. Petrolero': '/logos/independiente-petrolero.png',
        };
        return map[name] || '';
    };
    
    return {
        id: `espn-${index}`,
        home_team: m.homeTeam,
        away_team: m.awayTeam,
        home_score,
        away_score,
        date: parseDate(m.date, (m as any).time),
        location: m.homeTeam === 'Botafogo' ? 'Estádio Nilton Santos' : 'A definir',
        championship: m.competition,
        status: status,
        display_time: (m as any).time || (m.result ? 'FIM' : ''),
        home_team_logo: getLogo(m.homeTeam),
        away_team_logo: getLogo(m.awayTeam),
    };
});
