'use client';

import { Flame, Hash, TrendingUp, Instagram, Facebook, Music2 } from 'lucide-react';
import { Topic } from '@/lib/social-pulse';

interface SocialHubWidgetProps {
    topics: Topic[];
}

export default function SocialHubWidget({ topics }: SocialHubWidgetProps) {
    if (topics.length === 0) return null;

    return (
        <div className="mt-4 mb-8 md:mt-8 relative group">
            {/* Header with Glass Effect Pill */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                        <Flame size={16} className="text-pink-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-black text-white uppercase tracking-wider leading-none mb-1">
                            Em Alta
                        </h3>
                        <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                            O que a torcida está falando
                        </p>
                    </div>
                </div>
            </div>

            {/* Modern Cards Container */}
            <div className="flex flex-col gap-3">
                {topics.map((topic, index) => (
                    <div
                        key={topic.id}
                        className="group relative w-full rounded-2xl bg-zinc-900/30 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 overflow-hidden"
                    >
                        {/* Background Gradient Spot */}
                        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none
                            ${topic.source === 'instagram' ? 'bg-pink-600' :
                                topic.source === 'twitter' ? 'bg-sky-600' :
                                    topic.source === 'tiktok' ? 'bg-teal-500' :
                                        'bg-blue-600'}
                        `} />

                        <div className="flex items-center p-4 relative z-10 gap-4">
                            {/* Integrated Rank Number */}
                            <div className="flex-shrink-0 w-8 text-center">
                                <span className={`text-2xl font-black italic
                                    ${index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-sm' :
                                        index === 1 ? 'text-zinc-400' :
                                            index === 2 ? 'text-zinc-600' :
                                                'text-zinc-700'}
                                `}>
                                    {index + 1}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Header Row: Source Icon + Trend */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`p-1 rounded-full border bg-black/50 backdrop-blur-sm
                                        ${topic.source === 'instagram' ? 'border-pink-500/30 text-pink-500' :
                                            topic.source === 'twitter' ? 'border-sky-500/30 text-sky-500' :
                                                topic.source === 'tiktok' ? 'border-teal-500/30 text-teal-500' :
                                                    'border-blue-500/30 text-blue-500'}
                                    `}>
                                        {topic.source === 'instagram' && <Instagram size={10} />}
                                        {topic.source === 'tiktok' && <Music2 size={10} />}
                                        {topic.source === 'twitter' && <Hash size={10} />}
                                        {topic.source === 'facebook' && <Facebook size={10} />}
                                    </div>

                                    {topic.trend === 'up' && (
                                        <span className="text-[10px] md:text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-0.5">
                                            <TrendingUp size={12} /> Alta
                                        </span>
                                    )}
                                </div>

                                <h4 className="text-[18px] md:text-[16px] font-medium text-white/90 leading-snug group-hover:text-white transition-colors">
                                    {topic.text}
                                </h4>
                            </div>

                            {/* Volume (Subtle) */}
                            <div className="flex flex-col items-end shrink-0 pl-2 border-l border-white/5 gap-0.5">
                                <span className="text-[14px] md:text-[13px] font-bold text-white tabular-nums">
                                    {topic.count}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                                    Posts
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center">
                <p className="text-[10px] text-zinc-600 flex items-center gap-1.5 uppercase tracking-widest font-medium opacity-50">
                    <Hash size={10} />
                    Monitoramento em Tempo Real
                </p>
            </div>
        </div>
    );
}
