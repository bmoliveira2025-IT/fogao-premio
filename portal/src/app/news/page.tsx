import NewsContent from '@/components/NewsContent';
import { db } from '@/lib/firebase-admin';
import { getNewsDisplayDate } from '@/lib/news-utils';

async function getNews() {
    try {
        // Keep the four-day news archive available in the app.
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - 96);

        const snapshot = await db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .limit(500) // Cap the four-day window to protect mobile payloads.
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
                created_at: getNewsDisplayDate(data.published_at, data.created_at),
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
        <div className="w-full text-foreground font-sans selection:bg-premium-gold selection:text-black">
            <div className="max-w-7xl mx-auto px-0 pt-0">
                <NewsContent initialNews={news} />
            </div>
        </div>
    );
}
