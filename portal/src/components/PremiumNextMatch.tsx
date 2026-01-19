'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const dateString = matchDate.toLocaleDateString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' }).replace('.', '');

    return (
        <div className={cn("w-full", className)}>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-3xl relative overflow-hidden shadow-2xl group transition-all duration-500 hover:border-premium-gold/30">
                {/* Gold Top Border */}
                {/* Gold Top Border & Bottom Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80" />

                <div className="p-6 md:p-8">
                    {/* Header: PRÓXIMO CONFRONTO */}
                    <div className="mb-8 text-center">
                        <h4 className="text-sm md:text-base font-black text-premium-gold uppercase tracking-[0.2em] italic drop-shadow-sm">
                            PRÓXIMO CONFRONTO
                        </h4>
                    </div>

                    {/* Match Grid */}
                    <div className="flex items-center justify-between">

                        {/* Home Team */}
                        <div className="flex flex-col items-center w-1/3 gap-3">
                            <div className="w-16 h-16 md:w-24 md:h-24 relative transition-transform duration-500 group-hover:scale-105">
                                {data.home_team_logo ? (
                                    <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                ) : (
                                    <Shield size={64} className="text-white/10" />
                                )}
                            </div>
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest text-center leading-tight">
                                {data.home_team}
                            </span>
                        </div>

                        {/* Center Info: VS + Date */}
                        <div className="flex flex-col items-center justify-center w-1/3 gap-1">
                            <span className="text-xl md:text-3xl font-black italic text-white tracking-widest drop-shadow-md">VS</span>
                            <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest whitespace-nowrap">
                                {dateString}
                            </span>
                            {data.transmission && (
                                <span className="mt-2 text-[9px] md:text-[10px] font-bold text-premium-gold/80 uppercase tracking-widest border border-premium-gold/20 px-2 py-0.5 rounded-full">
                                    {data.transmission}
                                </span>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center w-1/3 gap-3">
                            <div className="w-16 h-16 md:w-24 md:h-24 relative transition-transform duration-500 group-hover:scale-105">
                                {data.away_team_logo ? (
                                    <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                ) : (
                                    <Shield size={64} className="text-white/10" />
                                )}
                            </div>
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest text-center leading-tight">
                                {data.away_team}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Glassy Background Flare */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-premium-gold/5 blur-[100px] rounded-full" />
            </div>
        </div>
    );
}
