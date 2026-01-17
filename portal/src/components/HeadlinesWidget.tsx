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

                {/* List of Banners (Indices 1-9) - Full Width Premium Style */}
                <div className="flex flex-col gap-1 md:gap-2 p-0 md:p-5 bg-card">
                    {bannerStories.map((story) => (
                        <Link
                            key={story.id}
                            href={`/news/${story.id}`}
                            className="group relative h-[180px] md:h-[220px] w-full rounded-none md:rounded-xl overflow-hidden bg-zinc-900 hover:brightness-110 transition-all duration-300 block"
                        >
                            {/* Full Width Background Image - Position Top to Keep Faces */}
                            <img
                                src={story.image || 'https://via.placeholder.com/800x400'}
                                alt={story.title}
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Premium Gradient Overlay - Bottom Heavy */}
                            <div className="absolute inset-0 hero-gradient" />

                            {/* Content - Bottom Aligned */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                {/* Source & Time Row */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10">
                                        <SourceIcon source={story.source || 'default'} className="w-3.5 h-3.5 text-premium-gold" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {story.source || 'FOGÃO'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-300 flex items-center gap-1 bg-black/40 px-2 py-1 rounded backdrop-blur-sm" suppressHydrationWarning>
                                        <Clock size={10} />
                                        <span suppressHydrationWarning>{getRelativeTime(story.created_at)}</span>
                                    </span>
                                </div>

                                {/* Title - Bold and Prominent */}
                                <h3 className="text-[16px] md:text-[18px] font-semibold font-sans text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2">
                                    {story.title}
                                </h3>
                            </div>

                            {/* Gradient Separator - Mobile Only */}
                            <div
                                className="md:hidden absolute bottom-0 left-[10%] right-[10%] h-px"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.3) 20%, rgba(255, 215, 0, 0.5) 50%, rgba(255, 215, 0, 0.3) 80%, transparent 100%)'
                                }}
                            />
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
