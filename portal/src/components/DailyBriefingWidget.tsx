"use client";

import { useEffect, useState } from 'react';
import { Lock, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TopStory {
    rank: number;
    title: string;
    category: string;
    image?: string;
}

interface DailyBriefing {
    date: string;
    general_summary: string;
    top_stories: TopStory[];
}

interface DailyBriefingWidgetProps {
    className?: string;
}

export default function DailyBriefingWidget({ className = "" }: DailyBriefingWidgetProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [loading, setLoading] = useState(true);

    const formatPremiumText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2);
                return (
                    <span key={index} className="relative inline-block font-bold text-white mx-1">
                        {content}
                        <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80"></span>
                    </span>
                );
            }
            return part;
        });
    };

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                // Fetch from our server-side API proxy
                const response = await fetch('/api/daily-briefing');
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setBriefing(data as DailyBriefing);
                    }
                }
            } catch (error) {
                console.error("Error fetching daily briefing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBriefing();
    }, []);

    if (loading) return null;
    if (!briefing) return null;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 bg-zinc-900 border border-premium-gold/30 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
                title="Abrir Resumo do Dia"
            >
                <div className="absolute inset-0 bg-premium-gold/10 rounded-full animate-pulse group-hover:animate-none" />
                <FileText className="text-premium-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" size={24} />
            </button>
        );
    }

    const topStory = briefing.top_stories.find(s => s.rank === 1);
    const otherStories = briefing.top_stories.filter(s => s.rank !== 1).sort((a, b) => a.rank - b.rank);

    return (
        <div className={`animate-in slide-in-from-top-4 fade-in duration-500 ${className}`}>
            <div className="flex items-center justify-between mb-4 px-4 md:px-1">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <FileText className="text-premium-gold" size={20} />
                    Resumo do Dia
                </h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                    <span className="sr-only">Fechar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            </div>

            <div className="bg-zinc-900 border-y border-white/5 md:border md:border-premium-gold/20 md:rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-premium-gold/5 blur-3xl rounded-full pointer-events-none" />

                {/* Rank 01 - Hero */}
                {topStory && (
                    <div className="relative h-64 w-full group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        {topStory.image && (
                            <img
                                src={topStory.image}
                                alt={topStory.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}

                        <div className="relative z-20 h-full flex flex-col justify-between p-6">
                            <span className="text-6xl font-display font-black text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] opacity-90">
                                01
                            </span>
                            <div>
                                <span className="text-xs font-bold text-premium-gold uppercase tracking-widest mb-2 block drop-shadow-md">
                                    {topStory.category}
                                </span>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-2xl max-w-xl">
                                    {topStory.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rank 02 & 03 - List */}
                <div className="divide-y divide-white/5 bg-zinc-900/80 backdrop-blur-sm">
                    {otherStories.map((story) => (
                        <div key={story.rank} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                            <span className="text-3xl font-display font-black text-white/20 group-hover:text-premium-gold/40 transition-colors">
                                0{story.rank}
                            </span>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2">
                                    {story.title}
                                </h4>
                                <span className="text-[10px] text-white/40 uppercase tracking-wide mt-1 block">
                                    {story.category}
                                </span>
                            </div>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-premium-gold transition-colors" />
                        </div>
                    ))}
                </div>

                {/* General Summary Footer */}
                <div className="bg-black/40 border-t border-white/5 p-6">
                    <div className="border-l-2 border-premium-gold pl-4 py-1">
                        <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium">
                            {formatPremiumText(briefing.general_summary)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
