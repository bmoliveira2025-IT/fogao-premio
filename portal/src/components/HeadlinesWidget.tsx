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

    // Take top 10 for extended view
    const allNews = news.slice(0, 10);

    // Take top 10 for extended view
    const allNews = news.slice(0, 10);

    return (
    return (
        <div className={`w-full flex flex-col gap-0 bg-card border resize-none md:rounded-3xl overflow-hidden shadow-2xl ${className}`} style={{ borderColor: 'var(--border-color)' }}>

            <div className="flex flex-col gap-0 md:gap-2 p-0 md:p-5">
                {allNews.map((story, index) => (
                    <div key={story.id}>
                        <Link
                            href={`/news/${story.id}`}
                            className="group relative h-[120px] md:h-[140px] w-full rounded-none md:rounded-xl overflow-hidden border-b md:border border-white/5 last:border-0 bg-zinc-900 hover:border-premium-gold/30 transition-all duration-300 block"
                        >
                            {/* Image - Wide crop */}
                            <img
                                src={story.image || 'https://via.placeholder.com/800x300'}
                                alt={story.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                            {/* Content - Left Aligned */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-center items-start max-w-2xl">
                                <div className="flex items-center gap-2 mb-1.5">
                                    {/* Source Badge */}
                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-white/10">
                                        <SourceIcon source={story.source || 'default'} className="w-3 h-3 text-premium-gold" />
                                        <span className="text-[9px] font-black text-white/90 uppercase tracking-widest leading-none mt-px">
                                            {story.source || 'FOGÃO'}
                                        </span>
                                    </div>
                                    {/* Time */}
                                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                                        <Clock size={10} />
                                        {getRelativeTime(story.created_at)}
                                    </span>
                                </div>

                                <h3 className="text-[14px] md:text-[16px] font-bold text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2 pr-4">
                                    {story.title}
                                </h3>
                            </div>

                            {/* Arrow hint */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-premium-gold transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </Link>

                        {/* Interstitial Match - Show after first item on Mobile */}
                        {index === 0 && nextMatch && (
                            <div className="lg:hidden border-t border-b bg-background dark:bg-zinc-900/30" style={{ borderColor: 'var(--border-color)' }}>
                                <PremiumNextMatch match={nextMatch} className="md:rounded-none md:border-0 shadow-none !bg-transparent" />
                            </div>
                        )}
                    </div>
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
    );
}
