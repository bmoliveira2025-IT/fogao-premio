import { db } from '@/lib/firebase-admin';
import MatchesAccordion from '@/components/MatchesAccordion';
import TabBar from '@/components/TabBar';
import BrandingHeader from '@/components/BrandingHeader';
import DesktopHeader from '@/components/DesktopHeader';

export const revalidate = 60;

async function getMatches() {
    const matchesRef = db.collection('matches').orderBy('date', 'asc').where('date', '>=', new Date().toISOString()).limit(20);
    const snapshot = await matchesRef.get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Serialize dates for Client Component
        date: doc.data().date instanceof Date ? doc.data().date.toISOString() : doc.data().date
    }));
}

export default async function MatchesPage() {
    const matches: any = await getMatches();

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-premium-gold selection:text-black pb-32 transition-colors duration-300">
            <div className="lg:hidden">
                <BrandingHeader />
            </div>
            <DesktopHeader />

            <div className="h-16 lg:h-24"></div>

            <div className="p-5 lg:max-w-5xl lg:mx-auto lg:p-8">
                <div className="flex items-center space-x-3 mb-6 lg:mb-10">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-foreground/10"></div>
                    <h1 className="text-xl lg:text-3xl font-display font-black text-foreground px-4 border border-premium-gold/30 py-2 rounded-full bg-foreground/5 uppercase tracking-wider backdrop-blur-md shadow-sm">
                        Calendário
                    </h1>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-foreground/10"></div>
                </div>

                {matches.length > 0 ? (
                    <MatchesAccordion matches={matches} />
                ) : (
                    <div className="text-center py-20 text-foreground/30 text-sm">
                        Nenhum jogo agendado no momento.
                    </div>
                )}
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main>
    );
}
