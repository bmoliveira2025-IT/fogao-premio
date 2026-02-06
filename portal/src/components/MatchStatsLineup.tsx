"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Player {
    name: string;
    position: string;
    number: number;
    x: number; // 0-100 (left to right)
    y: number; // 0-100 (bottom to top)
    rating?: number;
}

interface LineupData {
    formation: string;
    players: Player[];
}

interface MatchStatsLineupProps {
    home: LineupData;
    away: LineupData;
    homeTeamName: string;
    awayTeamName: string;
}

export default function MatchStatsLineup({ home, away, homeTeamName, awayTeamName }: MatchStatsLineupProps) {
    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            {/* Legend / Info */}
            <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-premium-gold uppercase tracking-[0.2em]">Mandante</span>
                    <span className="text-sm font-bold text-white">{homeTeamName} ({home.formation})</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Visitante</span>
                    <span className="text-sm font-bold text-white/70">{awayTeamName} ({away.formation})</span>
                </div>
            </div>

            {/* Soccer Pitch Container */}
            <div className="relative aspect-[2/3] w-full bg-[#112211] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Grass Pattern / Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.5) 20%)' }} />

                {/* Pitch Lines */}
                <div className="absolute inset-4 border-2 border-white/20 rounded-md pointer-events-none">
                    {/* Mid Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/20" />
                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full" />
                    {/* Penalty Areas */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/20" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/20" />
                    {/* Penalty Spots */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full" />
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full" />
                </div>

                {/* Home Team Players (Bottom) */}
                {home.players.map((player, i) => (
                    <PlayerIcon key={`home-${i}`} player={player} team="home" />
                ))}

                {/* Away Team Players (Top) */}
                {away.players.map((player, i) => (
                    <PlayerIcon key={`away-${i}`} player={player} team="away" />
                ))}
            </div>
        </div>
    );
}

function PlayerIcon({ player, team }: { player: Player; team: 'home' | 'away' }) {
    // We assume y=0 is top for away, y=100 is bottom for home if using coordinates directly.
    // However, for the UI, let's just use the provided x, y as percentages.

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
        >
            <div className="relative flex flex-col items-center">
                {/* Glow Background */}
                <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity ${team === 'home' ? 'bg-[#005BA3]' : 'bg-premium-gold'}`}
                    style={{ margin: '-4px' }} />

                {/* Circle with Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-110 ${team === 'home'
                    ? 'bg-white border-[#005BA3] text-[#005BA3]'
                    : 'bg-black border-premium-gold text-premium-gold'
                    }`}>
                    <span className="text-xs font-black">{player.number}</span>
                </div>

                {/* Name Tag */}
                <div className="mt-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded px-1.5 py-0.5 shadow-xl">
                    <span className="text-[9px] font-bold text-white whitespace-nowrap uppercase tracking-tighter">{player.name}</span>
                </div>

                {/* Rating Badge */}
                {player.rating && (
                    <div className={`absolute -top-2 -right-2 px-1 rounded-sm text-[8px] font-black border border-black/50 shadow-sm ${player.rating >= 8.0 ? 'bg-green-500 text-white' :
                        player.rating >= 7.0 ? 'bg-premium-gold text-black' :
                            'bg-zinc-600 text-white'
                        }`}>
                        {player.rating.toFixed(1)}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
