import { Shield, MapPin, Calendar } from 'lucide-react';

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

export default function PremiumNextMatch({ match }: { match?: MatchData | null }) {
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
        <div className="w-full">
            {/* Label */}
            <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-premium-gold/50"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold">Próximo Confronto</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-premium-gold/50"></div>
            </div>

            {/* Card */}
            <div className="bg-card backdrop-blur-sm rounded-lg border border-foreground/10 dark:border-premium-gold/20 p-5 shadow-2xl relative overflow-hidden group">

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 px-2">
                        {/* Home */}
                        <div className="flex flex-col items-center w-1/3">
                            <div className="w-14 h-14 relative mb-2 drop-shadow-xl">
                                {data.home_team_logo ? (
                                    <img src={data.home_team_logo} alt={data.home_team} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield size={40} className="text-foreground/20" />
                                )}
                            </div>
                            <span className="text-sm font-black text-foreground font-display tracking-wide">{data.home_team}</span>
                        </div>

                        {/* VS */}
                        <div className="flex flex-col items-center w-1/3">
                            <span className="text-2xl font-black italic text-foreground/10 font-display">VS</span>
                        </div>

                        {/* Away */}
                        <div className="flex flex-col items-center w-1/3">
                            <div className="w-14 h-14 relative mb-2 drop-shadow-xl">
                                {data.away_team_logo ? (
                                    <img src={data.away_team_logo} alt={data.away_team} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield size={40} className="text-foreground/20" />
                                )}
                            </div>
                            <span className="text-sm font-black text-foreground font-display tracking-wide">{data.away_team}</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-1 mb-5">
                        <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest">{data.championship}</p>
                        <p className="text-[11px] text-foreground/40 capitalize">{dateString} • {timeString}</p>
                        <p className="text-[11px] text-foreground/40">{data.location}</p>
                    </div>

                    {/* Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-lg text-black font-bold uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        Pré-Jogo
                    </button>
                </div>
            </div>
        </div>
    );
}
