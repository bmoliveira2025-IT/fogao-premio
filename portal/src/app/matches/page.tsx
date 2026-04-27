'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import MatchesAccordion from '@/components/MatchesAccordion';
import { Shield } from 'lucide-react';
import Link from 'next/link';

interface MatchData {
    id: string;
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    date: string;
    location: string;
    championship: string;
    status: string;
    home_team_logo?: string;
    away_team_logo?: string;
    match_id?: string;
    display_time?: string;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<MatchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'BRASILEIRAO' | 'COPA_DO_BRASIL' | 'SULAMERICANA'>('ALL');

    const championships = [
        { id: 'ALL', name: 'Todos' },
        { id: 'BRASILEIRAO', name: 'Brasileirão' },
        { id: 'COPA_DO_BRASIL', name: 'Copa do Brasil' },
        { id: 'SULAMERICANA', name: 'Sulamericana' },
    ] as const;

    useEffect(() => {
        setLoading(true);
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 24); // Show games from last 24h onwards

        let q = query(
            collection(db, 'matches'),
            where('date', '>=', threshold.toISOString()),
            orderBy('date', 'asc'),
            limit(20)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const matchesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];
            
            // Basic serialization
            const serialized = matchesData.map(data => ({
                ...data,
                date: data.date,
                home_team_logo: data.home_team_logo || data.home_logo,
                away_team_logo: data.away_team_logo || data.away_logo,
            }));

            setMatches(serialized);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const filteredMatches = filter === 'ALL' 
        ? matches 
        : matches.filter(m => {
            const champ = m.championship?.toLowerCase() || '';
            if (filter === 'BRASILEIRAO') return champ.includes('brasileir');
            if (filter === 'COPA_DO_BRASIL') return champ.includes('copa') || champ.includes('brasil');
            if (filter === 'SULAMERICANA') return champ.includes('sula');
            return true;
        });

    const upcoming = filteredMatches.filter(m => {
        const status = m.status?.toLowerCase();
        return status !== 'finalizado' && status !== 'encerrada';
    });

    const past = filteredMatches.filter(m => {
        const status = m.status?.toLowerCase();
        return status === 'finalizado' || status === 'encerrada';
    });

    return (
        <div className="w-full min-h-screen bg-[#0a0a0a] text-foreground pt-20 lg:pt-24">
            <div className="container mx-auto px-4 max-w-4xl pb-32">
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-[0.2em] mb-4 text-center">
                        Calendário <span className="text-premium-gold">2026</span>
                    </h1>
                    <div className="h-1 w-20 bg-premium-gold rounded-full" />
                </div>

                {/* Tournament Filter */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 justify-center">
                    {championships.map((champ) => (
                        <button
                            key={champ.id}
                            onClick={() => setFilter(champ.id)}
                            className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                            ${filter === champ.id 
                                ? 'bg-premium-gold text-black border-premium-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                                : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20'}`}
                        >
                            {champ.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Carregando jogos...</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* UPCOMING MATCHES */}
                        <div>
                            {upcoming.length > 0 ? (
                                <MatchesAccordion matches={upcoming} title="Próximos Jogos" />
                            ) : (
                                <div className="text-center py-10 glass-ultra rounded-3xl border border-white/5">
                                    <Shield className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nenhum jogo futuro para este filtro</p>
                                </div>
                            )}
                        </div>

                        {/* PAST MATCHES */}
                        {past.length > 0 && (
                            <div className="opacity-70">
                                <MatchesAccordion matches={past} title="Jogos Recentes" />
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation Link */}
                <div className="mt-16 flex justify-center">
                    <Link 
                        href="/tabela" 
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-premium-gold hover:text-black hover:border-premium-gold transition-all group"
                    >
                        Ver Classificação Completa
                        <Shield size={16} className="group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
