"use client";

import Image from 'next/image';
import { Play } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';

export default function ModernMatchCard({ match, compact = false }: { match: any, compact?: boolean }) {
    if (!match) return null;

    const defaultImg = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className={compact ? "px-1 mb-2" : "px-3 md:px-0 mb-4 mt-2"}>
            <div className={`editorial-card editorial-match relative block w-full bg-[#030303] border border-white/5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden ${compact ? 'py-6 md:py-8' : 'py-8 md:py-10'}`}>
                {/* Background Stadium/Player Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={defaultImg}
                        alt="Next Match Promo"
                        fill
                        className="object-cover object-center opacity-[0.15] grayscale mix-blend-lighten"
                        unoptimized
                    />
                </div>

                {/* Content Container */}
                <div className={`relative flex flex-col h-full z-20 ${compact ? 'px-4 md:px-6' : 'px-5 md:px-10'}`}>
                    
                    {/* Header: "Próximo Jogo" and Match Details */}
                    <div className={compact ? 'mb-4' : 'mb-8'}>
                        <h2 className={`${compact ? 'text-[18px] md:text-[22px]' : 'text-[28px] md:text-[36px]'} font-black text-white tracking-wide leading-none drop-shadow-md mb-3`}>
                            Próximo Jogo
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                             {/* Championship Pill */}
                             <div className="bg-[#111] border border-white/5 px-3 py-1.5 rounded-[8px] flex items-center shadow-lg">
                                <span className="text-[10px] md:text-[11px] font-[900] text-white tracking-widest uppercase">
                                    {match.championship}
                                </span>
                             </div>
                             {/* Date & Time */}
                             <span className="text-[12px] md:text-[13px] font-bold text-white tracking-widest pl-1" suppressHydrationWarning>
                                {new Date(match.date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} • {match.display_time || new Date(match.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
                             </span>
                        </div>
                    </div>

                    {/* Team Logos and Names Layout */}
                    <div className={`flex flex-col w-full z-20 ${compact ? '' : 'md:w-[90%]'}`}>
                        <div className="relative w-full rounded-[24px] md:rounded-[28px] overflow-visible border border-white/5 bg-[#080808] shadow-2xl py-2 md:py-3">
                            {/* HOME TEAM ROW */}
                            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 relative z-10 w-full">
                                <div className={`${compact ? 'w-[48px] h-[48px] md:w-[56px] md:h-[56px]' : 'w-[68px] h-[68px] md:w-[80px] md:h-[80px]'} relative bg-white rounded-full flex-shrink-0 flex items-center justify-center p-1.5 shadow-inner`}>
                                    {match.home_team_logo && (
                                        <Image src={getSafeImageSrc(match.home_team_logo)} alt={match.home_team} fill className="object-contain p-2" unoptimized />
                                    )}
                                </div>
                                <span className={`${compact ? 'text-[16px] md:text-[18px]' : 'text-[22px] md:text-[28px]'} font-bold text-white tracking-tight leading-none truncate`}>
                                    {match.home_team}
                                </span>
                            </div>

                            {/* Horizontal Divider */}
                            <div className="w-full h-[1px] bg-white/5 my-1" />

                            {/* VS Badge */}
                            <div className={`absolute ${compact ? 'left-[40px] md:left-[48px]' : 'left-[54px] md:left-[72px]'} top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none`}>
                                <div className="text-[10px] md:text-[11px] font-[900] text-[#d4af37] tracking-widest bg-[#0a0a0a] border border-[#d4af37]/40 px-2 py-1 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                                    VS
                                </div>
                            </div>

                            {/* AWAY TEAM ROW */}
                            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 relative z-10 w-full">
                                <div className={`${compact ? 'w-[48px] h-[48px] md:w-[56px] md:h-[56px]' : 'w-[68px] h-[68px] md:w-[80px] md:h-[80px]'} relative bg-white flex-shrink-0 rounded-full flex items-center justify-center p-1.5 shadow-inner`}>
                                    {match.away_team_logo && (
                                        <Image src={getSafeImageSrc(match.away_team_logo)} alt={match.away_team} fill className="object-contain p-2" unoptimized />
                                    )}
                                </div>
                                <span className={`${compact ? 'text-[16px] md:text-[18px]' : 'text-[22px] md:text-[28px]'} font-bold text-white tracking-tight leading-none truncate`}>
                                    {match.away_team}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
