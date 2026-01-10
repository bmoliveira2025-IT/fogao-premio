import { NextResponse } from 'next/server';
import { messaging } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        // Optional: security check
        // const authHeader = req.headers.get('authorization');
        // if (authHeader !== 'Bearer YOUR_SECRET_KEY') { ... }

        const title = "Resumo do Dia - Fogão Prêmio";
        const body = "Confira as principais notícias e destaques de hoje no mundo do Botafogo. 🌟";

        // Topic to send to (must match what users subscribe to in NotificationManager)
        const topic = 'news';

        const message = {
            notification: {
                title,
                body,
            },
            topic: topic,
            webpush: {
                fcmOptions: {
                    link: 'https://info-sphere-pro.vercel.app/' // Opens the app on click
                },
                notification: {
                    icon: '/icon.png',
                    badge: '/icon.png',
                    requireInteraction: true
                }
            }
        };

        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);

        return NextResponse.json({ success: true, messageId: response });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
