'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSafeImageSrc } from '@/lib/images';
import { MatchData } from '@/app/page';

interface CupMatchCardProps {
    copaMatch: MatchData | null;
    sulaMatch: MatchData | null;
}

export default function CupMatchCard({ copaMatch, sulaMatch }: CupMatchCardProps) {
    // Sort by closest date first
    const matches = [sulaMatch, copaMatch]
        .filter(Boolean)
        .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime()) as MatchData[];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (matches.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % matches.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [matches.length]);

    if (matches.length === 0) return null;

    const match = matches[currentIndex];

    return (
        <div className="px-1 mb-2">
            <div className="relative block w-full bg-[#030303] border border-white/5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden py-6 md:py-8">
                <div className="relative flex flex-col h-full z-20 px-4 md:px-6">

                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                            <h2 className="text-[18px] md:text-[22px] font-black text-white tracking-wide leading-none">
                                Próximo Jogo
                            </h2>
                            {matches.length > 1 && (
                                <div className="flex gap-1.5 ml-auto">
                                    {matches.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            aria-label={`Ver jogo ${i + 1}`}
                                            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-premium-gold' : 'bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="bg-[#111] border border-white/5 px-3 py-1.5 rounded-[8px]">
                                <span className="text-[10px] md:text-[11px] font-[900] text-white tracking-widest uppercase">
                                    {match.championship}
                                </span>
                            </div>
                            <span className="text-[12px] md:text-[13px] font-bold text-white tracking-widest pl-1" suppressHydrationWarning>
                                {new Date(match.date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                                {' • '}
                                {match.display_time && match.display_time !== 'A definir'
                                    ? match.display_time
                                    : new Date(match.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
                            </span>
                        </div>
                    </div>

                    {/* Teams */}
                    <div className="w-full rounded-[24px] overflow-hidden border border-white/5 bg-[#080808] shadow-2xl py-2">
                        <div className="flex items-center gap-4 px-4 py-3 w-full relative">
                            <div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] relative bg-white rounded-full flex-shrink-0 flex items-center justify-center p-1.5 shadow-inner">
                                {match.home_team_logo && (
                                    <Image src={getSafeImageSrc(match.home_team_logo)} alt={match.home_team} fill className="object-contain p-2" unoptimized />
                                )}
                            </div>
                            <span className="text-[16px] md:text-[18px] font-bold text-white tracking-tight leading-none truncate">
                                {match.home_team}
                            </span>
                        </div>

                        <div className="w-full h-[1px] bg-white/5 relative">
                            <div className="absolute left-[36px] md:left-[40px] top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                                <div className="text-[10px] font-[900] text-[#d4af37] tracking-widest bg-[#0a0a0a] border border-[#d4af37]/40 px-2 py-1 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                                    VS
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-4 py-3 w-full">
                            <div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] relative bg-white rounded-full flex-shrink-0 flex items-center justify-center p-1.5 shadow-inner">
                                {match.away_team_logo && (
                                    <Image src={getSafeImageSrc(match.away_team_logo)} alt={match.away_team} fill className="object-contain p-2" unoptimized />
                                )}
                            </div>
                            <span className="text-[16px] md:text-[18px] font-bold text-white tracking-tight leading-none truncate">
                                {match.away_team}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
