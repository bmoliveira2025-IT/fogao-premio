'use client';

import { Flame, Hash, TrendingUp, Instagram, Facebook } from 'lucide-react';
import { Topic } from '@/lib/social-pulse';

interface SocialHubWidgetProps {
    topics: Topic[];
}

export default function SocialHubWidget({ topics }: SocialHubWidgetProps) {
    if (topics.length === 0) return null;

    return (
        <div className="mt-2 lg:mt-4 bg-zinc-900/30 border-y md:border border-white/5 rounded-none md:rounded-2xl p-4 md:p-6 backdrop-blur-sm relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-premium-gold/5 rounded-full blur-3xl group-hover:bg-premium-gold/10 transition-colors duration-700" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20">
                            <Flame size={18} className="text-pink-500 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-black text-white uppercase tracking-widest leading-none">
                                Em Alta nas Redes Sociais
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-medium">
                                Assuntos do momento na torcida
                            </p>
                        </div>
                    </div>
                </div>

                {/* Topics Timeline - Compact Vertical */}
                <div className="relative pl-4 space-y-3">
                    {/* Connecting Line */}
                    <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-premium-gold/50 via-white/10 to-transparent" />

                    {topics.map((topic, index) => (
                        <div key={topic.id} className="relative flex items-center gap-3 group/item">
                            {/* Timeline Node */}
                            <div className={`
                                relative z-10 w-2.5 h-2.5 rounded-full border-2 shrink-0 transition-all duration-500
                                ${topic.source === 'instagram' ? 'bg-zinc-950 border-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]' :
                                    topic.source === 'twitter' ? 'bg-zinc-950 border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' :
                                        'bg-zinc-950 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}
                            `}>
                                {index < 2 && <div className="absolute inset-0 bg-white animate-ping opacity-20 rounded-full" />}
                            </div>

                            {/* Content Card */}
                            <div className={`
                                flex-1 flex items-center justify-between py-1.5 px-0 transition-all
                            `}>
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {/* Social Icon Small */}
                                    <div className={`shrink-0 ${topic.source === 'instagram' ? 'text-pink-500' :
                                        topic.source === 'twitter' ? 'text-zinc-300' :
                                            'text-blue-500'
                                        }`}>
                                        {topic.source === 'instagram' && <Instagram size={12} />}
                                        {topic.source === 'twitter' && (
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        )}
                                        {topic.source === 'facebook' && <Facebook size={12} />}
                                    </div>

                                    <span className={`text-[12px] font-medium tracking-tight leading-snug ${index === 0 ? 'text-white font-bold' : 'text-zinc-300'}`}>
                                        {topic.text}
                                    </span>
                                </div>

                                {/* Trend Stats */}
                                <div className="pl-2 shrink-0">
                                    <div className={`relative px-1.5 py-0.5 rounded text-[15px] font-bold font-mono min-w-[28px] text-center border overflow-hidden ${topic.trend === 'up' ? 'bg-emerald-900/40 border-emerald-500/30 text-emerald-100' : 'bg-white/10 border-white/10 text-white'}`}>
                                        <span className="relative z-10 drop-shadow-sm">{topic.count}</span>
                                        {topic.trend === 'up' && (
                                            <div className="absolute -bottom-1 -right-0.5 opacity-40 rotate-[0deg] text-emerald-400">
                                                <TrendingUp size={16} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subtle Footer */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end gap-2 text-[10px] text-zinc-600 uppercase tracking-wider">
                    <span>Baseado nas notícias de hoje</span>
                    <div className="flex gap-1 items-center">
                        <Instagram size={10} />
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
