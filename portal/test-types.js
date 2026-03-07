const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account-new.json');
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        projectId: 'strive-bra',
        databaseURL: 'https://strive-bra-default-rtdb.firebaseio.com'
    });
}
const db = getFirestore();

async function run() {
    const snap = await db.collection('news').orderBy('created_at', 'desc').limit(40).get();
    let timestamps = 0, strings = 0;
    snap.forEach((doc, i) => {
        let d = doc.data().created_at;
        if (typeof d === 'string') strings++;
        else timestamps++;
        if (i === 19 || i === 20 || i === 21) {
            console.log(`Item ${i}: type=${typeof d}, date=${d}`);
        }
    });
    console.log(`total: ${snap.size}. strings: ${strings}. timestamps: ${timestamps}`);
}
run();
