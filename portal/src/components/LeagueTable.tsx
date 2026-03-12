"use client";

import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TeamStats {
    position: number;
    team: string;
    points: number;
    games: number;
    wins: number;
    draws: number;
    losses: number;
    goal_diff: number;
    logo?: string;
    group?: string;
}

export default function LeagueTable() {
    const [tableData, setTableData] = useState<TeamStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [currentChampionship] = useState<'brasileirao_2026'>('brasileirao_2026');

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(doc(db, "championship_table", currentChampionship), (doc) => {
            if (doc.exists()) {
                const data = doc.data().standings as TeamStats[];
                setTableData(data);

                // Initialize groups as expanded
                const groups = Array.from(new Set(data.map(t => t.group || 'Geral')));
                const initialExpanded = groups.reduce((acc, group) => ({ ...acc, [group]: true }), {});
                setExpandedGroups(initialExpanded);
            } else {
                setTableData([]);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [currentChampionship]);

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    // Group teams by their group name
    const groupedData = tableData.reduce((acc, team) => {
        const group = team.group || 'Geral';
        if (!acc[group]) acc[group] = [];
        acc[group].push(team);
        return acc;
    }, {} as Record<string, TeamStats[]>);

    // Sort groups (A first) and teams within (by position)
    const sortedGroups = Object.keys(groupedData).sort();

    if (loading) {
        return (
            <div className="w-full h-96 bg-muted rounded-2xl flex items-center justify-center animate-pulse">
                <Shield className="w-12 h-12 text-foreground/10" />
            </div>
        );
    }

    const championshipName = 'Brasileirão 2026';

    return (
        <div className="w-full space-y-6">
            <div className="space-y-8">
                {sortedGroups.map((groupName) => (
                    <div key={groupName} className="glass-ultra rounded-[1.5rem] overflow-hidden shadow-premium border border-white/[0.04]">
                        {/* Header - Clickable for Dropdown */}
                        <div
                            onClick={() => toggleGroup(groupName)}
                            className="glass-panel p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors duration-500"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-premium-gold/10 dark:bg-premium-gold/10 light:bg-zinc-100 flex items-center justify-center border border-premium-gold/20">
                                    <Shield size={14} className="text-premium-gold dark:text-premium-gold light:text-zinc-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-foreground uppercase tracking-widest font-display">
                                        {groupName === 'Geral' ? championshipName : groupName}
                                    </h2>
                                    <span className="text-[10px] text-foreground/40 font-mono">2026 • Temporada Oficial</span>
                                </div>
                            </div>
                            <div className="text-premium-gold/50 dark:text-premium-gold/50 light:text-zinc-400">
                                {expandedGroups[groupName] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {expandedGroups[groupName] && (
                            <>
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-2 p-3 bg-black/20 border-y border-white/[0.02] text-[10px] font-bold text-foreground/30 uppercase tracking-wider">
                                    <div className="col-span-1 text-center">Pos</div>
                                    <div className="col-span-5 pl-2">Time</div>
                                    <div className="col-span-1 text-center text-foreground">Pts</div>
                                    <div className="col-span-1 text-center">J</div>
                                    <div className="col-span-1 text-center">V</div>
                                    <div className="col-span-1 text-center">E</div>
                                    <div className="col-span-1 text-center">D</div>
                                    <div className="col-span-1 text-center">SG</div>
                                </div>

                                {/* Rows */}
                                <div className="divide-y divide-white/[0.02]">
                                    {groupedData[groupName].sort((a, b) => a.position - b.position).map((team) => {
                                        const isBotafogo = team.team === "Botafogo";
                                        return (
                                            <div
                                                key={team.team}
                                                className={`grid grid-cols-12 gap-2 p-3 items-center text-xs transition-all duration-500 hover:bg-white/5 group border-b border-white/[0.01] last:border-0 hover:-translate-y-px hover:shadow-card-hover relative
                                                ${isBotafogo ? 'bg-premium-gold/10 dark:bg-premium-gold/10 light:bg-zinc-100 relative overflow-hidden backdrop-blur-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]' : ''}`}
                                            >
                                                {/* Highlight Bar for Botafogo */}
                                                {isBotafogo && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold animate-pulse" />
                                                )}

                                                {/* Position */}
                                                <div className="col-span-1 flex justify-center">
                                                    <span className={`w-5 h-5 flex items-center justify-center rounded-full font-bold text-[10px] 
                                                    ${team.position <= 4 ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400' : 'text-foreground/40'}`}>
                                                        {team.position}
                                                    </span>
                                                </div>

                                                {/* Team */}
                                                <div className="col-span-5 pl-2 flex items-center space-x-3">
                                                    {team.logo ? (
                                                        <div className="w-6 h-6 flex-shrink-0 relative bg-muted rounded-full p-0.5 group-hover:scale-110 transition-transform">
                                                            <img
                                                                src={team.logo}
                                                                alt=""
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 flex-shrink-0 bg-muted rounded-full flex items-center justify-center p-1 border border-foreground/10">
                                                            <Shield size={12} className="text-foreground/20" />
                                                        </div>
                                                    )}
                                                    <span className={`font-bold truncate ${isBotafogo ? 'text-premium-gold dark:text-premium-gold light:text-zinc-900 uppercase tracking-wide' : 'text-foreground/80'}`}>
                                                        {team.team}
                                                    </span>
                                                </div>

                                                {/* Pts - Highlighted */}
                                                <div className="col-span-1 text-center font-black text-foreground">{team.points}</div>

                                                {/* Stats */}
                                                <div className="col-span-1 text-center text-foreground/50 font-mono">{team.games}</div>
                                                <div className="col-span-1 text-center text-foreground/50 font-mono">{team.wins}</div>
                                                <div className="col-span-1 text-center text-foreground/50 font-mono">{team.draws}</div>
                                                <div className="col-span-1 text-center text-foreground/50 font-mono">{team.losses}</div>
                                                <div className="col-span-1 text-center text-foreground/50 font-mono">{team.goal_diff}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend/Footer */}
            <div className="p-3 glass-panel flex flex-wrap gap-3 justify-center border border-white/[0.04] rounded-full mx-auto w-fit shadow-premium mt-8">
                <div className="flex items-center space-x-1.5 focus:outline-none px-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                    <span className="text-[9px] text-foreground/40 uppercase">Classificação</span>
                </div>
            </div>
        </div>
    );
}
