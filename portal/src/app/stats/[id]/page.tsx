"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, BarChart3, Shield, Zap, TrendingUp, Award, Clock, ChevronRight, Star, Target, Activity, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import MatchStatsLineup from '@/components/MatchStatsLineup';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamStat {
    home: number;
    away: number;
}

interface Player {
    name: string;
    position: string;
    number: number;
    x: number;
    y: number;
    rating?: number;
}

interface LineupData {
    formation: string;
    players: Player[];
}

interface MatchStatData {
    id: string;
    home_team: string;
    away_team: string;
    score: string;
    home_score: number;
    away_score: number;
    status: string;
    date: string;
    championship: string;
    lineups?: {
        home: LineupData;
        away: LineupData;
    };
    stats: {
        possession: TeamStat;
        shots: TeamStat;
        shots_on_target?: TeamStat;
        shots_off_target?: TeamStat;
        shots_blocked?: TeamStat;
        corners?: TeamStat;
        pass_accuracy?: TeamStat;
        fouls?: TeamStat;
        tackles_won?: TeamStat;
        tackles_suffered?: TeamStat;
        interceptions?: TeamStat;
        duels_won_percent?: TeamStat;
        offsides?: TeamStat;
        big_chances?: TeamStat;
        big_chances_missed?: TeamStat;
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
        accurate_passes: { home: number; away: number; home_total: number; away_total: number };
        sideways_passes: { home: number; away: number; home_total: number; away_total: number };
        final_third_entries: { home: number; away: number; home_total: number; away_total: number };
        final_third_accuracy: { home: number; away: number; home_total: number; away_total: number };
        long_passes: { home: number; away: number; home_total: number; away_total: number };
        crosses: { home: number; away: number; home_total: number; away_total: number };
    };
    player_stats?: {
        home: Array<{ name: string; position: string; rating: number; goals: number; assists: number; shots: number; passes: number }>;
        away: Array<{ name: string; position: string; rating: number; goals: number; assists: number; shots: number; passes: number }>;
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
        // Force scroll to top on mount
        window.scrollTo(0, 0);
    }, [params.id]);

    const StatRow = ({ label, stats, icon: Icon, unit = "", homeTeam, awayTeam }: { label: string, stats: TeamStat, icon: any, unit?: string, homeTeam: string, awayTeam: string }) => {
        if (!stats) return null;

        const isBotafogoHome = homeTeam.toUpperCase().includes("BOTAFOGO");
        const botafogoLabel = isBotafogoHome ? homeTeam.split(' ')[0] : awayTeam.split(' ')[0];
        const rivalLabel = isBotafogoHome ? awayTeam.split(' ')[0] : homeTeam.split(' ')[0];
        const botafogoVal = isBotafogoHome ? stats.home : stats.away;
        const rivalVal = isBotafogoHome ? stats.away : stats.home;

        const total = stats.home + stats.away;
        const homePercent = total === 0 ? 50 : (stats.home / total) * 100;

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-black uppercase tracking-widest text-white/90">
                    <span className="flex items-center gap-2">
                        <Icon size={16} className="text-premium-gold" />
                        {label}
                    </span>
                    <span className="text-premium-gold font-bold">{unit}</span>
                </div>

                <div className="relative h-3 w-full bg-white/20 rounded-full overflow-hidden flex shadow-inner">
                    <div
                        className="h-full bg-premium-gold shadow-[0_0_20px_rgba(var(--premium-gold),0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${homePercent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-sm font-black font-mono">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-white text-xl leading-none">{stats.home}</span>
                        <span className="text-[14px] text-white/50 uppercase tracking-tighter">{homeTeam.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-white/80 text-xl leading-none">{stats.away}</span>
                        <span className="text-[14px] text-white/30 uppercase tracking-tighter">{awayTeam.split(' ')[0]}</span>
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

    const PassVolumeRow = ({ label, home, away, homeTeam, awayTeam, homeColor = "#22c55e", awayColor = "#818cf8" }: { label: string, home: number, away: number, homeTeam: string, awayTeam: string, homeColor?: string, awayColor?: string }) => {
        const total = home + away;
        const homeWidth = total === 0 ? 50 : (home / total) * 100;
        const awayWidth = 100 - homeWidth;

        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1 gap-2">
                    <span className="text-2xl font-black text-white font-mono">{home}</span>
                    <span className="text-[12px] md:text-[14px] font-black text-white/90 uppercase tracking-[0.1em] text-center flex-1 leading-tight">
                        {label}
                    </span>
                    <span className="text-2xl font-black text-white/60 font-mono">{away}</span>
                </div>
                <div className="flex h-3 w-full bg-white/20 rounded-full overflow-hidden shadow-lg">
                    <div className="h-full rounded-l-full transition-all duration-1000" style={{ width: `${homeWidth}%`, backgroundColor: homeColor }} />
                    <div className="h-full rounded-r-full transition-all duration-1000" style={{ width: `${awayWidth}%`, backgroundColor: awayColor }} />
                </div>
            </div>
        );
    };

    const [activeTab, setActiveTab] = useState<'resumo' | 'stats' | 'lineup'>('resumo');

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Activity className="text-premium-gold animate-pulse" size={40} />
            </div>
        );
    }

    if (!match) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-zinc-900 text-xl font-bold mb-4">Análise não encontrada</h1>
                <Link href="/" className="text-premium-gold border border-premium-gold/30 px-6 py-2 rounded-full">Voltar</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground dark:text-white pb-8 lg:pb-32 selection:bg-premium-gold selection:text-black font-sans">
            {/* Ultra Compact Non-Sticky Header */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-3xl border-b border-zinc-200 h-11 flex items-center px-4 shadow-sm">
                <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 active:scale-90 transition-transform">
                    <ChevronLeft size={18} />
                </button>
                <div className="flex-1 text-center px-2">
                    <h1 className="text-base font-black text-premium-gold uppercase tracking-[0.3em] truncate">Análise de Dados • 2026</h1>
                </div>
                <div className="w-8"></div>
            </header>

            <div className="px-4 pt-14 pb-12 max-w-xl mx-auto space-y-6">
                {/* Scoreboard - Ultra Compact */}
                <div className="p-4 bg-gradient-to-b from-white/[0.03] to-transparent rounded-xl border border-white/[0.02] flex flex-col items-center">
                    <span className="text-[12px] font-black text-premium-gold/50 uppercase tracking-[0.4em] mb-2">{match.championship || "Brasileirão Betano"}</span>
                    <div className="flex items-center justify-center gap-8 translate-x-1">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[14px] font-black uppercase text-white tracking-widest">{match.home_team.split(' ')[0]}</span>
                        </div>
                        <span className="text-4xl font-black italic font-display text-white">
                            {match.home_score !== undefined && match.home_score !== null ?
                                `${match.home_score} - ${match.away_score}` :
                                (match.score || "0 - 0")}
                        </span>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[14px] font-black uppercase text-white/40 tracking-widest">{match.away_team.split(' ')[0]}</span>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 shadow-lg">
                        <Clock size={12} className="text-white/40" />
                        <span className="text-[12px] font-bold text-white/60 uppercase tracking-widest">
                            {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md sticky top-12 z-50">
                    {[
                        { id: 'resumo', label: 'Resumo' },
                        { id: 'stats', label: 'Estatísticas' },
                        { id: 'lineup', label: 'Formações' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'bg-premium-gold text-black shadow-lg shadow-premium-gold/20' : 'text-white/40 hover:text-white/60'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {activeTab === 'resumo' && (
                            <div className="space-y-4">
                                {/* Jogador da Partida (MOTM) */}
                                {match.motm_data && (
                                    <div className="bg-[#080808] border border-premium-gold/20 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-3xl rounded-full" />
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Star size={14} className="text-premium-gold fill-premium-gold/20" />
                                                <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white/50">Destaque da Partida</h2>
                                            </div>
                                            <div className="bg-premium-gold px-2 py-1 rounded text-[14px] font-black text-black">
                                                {match.motm_data.rating}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-premium-gold/30 transition-colors">
                                                <Award size={24} className="text-premium-gold" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white leading-none mb-1">{match.motm_data.name}</h3>
                                                <p className="text-[13px] font-bold text-premium-gold uppercase tracking-widest">{match.motm_data.position}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/20">
                                            <p className="text-[17px] text-white/80 font-medium italic leading-relaxed">"{match.motm_data.contribution}"</p>
                                        </div>
                                    </div>
                                )}

                                {/* Goalkeeper Highlight */}
                                {match.goalkeeper_stats && (
                                    <div className="bg-[#080808] border border-white/5 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-5 px-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20">
                                                    <Shield size={16} className="text-premium-gold" />
                                                </div>
                                                <div>
                                                    <h2 className="text-base font-black uppercase tracking-wider text-white truncate max-w-[140px]">
                                                        {match.goalkeeper_stats.name}
                                                    </h2>
                                                    <span className="text-[11px] font-bold text-premium-gold/50 uppercase tracking-widest">Muralha Alvinegra</span>
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
                                                    <span className="text-xl font-black text-white mb-0.5">{s.val}</span>
                                                    <span className="text-[11px] font-black text-white/30 uppercase tracking-tighter">{s.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <div className="space-y-6">
                                {/* Visão Geral */}
                                <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                                    <div className="flex items-center gap-3">
                                        <BarChart3 size={14} className="text-premium-gold" />
                                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Visão Geral</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <StatRow label="Posse de Bola" stats={match.stats.possession} icon={Zap} unit="%" homeTeam={match.home_team} awayTeam={match.away_team} />
                                        <StatRow label="Finalizações" stats={match.stats.shots} icon={TrendingUp} homeTeam={match.home_team} awayTeam={match.away_team} />
                                        {match.stats.shots_on_target && <StatRow label="No Alvo" stats={match.stats.shots_on_target} icon={Target} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                        {match.stats.big_chances && <StatRow label="Grandes Chances" stats={match.stats.big_chances} icon={Award} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                    </div>
                                </div>

                                {/* Ataque */}
                                <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                                    <div className="flex items-center gap-3">
                                        <ArrowUpRight size={14} className="text-premium-gold" />
                                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Ataque</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {match.stats.corners && <StatRow label="Escanteios" stats={match.stats.corners} icon={Activity} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                        {match.stats.offsides && <StatRow label="Impedimentos" stats={match.stats.offsides} icon={AlertCircle} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                        {match.stats.big_chances_missed && <StatRow label="Chances Perdidas" stats={match.stats.big_chances_missed} icon={ArrowDownLeft} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                    </div>
                                </div>

                                {/* Passes */}
                                {match.pass_stats && (
                                    <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Activity size={14} className="text-premium-gold" />
                                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Passes</h2>
                                        </div>
                                        <div className="space-y-6">
                                            <PassVolumeRow label="Passes certos" home={match.pass_stats.accurate_passes.home} away={match.pass_stats.accurate_passes.away} homeTeam={match.home_team} awayTeam={match.away_team} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 text-center">Cruzamentos</span>
                                                    <CircularProgress value={match.pass_stats.crosses.home} total={match.pass_stats.crosses.home_total} color="#d4af37" size={60} />
                                                </div>
                                                <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 text-center">Bolas Longas</span>
                                                    <CircularProgress value={match.pass_stats.long_passes.home} total={match.pass_stats.long_passes.home_total} color="#d4af37" size={60} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Defesa */}
                                <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Shield size={14} className="text-premium-gold" />
                                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Defesa</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {match.stats.tackles_won && <StatRow label="Desarmes" stats={match.stats.tackles_won} icon={Activity} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                        {match.stats.interceptions && <StatRow label="Interceptações" stats={match.stats.interceptions} icon={Zap} homeTeam={match.home_team} awayTeam={match.away_team} />}
                                        {match.stats.duels_won_percent && <StatRow label="Duelos Ganhos" stats={match.stats.duels_won_percent} icon={Award} unit="%" homeTeam={match.home_team} awayTeam={match.away_team} />}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'lineup' && (
                            <div className="py-4">
                                {match.lineups ? (
                                    <MatchStatsLineup
                                        home={match.lineups.home}
                                        away={match.lineups.away}
                                        homeTeamName={match.home_team}
                                        awayTeamName={match.away_team}
                                    />
                                ) : (
                                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                        <Activity className="mx-auto text-white/20 mb-4" size={40} />
                                        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Formações indisponíveis</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Footer Extra */}
                <div className="text-center py-6">
                    <span className="text-[12px] font-black text-white/10 uppercase tracking-[0.5em]">Central de Inteligência • Botafogo 2026</span>
                </div>
            </div>

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main>
    );
}
