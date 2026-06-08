import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { botafogoSchedule } from '@/data/schedule';
import { detectCategoryKey } from '@/lib/news-utils';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        const notifications: any[] = [];
        
        // 1. Fetch recent news (last 72 hours)
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - 72);

        const newsRef = db.collection('news')
            .where('created_at', '>=', timeLimit)
            .orderBy('created_at', 'desc')
            .limit(50);
            
        const newsSnap = await newsRef.get();
        
        newsSnap.forEach(doc => {
            const data = doc.data();
            const title = data.title || '';
            const category = detectCategoryKey(title);
            
            // Only alert for Mercado (contratações), Medico (desfalques) or if it's explicitly breaking/urgente
            const isUrgent = title.toLowerCase().includes('urgente') || title.toLowerCase().includes('plantão');
            
            if (category === 'mercado' || category === 'medico' || isUrgent) {
                const createdAt = data.created_at?.toDate() || new Date();
                
                notifications.push({
                    id: doc.id,
                    title: title,
                    dateStr: createdAt.toISOString(),
                    timestamp: createdAt.getTime(),
                    type: category === 'mercado' ? 'NEWS_MERCADO' : (category === 'medico' ? 'NEWS_MEDICO' : 'NEWS_URGENT')
                });
            }
        });

        // 2. Fetch recently finished matches (last 48 hours)
        const matchTimeLimit = new Date();
        matchTimeLimit.setHours(matchTimeLimit.getHours() - 48);
        
        // We can also fetch from Firestore matches collection just in case
        const upcomingMatchesRef = db.collection('matches')
          .where('date', '>=', matchTimeLimit.toISOString())
          .orderBy('date', 'asc')
          .limit(20);
        
        const matchesSnap = await upcomingMatchesRef.get();
        const firestoreFinishedMatches = new Set();
        matchesSnap.forEach(doc => {
            const data = doc.data();
            const status = (data.status || '').toUpperCase();
            if (status === 'FINALIZADO' || status === 'ENCERRADA') {
                let dateStr = '';
                if (typeof data.date === 'string') dateStr = data.date.split('T')[0];
                else if (data.date?.toDate) dateStr = data.date.toDate().toISOString().split('T')[0];
                
                if (dateStr && data.home_team && data.away_team && data.home_score !== undefined && data.away_score !== undefined && data.home_score !== null && data.away_score !== null) {
                    const key = `${dateStr}|${data.home_team}|${data.away_team}`;
                    if (!firestoreFinishedMatches.has(key)) {
                        firestoreFinishedMatches.add(key);
                        const matchDate = data.date?.toDate ? data.date.toDate() : new Date(data.date);
                        notifications.push({
                            id: doc.id,
                            title: `Fim de jogo: ${data.home_team} ${data.home_score} x ${data.away_score} ${data.away_team}`,
                            dateStr: matchDate.toISOString(),
                            timestamp: matchDate.getTime() + (2 * 60 * 60 * 1000), // add 2h to match start time to approximate finish time
                            type: 'MATCH_RESULT'
                        });
                    }
                }
            }
        });

        // Add from static schedule if not already in firestore
        const recentMatches = botafogoSchedule.filter(m => {
            const matchDate = new Date(m.date);
            return matchDate >= matchTimeLimit && matchDate <= new Date() && (m.status === 'FINALIZADO' || m.status === 'ENCERRADA' || matchDate.getTime() < new Date().getTime() - 4 * 60 * 60 * 1000); 
        });

        recentMatches.forEach(m => {
            const dateStr = new Date(m.date).toISOString().split('T')[0];
            const key = `${dateStr}|${m.home_team}|${m.away_team}`;
            if (!firestoreFinishedMatches.has(key) && m.home_score !== undefined && m.away_score !== undefined && m.home_score !== null && m.away_score !== null) {
                const matchDate = new Date(m.date);
                notifications.push({
                    id: m.id || `${m.date}-${m.home_team}`,
                    title: `Fim de jogo: ${m.home_team} ${m.home_score} x ${m.away_score} ${m.away_team}`,
                    dateStr: matchDate.toISOString(),
                    timestamp: matchDate.getTime() + (2 * 60 * 60 * 1000),
                    type: 'MATCH_RESULT'
                });
            }
        });

        // 3. Fetch Daily Briefing
        const briefingRef = db.collection('daily_briefings').orderBy('created_at', 'desc').limit(1);
        const briefingSnap = await briefingRef.get();
        if (!briefingSnap.empty) {
            const b = briefingSnap.docs[0];
            const data = b.data();
            const createdAt = data.created_at?.toDate() || new Date();
            // check if it's within 48h
            if (createdAt >= matchTimeLimit) {
                notifications.push({
                    id: b.id,
                    title: `Resumo Diário: Edição ${data.edition || 'Atualizada'}`,
                    dateStr: createdAt.toISOString(),
                    timestamp: createdAt.getTime(),
                    type: 'DAILY_BRIEFING'
                });
            }
        }

        // 4. Sort by timestamp descending
        notifications.sort((a, b) => b.timestamp - a.timestamp);

        // Limit to top 15
        const topNotifications = notifications.slice(0, 15);

        return NextResponse.json(topNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
