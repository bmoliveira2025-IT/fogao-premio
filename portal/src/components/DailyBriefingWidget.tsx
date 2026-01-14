"use client";

import { useEffect, useState, useRef } from 'react';
import { Newspaper, ChevronRight, X, Clock, Trophy, Users, Briefcase, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

interface TopStory {
    rank: number;
    title: string;
    category: string;
    image?: string;
    id?: string;
    summary?: string;
    created_at?: string;
}

interface DailyBriefing {
    date: string;
    general_summary?: string;
    editorial_summary?: string;
    top_stories?: TopStory[];
    generated_at_formatted?: string;
    indicators?: {
        next_match?: string;
        location?: string;
        market?: string;
    };
}

interface DailyBriefingWidgetProps {
    className?: string;
}

// Premium category config
const CATEGORY_CONFIG: Record<string, { gradient: string; icon: React.ReactNode; label: string }> = {
    'elenco': {
        gradient: 'from-blue-600/80 to-blue-800/80',
        icon: <Users size={10} />,
        label: 'ELENCO'
    },
    'diretoria': {
        gradient: 'from-zinc-600/80 to-zinc-800/80',
        icon: <Briefcase size={10} />,
        label: 'DIRETORIA'
    },
    'mercado': {
        gradient: 'from-amber-500/80 to-orange-600/80',
        icon: <TrendingUp size={10} />,
        label: 'MERCADO'
    },
    'base': {
        gradient: 'from-slate-500/80 to-slate-700/80',
        icon: <Activity size={10} />,
        label: 'BASE'
    },
    'campeonato': {
        gradient: 'from-emerald-500/80 to-teal-600/80',
        icon: <Trophy size={10} />,
        label: 'CAMPEONATO'
    },
    'default': {
        gradient: 'from-zinc-700/80 to-zinc-900/80',
        icon: <Newspaper size={10} />,
        label: 'NOTÍCIA'
    }
};

function getCategoryConfig(category: string) {
    const key = category?.toLowerCase().trim() || 'default';
    return CATEGORY_CONFIG[key] || CATEGORY_CONFIG['default'];
}

function getRelativeTime(dateStr?: string): string {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora';
    if (diffHours === 1) return '1h';
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
}

export default function DailyBriefingWidget({ className = "" }: DailyBriefingWidgetProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
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
                className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-full shadow-2xl shadow-black/50 active:scale-95 transition-all backdrop-blur-xl"
            >
                <div className="w-2 h-2 rounded-full bg-premium-gold animate-pulse" />
                <span className="text-xs font-semibold text-white">Resumo</span>
            </button>
        );
    }

    const stories = briefing.top_stories?.sort((a, b) => a.rank - b.rank) || [];
    const mainStory = stories[0];
    const secondaryStories = stories.slice(1, 5);

    return (
        <div className={`animate-in fade-in duration-300 ${className}`}>
            {/* Premium Glass Card */}
            <div className="mx-3 lg:mx-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 relative bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-950/95 backdrop-blur-xl">

                {/* Premium Gold Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-premium-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-premium-gold/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Gold Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-premium-gold/40 to-transparent" />

                {/* Header */}
                <div className="relative flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-premium-gold/20 rounded-xl blur-md" />
                            <div className="relative p-2 rounded-xl bg-gradient-to-br from-premium-gold/20 to-transparent">
                                <Newspaper className="text-premium-gold" size={16} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-tight">Resumo do Dia</h2>
                            <span className="text-[10px] text-zinc-500 font-medium">
                                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Main Story - Cinematic Hero */}
                {mainStory && (
                    <Link
                        href={mainStory.id ? `/news/${mainStory.id}` : '#'}
                        className="block relative group mx-3 rounded-xl overflow-hidden"
                    >
                        <div className="relative h-28 w-full">
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 z-10" />

                            {/* Image */}
                            {mainStory.image && (
                                <img
                                    src={mainStory.image}
                                    alt={mainStory.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}

                            {/* Content */}
                            <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end">
                                {/* Category Pill */}
                                {(() => {
                                    const config = getCategoryConfig(mainStory.category);
                                    return (
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${config.gradient} text-white w-fit mb-2 shadow-lg`}>
                                            {config.icon}
                                            {config.label}
                                        </div>
                                    );
                                })()}
                                <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2 drop-shadow-lg group-hover:text-premium-gold transition-colors duration-300">
                                    {mainStory.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Secondary Stories - Premium Horizontal Cards */}
                {secondaryStories.length > 0 && (
                    <div
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto px-3 py-4 scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {secondaryStories.map((story) => {
                            const config = getCategoryConfig(story.category);
                            return (
                                <Link
                                    key={story.rank}
                                    href={story.id ? `/news/${story.id}` : '#'}
                                    className="flex-shrink-0 w-[140px] p-3 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent hover:from-white/[0.06] transition-all group"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    {/* Category */}
                                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-gradient-to-r ${config.gradient} text-white mb-2`}>
                                        {config.icon}
                                        {config.label}
                                    </div>
                                    {/* Title */}
                                    <h4 className="text-[11px] font-medium text-zinc-300 leading-tight line-clamp-3 group-hover:text-white transition-colors">
                                        {story.title}
                                    </h4>
                                    {/* Time */}
                                    {story.created_at && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <Clock size={8} className="text-zinc-600" />
                                            <span className="text-[9px] text-zinc-600">{getRelativeTime(story.created_at)}</span>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Quick Info Pills */}
                {briefing.indicators && (
                    <div className="flex flex-wrap gap-2 px-3 pb-3">
                        {briefing.indicators.next_match && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-950/30 text-[10px]">
                                <span>⚽</span>
                                <span className="text-emerald-400 font-medium">{briefing.indicators.next_match}</span>
                            </div>
                        )}
                        {briefing.indicators.location && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-900/30 to-blue-950/30 text-[10px]">
                                <span>🏟</span>
                                <span className="text-blue-400 font-medium">{briefing.indicators.location}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer CTA */}
                <Link
                    href="/news"
                    className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent hover:via-white/[0.05] transition-all group"
                >
                    <span className="text-[11px] font-semibold text-premium-gold/80 group-hover:text-premium-gold transition-colors">
                        Ver todas as notícias
                    </span>
                    <ChevronRight size={14} className="text-premium-gold/50 group-hover:text-premium-gold group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* Bottom Gold Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-premium-gold/20 to-transparent" />
            </div>
        </div>
    );
}
