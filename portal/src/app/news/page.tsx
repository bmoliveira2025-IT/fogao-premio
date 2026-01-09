import { db } from '@/lib/firebase-admin';
import NewsCard from '@/components/NewsCard';
import HeroNewsCard from '@/components/HeroNewsCard';
import InfiniteNewsFeed from '@/components/InfiniteNewsFeed';
import TabBar from '@/components/TabBar';
import DesktopHeader from '@/components/DesktopHeader';
import { Newspaper } from 'lucide-react';
import { Suspense } from 'react';

// Reusing loading for now or we can create a specific one
import Loading from '../loading';

async function getNews() {
    try {
        // Calculate the date 24 hours ago
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - 24);

        const snapshot = await db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .limit(24) // ENFORCE LIMIT
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || '',
                image: data.image,
                source: data.source,
                is_premium: data.is_premium,
                summary: data.summary,
                content: data.content,
                created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
            };
        }).filter(item => !item.is_premium);
    } catch (error) {
        console.warn("Failed to fetch news (likely quota exceeded):", error);
        return [];
    }
}

export default async function NewsPage() {
    const news = await getNews();

    return (
        <main className="min-h-screen bg-background text-foreground px-4 pt-10 lg:pt-0 pb-32 font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300">

            <DesktopHeader />
            <div className="hidden lg:block h-24"></div>

            <div className="max-w-5xl lg:max-w-7xl mx-auto lg:px-6">
                {/* Header (Mobile) */}
                {/* Header (Mobile) */}
                <header className="lg:hidden mb-6 pt-2 pb-4 border-b border-premium-gold/30 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-premium-gold/5 blur-3xl rounded-full pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between px-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-zinc-900 to-black rounded-xl flex items-center justify-center border border-premium-gold/20 shadow-sm">
                                <Newspaper className="text-premium-gold" size={18} />
                            </div>

                            <div className="flex flex-col">
                                <h1 className="text-xl font-black italic tracking-tighter font-display uppercase text-white leading-none">
                                    Central de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFE578] to-[#C9A24D]">Notícias</span>
                                </h1>
                                <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">
                                    Cobertura do Glorioso
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Desktop Title */}
                <div className="hidden lg:flex items-center space-x-4 mb-10 border-b border-foreground/10 pb-6">
                    <h1 className="text-4xl font-black italic tracking-tighter font-display uppercase text-foreground">
                        ÚLTIMAS <span className="text-premium-gold">NOTÍCIAS</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section (Spans Full Width) */}
                    <div className="md:col-span-2 lg:col-span-3 mb-6">
                        {news.length > 0 && <HeroNewsCard article={news[0]} />}
                    </div>

                    {/* Feed List (Grid) - Infinite Scroll */}
                    <InfiniteNewsFeed initialNews={news.slice(1)} />
                </div>
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main>
    );
}
