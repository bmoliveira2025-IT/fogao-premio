'use client';

import { MatchData } from '@/app/page';
import Image from 'next/image';
import { getSafeImageSrc } from '@/lib/images';

interface MobileLiveMatchesProps {
    matches: MatchData[];
}

export default function MobileLiveMatches({ matches }: MobileLiveMatchesProps) {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="lg:hidden w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
                {matches.map((match) => (
                    <div 
                        key={match.id}
                        className="w-[180px] bg-[#111] rounded-2xl p-3 border border-white/5 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-premium-gold uppercase tracking-tighter">
                                {match.championship}
                            </span>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[9px] font-bold text-red-500 uppercase">{match.status || 'LIVE'}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-5 h-5">
                                        <Image src={getSafeImageSrc(match.home_team_logo)} alt={match.home_team} fill className="object-contain" unoptimized />
                                    </div>
                                    <span className="text-[11px] font-black text-white truncate w-20">{match.home_team}</span>
                                </div>
                                <span className="text-[12px] font-black text-white">{match.home_score}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-5 h-5">
                                        <Image src={getSafeImageSrc(match.away_team_logo)} alt={match.away_team} fill className="object-contain" unoptimized />
                                    </div>
                                    <span className="text-[11px] font-black text-white truncate w-20">{match.away_team}</span>
                                </div>
                                <span className="text-[12px] font-black text-white">{match.away_score}</span>
                            </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/[0.03]">
                            <span className="text-[9px] font-bold text-zinc-500">{match.display_time || 'Ao vivo'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
