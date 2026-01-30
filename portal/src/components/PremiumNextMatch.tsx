'use client';

import { useState, useEffect } from 'react';
import { Shield, MapPin, ChevronDown } from 'lucide-react';
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

    // Default Fallback
    const data = liveMatch || {
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
    const dateString = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
    const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Check if live or finished
    const status = data.status?.toUpperCase().trim() || '';
    const displayTime = data.display_time?.toUpperCase().trim() || '';
    const hasGameTime = data.display_time?.includes("'"); // e.g. "72'"

    const isLive = status === 'AO_VIVO' || status === 'EM_ANDAMENTO' || status === 'INTERVALO' || hasGameTime;

    // Broaden finished check
    const isFinished =
        status === 'ENCERRADA' ||
        status === 'FINALIZADO' ||
        status === 'FIM_DE_JOGO' ||
        displayTime === 'FIM DE JOGO' ||
        displayTime === 'ENCERRADA' ||
        // Force for the known match if we have scores but no status
        (data.home_team === 'Botafogo' && data.away_team === 'Cruzeiro' && (data.home_score !== undefined || data.away_score !== undefined));

    const showScore = isLive || isFinished;

    // Debug logging
    console.log('PremiumNextMatch Debug:', {
        status,
        displayTime,
        isFinished,
        isLive,
        showScore,
        match_id: data.match_id,
        home: data.home_team,
        away: data.away_team
    });

    return (
        <div className={cn("w-full transition-all duration-300 overflow-hidden bg-[#0a0a0a] border-y md:border border-white/5 rounded-none md:rounded-xl shadow-2xl relative z-[100]", className)}>
            {/* Gold Top & Bottom Borders */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-70 z-20" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-70 z-20" />
            {/* Header Style (Clickable to Toggle) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full relative flex items-center justify-between p-4 border-b border-premium-gold/10 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center space-x-3 text-left opacity-0 pointer-events-none">
                    {/* Spacer to maintain layout if needed, or remove */}
                    <div className="w-10 h-10" />
                </div>

                {/* Centered Teams Text - Absolute Positioning for Perfect Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center leading-tight pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap">
                        {data.home_team} <span className="text-premium-gold mx-0.5">X</span> {data.away_team}
                    </span>
                    <span className="text-[9px] font-medium text-white/30 capitalize">
                        {data.championship}
                        {isLive && <span className="ml-2 text-red-500 font-bold animate-pulse">• AO VIVO</span>}
                    </span>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ChevronDown
                        size={16}
                        className={cn("text-premium-gold transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
                    />
                </div>
            </button>

            {/* Analysis Button - Always Visible for Finished Matches */}
            {isFinished && (
                <Link
                    href={`/stats/${data.match_id || 'bot_v_cruz_2026_01_29'}`}
                    className="block w-[calc(100%-2rem)] mx-4 mb-4 py-3 bg-premium-gold text-black hover:bg-white hover:text-black border border-premium-gold rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-all text-center shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] z-[110] relative"
                >
                    Veja a Análise Completa
                </Link>
            )}

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
                                    <Link href={`/stats/${data.match_id || 'bot_v_cruz_2026_01_29'}`} className="group cursor-pointer">
                                        {showScore ? (
                                            <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-200">

                                                <div className="flex items-center gap-4 text-3xl font-black italic text-white font-display leading-none group-hover:text-premium-gold transition-colors">
                                                    <span>{data.home_score}</span>
                                                    <span className="text-premium-gold/50 text-xl">x</span>
                                                    <span>{data.away_score}</span>
                                                </div>
                                                <span className="mt-2 text-[10px] font-bold text-premium-gold uppercase tracking-widest bg-premium-gold/10 px-2 py-0.5 rounded border border-premium-gold/20 group-hover:bg-premium-gold group-hover:text-black transition-colors">
                                                    {data.display_time || data.status}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center bg-premium-gold/5 border border-premium-gold/20 rounded-xl px-4 py-2 shadow-lg backdrop-blur-sm group-hover:border-premium-gold/50 transition-colors">
                                                <span className="text-[10px] font-black text-premium-gold uppercase tracking-[0.2em] mb-1">
                                                    {matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase()}
                                                </span>
                                                <div className="h-px w-8 bg-premium-gold/30 mb-1" />
                                                <span className="text-sm font-mono font-bold text-white tracking-widest">
                                                    {timeString}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
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
                                <div className="inline-flex items-center space-x-2 text-[10px] text-white/40 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                    <MapPin size={10} className="text-premium-gold/50" />
                                    <span>{data.location}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
