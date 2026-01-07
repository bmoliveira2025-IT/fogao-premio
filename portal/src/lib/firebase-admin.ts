import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import path from 'path';

if (!getApps().length) {
    let credential;

    // Check for environment variable (Vercel best practice)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = cert(serviceAccount);
        } catch (e) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
        }
    }

    // Fallback to local file (Development)
    if (!credential) {
        const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
        credential = cert(serviceAccountPath);
    }

    initializeApp({
        credential,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://coastal-epigram-392314-default-rtdb.firebaseio.com",
    });
}

const db = getFirestore();
const rtdb = getDatabase();

export { db, rtdb };
