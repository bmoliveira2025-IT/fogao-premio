import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

async function deleteCollection(collectionPath: string, batchSize: number) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db: any, query: any, resolve: any) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

export async function GET(request: Request) {
    try {
        // Authenticate request (basic protection) - Optional: Uncommment for production
        // const authHeader = request.headers.get('authorization');
        // if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //      if (process.env.NODE_ENV !== 'development') {
        //          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        //      }
        // }

        console.log("Starting Database Reset...");

        // Delete major collections
        await Promise.all([
            deleteCollection('news', 100),
            deleteCollection('matches', 100),
            deleteCollection('videos', 50),
            deleteCollection('squad', 100),
            deleteCollection('daily_briefings', 50)
        ]);

        console.log("Database successfully reset.");
        return NextResponse.json({ message: 'Database reset successful. All collections cleared.' });

    } catch (error) {
        console.error('Database reset failed:', error);
        return NextResponse.json({
            error: 'Failed to reset database. Note: If you are hitting Quota limits, this deletion might fail. Please delete collections manually in the Firebase Console.'
        }, { status: 500 });
    }
}
