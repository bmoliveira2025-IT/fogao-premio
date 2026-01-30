import { db } from '@/lib/firebase-admin';
import MatchesAccordion from '@/components/MatchesAccordion';

export const revalidate = 0;

async function getUpcomingMatches() {
    try {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 3); // Include games just finished
        const matchesRef = db.collection('matches')
            .where('date', '>=', threshold.toISOString())
            .orderBy('date', 'asc')
            .limit(10);
        const snapshot = await matchesRef.get();
        return serializeMatches(snapshot);
    } catch (e) { return []; }
}

async function getPastMatches() {
    try {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 3);
        const matchesRef = db.collection('matches')
            .where('date', '<', threshold.toISOString())
            .orderBy('date', 'desc')
            .limit(1);
        const snapshot = await matchesRef.get();
        return serializeMatches(snapshot);
    } catch (e) { return []; }
}

function serializeMatches(snapshot: any) {
    return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
            id: data.match_id || doc.id,
            home_team: data.home_team,
            away_team: data.away_team,
            home_score: data.home_score,
            away_score: data.away_score,
            date: data.date && typeof data.date.toDate === 'function' ? data.date.toDate().toISOString() : (data.date instanceof Date ? data.date.toISOString() : data.date),
            location: data.location,
            championship: data.championship,
            status: data.status,
            home_team_logo: data.home_team_logo,
            away_team_logo: data.away_team_logo,
            display_time: data.display_time
        };
    });
}

export default async function MatchesPage() {
    const upcoming = await getUpcomingMatches();
    const past = await getPastMatches();

    return (
        <div className="w-full text-foreground font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300">
            <div className="p-5 lg:max-w-5xl lg:mx-auto lg:p-8 mt-4">
                <div className="flex items-center space-x-3 mb-6 lg:mb-10">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-foreground/10"></div>
                    <h1 className="text-xl lg:text-3xl font-display font-black text-foreground px-4 border border-premium-gold/30 py-2 rounded-full bg-foreground/5 uppercase tracking-wider backdrop-blur-md shadow-sm">
                        Calendário
                    </h1>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-foreground/10"></div>
                </div>

                <div className="flex justify-center mb-8">
                    <a href="/tabela" className="px-6 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 text-premium-gold text-xs font-bold uppercase tracking-widest hover:bg-premium-gold hover:text-black transition-all duration-300">
                        Ver Classificação
                    </a>
                </div>

                {/* PAST MATCHES */}
                {past.length > 0 && (
                    <div className="mb-12">
                        <MatchesAccordion matches={past} title="Últimos Resultados" />
                    </div>
                )}

                {/* UPCOMING MATCHES */}
                {upcoming.length > 0 ? (
                    <MatchesAccordion matches={upcoming} title="Próximos Jogos" />
                ) : (
                    <div className="text-center py-20 text-foreground/30 text-sm">

                    </div>
                )}

                {upcoming.length === 0 && (
                    <div className="text-center py-5 text-foreground/30 text-sm">
                        Nenhum jogo futuro agendado no momento.
                    </div>
                )}
            </div>
        </div>
    );
}
