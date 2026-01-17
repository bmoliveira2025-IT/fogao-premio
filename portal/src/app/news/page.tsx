import BrandingHeader from '@/components/BrandingHeader';

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
        <main className="min-h-screen bg-background text-foreground px-0 md:px-4 pt-20 lg:pt-0 pb-32 font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300">
            {/* Mobile Header (App Shell) */}
            <div className="lg:hidden">
                <BrandingHeader />
            </div>

            <DesktopHeader />
            <div className="hidden lg:block h-24"></div>

            <div className="max-w-5xl lg:max-w-7xl mx-auto lg:px-6">

                {/* Desktop Title */}
                <div className="hidden lg:flex items-center space-x-4 mb-10 border-b border-foreground/10 pb-6">
                    <h1 className="text-4xl font-black italic tracking-tighter font-display uppercase text-foreground">
                        TODAS AS <span className="text-premium-gold">NOTÍCIAS</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section (Spans Full Width) - Skip first news (already on home) */}
                    <div className="md:col-span-2 lg:col-span-3 mb-0 md:mb-6">
                        {news.length > 1 && <HeroNewsCard article={news[1]} />}
                    </div>

                    {/* Feed List (Grid) - Infinite Scroll, skip first 2 */}
                    <InfiniteNewsFeed initialNews={news.slice(2)} />
                </div>
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main>
    );
}
