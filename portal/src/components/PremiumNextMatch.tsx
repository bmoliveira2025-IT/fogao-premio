'use client';

import { useState } from 'react';
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
}

export default function PremiumNextMatch({ match, className }: { match?: MatchData | null, className?: string }) {
    const [isOpen, setIsOpen] = useState(true);

    // Default Fallback
    const data = match || {
        home_team: "BOTAFOGO",
        away_team: "VOLTA REDONDA",
        home_score: 0,
        away_score: 0,
        date: new Date().toISOString(),
        location: "Nilton Santos",
        championship: "Carioca",
        status: "scheduled",
        home_team_logo: "",
        away_team_logo: ""
    };

    const matchDate = new Date(data.date);
    const dateString = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
    const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={cn("w-full transition-all duration-300 overflow-hidden bg-[#0a0a0a] border-y md:border border-white/5 rounded-none md:rounded-xl shadow-2xl relative", className)}>
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
                    </span>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ChevronDown
                        size={16}
                        className={cn("text-premium-gold transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
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

                                {/* Date & Time - Absolutely Centered */}
                                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    <div className="flex flex-col items-center bg-premium-gold/5 border border-premium-gold/20 rounded-xl px-4 py-2 shadow-lg backdrop-blur-sm">
                                        <span className="text-[10px] font-black text-premium-gold uppercase tracking-[0.2em] mb-1">
                                            {matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase()}
                                        </span>
                                        <div className="h-px w-8 bg-premium-gold/30 mb-1" />
                                        <span className="text-sm font-mono font-bold text-white tracking-widest">
                                            {timeString}
                                        </span>
                                    </div>
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
