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

export default function LeagueTable({ defaultExpanded = true }: { defaultExpanded?: boolean }) {
    const [tableData, setTableData] = useState<TeamStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [currentChampionship, setCurrentChampionship] = useState<'brasileirao_2026' | 'copa_do_brasil' | 'sulamericana'>('brasileirao_2026');

    const championships = [
        { id: 'brasileirao_2026', name: 'Brasileirão' },
    ] as const;

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(doc(db, "championship_table", currentChampionship), (doc) => {
            if (doc.exists()) {
                const data = doc.data().standings as TeamStats[];
                setTableData(data);

                // Initialize groups based on defaultExpanded
                const groups = Array.from(new Set(data.map(t => t.group || 'Geral')));
                const initialExpanded = groups.reduce((acc, group) => ({ ...acc, [group]: defaultExpanded }), {});
                setExpandedGroups(initialExpanded);
            } else {
                setTableData([]);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [currentChampionship, defaultExpanded]);

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

    const sortedGroups = Object.keys(groupedData).sort();

    if (loading) {
        return (
            <div className="w-full space-y-4">
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-8 w-24 bg-zinc-100 rounded-full animate-pulse" />)}
                </div>
                <div className="w-full h-96 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center animate-pulse">
                    <Shield className="w-12 h-12 text-zinc-300" />
                </div>
            </div>
        );
    }

    const currentName = championships.find(c => c.id === currentChampionship)?.name || 'Campeonato';

    return (
        <div className="w-full space-y-4 font-sans">
            {/* Championship Selector */}
            {championships.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {championships.map((champ) => (
                        <button
                            key={champ.id}
                            onClick={() => setCurrentChampionship(champ.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border
                            ${currentChampionship === champ.id 
                                ? 'bg-[#FF8A65] text-white border-[#FF8A65] shadow-sm' 
                                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}
                        >
                            {champ.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                {sortedGroups.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                        <Shield className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tabela ainda não disponível</p>
                    </div>
                ) : sortedGroups.map((groupName) => (
                    <div key={groupName} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-200">
                        {/* Header - Clickable for Dropdown */}
                        <div
                            onClick={() => toggleGroup(groupName)}
                            className="bg-zinc-50 p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-100 transition-colors duration-200 border-b border-zinc-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div>
                                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                                        {groupName === 'Geral' ? currentName : groupName}
                                    </h2>
                                </div>
                            </div>
                            <div className="text-zinc-500">
                                {expandedGroups[groupName] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {expandedGroups[groupName] && (
                            <>
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-1 px-3 py-3 bg-white text-[11px] font-medium text-zinc-500 border-b border-zinc-100">
                                    <div className="col-span-1 text-center">#</div>
                                    <div className="col-span-5 pl-2 text-left">Time</div>
                                    <div className="col-span-1 text-center">J</div>
                                    <div className="col-span-1 text-center">V</div>
                                    <div className="col-span-1 text-center">E</div>
                                    <div className="col-span-1 text-center">D</div>
                                    <div className="col-span-1 text-center">SG</div>
                                    <div className="col-span-1 text-center font-bold text-zinc-900">PTS</div>
                                </div>

                                {/* Rows */}
                                <div className="divide-y divide-zinc-100">
                                    {groupedData[groupName].sort((a, b) => a.position - b.position).map((team) => {
                                        const isBotafogo = team.team === "Botafogo";
                                        // Top 4 classification line
                                        const isLibertadores = team.position <= 4;
                                        const isSulamericana = team.position > 4 && team.position <= 12;
                                        const isRelegation = team.position > 16;
                                        
                                        let borderColor = "border-transparent";
                                        if (isLibertadores) borderColor = "border-green-500";
                                        else if (isSulamericana) borderColor = "border-blue-500";
                                        else if (isRelegation) borderColor = "border-red-500";

                                        return (
                                            <div
                                                key={team.team}
                                                className={`grid grid-cols-12 gap-1 px-3 py-3.5 items-center text-[13px] transition-all duration-200 hover:bg-zinc-50 border-l-4 ${borderColor} ${isBotafogo ? 'bg-orange-50/50' : 'bg-white'}`}
                                            >
                                                {/* Position */}
                                                <div className="col-span-1 flex justify-center">
                                                    <span className={`font-bold ${team.position <= 3 ? 'text-yellow-500' : 'text-zinc-500'}`}>
                                                        {team.position}
                                                    </span>
                                                </div>

                                                {/* Team */}
                                                <div className="col-span-5 pl-2 flex items-center space-x-3">
                                                    {team.logo ? (
                                                        <div className="w-6 h-6 flex-shrink-0 relative">
                                                            <img
                                                                src={team.logo}
                                                                alt=""
                                                                className="w-full h-full object-contain drop-shadow-sm"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 flex-shrink-0 bg-zinc-100 rounded-full flex items-center justify-center p-1 border border-zinc-200">
                                                            <Shield size={12} className="text-zinc-400" />
                                                        </div>
                                                    )}
                                                    <span className={`truncate font-medium ${isBotafogo ? 'text-zinc-900 font-bold' : 'text-zinc-800'}`}>
                                                        {team.team}
                                                    </span>
                                                </div>

                                                {/* Stats */}
                                                <div className="col-span-1 text-center text-zinc-500">{team.games}</div>
                                                <div className="col-span-1 text-center text-zinc-500">{team.wins}</div>
                                                <div className="col-span-1 text-center text-zinc-500">{team.draws}</div>
                                                <div className="col-span-1 text-center text-zinc-500">{team.losses}</div>
                                                <div className="col-span-1 text-center text-zinc-500">{team.goal_diff}</div>

                                                {/* Points - Highlighted */}
                                                <div className="col-span-1 text-center font-bold text-zinc-900">{team.points}</div>
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
            <div className="p-4 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 justify-center shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                    <span className="text-[11px] font-medium text-zinc-600">Libertadores</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
                    <span className="text-[11px] font-medium text-zinc-600">Sul-Americana</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div>
                    <span className="text-[11px] font-medium text-zinc-600">Rebaixamento</span>
                </div>
            </div>
        </div>
    );
}
