"use client";

import { FileText, ChevronRight, Clock, Flame, Crown } from 'lucide-react';
import Link from 'next/link';
import VisualNewsGrid from './VisualNewsGrid';
import SourceIcon from './SourceIcon';
import PremiumNextMatch from './PremiumNextMatch';
import { cn } from '@/lib/utils';
import { getSafeImageSrc } from '@/lib/images';

interface NewsItem {
    id: string;
    title: string;
    category?: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    is_live?: boolean;
    is_breaking?: boolean;
    is_premium?: boolean;
}

interface MatchData {
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    date: string;
    location: string;
    championship: string;
    status: string;
    home_team_logo?: string;
    away_team_logo?: string;
}

interface HeadlinesWidgetProps {
    news: NewsItem[];
    nextMatch?: MatchData | null;
    className?: string;
}

function getRelativeTime(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
}

export default function HeadlinesWidget({ news, nextMatch, className = "" }: HeadlinesWidgetProps) {
    if (!news || news.length === 0) return null;

    // Take top 10 for extended view (Unified List)
    const allNews = news.slice(0, 10);

    // Top Story (Hero) - Index 0
    const topStory = allNews[0];

    // Remaining Stories (Banners) - Indices 1-9
    const bannerStories = allNews.slice(1);

    return (
        <div className={` ${className}`}>
            <div className="w-full flex flex-col gap-2 md:gap-6 bg-transparent">

                {/* Rank 01 - Hero Section (Premium Highlight) */}
                {topStory && (
                    <Link
                        href={`/news/${topStory.id}`}
                        className="relative w-full aspect-[16/18] md:aspect-[21/10] group overflow-hidden block md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-[1.005] hover:shadow-premium-gold/10 border-b-4 border-premium-gold"
                    >
                        {/* Image */}
                        <img
                            src={getSafeImageSrc(topStory.image)}
                            alt={topStory.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        {/* Cinematic Overlay - Deeper and more nuanced */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-85" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-60" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-20 z-20">
                            {/* Badges (Top Left) */}
                            <div className="absolute top-6 md:top-10 left-6 md:left-10 z-30 flex gap-3">
                                {topStory.is_live && (
                                    <div className="px-4 py-1.5 bg-red-600 rounded-full shadow-lg animate-pulse flex items-center gap-2 border border-white/20">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">AO VIVO</span>
                                    </div>
                                )}
                                {topStory.is_breaking && (
                                    <div className="px-4 py-1.5 bg-premium-gold rounded-full shadow-lg flex items-center gap-2 border border-black/10">
                                        <div className="flex items-center gap-2">
                                            <Flame size={14} className="text-black fill-current" />
                                            <span className="text-[11px] font-black text-black uppercase tracking-widest">URGENTE</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Destaque Badge (Top Right or next to others) - Let's put it Distinctively */}
                            <div className="absolute top-6 md:top-10 right-6 md:right-10 z-30">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold text-black font-black uppercase tracking-widest text-[12px] shadow-lg border-2 border-white/10">
                                    <Crown size={16} fill="black" />
                                    Destaque
                                </div>
                            </div>

                            <div className="max-w-7xl space-y-4 md:space-y-6">
                                <h3 className="text-xl md:text-4xl lg:text-5xl font-black font-sans text-white leading-[0.95] md:leading-[1] uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] group-hover:text-premium-gold transition-colors duration-500 tracking-tighter">
                                    {topStory.title?.replace(/\*\*/g, '')}
                                </h3>

                                {/* Source & Time Row */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-xl">
                                        <SourceIcon source={topStory.source || 'default'} className="w-5 h-5 text-premium-gold" />
                                        <span className="text-[12px] md:text-sm font-black text-white uppercase tracking-[0.25em]">
                                            {topStory.source || 'FOGÃO PRÊMIO'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                                        <Clock size={16} className="text-zinc-400" />
                                        <span className="text-[11px] md:text-sm font-bold text-zinc-300 uppercase tracking-widest" suppressHydrationWarning>
                                            {getRelativeTime(topStory.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* INTERSTITIAL: NEXT MATCH (Shown after Hero on Mobile) */}
                {nextMatch && (
                    <div className="md:hidden px-4">
                        <PremiumNextMatch match={nextMatch} />
                    </div>
                )}

                {/* Grid for Banner Stories - 2 columns on desktop */}
                <div className="px-4 md:px-0">
                    <VisualNewsGrid news={bannerStories} />
                </div>

                {/* Footer */}
                <Link
                    href="/news"
                    className="flex items-center justify-center gap-3 p-6 mt-4 md:mt-6 bg-white/5 hover:bg-white/10 md:rounded-2xl border border-white/5 text-[13px] font-black text-white uppercase tracking-[0.2em] transition-all hover:gap-5 group"
                >
                    Ver Todas as Notícias
                    <ChevronRight size={18} className="text-premium-gold group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
