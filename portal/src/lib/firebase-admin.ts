import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import path from 'path';

if (!getApps().length) {
    let credential;

    // 1. Try Environment Variable (Production/Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = cert(serviceAccount);
            console.log("Firebase Admin initialized with FIREBASE_SERVICE_ACCOUNT env var");
        } catch (e) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
        }
    }

    // 2. Fallback to local file (Development)
    if (!credential) {
        try {
            // We use 'fs' to check existence to avoid crashing 'cert' if missing
            const fs = require('fs');
            const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

            if (fs.existsSync(serviceAccountPath)) {
                credential = cert(serviceAccountPath);
                console.log("Firebase Admin initialized with local service-account.json");
            } else {
                console.warn("No 'FIREBASE_SERVICE_ACCOUNT' env var and no 'service-account.json' found.");
            }
        } catch (e) {
            console.error("Error looading local credential:", e);
        }
    }

    // 3. Initialize (or fail gracefully/throw if strict)
    // Note: If credential is null, initializeApp will fail or try Google Application Default Credentials.
    // For Vercel, we ideally want to fail if we can't connect, but let's allow Default Creds as last resort.

    if (credential) {
        initializeApp({
            credential,
            projectId: "coastal-epigram-392314",
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://coastal-epigram-392314-default-rtdb.firebaseio.com",
        });
    } else {
        // Attempt default (e.g. if Vercel has other Google Cloud integration, though unlikely for Firebase Admin without config)
        // Or just let it crash with a better message if accessed
        console.warn("Running Firebase Admin without explicit credentials. Access might fail.");
        initializeApp({
            projectId: "coastal-epigram-392314",
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://coastal-epigram-392314-default-rtdb.firebaseio.com",
        });
    }
}

const db = getFirestore();
const rtdb = getDatabase();

export { db, rtdb };
