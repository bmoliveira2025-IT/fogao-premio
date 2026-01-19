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
            // Sanitize string: ensure all newlines are escaped as \n for JSON.parse
            // This handles cases where .env has real newlines (which break JSON) 
            // OR literal \n that might be double escaped.
            // Strategy: Convert all forms of newlines to real newlines, then escape them all to \n.
            const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
            let serviceAccount;

            try {
                // First: Try direct parse
                serviceAccount = JSON.parse(raw);
            } catch (jsonError) {
                // Second: If direct parse fails, it might be due to newlines
                // Try to handle common copy-paste issues (like newlines becoming \\n literals globally)
                try {
                    // If the error is related to control characters, try to escape them back?
                    // Or maybe the user pasted it with surrounding quotes?
                    const sanitized = raw.replace(/\n/g, '\\n');
                    serviceAccount = JSON.parse(sanitized);
                } catch (e2) {
                    // Last resort: aggressive replacement if it was completely flattened
                    const aggressivelySanitized = raw.replace(/\\n/g, '\\n');
                    serviceAccount = JSON.parse(aggressivelySanitized);
                }
            }

            // Fix Private Key (common issue where \n comes in as literal \\n)
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }

            credential = cert(serviceAccount);
            console.log("Firebase Admin initialized with FIREBASE_SERVICE_ACCOUNT env var");
        } catch (e) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
            // Don't swallow error completely for build logs
            if (process.env.NODE_ENV === 'production') {
                throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT in production: ${e}`);
            }
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
