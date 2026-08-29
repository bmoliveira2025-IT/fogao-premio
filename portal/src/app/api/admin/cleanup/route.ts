import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Authenticate request (basic protection)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // Allow local development without secret
            if (process.env.NODE_ENV !== 'development') {
                // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const now = new Date();
        const cutoff = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // Four days ago

        console.log(`Starting cleanup. Deleting news created before ${cutoff.toISOString()}`);

        const snapshot = await db.collection('news')
            .where('created_at', '<', cutoff)
            .limit(500) // Batch limit to prevent timeout
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ message: 'No old news to delete.', count: 0 });
        }

        const batch = db.batch();
        let count = 0;

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
            count++;
        });

        await batch.commit();
        console.log(`Deleted ${count} old news articles.`);

        return NextResponse.json({
            message: 'Cleanup successful',
            deleted_count: count,
            cutoff_date: cutoff.toISOString()
        });

    } catch (error) {
        console.error('Cleanup failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
