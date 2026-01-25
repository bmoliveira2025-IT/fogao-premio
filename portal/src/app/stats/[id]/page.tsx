"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, BarChart3, Shield, Zap, TrendingUp, Award, Clock, ChevronRight, Star, Target, Activity, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PremiumGuard from '@/components/PremiumGuard';
import TabBar from '@/components/TabBar';

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
        shots_off_target?: TeamStat;
        shots_blocked?: TeamStat;
        tackles_won?: TeamStat;
        tackles_suffered?: TeamStat;
        interceptions?: TeamStat;
        duels_won_percent?: TeamStat;
    };
    motm_data?: {
        name: string;
        rating: number;
        position: string;
        contribution: string;
    };
    goalkeeper_stats?: {
        name: string;
        saves: number;
        saves_inside_box: number;
        punched_clear: number;
        high_claims: number;
        clean_sheet: boolean;
    };
    pass_map_data?: Array<{
        from: string;
        to: string;
        weight: number;
    }>;
    pass_stats?: {
        accurate_passes: TeamStat & { home_total: number; away_total: number };
        sideways_passes: TeamStat & { home_total: number; away_total: number };
        final_third_entries: TeamStat & { home_total: number; away_total: number };
        final_third_accuracy: TeamStat & { home_total: number; away_total: number };
        long_passes: TeamStat & { home_total: number; away_total: number };
        crosses: TeamStat & { home_total: number; away_total: number };
    };
    events: Array<{
        minute: number;
        team: 'home' | 'away';
        type: string;
        player?: string;
        player_in?: string;
        player_out?: string;
        assist?: string;
    }>;
}

export default function MatchStatsPage() {
    const params = useParams();
    const router = useRouter();
    const [match, setMatch] = useState<MatchStatData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(db, 'match_stats', params.id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMatch({ id: docSnap.id, ...docSnap.data() } as MatchStatData);
                }
            } catch (error) {
                console.error("Error fetching match:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [params.id]);

    const StatRow = ({ label, stats, icon: Icon, unit = "" }: { label: string, stats: TeamStat, icon: any, unit?: string }) => {
        const total = stats.home + stats.away;
        const homePercent = total === 0 ? 50 : (stats.home / total) * 100;

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                    <span className="flex items-center gap-2">
                        <Icon size={12} className="text-premium-gold/40" />
                        {label}
                    </span>
                    <span className="text-premium-gold/60">{unit}</span>
                </div>

                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-premium-gold shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: `${homePercent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs font-black font-mono">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-white text-md">{stats.home}</span>
                        <span className="text-[7px] text-white/20 uppercase tracking-tighter">Botafogo</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-white/40 text-md">{stats.away}</span>
                        <span className="text-[7px] text-white/10 uppercase tracking-tighter">Rival</span>
                    </div>
                </div>
            </div>
        );
    };

    const CircularProgress = ({ value, total, color, size = 50 }: { value: number; total: number; color: string; size?: number }) => {
        const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
        const radius = (size - 10) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className="text-white/5"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-[10px] font-black text-white">{percentage}%</span>
                </div>
            </div>
        );
    };

    const PassVolumeRow = ({ label, home, away, homeColor = "#22c55e", awayColor = "#818cf8" }: { label: string, home: number, away: number, homeColor?: string, awayColor?: string }) => {
        const total = home + away;
        const homeWidth = total === 0 ? 50 : (home / total) * 100;
        const awayWidth = 100 - homeWidth;

        return (
            <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-white font-mono">{home}</span>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</span>
                    <span className="text-xs font-black text-white/40 font-mono">{away}</span>
                </div>
                <div className="flex h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-l-full transition-all duration-1000" style={{ width: `${homeWidth}%`, backgroundColor: homeColor }} />
                    <div className="h-full rounded-r-full transition-all duration-1000" style={{ width: `${awayWidth}%`, backgroundColor: awayColor }} />
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Activity className="text-premium-gold animate-pulse" size={40} />
            </div>
        );
    }

    if (!match) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-white text-xl font-bold mb-4">Análise não encontrada</h1>
                <Link href="/" className="text-premium-gold border border-premium-gold/30 px-6 py-2 rounded-full">Voltar</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pb-32 selection:bg-premium-gold selection:text-black">
            <PremiumGuard>
                {/* Compact Sticky Header */}
                <header className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-2xl border-b border-white/5 h-16 flex items-center px-4">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 active:scale-90 transition-transform">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1 text-center px-2">
                        <h1 className="text-[10px] font-black text-premium-gold uppercase tracking-[0.3em] truncate">Análise de Dados • 2026</h1>
                    </div>
                    <div className="w-10"></div>
                </header>

                <div className="h-16"></div>

                <div className="px-4 py-6 max-w-xl mx-auto space-y-6">
                    {/* Scoreboard - Ultra Compact */}
                    <div className="p-6 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[2.5rem] border border-white/[0.02] flex flex-col items-center">
                        <span className="text-[8px] font-black text-premium-gold/50 uppercase tracking-[0.4em] mb-4">{match.championship}</span>
                        <div className="flex items-center justify-center gap-8 translate-x-1">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">{match.home_team.split(' ')[0]}</span>
                            </div>
                            <span className="text-4xl font-black italic font-display text-white">{match.score}</span>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{match.away_team.split(' ')[0]}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                            <Clock size={10} className="text-white/20" />
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                    </div>

                    {/* Jogador da Partida (MOTM) - NEW */}
                    {match.motm_data && (
                        <div className="bg-[#080808] border border-premium-gold/20 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-3xl rounded-full" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Star size={14} className="text-premium-gold fill-premium-gold/20" />
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Destaque da Partida</h2>
                                </div>
                                <div className="bg-premium-gold px-2 py-1 rounded text-[10px] font-black text-black">
                                    {match.motm_data.rating}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-premium-gold/30 transition-colors">
                                    <Award size={24} className="text-premium-gold" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white leading-none mb-1">{match.motm_data.name}</h3>
                                    <p className="text-[9px] font-bold text-premium-gold uppercase tracking-widest">{match.motm_data.position}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-[10px] text-white/40 font-medium italic">"{match.motm_data.contribution}"</p>
                            </div>
                        </div>
                    )}

                    {/* Goalkeeper Highlight - COMPACT 4x1 GRID */}
                    {match.goalkeeper_stats && (
                        <div className="bg-[#080808] border border-white/5 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-5 px-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20">
                                        <Shield size={16} className="text-premium-gold" />
                                    </div>
                                    <div>
                                        <h2 className="text-[11px] font-black uppercase tracking-wider text-white truncate max-w-[140px]">
                                            {match.goalkeeper_stats.name}
                                        </h2>
                                        <span className="text-[7px] font-bold text-premium-gold/50 uppercase tracking-widest">Muralha Alvinegra</span>
                                    </div>
                                </div>
                                {match.goalkeeper_stats.clean_sheet && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-premium-gold rounded-md">
                                        <Star size={8} className="text-black fill-black" />
                                        <span className="text-[8px] font-black text-black uppercase tracking-tighter">CLEAN SHEET</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'Defesas', val: match.goalkeeper_stats.saves },
                                    { label: 'Na Área', val: match.goalkeeper_stats.saves_inside_box },
                                    { label: 'Socos', val: match.goalkeeper_stats.punched_clear },
                                    { label: 'Aéreas', val: match.goalkeeper_stats.high_claims }
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/[0.02] rounded-xl py-3 border border-white/[0.03] flex flex-col items-center">
                                        <span className="text-base font-black text-white mb-0.5">{s.val}</span>
                                        <span className="text-[7px] font-black text-white/30 uppercase tracking-tighter">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Technical Stats - COMPACT GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#080808] border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <Target size={14} className="text-premium-gold" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Scout Técnico</h2>
                            </div>
                            <div className="space-y-6">
                                <StatRow label="Posse de Bola" stats={match.stats.possession} icon={Zap} unit="%" />
                                <StatRow label="Precisão Passe" stats={match.stats.pass_accuracy} icon={Award} unit="%" />
                                <div className="space-y-4 pt-2">
                                    <StatRow label="Finalizações Totais" stats={match.stats.shots} icon={TrendingUp} />
                                    <div className="grid grid-cols-3 gap-2 pl-4 border-l border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white">{match.stats.shots_on_target.home}</span>
                                            <span className="text-[7px] text-white/30 uppercase">No Alvo</span>
                                        </div>
                                        {match.stats.shots_off_target && (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white/60">{match.stats.shots_off_target.home}</span>
                                                <span className="text-[7px] text-white/20 uppercase">Fora</span>
                                            </div>
                                        )}
                                        {match.stats.shots_blocked && (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white/40">{match.stats.shots_blocked.home}</span>
                                                <span className="text-[7px] text-white/10 uppercase">Blocks</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {match.stats.tackles_won && (
                            <div className="bg-[#080808] border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <Shield size={14} className="text-premium-gold" />
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Combate</h2>
                                </div>
                                <div className="space-y-6">
                                    <StatRow label="Desarmes Ganhos" stats={match.stats.tackles_won} icon={Award} />
                                    <StatRow label="Intercepções" stats={match.stats.interceptions!} icon={Zap} />
                                    <StatRow label="Duelos (%)" stats={match.stats.duels_won_percent!} icon={TrendingUp} unit="%" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pass Analytics - NEW PROFESSIONAL VIEW */}
                    {match.pass_stats && (
                        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-10">
                            <div className="flex items-center gap-3">
                                <TrendingUp size={14} className="text-premium-gold" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Passes</h2>
                            </div>

                            <div className="space-y-8">
                                {/* Volume Rows */}
                                <PassVolumeRow label="Passes certos" home={match.pass_stats.accurate_passes.home} away={match.pass_stats.accurate_passes.away} />
                                <PassVolumeRow label="Laterais" home={match.pass_stats.sideways_passes.home} away={match.pass_stats.sideways_passes.away} />
                                <PassVolumeRow label="Entradas no terço final" home={match.pass_stats.final_third_entries.home} away={match.pass_stats.final_third_entries.away} />

                                {/* Accuracy Circles Rows */}
                                {[
                                    { label: 'Passes no terço final', stats: match.pass_stats.final_third_accuracy },
                                    { label: 'Passes longos', stats: match.pass_stats.long_passes },
                                    { label: 'Cruzamentos', stats: match.pass_stats.crosses }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <div className="flex flex-col items-center gap-2 w-24">
                                            <span className="text-[10px] font-bold text-white font-mono">{row.stats.home}/{row.stats.home_total}</span>
                                            <CircularProgress value={row.stats.home} total={row.stats.home_total} color="#22c55e" size={48} />
                                        </div>

                                        <span className="flex-1 text-center text-[9px] font-black text-white/30 uppercase tracking-widest px-2">
                                            {row.label}
                                        </span>

                                        <div className="flex flex-col items-center gap-2 w-24">
                                            <CircularProgress value={row.stats.away} total={row.stats.away_total} color="#818cf8" size={48} />
                                            <span className="text-[10px] font-bold text-white/40 font-mono">{row.stats.away}/{row.stats.away_total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Events Timeline - ULTRA DETAILED */}
                    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-10">
                            <Clock size={14} className="text-premium-gold" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Cronologia</h2>
                        </div>

                        <div className="relative pl-4">
                            <div className="absolute left-[23px] top-1 bottom-1 w-[2px] bg-gradient-to-b from-premium-gold/40 via-white/5 to-transparent" />

                            <div className="space-y-10">
                                {match.events.sort((a, b) => a.minute - b.minute).map((e, idx) => (
                                    <div key={idx} className="flex gap-6 relative group">
                                        {/* Minute Marker */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 border transition-all duration-500
                                            ${e.type === 'goal' ? 'bg-premium-gold border-premium-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-110' :
                                                e.type === 'substitution' ? 'bg-blue-600 border-blue-500 text-white' :
                                                    e.type === 'yellow_card' ? 'bg-yellow-500 border-yellow-400 text-black' :
                                                        e.type === 'red_card' ? 'bg-red-600 border-red-500 text-white' :
                                                            'bg-zinc-900 border-white/10 text-white/40'}`}>
                                            <span className="text-[10px] font-black">{e.minute}'</span>
                                        </div>

                                        <div className="flex-1 pt-1">
                                            {/* Team Badge */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${e.team === 'home' ? 'bg-premium-gold/10 text-premium-gold' : 'bg-white/5 text-white/30'}`}>
                                                    {e.team === 'home' ? match.home_team : match.away_team}
                                                </span>
                                            </div>

                                            {/* Event Content */}
                                            {e.type === 'goal' ? (
                                                <div className="relative group/goal">
                                                    <div className="absolute -inset-4 bg-premium-gold/5 blur-2xl rounded-full opacity-0 group-hover/goal:opacity-100 transition-opacity" />
                                                    <div className="space-y-1 relative">
                                                        <div className="flex items-center gap-2">
                                                            <div className="px-2 py-0.5 bg-premium-gold rounded text-[10px] font-black text-black uppercase tracking-tighter">GOL!</div>
                                                            <Star size={14} className="text-premium-gold fill-premium-gold/20" />
                                                        </div>
                                                        <h4 className="text-md font-black text-white tracking-tight">{e.player}</h4>
                                                        {e.assist && <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">Assistência: {e.assist}</p>}
                                                    </div>
                                                </div>
                                            ) : e.type === 'substitution' ? (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                            <ArrowUpRight size={14} className="text-green-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-white">
                                                                <span className="text-green-500/80 mr-1.5 text-[9px]">ENTRA:</span>
                                                                {e.player_in}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="h-[1px] w-full bg-white/5" />
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                            <ArrowDownLeft size={14} className="text-red-500/60" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-white/50">
                                                                <span className="text-red-500/40 mr-1.5 text-[9px]">SAI:</span>
                                                                {e.player_out}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter
                                                        ${e.type === 'yellow_card' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                                                        {e.type === 'yellow_card' ? 'Amarelo' : 'Vermelho'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-white">{e.player}</h4>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Extra */}
                    <div className="text-center py-6">
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">Central de Inteligência • Botafogo 2026</span>
                    </div>
                </div>

                <div className="lg:hidden">
                    <TabBar />
                </div>
            </PremiumGuard>
        </main>
    );
}
