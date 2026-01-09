import { Shield, MapPin, Calendar } from 'lucide-react';
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
    const dateString = matchDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeString = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={cn("w-full transition-all duration-300", className)}>
            {/* Card */}
            <div className="bg-card backdrop-blur-sm rounded-none md:rounded-xl md:border border-foreground/10 dark:border-premium-gold/20 p-4 md:p-5 shadow-2xl relative overflow-hidden group -mx-4 md:mx-0">

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                    {/* Header Label - Premium & Centered */}
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-premium-gold/50"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold whitespace-nowrap">
                            Próximo Confronto
                        </span>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 px-2 lg:px-4">

                        {/* Home Team */}
                        <div className="flex flex-col items-center w-full md:w-1/3 order-1 md:order-1">
                            <div className="w-16 h-16 md:w-16 md:h-16 relative mb-3 drop-shadow-2xl hover:scale-110 transition-transform duration-300">
                                {data.home_team_logo ? (
                                    <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield size={48} className="text-foreground/20" />
                                )}
                            </div>
                            <span className="text-base md:text-lg font-black text-foreground font-display tracking-wide text-center leading-tight">
                                {data.home_team}
                            </span>
                        </div>

                        {/* VS / Info Center */}
                        <div className="flex flex-col items-center justify-center w-full md:w-1/3 order-2 md:order-2 space-y-2 my-2 md:my-0">
                            <span className="text-4xl md:text-5xl font-black italic text-foreground/10 font-display select-none">VS</span>
                            {/* Mobile Date/Time nested here for tighter feel */}
                            <div className="flex flex-col items-center md:hidden space-y-0.5">
                                <span className="text-[10px] font-bold text-premium-gold uppercase tracking-widest">{data.championship}</span>
                                <span className="text-[11px] font-medium text-foreground/60">{dateString} • {timeString}</span>
                            </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center w-full md:w-1/3 order-3 md:order-3">
                            <div className="w-16 h-16 md:w-16 md:h-16 relative mb-3 drop-shadow-2xl hover:scale-110 transition-transform duration-300">
                                {data.away_team_logo ? (
                                    <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield size={48} className="text-foreground/20" />
                                )}
                            </div>
                            <span className="text-base md:text-lg font-black text-foreground font-display tracking-wide text-center leading-tight">
                                {data.away_team}
                            </span>
                        </div>
                    </div>

                    {/* Desktop Info Footer */}
                    <div className="hidden md:block text-center space-y-1 mt-6">
                        <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest">{data.championship}</p>
                        <p className="text-[11px] text-foreground/40 capitalize">{dateString} • {timeString}</p>
                        <p className="text-[11px] text-foreground/40">{data.location}</p>
                    </div>

                    {/* Mobile Location Footer */}
                    <div className="md:hidden text-center mt-4 border-t border-white/5 pt-3">
                        <div className="flex items-center justify-center gap-1.5 text-foreground/40">
                            <MapPin size={10} />
                            <p className="text-[10px]">{data.location}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
