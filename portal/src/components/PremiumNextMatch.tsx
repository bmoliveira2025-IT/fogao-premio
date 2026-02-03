'use client';

import { useState, useEffect } from 'react';
import { Shield, MapPin, ChevronDown, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSafeImageSrc } from '@/lib/images';

interface MatchData {
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
    transmission?: string;
    display_time?: string; // New field for "15'" or "INT"
    match_id?: string;
}

import Link from 'next/link';

import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function PremiumNextMatch({ match, className }: { match?: MatchData | null, className?: string }) {
    const [isOpen, setIsOpen] = useState(true);
    const [liveMatch, setLiveMatch] = useState<MatchData | null>(null);

    // Listen for real-time updates to 'next_match' - fetch immediately on mount
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "matches", "next_match"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setLiveMatch({
                    home_team: data.home_team,
                    away_team: data.away_team,
                    home_score: data.home_score,
                    away_score: data.away_score,
                    date: data.date,
                    location: data.location,
                    championship: data.championship,
                    status: data.status,
                    home_team_logo: data.home_team_logo,
                    away_team_logo: data.away_team_logo,
                    transmission: data.transmission,
                    display_time: data.display_time,
                    match_id: data.match_id,
                } as MatchData);
            }
        });
        return () => unsub();
    }, []);

    // Priority: Live > Prop > Fallback
    const data = liveMatch || match || {
        home_team: "BOTAFOGO",
        away_team: "ADVERSÁRIO",
        home_score: 0,
        away_score: 0,
        date: new Date().toISOString(),
        location: "A definir",
        championship: "Campeonato",
        status: "scheduled",
        home_team_logo: "",
        away_team_logo: ""
    };

    const matchDate = new Date(data.date);
    const dateString = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' }).toUpperCase();
    const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

    // Aggressive Status Detection
    const status = data.status?.toUpperCase().trim() || '';
    const displayTime = data.display_time?.toUpperCase().trim() || '';
    const hasGameTime = data.display_time?.includes("'");

    const isLive = status === 'AO_VIVO' || status === 'EM_ANDAMENTO' || status === 'INTERVALO' || hasGameTime;

    // Robust finished check - rely on status markers
    const isFinishedStatus =
        ['ENCERRADA', 'FINALIZADO', 'FIM_DE_JOGO', 'CONCLUÍDO', 'FIM'].includes(status) ||
        ['FIM DE JOGO', 'ENCERRADA', 'FINALIZADO', 'TERMINADO'].includes(displayTime);

    // Time-based check: If match started more than 6 hours ago and isn't marked as LIVE, assume finished
    // This handles cases where backend hasn't updated the status e.g. "Agendado" but date passed
    const now = new Date();
    const hoursSinceStart = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
    const isOldMatch = hoursSinceStart > 6;

    const isFinished = isFinishedStatus || isOldMatch;

    // Filter out finished games - User requested to ONLY show next game
    if (isFinished) return null;

    // Show score if live (removed finished check as we return null)
    const hasScore = (data.home_score !== undefined && data.home_score !== null && data.home_score > 0) ||
        (data.away_score !== undefined && data.away_score !== null && data.away_score > 0);

    const showScore = isLive || hasScore; // Removed isFinished

    return (
        <div
            className={cn("w-full transition-all duration-300 overflow-hidden bg-transparent border-y md:border rounded-none md:rounded-xl shadow-2xl relative z-[100]", className)}
            style={{
                borderColor: 'var(--border-color)'
            }}
        >
            {/* Gold Top & Bottom Borders */}
            <div
                className="absolute top-0 left-0 w-full h-[2px] opacity-70 z-20 bg-gradient-to-r from-transparent via-premium-gold dark:via-premium-gold light:via-zinc-300 to-transparent"
            />
            <div
                className="absolute bottom-0 left-0 w-full h-[2px] opacity-70 z-20 bg-gradient-to-r from-transparent via-premium-gold dark:via-premium-gold light:via-zinc-300 to-transparent"
            />
            {/* Header Style (Clickable to Toggle) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full relative flex items-center justify-between p-4 border-b hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                style={{
                    borderColor: 'rgba(184, 134, 11, 0.2)'
                }}
            >
                <div className="flex items-center space-x-3 text-left opacity-0 pointer-events-none">
                    {/* Spacer to maintain layout if needed, or remove */}
                    <div className="w-10 h-10" />
                </div>

                {/* Centered Teams Text - Absolute Positioning for Perfect Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center leading-tight pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap text-foreground">
                        {data.home_team} <span className="text-premium-gold dark:text-premium-gold light:text-zinc-400 mx-0.5">X</span> {data.away_team}
                    </span>
                    <span className="text-[9px] font-medium opacity-30 capitalize" style={{ color: 'var(--foreground)' }}>
                        {data.championship}
                        {isLive && <span className="ml-2 text-red-500 font-bold animate-pulse">• AO VIVO</span>}
                    </span>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ChevronDown
                        size={16}
                        className={cn("text-premium-gold dark:text-premium-gold light:text-zinc-400 transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
                    />
                </div>
            </button>


            {/* Content Style (AnimatePresence for smooth expand/collapse) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-4 pb-5 pt-4">
                            <div className="flex items-center py-4 relative h-20">
                                {/* Home Logo */}
                                <div className="absolute left-6">
                                    <div className="w-12 h-12 relative drop-shadow-md">
                                        {data.home_team_logo ? (
                                            <img src={getSafeImageSrc(data.home_team_logo)} alt={data.home_team} className="w-full h-full object-contain" />
                                        ) : (
                                            <Shield size={32} className="text-white/20" />
                                        )}
                                    </div>
                                </div>

                                {/* CENTER: Date & Time OR Score */}
                                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                                    {isFinished ? (
                                        <Link href={`/stats/${data.match_id}`} className="group cursor-pointer">
                                            <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-200">
                                                <div className="flex items-center gap-4 text-3xl font-black italic font-display leading-none group-hover:text-premium-gold transition-colors" style={{ color: 'var(--foreground)' }}>
                                                    <span>{data.home_score}</span>
                                                    <span className="text-premium-gold/50 text-xl">x</span>
                                                    <span>{data.away_score}</span>
                                                </div>
                                                <span className="mt-2 text-[10px] font-bold text-premium-gold uppercase tracking-widest bg-premium-gold/10 px-2 py-0.5 rounded border border-premium-gold/20 group-hover:bg-premium-gold group-hover:text-black transition-colors">
                                                    {data.display_time || data.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            {showScore ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-4 text-3xl font-black italic font-display leading-none" style={{ color: 'var(--foreground)' }}>
                                                        <span>{data.home_score}</span>
                                                        <span className="text-premium-gold/50 text-xl">x</span>
                                                        <span>{data.away_score}</span>
                                                    </div>
                                                    <span className="mt-2 text-[10px] font-bold text-premium-gold uppercase tracking-widest bg-premium-gold/10 px-2 py-0.5 rounded border border-premium-gold/20">
                                                        {data.display_time || data.status}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center bg-transparent border border-premium-gold/20 dark:border-premium-gold/20 light:border-zinc-200 rounded-xl px-4 py-2 shadow-lg backdrop-blur-sm">
                                                    <span className="text-[10px] font-black text-premium-gold dark:text-premium-gold light:text-zinc-900 uppercase tracking-[0.2em] mb-1">
                                                        {matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase()}
                                                    </span>
                                                    <div className="h-px w-8 bg-premium-gold/30 dark:bg-premium-gold/30 light:bg-zinc-300 mb-1" />
                                                    <span className="text-sm font-mono font-bold tracking-widest text-foreground">
                                                        {timeString}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Away Logo */}
                                <div className="absolute right-6">
                                    <div className="w-12 h-12 relative drop-shadow-md">
                                        {data.away_team_logo ? (
                                            <img src={getSafeImageSrc(data.away_team_logo)} alt={data.away_team} className="w-full h-full object-contain" />
                                        ) : (
                                            <Shield size={32} className="text-white/20" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-2">
                                <div className="inline-flex items-center space-x-2 text-[10px] opacity-40 bg-white/5 px-4 py-1.5 rounded-full border border-white/5" style={{ color: 'var(--foreground)' }}>
                                    <MapPin size={10} className="text-premium-gold/50" />
                                    <span>{data.location}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Modern Bottom Analysis Button - Always Visible for Finished Games */}
            {isFinished && data.match_id && (
                <div className="px-4 pb-4">
                    <Link href={`/stats/${data.match_id}`} className="block">
                        <div className="w-full py-3.5 bg-white/5 border border-premium-gold/20 dark:border-premium-gold/20 light:border-zinc-200 hover:border-premium-gold/50 dark:hover:border-premium-gold/50 light:hover:border-zinc-400 hover:bg-premium-gold/5 dark:hover:bg-premium-gold/5 light:hover:bg-zinc-100 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 group backdrop-blur-md">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-gold dark:text-premium-gold light:text-zinc-800 group-hover:text-white dark:group-hover:text-white light:group-hover:text-black transition-colors">
                                Veja a Análise Completa
                            </span>
                            <div className="w-5 h-5 rounded-full bg-premium-gold/10 dark:bg-premium-gold/10 light:bg-zinc-200 flex items-center justify-center group-hover:bg-premium-gold dark:group-hover:bg-premium-gold light:group-hover:bg-zinc-300 transition-all duration-300">
                                <ChevronDown size={12} className="text-premium-gold dark:text-premium-gold light:text-zinc-600 group-hover:text-black -rotate-90 transition-colors" />
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
