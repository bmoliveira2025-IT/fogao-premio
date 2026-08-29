"use client";

import { useState } from 'react';
import { Shield, ChevronDown, MapPin } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
    match_id?: string;
    display_time?: string;
}

export default function MatchesAccordion({ matches, title = "Próximos Jogos" }: { matches: MatchData[], title?: string }) {
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
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-premium-gold">{title}</span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
            </div>

            {matches.map((match) => {
                const isOpen = openId === match.id;
                const matchDate = new Date(match.date);
                const dateString = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
                const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                const status = match.status?.toUpperCase().trim() || 'AGENDADO';
                const displayTime = match.display_time?.toUpperCase().trim() || '';

                // Strict ALLOWLIST for showing scores - use exact matching for status
                const liveStatuses = ['AO_VIVO', 'AO VIVO', 'EM ANDAMENTO', 'INTERVALO', 'INT'];
                const finishedStatuses = ['ENCERRADA', 'FINALIZADO', 'FIM', 'FIM DE JOGO', 'TERMINADO', 'CONCLUÍDO', 'FIM_DE_JOGO'];

                const isLive = liveStatuses.includes(status) || displayTime.includes("'") || displayTime === 'INT';
                const isFinished = finishedStatuses.includes(status) || displayTime === 'FIM DE JOGO';

                // Only show score if it's explicitly Live or Finished
                const isLiveOrFinished = isLive || isFinished;

                const homeScore = match.home_score ?? 0;
                const awayScore = match.away_score ?? 0;

                return (
                    <div
                        key={match.id}
                        className={`rounded-[1.5rem] border bg-white transition-all duration-500 overflow-hidden ${isOpen ? 'border-premium-gold/40 shadow-gold-glow scale-[1.02]' : 'border-zinc-200 hover:border-premium-gold/20 hover:shadow-premium hover:-translate-y-0.5'}`}
                    >
                        {/* Header (Always Visible) */}
                        <button
                            onClick={() => toggle(match.id)}
                            className="w-full flex items-center justify-between p-4"
                        >
                            <div className="flex items-center space-x-3">
                                {/* Date Badge */}
                                <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border ${isOpen ? 'bg-premium-gold text-black border-premium-gold' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
                                    <span className="text-[9px] font-black uppercase leading-none">{dateString.split(' ')[0]}</span>
                                    <span className="text-[12px] font-black leading-none">{dateString.split(' ')[2]?.replace('.', '') || matchDate.getDate()}</span>
                                </div>

                                {/* Teams Text */}
                                <div className="flex flex-col items-start">
                                    <span className="text-sm md:text-base font-black uppercase tracking-wider text-foreground">
                                        {match.home_team} <span className="text-premium-gold mx-1">
                                            {isLiveOrFinished ? `${homeScore} x ${awayScore}` : 'x'}
                                        </span> {match.away_team}
                                    </span>
                                    <span className="text-[11px] md:text-[12px] font-bold text-zinc-500 capitalize mt-1">
                                        {match.championship} • {status === 'AO_VIVO' || status === 'AO VIVO' ? 'AO VIVO' : isFinished ? 'Finalizado' : timeString}
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
                                    <div className="px-4 pb-2 pt-0 border-t border-premium-gold/15 mt-2">
                                        <div className="flex justify-between items-center py-4">
                                            {/* Home Logo */}
                                            <div className="flex flex-col items-center w-1/3">
                                                <div className="w-12 h-12 md:w-16 md:h-16 relative mb-2 drop-shadow-md">
                                                    {match.home_team_logo ? (
                                                        <Image src={getSafeImageSrc(match.home_team_logo)} alt={match.home_team} fill sizes="64px" className="object-contain" unoptimized />
                                                    ) : (
                                                        <Shield size={32} className="text-white/20" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Time/Score or Action */}
                                            <div className="flex flex-col items-center w-1/3 space-y-2">
                                                <span className="text-base md:text-xl font-mono font-black text-premium-gold bg-premium-gold/10 px-3 py-1.5 rounded-lg">
                                                    {isOpen && isLiveOrFinished ? `${homeScore} - ${awayScore}` : timeString}
                                                </span>
                                            </div>

                                            {/* Away Logo */}
                                            <div className="flex flex-col items-center w-1/3">

                                                <div className="w-12 h-12 md:w-16 md:h-16 relative mb-2 drop-shadow-md">
                                                    {match.away_team_logo ? (
                                                        <Image src={getSafeImageSrc(match.away_team_logo)} alt={match.away_team} fill sizes="64px" className="object-contain" unoptimized />
                                                    ) : (
                                                        <Shield size={32} className="text-white/20" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="inline-flex items-center space-x-2 text-[12px] md:text-[14px] font-bold text-zinc-600 bg-zinc-100 px-4 py-2 rounded-full mb-4 border border-zinc-200">
                                                <MapPin size={12} className="text-premium-gold" />
                                                <span>{match.location}</span>
                                            </div>

                                        </div>
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
