import { db } from '@/lib/firebase-admin';
import MatchesAccordion from '@/components/MatchesAccordion';

export const revalidate = 0;

async function getUpcomingMatches() {
    try {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 3);
        const matchesRef = db.collection('matches')
            .where('date', '>=', threshold.toISOString())
            .orderBy('date', 'asc')
            .limit(10);
        const snapshot = await matchesRef.get();
        const matches = serializeMatches(snapshot);
        // Exclude truly finished matches from upcoming list
        return matches.filter(m => m.status?.toLowerCase() !== 'finalizado');
    } catch (e) { return []; }
}

async function getPastMatches() {
    try {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 1); // Only very recent or past games
        const matchesRef = db.collection('matches')
            .where('date', '<', threshold.toISOString())
            .orderBy('date', 'desc')
            .limit(5); // Show more than just 1
        const snapshot = await matchesRef.get();
        return serializeMatches(snapshot);
    } catch (e) { return []; }
}

function serializeMatches(snapshot: any) {
    const matchesMap = new Map();

    snapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        const date = data.date && typeof data.date.toDate === 'function' ? data.date.toDate().toISOString() : (data.date instanceof Date ? data.date.toISOString() : data.date);
        const home = data.home_team || '';
        const away = data.away_team || '';
        const key = `${home}_vs_${away}_${date.split('T')[0]}`;

        const serialized = {
            id: doc.id,
            home_team: home,
            away_team: away,
            home_score: data.home_score,
            away_score: data.away_score,
            date: date,
            location: data.location,
            championship: data.championship,
            status: data.status,
            home_team_logo: data.home_team_logo || data.home_logo,
            away_team_logo: data.away_team_logo || data.away_logo,
            display_time: data.display_time,
            match_id: data.match_id
        };

        // If we have a version with a match_id or a non-zero score, prioritize it
        const existing = matchesMap.get(key);
        if (!existing || (serialized.match_id && !existing.match_id) || (serialized.home_score > 0 || serialized.away_score > 0)) {
            matchesMap.set(key, serialized);
        }
    });

    return Array.from(matchesMap.values());
}

export default async function MatchesPage() {
    const upcoming = await getUpcomingMatches();
    const past = await getPastMatches();

    return (
        <div className="w-full text-foreground font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300">
            <div className="p-4 md:p-6 lg:max-w-5xl lg:mx-auto mt-4 pb-32">
                <div className="flex items-center space-x-4 mb-8 lg:mb-12">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <div className="glass-ultra border border-white/[0.04] px-6 py-3 rounded-[2rem] shadow-premium">
                        <h1 className="text-lg lg:text-3xl font-display font-black text-white uppercase tracking-[0.2em]">
                            Calendário
                        </h1>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <div className="flex justify-center mb-10">
                    <a href="/tabela" className="px-8 py-3 rounded-xl bg-premium-gold/10 border border-premium-gold/30 text-premium-gold text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-premium-gold hover:text-black hover:shadow-gold-glow transition-all duration-500 active:scale-90">
                        Ver Classificação
                    </a>
                </div>


                {/* UPCOMING MATCHES */}
                {upcoming.length > 0 && (
                    <MatchesAccordion matches={upcoming} title="Próximos Jogos" />
                )}

                {upcoming.length === 0 && (
                    <div className="text-center py-10 text-foreground/30 text-sm">
                        Nenhum jogo futuro agendado no momento.
                    </div>
                )}

                {/* PAST MATCHES */}
                {past.length > 0 && (
                    <div className="mt-12 opacity-80">
                        <MatchesAccordion matches={past} title="Jogos Anteriores" />
                    </div>
                )}
            </div>
        </div>
    );
}
