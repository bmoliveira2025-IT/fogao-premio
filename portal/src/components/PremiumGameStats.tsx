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
        description?: string;
    }>;
}

export default function PremiumGameStats() {
    const [matches, setMatches] = useState<MatchStatData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMatchIndex, setActiveMatchIndex] = useState(0);

    // Helper for Event Types
    const getEventStyle = (type: string) => {
        switch (type) {
            case 'goal': return { color: 'bg-premium-gold text-black shadow-lg shadow-premium-gold/20', label: 'GOL!', icon: '⚽' };
            case 'yellow_card': return { color: 'bg-yellow-500 text-black', label: 'Cartão Amarelo', icon: '🟨' };
            case 'red_card': return { color: 'bg-red-600 text-white', label: 'Cartão Vermelho', icon: '🟥' };
            case 'substitution': return { color: 'bg-blue-600 text-white', label: 'Substituição', icon: '🔄' };
            case 'corner': return { color: 'bg-white/10 text-white', label: 'Escanteio', icon: '🚩' };
            case 'finalization': return { color: 'bg-white/10 text-white', label: 'Finalização', icon: '👟' };
            case 'save': return { color: 'bg-green-900/40 text-green-400', label: 'Defesa', icon: '🧤' };
            default: return { color: 'bg-black/50 border border-white/10 text-white/50', label: '', icon: '•' };
        }
    };

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

    const StatRow = ({ label, stats, icon: Icon, unit = "", homeTeam, awayTeam }: { label: string, stats: TeamStat, icon: any, unit?: string, homeTeam: string, awayTeam: string }) => {
        const total = stats.home + stats.away;
        const homePercent = total > 0 ? (stats.home / total) * 100 : 50;

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
                    <div className="flex flex-col">
                        <span className="text-white">{stats.home}{unit}</span>
                        <span className="text-[8px] text-white/20 uppercase tracking-tighter">{homeTeam.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-white/30">{stats.away}{unit}</span>
                        <span className="text-[8px] text-white/10 uppercase tracking-tighter">{awayTeam.split(' ')[0]}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="mt-12 mb-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20 shadow-[0_0_15px_rgba(var(--premium-gold),0.1)]">
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

            <div className="max-w-3xl mx-auto">
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
                                <p className="text-[9px] text-white/30 font-bold uppercase mt-1">
                                    {currentMatch.stats.possession.home > 0 ? "Finalizado" : "Ao Vivo"}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="space-y-6">
                            <StatRow label="Posse de Bola" stats={currentMatch.stats.possession} icon={Zap} unit="%" homeTeam={currentMatch.home_team} awayTeam={currentMatch.away_team} />
                            <StatRow label="Finalizações" stats={currentMatch.stats.shots} icon={TrendingUp} homeTeam={currentMatch.home_team} awayTeam={currentMatch.away_team} />
                            <StatRow label="No Alvo" stats={currentMatch.stats.shots_on_target} icon={Award} homeTeam={currentMatch.home_team} awayTeam={currentMatch.away_team} />
                            <StatRow label="Precisão de Passe" stats={currentMatch.stats.pass_accuracy} icon={ChevronRight} unit="%" homeTeam={currentMatch.home_team} awayTeam={currentMatch.away_team} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
