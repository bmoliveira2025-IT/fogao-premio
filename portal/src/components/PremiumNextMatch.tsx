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
                className="w-full flex items-center justify-between p-4 border-b border-premium-gold/10 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center space-x-3 text-left">
                    {/* Date Badge */}
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg border bg-premium-gold text-black border-premium-gold shadow-lg">
                        <span className="text-[9px] font-black uppercase leading-none">{dateString.split(' ')[0]}</span>
                        <span className="text-[12px] font-black leading-none">{dateString.split(' ')[2]?.replace('.', '') || matchDate.getDate()}</span>
                    </div>

                    {/* Teams Text */}
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                            {data.home_team} <span className="text-premium-gold mx-0.5">X</span> {data.away_team}
                        </span>
                        <span className="text-[9px] font-medium text-white/30 capitalize">
                            {data.championship}
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={16}
                    className={cn("text-premium-gold transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
                />
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
                            <div className="flex justify-between items-center py-4">
                                {/* Home Logo */}
                                <div className="flex flex-col items-center w-1/3">
                                    <div className="w-12 h-12 relative mb-2 drop-shadow-md">
                                        {data.home_team_logo ? (
                                            <img src={getSafeImageSrc(data.home_team_logo)} alt={data.home_team} className="w-full h-full object-contain" />
                                        ) : (
                                            <Shield size={32} className="text-white/20" />
                                        )}
                                    </div>
                                </div>

                                {/* Time/Score */}
                                <div className="flex flex-col items-center w-1/3">
                                    <span className="text-xs font-mono font-bold text-premium-gold bg-premium-gold/10 px-3 py-1.5 rounded transition-all duration-300">
                                        {timeString}
                                    </span>
                                </div>

                                {/* Away Logo */}
                                <div className="flex flex-col items-center w-1/3">
                                    <div className="w-12 h-12 relative mb-2 drop-shadow-md">
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
