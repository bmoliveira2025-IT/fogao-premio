"use client";
import { Shield } from 'lucide-react';
import { useScroll, motion, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase-admin'; // Note: Client component shouldn't use admin directly usually, but for this architecture we might need a client-side fetch or pass props.
// Wait, 'db' is admin SDK (Node only). We need to fetch this in a Parent Server Component and pass as props OR use client SDK.
// Since User architecture is Mixing, best to Fetch in Page and pass to Widget, OR make Widget fetch via API.
// Let's stick to the Pattern: Fetch in HomePage (Server Component) and pass data.

// BUT, to keep it simple and given previous context, let's make this component accept props.
// Reverting to receiving props to avoid breaking Next.js Boundary.

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
}

export default function StickyMatchWidget({ match }: { match?: MatchData | null }) {
    const { scrollY } = useScroll();
    const [isCompact, setIsCompact] = useState(false);

    // Default Fallback if no data
    const data = match || {
        home_team: "BOT",
        away_team: "PAL",
        home_score: 0,
        away_score: 0,
        date: new Date().toISOString(),
        location: "Aguardando Definição",
        championship: "Brasileirão 2026",
        status: "scheduled"
    };

    const matchDate = new Date(data.date);
    const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsCompact(latest > 100);
    });

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isCompact ? 'bg-[#050505]/90 backdrop-blur-md border-b border-premium-gold/15 py-2' : 'relative bg-transparent py-0'}`}
        >
            <div className={`max-w-2xl mx-auto ${isCompact ? 'px-4 flex items-center justify-between' : 'mb-8'}`}>

                {/* Full Widget Mode */}
                {!isCompact && (
                    <div className="bg-[#121212] rounded-[2rem] p-6 relative overflow-hidden border border-premium-gold/15 shadow-2xl group mx-auto">
                        {/* Ambient Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-premium-gold/5 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${data.status === 'live' ? 'bg-red-500' : 'bg-premium-gold'}`} />
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
                                        {data.status === 'live' ? 'EM ANDAMENTO' : 'PRÓXIMO CONFRONTO'}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-1 rounded">{data.championship}</span>
                            </div>

                            {/* Teams */}
                            <div className="flex items-center justify-between">
                                {/* Home */}
                                <div className="flex flex-col items-center w-1/3">
                                    <div className="w-16 h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {data.home_team_logo ? (
                                            <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain drop-shadow-lg" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-premium-gold/15 shadow-lg">
                                                <Shield size={32} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-sm tracking-wide font-display text-center">{data.home_team}</span>
                                </div>

                                {/* VS & Timer */}
                                <div className="flex flex-col items-center justify-center w-1/3">
                                    {data.status === 'live' || data.status === 'finished' ? (
                                        <span className="text-3xl font-black italic text-white mb-2 font-display">
                                            {data.home_score} <span className="text-premium-gold mx-1">-</span> {data.away_score}
                                        </span>
                                    ) : (
                                        <span className="text-2xl font-black italic text-premium-gold/20 mb-2 font-display">VS</span>
                                    )}

                                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-premium-gold/15">
                                        <span className="text-xs font-mono font-bold text-premium-gold">
                                            {data.status === 'live' ? 'AO VIVO' : timeString}
                                        </span>
                                    </div>
                                </div>

                                {/* Away */}
                                <div className="flex flex-col items-center w-1/3">
                                    <div className="w-16 h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {data.away_team_logo ? (
                                            <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain drop-shadow-lg" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-premium-gold/15 shadow-lg opacity-60">
                                                <Shield size={32} className="text-white/50" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-sm tracking-wide font-display text-white/60 text-center">{data.away_team}</span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="mt-6 text-center border-t border-premium-gold/15 pt-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{data.location}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Compact Sticky Mode */}
                {isCompact && (
                    <>
                        <div className="flex items-center space-x-3">
                            <span className="font-display font-black text-white text-lg">{data.home_team}</span>
                            <span className="text-premium-gold text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                                {data.home_score} x {data.away_score}
                            </span>
                            <span className="font-display font-black text-white/50 text-lg">{data.away_team}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${data.status === 'live' ? 'bg-red-500' : 'bg-gray-500'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                                {data.status === 'live' ? 'AO VIVO' : data.status === 'finished' ? 'FIM' : timeString}
                            </span>
                        </div>
                    </>
                )}

            </div>
        </motion.div>
    );
}
