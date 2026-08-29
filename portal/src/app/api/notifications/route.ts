import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { detectCategoryKey } from '@/lib/news-utils';

export const revalidate = 60; // Cache for 60 seconds

interface NotificationItem {
    id: string;
    title: string;
    dateStr: string;
    timestamp: number;
    type: string;
}

export async function GET() {
    try {
        const notifications: NotificationItem[] = [];
        
        // 1. Fetch recent news from the app's four-day archive.
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - 96);

        const newsRef = db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .limit(50);
            
        const newsSnap = await newsRef.get();
        
        newsSnap.forEach(doc => {
            const data = doc.data();
            const title = data.title || '';
            const category = detectCategoryKey(title);
            
            // Only alert for Mercado (contratações), Medico (desfalques) or if it's explicitly breaking/urgente
            const isUrgent = title.toLowerCase().includes('urgente') || title.toLowerCase().includes('plantão');
            
            if (category === 'mercado' || category === 'medico' || isUrgent) {
                const createdAt = data.created_at?.toDate() || new Date();
                
                notifications.push({
                    id: doc.id,
                    title: title,
                    dateStr: createdAt.toISOString(),
                    timestamp: createdAt.getTime(),
                    type: category === 'mercado' ? 'NEWS_MERCADO' : (category === 'medico' ? 'NEWS_MEDICO' : 'NEWS_URGENT')
                });
            }
        });

        // 2. Fetch the latest editorial briefing. Match-result alerts are intentionally excluded.
        const briefingTimeLimit = new Date();
        briefingTimeLimit.setHours(briefingTimeLimit.getHours() - 48);
        const briefingRef = db.collection('daily_briefings').orderBy('created_at', 'desc').limit(1);
        const briefingSnap = await briefingRef.get();
        if (!briefingSnap.empty) {
            const b = briefingSnap.docs[0];
            const data = b.data();
            const createdAt = data.created_at?.toDate() || new Date();
            // check if it's within 48h
            if (createdAt >= briefingTimeLimit) {
                notifications.push({
                    id: b.id,
                    title: `Giro do Fogão • Edição ${data.edition || 'Atualizada'}`,
                    dateStr: createdAt.toISOString(),
                    timestamp: createdAt.getTime(),
                    type: 'DAILY_BRIEFING'
                });
            }
        }

        // 3. Sort by timestamp descending
        notifications.sort((a, b) => b.timestamp - a.timestamp);

        // Limit to top 15
        const topNotifications = notifications.slice(0, 15);

        return NextResponse.json(topNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
