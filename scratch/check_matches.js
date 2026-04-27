const admin = require('firebase-admin');
const serviceAccount = require('./backend/service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkMatches() {
    console.log("Checking upcoming matches for Botafogo...");
    const threshold = new Date();
    threshold.setHours(threshold.getHours() - 3);

    const snapshot = await db.collection('matches')
        .where('date', '>=', threshold.toISOString())
        .orderBy('date', 'asc')
        .limit(100)
        .get();

    if (snapshot.empty) {
        console.log("No upcoming matches found in DB.");
        return;
    }

    const botafogoMatches = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.home_team?.includes('Botafogo') || data.away_team?.includes('Botafogo')) {
            botafogoMatches.push({
                id: doc.id,
                championship: data.championship,
                home: data.home_team,
                away: data.away_team,
                date: data.date
            });
        }
    });

    console.log(`Found ${botafogoMatches.length} upcoming matches for Botafogo:`);
    botafogoMatches.forEach(m => {
        console.log(`- [${m.championship}] ${m.home} vs ${m.away} on ${m.date}`);
    });
}

checkMatches().catch(console.error);
