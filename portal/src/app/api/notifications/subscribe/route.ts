
import { type NextRequest, NextResponse } from 'next/server';
import { messaging } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Subscribe the token to the 'news' topic
        await messaging.subscribeToTopic(token, 'news');

        console.log(`Successfully subscribed token to topic "news": ${token.slice(0, 10)}...`);

        return NextResponse.json({ success: true, message: 'Subscribed to news topic' });
    } catch (error: any) {
        console.error('Error subscribing to topic:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
