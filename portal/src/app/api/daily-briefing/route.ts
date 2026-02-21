import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snapshot = await db.collection('daily_briefings')
            .orderBy('created_at', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json(null);
        }

        const data = snapshot.docs[0].data();
        return NextResponse.json(data);
    } catch (error: any) {
        if (error?.message?.includes('Quota exceeded') || error?.code === 8) {
            console.warn("Firestore Quota Exceeded for daily-briefing. Returning empty fallback.");
            return NextResponse.json(null);
        }
        console.error("Error fetching daily briefing from API:", error);
        return NextResponse.json(null, { status: 200 }); // Fail gracefully for UI
    }
}
