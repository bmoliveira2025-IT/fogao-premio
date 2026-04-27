"use client";

import Image from 'next/image';
import { Play } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';

export default function ModernMatchCard({ match }: { match: any }) {
    if (!match) return null;

    // Default mock data if needed for testing layout
    const defaultImg = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className="px-3 md:px-0 mb-4 mt-2">
            <div className="relative block w-full bg-[#030303] border border-white/5 rounded-3xl md:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden py-8 md:py-10">
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
                <div className="relative px-5 md:px-10 flex flex-col h-full z-20">
                    
                    {/* Header: "Próximo Jogo" and Match Details */}
                    <div className="mb-8">
                        <h2 className="text-[36px] md:text-[48px] font-black text-white tracking-wide leading-none drop-shadow-md mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Próximo Jogo
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                             {/* Championship Pill */}
                             <div className="bg-[#111] border border-white/5 px-4 py-2.5 rounded-[10px] flex items-center shadow-lg">
                                <span className="text-[12px] md:text-[14px] font-[900] text-white tracking-widest uppercase">
                                    {match.championship}
                                </span>
                             </div>
                             {/* Date & Time */}
                             <span className="text-[15px] md:text-[17px] font-bold text-white tracking-widest pl-1" suppressHydrationWarning>
                                {new Date(match.date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} • {match.display_time || new Date(match.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
                             </span>
                        </div>
                    </div>

                    {/* Team Logos and Names Layout - Unified Rounded Container */}
                    <div className="flex flex-col mt-4 w-full md:w-[80%] z-20">
                        
                        {/* Wrapper for the two teams to give the unified border look */}
                        <div className="relative w-full rounded-[28px] md:rounded-[32px] overflow-visible border border-white/5 bg-[#080808] shadow-2xl transition-all duration-300 py-3 md:py-4">
                            {/* HOME TEAM ROW */}
                            <div className="flex items-center gap-5 md:gap-8 px-5 md:px-8 py-4 relative z-10 w-full">
                                <div className="w-[68px] h-[68px] md:w-[80px] md:h-[80px] relative bg-white rounded-full flex-shrink-0 flex items-center justify-center p-2 shadow-inner">
                                    {match.home_team_logo && (
                                        <Image src={getSafeImageSrc(match.home_team_logo)} alt={match.home_team} fill className="object-contain p-2" unoptimized />
                                    )}
                                </div>
                                <span className="text-[30px] md:text-[36px] font-bold text-white tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {match.home_team}
                                </span>
                            </div>

                            {/* Horizontal Divider */}
                            <div className="w-full h-[1px] bg-white/5 my-1" />

                            {/* VS Badge - Positioned exactly on the vertical line of the logos */}
                            <div className="absolute left-[54px] md:left-[72px] top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none">
                                <div className="text-[13px] md:text-[15px] font-[900] text-[#d4af37] tracking-widest bg-[#0a0a0a] border border-[#d4af37]/40 px-3 py-1.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.6)] flex items-center justify-center line-height-[1]">
                                    VS
                                </div>
                            </div>

                            {/* AWAY TEAM ROW */}
                            <div className="flex items-center gap-5 md:gap-8 px-5 md:px-8 py-4 relative z-10 w-full">
                                <div className="w-[68px] h-[68px] md:w-[80px] md:h-[80px] relative bg-white flex-shrink-0 rounded-full flex items-center justify-center p-2 shadow-inner">
                                    {match.away_team_logo && (
                                        <Image src={getSafeImageSrc(match.away_team_logo)} alt={match.away_team} fill className="object-contain p-2" unoptimized />
                                    )}
                                </div>
                                <span className="text-[30px] md:text-[36px] font-bold text-white tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
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
