'use server';

import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function fetchMoreNews(lastCreatedAt: string) {
    // Four-day window, matching the homepage and news archive policy.
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 96);

    try {
        const query = db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .startAfter(Timestamp.fromDate(new Date(lastCreatedAt)))
            .limit(15);

        // Important: When passing a string date from client, we need to convert it back to what Firestore expects.
        // However, if we stored it as Timestamp, passing a Date object usually works for startAfter if using the Admin SDK.
        // If not, we might need the actual document snapshot, but startAfter(value) works if we sort by that value.

        // Wait, startAfter takes the field values of the orderBy fields.

        const snapshot = await query.get();

        const news = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                image: data.image,
                source: data.source,
                is_premium: data.is_premium,
                summary: data.summary,
                created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
            };
        }).filter(item => !item.is_premium);

        return news;
    } catch (error) {
        console.error("Error fetching more news:", error);
        return [];
    }
}
