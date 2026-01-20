import { db } from '@/lib/firebase-admin';
import MatchesAccordion from '@/components/MatchesAccordion';

export const revalidate = 60;

async function getMatches() {
    try {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 3);
        const matchesRef = db.collection('matches')
            .where('date', '>=', threshold.toISOString())
            .orderBy('date', 'asc')
            .limit(20);
        const snapshot = await matchesRef.get();

        const rawMatches = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Serialize dates for Client Component
            date: doc.data().date instanceof Date ? doc.data().date.toISOString() : doc.data().date
        }));

        // Deduplicate Logic
        const uniqueMatchesMap = new Map();

        rawMatches.forEach((match: any) => {
            // Create a unique key based on teams
            // We ignore date details to catch dups on same day easily, or include day if needed. 
            // Given the report, it's likely exact same match data.
            const matchDate = new Date(match.date).toLocaleDateString('pt-BR');
            const key = `${match.home_team}-${match.away_team}-${matchDate}`;

            if (uniqueMatchesMap.has(key)) {
                // Determine which one to keep
                const existing = uniqueMatchesMap.get(key);
                // Priority: Status 'live' > Has Logo > Existing
                const existingHasLogo = existing.home_team_logo && existing.away_team_logo;
                const currentHasLogo = match.home_team_logo && match.away_team_logo;

                if (!existingHasLogo && currentHasLogo) {
                    uniqueMatchesMap.set(key, match);
                }
            } else {
                uniqueMatchesMap.set(key, match);
            }
        });

        return Array.from(uniqueMatchesMap.values());
    } catch (error) {
        // Quota exceeded or other Firestore error - fail gracefully
        return [];
    }
}

export default async function MatchesPage() {
    const matches: any = await getMatches();

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

                {matches.length > 0 ? (
                    <MatchesAccordion matches={matches} />
                ) : (
                    <div className="text-center py-20 text-foreground/30 text-sm">
                        Nenhum jogo agendado no momento.
                    </div>
                )}
            </div>
        </div>
    );
}
