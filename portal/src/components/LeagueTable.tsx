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

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "championship_table", "carioca_2026"), (doc) => {
            if (doc.exists()) {
                const data = doc.data().standings as TeamStats[];
                setTableData(data);

                // Initialize groups as expanded
                const groups = Array.from(new Set(data.map(t => t.group || 'Geral')));
                const initialExpanded = groups.reduce((acc, group) => ({ ...acc, [group]: true }), {});
                setExpandedGroups(initialExpanded);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

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
            <div className="w-full h-96 bg-[#111] rounded-2xl border border-premium-gold/15 flex items-center justify-center animate-pulse">
                <Shield className="w-12 h-12 text-premium-gold/20" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {sortedGroups.map((groupName) => (
                <div key={groupName} className="bg-[#111] rounded-2xl border border-premium-gold/15 overflow-hidden shadow-xl">
                    {/* Header - Clickable for Dropdown */}
                    <div
                        onClick={() => toggleGroup(groupName)}
                        className="bg-[#1A1A1A] p-4 flex items-center justify-between border-b border-premium-gold/10 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/30">
                                <Shield size={14} className="text-premium-gold" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-white uppercase tracking-widest font-display">
                                    {groupName === 'Geral' ? 'Campeonato Carioca' : groupName}
                                </h2>
                                <span className="text-[10px] text-white/40 font-mono">2026 • Taça Guanabara</span>
                            </div>
                        </div>
                        <div className="text-premium-gold/50">
                            {expandedGroups[groupName] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>

                    {/* Collapsible Content */}
                    {expandedGroups[groupName] && (
                        <>
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 p-3 bg-black/40 text-[10px] font-bold text-white/30 uppercase tracking-wider border-b border-white/5">
                                <div className="col-span-1 text-center">Pos</div>
                                <div className="col-span-5 pl-2">Time</div>
                                <div className="col-span-1 text-center text-white">Pts</div>
                                <div className="col-span-1 text-center">J</div>
                                <div className="col-span-1 text-center">V</div>
                                <div className="col-span-1 text-center">E</div>
                                <div className="col-span-1 text-center">D</div>
                                <div className="col-span-1 text-center">SG</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-white/5">
                                {groupedData[groupName].sort((a, b) => a.position - b.position).map((team) => {
                                    const isBotafogo = team.team === "Botafogo";
                                    return (
                                        <div
                                            key={team.team}
                                            className={`grid grid-cols-12 gap-2 p-3 items-center text-xs transition-colors hover:bg-white/5 
                                            ${isBotafogo ? 'bg-premium-gold/10 relative overflow-hidden' : ''}`}
                                        >
                                            {/* Highlight Bar for Botafogo */}
                                            {isBotafogo && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold animate-pulse" />
                                            )}

                                            {/* Position */}
                                            <div className="col-span-1 flex justify-center">
                                                <span className={`w-5 h-5 flex items-center justify-center rounded-full font-bold text-[10px] 
                                                ${team.position <= 4 ? 'bg-blue-500/20 text-blue-400' : 'text-white/40'}`}>
                                                    {team.position}
                                                </span>
                                            </div>

                                            {/* Team */}
                                            <div className="col-span-5 pl-2 flex items-center space-x-2">
                                                <span className={`font-bold ${isBotafogo ? 'text-premium-gold uppercase tracking-wide' : 'text-white/80'}`}>
                                                    {team.team}
                                                </span>
                                            </div>

                                            {/* Pts - Highlighted */}
                                            <div className="col-span-1 text-center font-black text-white">{team.points}</div>

                                            {/* Stats */}
                                            <div className="col-span-1 text-center text-white/50 font-mono">{team.games}</div>
                                            <div className="col-span-1 text-center text-white/50 font-mono">{team.wins}</div>
                                            <div className="col-span-1 text-center text-white/50 font-mono">{team.draws}</div>
                                            <div className="col-span-1 text-center text-white/50 font-mono">{team.losses}</div>
                                            <div className="col-span-1 text-center text-white/50 font-mono">{team.goal_diff}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            ))}

            {/* Legend/Footer */}
            <div className="p-3 bg-black/20 flex flex-wrap gap-3 justify-center border-t border-white/5 rounded-full mx-auto w-fit">
                <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                    <span className="text-[9px] text-white/40 uppercase">Classificação</span>
                </div>
            </div>
        </div>
    );
}
