import BrandingHeader from '@/components/BrandingHeader';

import NewsContent from '@/components/NewsContent';
import { db } from '@/lib/firebase-admin';
import TabBar from '@/components/TabBar';
import DesktopHeader from '@/components/DesktopHeader';
import { Suspense } from 'react';
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
        <main className="min-h-screen bg-black text-foreground pb-44 pt-20 lg:pt-0 font-sans selection:bg-premium-gold selection:text-black">
            {/* Desktop Sidebar (Optional if layout adds it, but keeping structure) */}

            {/* Mobile Header */}
            <div className="lg:hidden">
                <BrandingHeader />
            </div>

            <DesktopHeader />
            <div className="hidden lg:block h-24"></div>

            <div className="max-w-7xl mx-auto px-0">
                <NewsContent initialNews={news} />
            </div>

            <div className="lg:hidden">
                <Suspense fallback={<div className="h-16 bg-black" />}>
                    <TabBar />
                </Suspense>
            </div>
        </main>
    );
}
