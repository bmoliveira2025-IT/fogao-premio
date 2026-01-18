"use client";

import { FileText, ChevronRight, Clock, Flame } from 'lucide-react';
import Link from 'next/link';
import VisualNewsGrid from './VisualNewsGrid';
import SourceIcon from './SourceIcon';
import PremiumNextMatch from './PremiumNextMatch';
import { cn } from '@/lib/utils';

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
        <div className={`gradient-border-static md:rounded-3xl ${className}`}>
            <div className="w-full flex flex-col gap-2 md:gap-0 bg-card resize-none md:rounded-3xl overflow-hidden shadow-2xl">

                {/* Rank 01 - Hero Section (Premium Highlight) */}
                {topStory && (
                    <Link
                        href={`/news/${topStory.id}`}
                        className="relative w-full aspect-[16/9] md:aspect-[21/9] group overflow-hidden block"
                    >
                        {/* Image */}
                        {topStory.image ? (
                            <img
                                src={topStory.image}
                                alt={topStory.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-zinc-900" />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 z-20">
                            {/* Badges (Top Left) */}
                            <div className="absolute top-4 md:top-6 left-4 md:left-6 z-30 flex gap-2">
                                {topStory.is_live && (
                                    <div className="p-2 bg-red-600 rounded-full shadow-lg animate-pulse" title="AO VIVO">
                                        <div className="w-2 h-2 bg-white rounded-full component-shadow" />
                                    </div>
                                )}
                                {topStory.is_breaking && (
                                    <div className="p-2 bg-red-600 rounded-full shadow-lg" title="URGENTE">
                                        <Flame size={12} className="text-white fill-current" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-[20px] md:text-[32px] font-semibold font-sans text-white leading-tight max-w-4xl group-hover:text-premium-gold/90 transition-colors mb-4 md:mb-5">
                                {topStory.title?.replace(/\*\*/g, '')}
                            </h3>

                            {/* Source & Time Row */}
                            <div className="flex items-center gap-2 md:gap-3">
                                {/* Premium Source Pill */}
                                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-premium-gold/40 shadow-lg shadow-premium-gold/10">
                                    <Flame className="w-3.5 h-3.5 text-premium-gold animate-pulse fill-premium-gold/20" />
                                    <span className="text-[11px] md:text-xs font-black text-premium-gold uppercase tracking-widest">
                                        {topStory.source || 'FOGÃO PRÊMIO'}
                                    </span>
                                </div>

                                {/* Time Pill */}
                                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <Clock size={12} className="text-zinc-400" />
                                    <span className="text-[10px] md:text-xs font-bold text-zinc-300 uppercase tracking-widest" suppressHydrationWarning>
                                        {getRelativeTime(topStory.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* INTERSTITIAL: NEXT MATCH (Shown after Hero on Mobile, integrated differently on desktop if needed, 
                but user requested it "maintain" position meaning broadly after the first/top news) 
            */}
                {nextMatch && (
                    <div className="md:hidden mt-0.5 border-t border-b bg-background dark:bg-zinc-900/30" style={{ borderColor: 'var(--border-color)' }}>
                        <PremiumNextMatch match={nextMatch} className="rounded-none border-0 shadow-none !bg-transparent" />
                    </div>
                )}

                {/* List of Banners (Indices 1-9) - Modern Premium Cards */}
                <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-5 bg-transparent md:bg-card">
                    {bannerStories.map((story) => (
                        <Link
                            key={story.id}
                            href={`/news/${story.id}`}
                            className="group relative h-[200px] md:h-[240px] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg shadow-black/50 hover:border-premium-gold/30 hover:shadow-premium-gold/5 transition-all duration-300 block"
                        >
                            {/* Full Width Background Image */}
                            <img
                                src={story.image || 'https://via.placeholder.com/800x400'}
                                alt={story.title}
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />

                            {/* Cinematic Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity" />

                            {/* Content - Bottom Aligned */}
                            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                {/* Top Badges (Floating) */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {story.is_premium && (
                                        <div className="p-1.5 bg-premium-gold/20 backdrop-blur-md rounded-lg border border-premium-gold/30">
                                            <Flame size={12} className="text-premium-gold fill-premium-gold/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Source & Time Row */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 group-hover:border-premium-gold/30 transition-colors">
                                        <SourceIcon source={story.source || 'default'} className="w-3.5 h-3.5 text-premium-gold drop-shadow-md" />
                                        <span className="text-[10px] font-black text-white/90 uppercase tracking-widest drop-shadow-md">
                                            {story.source || 'FOGÃO'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1.5 drop-shadow-md" suppressHydrationWarning>
                                        <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <span suppressHydrationWarning>{getRelativeTime(story.created_at)}</span>
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-[17px] md:text-[19px] font-bold font-sans text-white leading-snug group-hover:text-premium-gold transition-colors line-clamp-2 drop-shadow-lg pr-4">
                                    {story.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <Link
                    href="/news"
                    className="block p-4 text-center bg-card hover:bg-white/5 border-t text-[13px] font-bold text-foreground/40 hover:text-white uppercase tracking-widest transition-colors relative z-10"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    Ver Todas as Notícias
                </Link>
            </div>
        </div>
    );
}
