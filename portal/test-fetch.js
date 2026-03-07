require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Fallback to local file if no env var
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = require('./service-account-new.json');
        if (!getApps().length) {
            initializeApp({
                credential: cert(serviceAccount),
                projectId: 'strive-bra',
                databaseURL: 'https://strive-bra-default-rtdb.firebaseio.com'
            });
        }
    } catch (e) { console.error("Could not load local service account", e); }
} else {
    try {
        let raw = process.env.FIREBASE_SERVICE_ACCOUNT;
        let serviceAccount = JSON.parse(raw.replace(/\\n/g, '\\n'));
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        if (!getApps().length) {
            initializeApp({
                credential: cert(serviceAccount),
                projectId: 'strive-bra',
                databaseURL: 'https://strive-bra-default-rtdb.firebaseio.com'
            });
        }
    } catch (e) { console.error("Could not parse env var"); }
}

const db = getFirestore();

async function check() {
    console.log("Fetching latest 50 news...");
    const snap = await db.collection('news').orderBy('created_at', 'desc').limit(50).get();
    console.log("Fetched", snap.size, "news.");

    let strings = 0;
    let timestamps = 0;
    let oldest = new Date();

    snap.docs.forEach((doc, i) => {
        const data = doc.data();
        if (typeof data.created_at === 'string') {
            strings++;
        } else if (data.created_at && data.created_at.toDate) {
            timestamps++;
        }

        let d = data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at);
        if (d < oldest) oldest = d;

        if (i === snap.size - 1) {
            console.log("Last item date:", d.toISOString(), "Title:", data.title);
        }
        if (i === 0) {
            console.log("First item date:", d.toISOString(), "Title:", data.title);
        }
    });

    console.log(`Found ${timestamps} Timestamps and ${strings} strings.`);
    console.log(`Oldest retrieved in top 50: ${oldest.toISOString()}`);
}

check().catch(console.error);
