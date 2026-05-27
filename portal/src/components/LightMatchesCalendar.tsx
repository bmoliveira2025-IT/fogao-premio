"use client";

import { useState, useMemo } from 'react';
import { MatchData } from '@/data/schedule';
import { ChevronDown, Filter, Calendar as CalendarIcon, MapPin, MoreVertical } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import { cn } from '@/lib/utils';

interface LightMatchesCalendarProps {
    matches: MatchData[];
}

export default function LightMatchesCalendar({ matches }: LightMatchesCalendarProps) {
    const [currentDate] = useState(new Date());

    // Generate current week days
    const weekDays = useMemo(() => {
        const days = [];
        const currentDay = currentDate.getDay(); // 0 is Sunday
        
        // Go back to Sunday
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDay);

        const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push({
                dateObj: date,
                dayName: dayNames[i],
                dayNumber: date.getDate(),
                isToday: date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth()
            });
        }
        return days;
    }, [currentDate]);

    const currentMonthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    // Capitalize first letter of month
    const formattedCurrentMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

    // Group matches by Month and Year
    const groupedMatches = useMemo(() => {
        const groups: Record<string, MatchData[]> = {};
        
        // Sort matches by date ascending
        const sorted = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sorted.forEach(match => {
            const date = new Date(match.date);
            const monthName = date.toLocaleString('pt-BR', { month: 'long' });
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            const year = date.getFullYear();
            const groupKey = `${capitalizedMonth} ${year}`;
            
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(match);
        });

        return groups;
    }, [matches]);

    return (
        <div className="w-full min-h-screen bg-[#f8f9fa] font-sans pb-32">
            {/* Top Header */}
            <div className="px-5 pt-12 pb-6 bg-[#f8f9fa] sticky top-0 z-30">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-zinc-900">{formattedCurrentMonth} {currentYear}</h1>
                        <ChevronDown size={20} className="text-zinc-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-green-600 shadow-sm">
                            <CalendarIcon size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Week Selector */}
                <div className="flex justify-between items-center mb-2">
                    {weekDays.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 w-10">
                            <span className={cn(
                                "text-[10px] font-bold uppercase",
                                day.isToday ? "text-red-500" : "text-zinc-400"
                            )}>
                                {day.dayName}
                            </span>
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all relative",
                                day.isToday 
                                    ? "bg-[#1f7a3f] text-white shadow-md" 
                                    : "text-zinc-800"
                            )}>
                                {day.dayNumber}
                                {day.isToday && (
                                    <div className="absolute -bottom-2 w-4 h-0.5 bg-zinc-900 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Matches List */}
            <div className="px-5 space-y-8">
                {Object.entries(groupedMatches).map(([monthYear, monthMatches]) => (
                    <div key={monthYear} className="space-y-4">
                        <h2 className="text-[13px] font-bold text-zinc-800">{monthYear}</h2>
                        
                        <div className="space-y-3">
                            {monthMatches.map(match => {
                                const matchDate = new Date(match.date);
                                const isToday = matchDate.getDate() === currentDate.getDate() && matchDate.getMonth() === currentDate.getMonth();
                                
                                const timeString = matchDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                                
                                // Determine the opponent
                                const isHome = match.home_team.toLowerCase().includes('botafogo');
                                const opponent = isHome ? match.away_team : match.home_team;
                                const opponentLogo = isHome ? match.away_team_logo : match.home_team_logo;

                                const homeScore = match.home_score ?? 0;
                                const awayScore = match.away_score ?? 0;
                                const status = match.status?.toUpperCase() || '';
                                const isFinished = status.includes('FIM') || status.includes('ENCERRAD');
                                const isLive = status.includes('VIVO') || status.includes('ANDAMENTO');

                                return (
                                    <div key={match.id} className="bg-white rounded-[20px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-zinc-100">
                                        {/* Date Circle */}
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-full border border-zinc-200/60 bg-zinc-50/50">
                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                                                {isToday ? 'HOJE' : matchDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                                            </span>
                                            <span className="text-[15px] font-bold text-zinc-900 leading-tight">
                                                {matchDate.getDate().toString().padStart(2, '0')}
                                            </span>
                                        </div>

                                        {/* Match Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[15px] font-bold text-zinc-900 truncate">
                                                {isHome ? `vs ${opponent}` : `@ ${opponent}`}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[12px] text-zinc-500 font-medium">{timeString}</span>
                                                <span className="text-zinc-300 text-[10px]">•</span>
                                                <span className="text-[11px] text-zinc-400 font-medium truncate uppercase">{match.championship}</span>
                                            </div>
                                            
                                            {(isFinished || isLive) && (
                                                <div className="mt-1.5 flex items-center">
                                                    <span className={cn(
                                                        "text-[12px] font-bold px-2 py-0.5 rounded-md",
                                                        isLive ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-600"
                                                    )}>
                                                        {homeScore} - {awayScore}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Icon / Logo */}
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
                                            {opponentLogo ? (
                                                <img src={getSafeImageSrc(opponentLogo)} alt={opponent} className="w-8 h-8 object-contain opacity-80" />
                                            ) : (
                                                <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Action Button (FAB) */}
            <button className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-[#1f7a3f] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(31,122,63,0.3)] z-40 transition-transform active:scale-95">
                <Filter size={24} />
            </button>
        </div>
    );
}
