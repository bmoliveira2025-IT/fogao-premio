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
            <div className="bg-card backdrop-blur-sm rounded-none md:rounded-xl md:border border-foreground/10 dark:border-premium-gold/20 p-2 py-3 md:p-5 shadow-2xl relative overflow-hidden group -mx-4 md:mx-0">

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-row items-center justify-between md:block">
                    {/* MOBILE: Horizontal Layout Compact */}

                    {/* Label (Desktop Only or heavily modified for mobile? Let's keep it minimal) */}
                    {/* For extreme compactness on mobile, maybe hide the "PROXIMO CONFRONTO" label or make it tiny top overlay? 
                        User said "compactar mais". Let's try a dense row layout for mobile.
                     */}
                    <div className="hidden md:flex items-center justify-center space-x-2 mb-4">
                        <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-premium-gold/50"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold whitespace-nowrap">Próximo Confronto</span>
                        <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
                    </div>


                    {/* Teams Row - Responsive */}
                    <div className="flex w-full md:w-auto items-center justify-between md:mb-6 md:px-2 gap-2">
                        {/* Home */}
                        <div className="flex md:flex-col flex-row-reverse items-center gap-2 md:gap-0 w-[45%] md:w-1/3 justify-end md:justify-center text-right md:text-center">
                            <span className="text-xs md:text-sm font-black text-foreground font-display tracking-wide leading-tight line-clamp-1">{data.home_team}</span>
                            <div className="w-8 h-8 md:w-14 md:h-14 relative md:mb-2 drop-shadow-xl shrink-0">
                                {data.home_team_logo ? (
                                    <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield size={24} className="text-foreground/20 md:w-10 md:h-10" />
                                )}
                            </div>
                        </div>

                        {/* VS / Time Info (Center) */}
                        <div className="flex flex-col items-center justify-center w-[10%] md:w-1/3 shrink-0">
                            {/* Mobile: Show Time/Date instead of VS if useful, or just VS? 
                                Let's keep VS on desktop, and maybe just a small hyphen or 'x' on mobile, or the Time.
                                User wants Compact. 
                             */}
                            <span className="text-sm md:text-2xl font-black italic text-foreground/20 font-display">x</span>

                            {/* Mobile Only Date/Time Hint? */}
                            <span className="md:hidden text-[9px] text-foreground/40 font-bold whitespace-nowrap mt-0.5">{timeString}</span>
                        </div>

                        {/* Away */}
                        <div className="flex md:flex-col flex-row items-center gap-2 md:gap-0 w-[45%] md:w-1/3 justify-start md:justify-center text-left md:text-center">
                            <div className="w-8 h-8 md:w-14 md:h-14 relative md:mb-2 drop-shadow-xl shrink-0">
                                {data.away_team_logo ? (
                                    <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield size={24} className="text-foreground/20 md:w-10 md:h-10" />
                                )}
                            </div>
                            <span className="text-xs md:text-sm font-black text-foreground font-display tracking-wide leading-tight line-clamp-1">{data.away_team}</span>
                        </div>
                    </div>

                    {/* Info Footer (Desktop) */}
                    <div className="hidden md:block text-center space-y-1 mb-5">
                        <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest">{data.championship}</p>
                        <p className="text-[11px] text-foreground/40 capitalize">{dateString} • {timeString}</p>
                        <p className="text-[11px] text-foreground/40">{data.location}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
