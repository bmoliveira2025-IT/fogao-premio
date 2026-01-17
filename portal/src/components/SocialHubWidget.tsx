'use client';

import { Flame, Hash, TrendingUp, Instagram, Facebook, Music2 } from 'lucide-react';
import { Topic } from '@/lib/social-pulse';

interface SocialHubWidgetProps {
    topics: Topic[];
}

export default function SocialHubWidget({ topics }: SocialHubWidgetProps) {
    if (topics.length === 0) return null;

    return (
        <div className="mt-2 md:mt-4 relative group">
            {/* Header */}
            <div className="mb-3 px-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20">
                        <Flame size={14} className="text-pink-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">
                            Em Alta
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-medium">
                            Assuntos do momento
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    <span className="hidden md:inline">Atualizado agora</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </div>

            {/* Cards Container - Spaced (Restoring lateral spacing) */}
            <div className="flex flex-col gap-2">
                {topics.map((topic, index) => (
                    <div
                        key={topic.id}
                        className={`
                            relative overflow-hidden w-full rounded-xl
                            group/card transition-all duration-500
                            border border-white/5
                            bg-[#0a0a0a] md:bg-zinc-900/40 backdrop-blur-md
                            hover:bg-white/[0.07] hover:border-white/10
                        `}
                    >
                        {/* Rank Background Effect */}
                        <div className={`
                            absolute left-0 top-0 bottom-0 w-1
                            ${index === 0 ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' :
                                index === 1 ? 'bg-gradient-to-b from-zinc-300 to-zinc-500' :
                                    index === 2 ? 'bg-gradient-to-b from-orange-400 to-orange-700' :
                                        'bg-zinc-800'}
                        `} />

                        {/* Ambient Glow on Hover */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-white/5 to-transparent" />

                        <div className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4 relative z-10">
                            {/* Rank Indicator */}
                            <div className="flex-shrink-0 w-12 text-center flex flex-col items-center justify-center">
                                <span className={`
                                    text-3xl font-black italic tracking-tighter leading-normal py-1 pr-2
                                    ${index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)]' :
                                        index === 1 ? 'text-transparent bg-clip-text bg-gradient-to-br from-zinc-200 to-zinc-500' :
                                            index === 2 ? 'text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-orange-600' :
                                                'text-zinc-600'}
                                `}>
                                    {index + 1}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {/* Source Badge */}
                                    <div className={`
                                        inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider
                                        ${topic.source === 'instagram' ? 'bg-social-instagram/10 border-social-instagram/20 text-social-instagram' :
                                            topic.source === 'tiktok' ? 'bg-social-tiktok/10 border-social-tiktok/20 text-social-tiktok' :
                                                topic.source === 'twitter' ? 'bg-social-twitter/10 border-social-twitter/20 text-social-twitter' :
                                                    'bg-social-facebook/10 border-social-facebook/20 text-social-facebook'}
                                    `}>
                                        {topic.source === 'instagram' && <Instagram size={8} />}
                                        {topic.source === 'tiktok' && <Music2 size={8} />}
                                        {topic.source === 'twitter' && <Hash size={8} />}
                                        {topic.source === 'facebook' && <Facebook size={8} />}
                                        <span className="mt-px">{topic.source}</span>
                                    </div>

                                    {/* Trend Badge */}
                                    {topic.trend === 'up' && (
                                        <div className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
                                            <TrendingUp size={10} />
                                            <span>Alta</span>
                                        </div>
                                    )}
                                </div>

                                <h4 className={`
                                    text-[14px] sm:text-[15px] font-medium leading-tight line-clamp-2
                                    ${index < 3 ? 'text-white font-bold' : 'text-zinc-300'}
                                    group-hover/card:text-premium-gold transition-colors
                                `}>
                                    {topic.text}
                                </h4>
                            </div>

                            {/* Volume Metric */}
                            <div className="shrink-0 text-right">
                                <div className={`
                                    flex flex-col items-center justify-center
                                    px-2 py-1 rounded-lg border
                                    ${index < 3 ? 'bg-white/10 border-white/20' : 'bg-zinc-900/50 border-white/5'}
                                `}>
                                    <span className="text-xl font-black text-white font-mono leading-none">
                                        {topic.count}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-0.5">
                                        Posts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Subtle Footer */}
            <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-zinc-600 uppercase tracking-wider px-1">
                <span>Baseado no noticiário</span>
                <div className="flex gap-1 items-center">
                    <Instagram size={10} />
                </div>
            </div>
        </div>
    );
}
