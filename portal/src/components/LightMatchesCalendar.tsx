"use client";

import { useState, useMemo } from 'react';
import { MatchData } from '@/data/schedule';
import { ChevronDown, Filter, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import { cn } from '@/lib/utils';

interface LightMatchesCalendarProps {
    matches: MatchData[];
}

function getChampionshipLabel(championship?: string) {
    const normalized = championship?.trim().toLowerCase() || '';

    if (normalized.includes('brasileiro') || normalized.includes('brasileirão')) return 'Brasileirão';
    if (normalized.includes('libertadores')) return 'Libertadores';
    if (normalized.includes('sudamericana') || normalized.includes('sul-americana')) return 'Sulamericana';
    if (normalized.includes('copa do brasil')) return 'Copa do Brasil';

    return championship || 'Campeonato';
}

export default function LightMatchesCalendar({ matches }: LightMatchesCalendarProps) {
    const [currentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Todos');

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
        
        // Filter by championship if needed
        let filteredMatches = matches;
        if (activeFilter !== 'Todos') {
            filteredMatches = matches.filter(m => m.championship === activeFilter);
        }

        // Sort matches by date ascending
        const sorted = [...filteredMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    }, [matches, activeFilter]);

    const availableMonths = Object.keys(groupedMatches);
    
    const availableFilters = useMemo(() => {
        const filters = new Set<string>();
        filters.add('Todos');
        matches.forEach(m => {
            if (m.championship) filters.add(m.championship);
        });
        return Array.from(filters);
    }, [matches]);

    return (
        <div className="w-full min-h-screen bg-[#f8f9fa] font-sans pb-32">
            {/* Top Header */}
            <div className="px-5 pt-12 pb-6 bg-[#f8f9fa] sticky top-0 z-30">
                <div className="flex items-center justify-between mb-8">
                    <div className="relative">
                        <button 
                            onClick={() => { setIsMonthDropdownOpen(!isMonthDropdownOpen); setIsFilterDropdownOpen(false); }}
                            className="flex items-center gap-2"
                        >
                            <h1 className="text-xl font-bold text-zinc-900">{formattedCurrentMonth} {currentYear}</h1>
                            <ChevronDown size={20} className={cn("text-zinc-500 transition-transform", isMonthDropdownOpen && "rotate-180")} />
                        </button>

                        {isMonthDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-zinc-100 py-2 min-w-[160px] z-50 max-h-[300px] overflow-y-auto">
                                {availableMonths.map(month => (
                                    <button 
                                        key={month}
                                        onClick={() => {
                                            setIsMonthDropdownOpen(false);
                                            document.getElementById(`month-${month}`)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="w-full text-left px-4 py-2 text-[14px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 relative">
                        <button 
                            onClick={() => {
                                setSelectedDate(new Date());
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-green-600 shadow-sm transition-transform active:scale-95"
                        >
                            <CalendarIcon size={18} />
                        </button>
                        <button 
                            onClick={() => { setIsFilterDropdownOpen(!isFilterDropdownOpen); setIsMonthDropdownOpen(false); }}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95",
                                activeFilter !== 'Todos' || isFilterDropdownOpen ? "bg-[#1f7a3f] text-white shadow-md" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            )}
                        >
                            <Filter size={18} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-zinc-100 py-2 min-w-[200px] z-50">
                                {availableFilters.map(filter => (
                                    <button 
                                        key={filter}
                                        onClick={() => {
                                            setActiveFilter(filter);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-[14px] font-medium hover:bg-zinc-50 flex items-center justify-between transition-colors",
                                            activeFilter === filter ? "text-[#1f7a3f] bg-green-50/50" : "text-zinc-700"
                                        )}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Week Selector */}
                <div className="flex justify-between items-center mb-2">
                    {weekDays.map((day, idx) => {
                        const isSelected = day.dateObj.getDate() === selectedDate.getDate() && day.dateObj.getMonth() === selectedDate.getMonth();
                        
                        return (
                            <button 
                                key={idx} 
                                onClick={() => setSelectedDate(day.dateObj)}
                                className="flex flex-col items-center gap-3 w-10 outline-none"
                            >
                                <span className={cn(
                                    "text-[10px] font-bold uppercase",
                                    day.isToday ? "text-red-500" : "text-zinc-400"
                                )}>
                                    {day.dayName}
                                </span>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all relative",
                                    isSelected 
                                        ? "bg-[#1f7a3f] text-white shadow-md" 
                                        : "text-zinc-800 hover:bg-zinc-100"
                                )}>
                                    {day.dayNumber}
                                    {isSelected && (
                                        <div className="absolute -bottom-2 w-4 h-0.5 bg-zinc-900 rounded-full"></div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Matches List */}
            <div className="px-5 space-y-8">
                {Object.entries(groupedMatches).map(([monthYear, monthMatches]) => (
                    <div key={monthYear} id={`month-${monthYear}`} className="space-y-4 scroll-mt-[200px]">
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
                                
                                const bfrScore = isHome ? homeScore : awayScore;
                                const oppScore = isHome ? awayScore : homeScore;

                                const status = match.status?.toUpperCase() || '';
                                const isFinished = status.includes('FIM') || status.includes('ENCERRAD') || status.includes('FINALIZAD');
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
                                                <span className="whitespace-nowrap text-[11px] font-semibold text-zinc-500">
                                                    {getChampionshipLabel(match.championship)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Match Score */}
                                        {(isFinished || isLive) && (
                                            <div className="flex-shrink-0 flex items-center justify-center">
                                                <span className={cn(
                                                    "text-[15px] font-black px-3 py-1.5 rounded-[10px] border tracking-wide",
                                                    isLive 
                                                        ? "bg-red-50 text-red-600 border-red-100 shadow-[0_0_10px_rgba(220,38,38,0.2)] animate-pulse" 
                                                        : "bg-zinc-50 text-zinc-800 border-zinc-200/80 shadow-sm"
                                                )}>
                                                    {bfrScore} <span className="text-zinc-400 font-medium mx-0.5">x</span> {oppScore}
                                                </span>
                                            </div>
                                        )}

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
            <button 
                onClick={() => { setIsFilterDropdownOpen(true); setIsMonthDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-[#1f7a3f] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(31,122,63,0.3)] z-40 transition-transform active:scale-95"
            >
                <Filter size={24} />
            </button>
        </div>
    );
}
