import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import { getMessaging } from 'firebase-admin/messaging';
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
            const fs = require('fs');
            // FORCE NEW JSON
            const serviceAccountPath = path.join(process.cwd(), 'service-account-new.json');

            if (fs.existsSync(serviceAccountPath)) {
                credential = cert(serviceAccountPath);
                console.log("Firebase Admin FORCE-LOADED: service-account-new.json");
            } else {
                // Try old one as backup but warn
                const oldPath = path.join(process.cwd(), 'service-account.json');
                if (fs.existsSync(oldPath)) {
                    credential = cert(oldPath);
                    console.log("Firebase Admin LOADED OLD: service-account.json (WARNING: Might use old project)");
                }
            }
        } catch (e) {
            console.error("Error loading local credential:", e);
        }
    }

    if (credential) {
        const config = {
            credential,
            projectId: "strive-bra",
            databaseURL: "https://strive-bra-default-rtdb.firebaseio.com"
        };
        console.log("Initializing Firebase with config:", config.projectId);
        initializeApp(config);
    } else {
        console.warn("Running Firebase Admin without explicit credentials.");
        initializeApp({
            projectId: "strive-bra",
            databaseURL: "https://strive-bra-default-rtdb.firebaseio.com"
        });
    }
}

const db = getFirestore();
const rtdb = getDatabase();
const messaging = getMessaging();

export { db, rtdb, messaging };
