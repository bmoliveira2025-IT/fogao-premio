import { db } from '@/lib/firebase-admin';
import VerticalNewsFeed from '@/components/VerticalNewsFeed';

export const revalidate = 60; // ISR for 60 seconds

async function getFeedNews() {
    try {
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - 96);

        const newsRef = db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .limit(500);

        const newsSnap = await newsRef.get();
        const news = newsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || '',
                image: data.image,
                source: data.source,
                is_premium: data.is_premium,
                summary: data.summary,
                likes_count: data.likes_count || 0,
                dislikes_count: data.dislikes_count || 0,
                created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
            };
        }).filter(item => !item.is_premium);

        return news;
    } catch (error) {
        console.error("FEED FETCH ERROR:", error);
        return [];
    }
}

export default async function FeedPage() {
    const news = await getFeedNews();

    return (
        <main className="w-full h-[100dvh] bg-background overflow-hidden relative">
            <VerticalNewsFeed initialNews={news} />
        </main>
    );
}
