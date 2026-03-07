const admin = require('firebase-admin');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require('./portal/firebase-service-account.json'))
    });
}

const db = admin.firestore();

async function check() {
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 36);

    const snapshot = await db.collection('news')
        .where('created_at', '>=', timeLimit)
        .orderBy('created_at', 'desc')
        .limit(100)
        .get();

    console.log("Total news fetched with limit 100:", snapshot.docs.length);
    if (snapshot.docs.length > 0) {
        const oldest = snapshot.docs[snapshot.docs.length - 1].data().created_at.toDate();
        console.log("Oldest news date in subset:", oldest);
        console.log("Now from:", new Date());

        // Let's test startAfter
        const nextSnap = await db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .startAfter(oldest)
            .limit(15)
            .get();
        console.log("Next page fetched:", nextSnap.docs.length);
    }
}

check().catch(console.error);
