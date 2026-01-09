import { Shield, MapPin, Calendar, Clock } from 'lucide-react';
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
}

export default function PremiumNextMatch({ match, className }: { match?: MatchData | null, className?: string }) {
    // Default Fallback
    const data = match || {
        home_team: "BOT",
        away_team: "INT",
        home_score: 0,
        away_score: 0,
        date: new Date().toISOString(),
        location: "Nilton Santos",
        championship: "Brasileirão",
        status: "scheduled"
    };

    const matchDate = new Date(data.date);
    const dateString = matchDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'numeric' }).replace('.', '');
    const champName = data.championship.toUpperCase();
    const formattedDate = matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={cn("w-full transition-all duration-300", className)}>
            {/* Card - Ultra Compact for Mobile, Premium for Desktop */}
            <div className="bg-card backdrop-blur-sm rounded-none md:rounded-xl md:border border-foreground/10 dark:border-premium-gold/20 p-2 md:p-3 shadow-2xl relative overflow-hidden group -mx-4 md:mx-0">

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">

                    {/* DESKTOP LAYOUT (Unchanged - Premium Vertical) */}
                    <div className="hidden md:block">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-premium-gold/50"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold whitespace-nowrap">
                                Próximo Confronto
                            </span>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
                        </div>

                        <div className="flex items-center justify-between px-4">
                            <div className="flex flex-col items-center w-1/3">
                                <div className="w-16 h-16 relative mb-3 drop-shadow-2xl hover:scale-110 transition-transform duration-300">
                                    {data.home_team_logo ? (
                                        <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain" />
                                    ) : (
                                        <Shield size={48} className="text-foreground/20" />
                                    )}
                                </div>
                                <span className="text-lg font-black text-foreground font-display tracking-wide text-center leading-tight">
                                    {data.home_team}
                                </span>
                            </div>

                            <div className="flex flex-col items-center justify-center w-1/3 space-y-2">
                                <span className="text-5xl font-black italic text-foreground/10 font-display select-none">VS</span>
                            </div>

                            <div className="flex flex-col items-center w-1/3">
                                <div className="w-16 h-16 relative mb-3 drop-shadow-2xl hover:scale-110 transition-transform duration-300">
                                    {data.away_team_logo ? (
                                        <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain" />
                                    ) : (
                                        <Shield size={48} className="text-foreground/20" />
                                    )}
                                </div>
                                <span className="text-lg font-black text-foreground font-display tracking-wide text-center leading-tight">
                                    {data.away_team}
                                </span>
                            </div>
                        </div>
                        <div className="text-center space-y-1 mt-6">
                            <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest">{data.championship}</p>
                            <p className="text-[11px] text-foreground/40 capitalize">{dateString} • {timeString}</p>
                            <p className="text-[11px] text-foreground/40">{data.location}</p>
                        </div>
                    </div>


                    {/* MOBILE LAYOUT - CENTER FACING LOGOS */}
                    <div className="md:hidden flex flex-col pt-2 pb-2 px-2 bg-zinc-950/50">
                        {/* 1. Header: Próximo Confronto */}
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <div className="h-[1px] w-4 bg-gradient-to-r from-transparent to-premium-gold/50"></div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-premium-gold whitespace-nowrap">
                                Próximo Confronto
                            </span>
                            <div className="h-[1px] w-4 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
                        </div>

                        {/* 2. Main Row: [Name]-[Logo] [Info] [Logo]-[Name] */}
                        <div className="flex items-center justify-between w-full relative">

                            {/* Home Side (Right Aligned Name) */}
                            <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                                <span className="text-[10px] font-black text-foreground font-display tracking-wide leading-tight line-clamp-2 text-right">
                                    {data.home_team}
                                </span>
                                <div className="w-9 h-9 relative drop-shadow-lg shrink-0">
                                    {data.home_team_logo ? (
                                        <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain" />
                                    ) : (
                                        <Shield size={36} className="text-foreground/20" />
                                    )}
                                </div>
                            </div>

                            {/* Center Info Column */}
                            <div className="flex flex-col items-center justify-center shrink-0 mx-2 w-16">
                                {/* Time Box */}
                                <div className="bg-zinc-900 border border-white/10 rounded px-1.5 py-0.5 shadow-sm mb-1">
                                    <span className="text-xs font-bold text-white whitespace-nowrap">{timeString}</span>
                                </div>
                                {/* Meta Info (Champ + Date) stacked */}
                                <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-[8px] font-bold text-premium-gold uppercase tracking-wider text-center leading-none truncate max-w-full">
                                        {champName.split(' ')[0]} {/* Shorten Champ if needed */}
                                    </span>
                                    <span className="text-[8px] font-medium text-foreground/50 leading-none">
                                        {formattedDate}
                                    </span>
                                </div>
                            </div>

                            {/* Away Side (Left Aligned Name) */}
                            <div className="flex items-center justify-start gap-2 flex-1 min-w-0">
                                <div className="w-9 h-9 relative drop-shadow-lg shrink-0">
                                    {data.away_team_logo ? (
                                        <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain" />
                                    ) : (
                                        <Shield size={36} className="text-foreground/20" />
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-foreground font-display tracking-wide leading-tight line-clamp-2 text-left">
                                    {data.away_team}
                                </span>
                            </div>

                        </div>

                        {/* Optional Location Bottom - faint */}
                        <div className="text-center mt-2 opacity-30">
                            <span className="text-[8px] uppercase tracking-widest">{data.location}</span>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
