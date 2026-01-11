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
    } catch (error) {
        console.error("Error fetching daily briefing from API:", error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
