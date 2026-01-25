"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Shield, Zap, TrendingUp, Award, BarChart3, ChevronRight } from 'lucide-react';

interface TeamStat {
    home: number;
    away: number;
}

interface MatchStatData {
    id: string;
    home_team: string;
    away_team: string;
    score: string;
    date: string;
    championship: string;
    stats: {
        possession: TeamStat;
        shots: TeamStat;
        shots_on_target: TeamStat;
        corners: TeamStat;
        pass_accuracy: TeamStat;
        fouls: TeamStat;
    };
    events: Array<{
        minute: number;
        team: 'home' | 'away';
        type: string;
        player: string;
        assist?: string;
    }>;
}

export default function PremiumGameStats() {
    const [matches, setMatches] = useState<MatchStatData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMatchIndex, setActiveMatchIndex] = useState(0);

    useEffect(() => {
        const q = query(collection(db, 'match_stats'), orderBy('date', 'desc'), limit(5));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const matchesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MatchStatData[];

            setMatches(matchesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching match stats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-64 bg-[#0a0a0a] rounded-2xl animate-pulse flex items-center justify-center border border-premium-gold/10">
                <BarChart3 className="text-premium-gold/20 w-12 h-12" />
            </div>
        );
    }

    if (matches.length === 0) return null;

    const currentMatch = matches[activeMatchIndex];

    const StatRow = ({ label, stats, icon: Icon, unit = "" }: { label: string, stats: TeamStat, icon: any, unit?: string }) => {
        const total = stats.home + stats.away;
        const homePercent = (stats.home / total) * 100;

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/40">
                    <span className="flex items-center gap-2">
                        <Icon size={12} className="text-premium-gold/60" />
                        {label}
                    </span>
                </div>

                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-premium-gold transition-all duration-1000 ease-out"
                        style={{ width: `${homePercent}%` }}
                    />
                    <div
                        className="h-full bg-white/20 transition-all duration-1000 ease-out"
                        style={{ width: `${100 - homePercent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs font-black font-mono">
                    <span className="text-white">{stats.home}{unit}</span>
                    <span className="text-white/30">{stats.away}{unit}</span>
                </div>
            </div>
        );
    };

    return (
        <section className="mt-12 mb-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        <BarChart3 size={20} className="text-premium-gold" />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-medium text-white">
                            Análise de Jogos <span className="text-premium-gold">2026</span>
                        </h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Dados Exclusivos do Botafogo</p>
                    </div>
                </div>

                {/* Match Selector Buttons */}
                <div className="flex gap-2">
                    {matches.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveMatchIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeMatchIndex === i ? 'bg-premium-gold w-6' : 'bg-white/10 hover:bg-white/20'}`}
                            aria-label={`Ver jogo ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Visual Stats Card */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent" />

                    <div className="p-6 md:p-8">
                        {/* Match Indicator */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-premium-gold uppercase tracking-widest mb-1">{currentMatch.championship}</span>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                    {currentMatch.home_team} <span className="text-premium-gold">x</span> {currentMatch.away_team}
                                </h4>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black italic text-white font-display leading-none">{currentMatch.score}</span>
                                <p className="text-[9px] text-white/30 font-bold uppercase mt-1">Finalizado</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="space-y-6">
                            <StatRow label="Posse de Bola" stats={currentMatch.stats.possession} icon={Zap} unit="%" />
                            <StatRow label="Finalizações" stats={currentMatch.stats.shots} icon={TrendingUp} />
                            <StatRow label="No Alvo" stats={currentMatch.stats.shots_on_target} icon={Award} />
                            <StatRow label="Precisão de Passe" stats={currentMatch.stats.pass_accuracy} icon={ChevronRight} unit="%" />
                        </div>
                    </div>
                </div>

                {/* Event Timeline / Facts Card */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap size={18} className="text-premium-gold fill-premium-gold/20" />
                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Principais Eventos</h4>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[21px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-premium-gold/40 via-premium-gold/10 to-transparent" />

                        <div className="space-y-8">
                            {currentMatch.events.map((event, idx) => (
                                <div key={idx} className="flex items-start gap-4 relative">
                                    <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 z-10 
                                        ${event.type === 'goal' ? 'bg-premium-gold text-black shadow-lg shadow-premium-gold/20' : 'bg-black/50 border border-white/10 text-white/50'}`}>
                                        <span className="text-xs font-black">{event.minute}'</span>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${event.team === 'home' ? 'bg-white/5 text-white/80' : 'bg-white/5 text-white/40'}`}>
                                                {event.team === 'home' ? currentMatch.home_team : currentMatch.away_team}
                                            </span>
                                            {event.type === 'goal' && <span className="text-[9px] font-black text-premium-gold uppercase tracking-widest">GOL!</span>}
                                        </div>
                                        <p className="text-sm font-bold text-white tracking-wide">{event.player}</p>
                                        {event.assist && <p className="text-[10px] text-white/40 mt-0.5">Assis: {event.assist}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Disclaimer Subtle */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Dados Exclusivos Fogão Prêmio</p>
                        <Shield size={12} className="text-white/10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
