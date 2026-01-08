"use client";

import { useState } from 'react';
import { Shield, ChevronDown, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export default function MatchesAccordion({ matches }: { matches: MatchData[] }) {
    const [openId, setOpenId] = useState<string | null>(matches[0]?.id || null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (!matches || matches.length === 0) return null;

    return (
        <div className="w-full space-y-3">
            {/* Label */}
            <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-premium-gold/50"></div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-premium-gold">Próximos Jogos</span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
            </div>

            {matches.map((match) => {
                const isOpen = openId === match.id;
                const matchDate = new Date(match.date);
                const dateString = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
                const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                    <div
                        key={match.id}
                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-[#1A1A1A] border-premium-gold/30 shadow-2xl scale-[1.02]' : 'bg-[#111] border-premium-gold/15'}`}
                    >
                        {/* Header (Always Visible) */}
                        <button
                            onClick={() => toggle(match.id)}
                            className="w-full flex items-center justify-between p-4"
                        >
                            <div className="flex items-center space-x-3">
                                {/* Date Badge */}
                                <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border ${isOpen ? 'bg-premium-gold text-black border-premium-gold' : 'bg-white/5 border-premium-gold/15 text-white/50'}`}>
                                    <span className="text-[9px] font-black uppercase leading-none">{dateString.split(' ')[0]}</span>
                                    <span className="text-[12px] font-black leading-none">{dateString.split(' ')[2]?.replace('.', '') || matchDate.getDate()}</span>
                                </div>

                                {/* Teams Text */}
                                <div className="flex flex-col items-start">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isOpen ? 'text-white' : 'text-white/70'}`}>
                                        {match.home_team} <span className="text-premium-gold mx-1">x</span> {match.away_team}
                                    </span>
                                    <span className="text-[9px] font-medium text-white/30 capitalize">
                                        {match.championship}
                                    </span>
                                </div>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`text-premium-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Expanded Content (Details) */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className="px-4 pb-5 pt-0 border-t border-premium-gold/15 mt-2">
                                        <div className="flex justify-between items-center py-4">
                                            {/* Home Logo */}
                                            <div className="flex flex-col items-center w-1/3">
                                                <div className="w-12 h-12 relative mb-2 drop-shadow-md">
                                                    {match.home_team_logo ? (
                                                        <img src={match.home_team_logo} alt={match.home_team} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Shield size={32} className="text-white/20" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Time/Score */}
                                            <div className="flex flex-col items-center w-1/3">
                                                <span className="text-xs font-mono font-bold text-premium-gold bg-premium-gold/10 px-2 py-1 rounded">
                                                    {timeString}
                                                </span>
                                            </div>

                                            {/* Away Logo */}
                                            <div className="flex flex-col items-center w-1/3">
                                                <div className="w-12 h-12 relative mb-2 drop-shadow-md">
                                                    {match.away_team_logo ? (
                                                        <img src={match.away_team_logo} alt={match.away_team} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Shield size={32} className="text-white/20" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center mb-4">
                                            <div className="inline-flex items-center space-x-1 text-[10px] text-white/40 bg-white/5 px-3 py-1 rounded-full">
                                                <MapPin size={10} />
                                                <span>{match.location}</span>
                                            </div>
                                        </div>

                                        <button className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-lg text-black font-bold uppercase tracking-widest text-[9px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg">
                                            Pré-Jogo
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
