import { db } from '@/lib/firebase-admin';
import { getNewsDisplayDate } from '@/lib/news-utils';
import PremiumPageContent from '@/components/PremiumPageContent';

export const revalidate = 60;

export default async function PremiumPage() {
    try {
        // Fetch Premium News
        const premiumRef = db.collection('news')
            .where('is_premium', '==', true)
            .orderBy('created_at', 'desc')
            .limit(10); // LIMIT ALREADY EXISTS

        const snapshot = await premiumRef.get();
        const premiumNews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: getNewsDisplayDate(doc.data().published_at, doc.data().created_at)
        }));

        return <PremiumPageContent premiumNews={premiumNews} />;
    } catch (error) {
        console.warn("Failed to fetch premium news (likely quota exceeded):", error);
        return <PremiumPageContent premiumNews={[]} />;
    }
}
