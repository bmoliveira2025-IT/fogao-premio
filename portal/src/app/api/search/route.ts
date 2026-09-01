import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getNewsDisplayDate } from '@/lib/news-utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    try {
        const newsSnap = await db.collection('news')
            .orderBy('created_at', 'desc')
            .limit(100)
            .get();

        const allNews = newsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || '',
                image: data.image,
                source: data.source,
                summary: data.summary,
                created_at: getNewsDisplayDate(data.published_at, data.created_at),
                likes_count: data.likes_count || 0,
                dislikes_count: data.dislikes_count || 0,
            };
        });

        if (!q) {
            return NextResponse.json({ results: allNews.slice(0, 20) });
        }

        const queryTerms = q.split(/\s+/).filter(Boolean);
        const filtered = allNews.filter(item => {
            const fullText = (item.title + ' ' + (item.summary || '') + ' ' + (item.source || '')).toLowerCase();
            return queryTerms.every(term => fullText.includes(term));
        });

        return NextResponse.json({ results: filtered });
    } catch (err) {
        console.error('Error searching news:', err);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
