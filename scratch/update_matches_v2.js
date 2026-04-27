const admin = require('firebase-admin');
const serviceAccount = require('./backend/service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function updateMatches() {
    console.log("Updating matches...");
    const matchesRef = db.collection('matches');

    // 1. Mark Botafogo x Internacional as finished
    const interSnap = await matchesRef
        .where('home_team', 'in', ['Botafogo', 'Internacional'])
        .where('away_team', 'in', ['Botafogo', 'Internacional'])
        .get();
    
    for (const doc of interSnap.docs) {
        await doc.ref.update({
            status: 'FINALIZADO',
            display_time: 'FIM DE JOGO'
        });
        console.log(`Updated ${doc.id} (Inter) to FINALIZADO`);
    }

    // 2. Add Sulamericana match
    const sulaDate = "2026-04-28T19:00:00-03:00";
    await matchesRef.add({
        home_team: "Botafogo",
        away_team: "Independiente Petrolero",
        home_team_logo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",
        away_team_logo: "https://via.placeholder.com/64?text=IND",
        date: sulaDate,
        championship: "Copa Sul-Americana",
        location: "Estádio Nilton Santos",
        stadium: "Nilton Santos",
        status: "AGENDADO",
        display_time: "19:00"
    });
    console.log("Added Sulamericana match.");

    // 3. Update Remo match to Copa do Brasil
    const remoSnap = await matchesRef
        .where('home_team', 'in', ['Botafogo', 'Remo'])
        .where('away_team', 'in', ['Botafogo', 'Remo'])
        .get();

    for (const doc of remoSnap.docs) {
        await doc.ref.update({
            championship: 'Copa do Brasil',
            status: 'AGENDADO'
        });
        console.log(`Updated ${doc.id} (Remo) to Copa do Brasil`);
    }
}

updateMatches().catch(console.error);
