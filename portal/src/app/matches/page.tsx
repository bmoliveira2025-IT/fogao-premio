'use client';

import { useState } from 'react';
import { botafogoSchedule, MatchData } from '@/data/schedule';
import MatchesAccordion from '@/components/MatchesAccordion';
import { Shield, Trophy } from 'lucide-react';
import Link from 'next/link';
import LightMatchesCalendar from '@/components/LightMatchesCalendar';

export default function MatchesPage() {
    const matches: MatchData[] = botafogoSchedule;
    const loading = false;
    const [filter, setFilter] = useState<'ALL' | 'BRASILEIRAO' | 'COPA_DO_BRASIL' | 'SULAMERICANA'>('ALL');

    const championships = [
        { id: 'ALL', name: 'Todos' },
        { id: 'BRASILEIRAO', name: 'Brasileirão' },
        { id: 'COPA_DO_BRASIL', name: 'Copa do Brasil' },
        { id: 'SULAMERICANA', name: 'Sulamericana' },
    ] as const;

    const filteredMatches = matches.filter(m => {
        if (filter === 'ALL') return true;
        const champ = m.championship?.toLowerCase() || '';
        if (filter === 'BRASILEIRAO') return champ.includes('brasileiro');
        if (filter === 'COPA_DO_BRASIL') return champ.includes('copa') && champ.includes('brasil');
        if (filter === 'SULAMERICANA') return champ.includes('suda') || champ.includes('sula');
        return true;
    });

    // Grouping logic
    const groupedByChampionship = filteredMatches.reduce((acc, match) => {
        const champ = match.championship || 'Outros';
        if (!acc[champ]) acc[champ] = [];
        acc[champ].push(match);
        return acc;
    }, {} as Record<string, MatchData[]>);

    const championshipOrder = [
        'CONMEBOL Libertadores',
        'CONMEBOL Sudamericana',
        'Campeonato Brasileiro',
        'Copa do Brasil',
        'Campeonato Carioca'
    ];

    const sortedChampionships = Object.keys(groupedByChampionship).sort((a, b) => {
        const indexA = championshipOrder.findIndex(c => a.includes(c) || c.includes(a));
        const indexB = championshipOrder.findIndex(c => b.includes(c) || b.includes(b));
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div className="w-full min-h-screen bg-background text-foreground">
            {/* Mobile Light Theme Calendar */}
            <div className="block lg:hidden">
                <LightMatchesCalendar matches={matches} />
            </div>

            {/* Desktop Dark Theme Layout */}
            <div className="hidden lg:block container mx-auto px-4 max-w-4xl pb-32 pt-20 lg:pt-24">
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl md:text-4xl font-black text-zinc-900 uppercase tracking-[0.2em] mb-4 text-center">
                        Calendário <span className="text-premium-gold">2026</span>
                    </h1>
                    <div className="h-1 w-20 bg-premium-gold rounded-full" />
                </div>

                {/* Tournament Filter */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-6 mb-8 md:justify-center px-4">
                    {championships.map((champ) => (
                        <button
                            key={champ.id}
                            onClick={() => setFilter(champ.id)}
                            className={`px-6 py-3 rounded-full text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                            ${filter === champ.id 
                                ? 'bg-premium-gold text-black border-premium-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-premium-gold/40'}`}
                        >
                            {champ.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Carregando jogos...</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {sortedChampionships.length > 0 ? (
                            sortedChampionships.map((champName) => (
                                <div key={champName} className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="p-2 rounded-xl bg-premium-gold/10 border border-premium-gold/20">
                                            <Trophy size={20} className="text-premium-gold" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-wider">
                                            {champName}
                                        </h2>
                                        <div className="flex-1 h-[1px] bg-gradient-to-r from-premium-gold/20 to-transparent" />
                                    </div>
                                    <MatchesAccordion 
                                        matches={groupedByChampionship[champName]} 
                                        title={`${groupedByChampionship[champName].length} Jogos`} 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-sm">
                                <Shield className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Nenhum jogo encontrado para este filtro</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation Link */}
                <div className="mt-16 flex justify-center">
                    <Link 
                        href="/tabela" 
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-premium-gold hover:text-black hover:border-premium-gold transition-all group shadow-sm"
                    >
                        Ver Classificação Completa
                        <Shield size={16} className="group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

