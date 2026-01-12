"use client";

import { FileText, ChevronRight, Clock, Flame } from 'lucide-react';
import Link from 'next/link';
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

    // Take top 8 for a balanced view
    const topBriefing = news.slice(0, 8);
    const topStory = topBriefing[0];
    const otherStories = topBriefing.slice(1);

    return (
        <div className={`w-full flex flex-col gap-0 bg-card border resize-none md:rounded-3xl overflow-hidden shadow-2xl ${className}`} style={{ borderColor: 'var(--border-color)' }}>

            {/* Rank 01 - Hero Section (Immersive) */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
                        {/* Badge - Adjusted top position for mobile to prevent header overlap if necessary, though it is usually inside. 
                            If user says "sem visão", maybe it's too high up? 
                            I'll move the badges container to be absolutely positioned safely or rely on the flex layout.
                            Wait, the badges were `absolute top-4 left-4`. 
                            I'll move them down a bit on mobile: `top-20`? No, that's too much.
                            The user image shows it cut off by the header. 
                            I will add `mt-14` to the first card on mobile? No, the page has padding.
                            Let's push the badges down on mobile.
                        */}
                        {/* Badge - Iconic Only */}
                        <div className="absolute top-4 md:top-6 left-4 md:left-6 z-30 flex gap-2">
                            {/* Live Badge */}
                            {topStory.is_live && (
                                <div className="p-2 bg-red-600 rounded-full shadow-lg animate-pulse" title="AO VIVO">
                                    <div className="w-2 h-2 bg-white rounded-full component-shadow" />
                                </div>
                            )}
                            {/* Breaking News Badge */}
                            {topStory.is_breaking && (
                                <div className="p-2 bg-red-600 rounded-full shadow-lg" title="URGENTE">
                                    <Flame size={12} className="text-white fill-current" />
                                </div>
                            )}
                        </div>



                        <h3 className="text-lg md:text-3xl font-black text-white leading-tight drop-shadow-xl max-w-4xl group-hover:text-premium-gold/90 transition-colors">
                            {topStory.title?.replace(/\*\*/g, '')}
                        </h3>

                        {/* Source & Time */}
                        <div className="flex items-center gap-2 mt-4 opacity-100">
                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-premium-gold/30 shadow-[0_0_15px_rgba(255,32,176,0.3)]">
                                <Flame className="w-3.5 h-3.5 text-premium-gold animate-pulse fill-premium-gold/20" />
                                <span className="text-[10px] font-black text-premium-gold uppercase tracking-widest">
                                    {topStory.source || 'Fogão Prêmio'}
                                </span>
                            </div>

                            {/* Time Tag Moved Here */}
                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                                <Clock size={11} className="text-zinc-400" />
                                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest" suppressHydrationWarning>
                                    {getRelativeTime(topStory.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            )}

            {/* INTERSTITIAL: NEXT MATCH (Desktop/Tablet integrated) */}
            {nextMatch && (
                <div className="lg:hidden border-t border-b bg-background dark:bg-zinc-900/30" style={{ borderColor: 'var(--border-color)' }}>
                    <PremiumNextMatch match={nextMatch} className="md:rounded-none md:border-0 shadow-none !bg-transparent" />
                </div>
            )}


            {/* Rank 02-08 - List Section */}
            <div className={`grid grid-cols-1 divide-y bg-card`} style={{ borderColor: 'var(--border-color)' }}>
                {otherStories.map((story, index) => (
                    <Link
                        key={story.id}
                        href={`/news/${story.id}`}
                        className={`group relative flex items-center gap-4 p-4 md:p-5 hover:bg-white/5 transition-all duration-300 overflow-hidden border-b last:border-0`}
                        style={{ borderColor: 'var(--border-color)' }}
                    >
                        {/* Background removed/simplified for cleaner text readability */}

                        {/* Background Image - Subtle & Transparent */}
                        {story.image && (
                            <div className="absolute inset-0 z-0 opacity-10">
                                <img
                                    src={story.image}
                                    alt=""
                                    className="w-full h-full object-cover grayscale"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent" />
                            </div>
                        )}

                        {/* Z-Index Wrapper to stay above bg */}
                        <div className="relative z-10 flex flex-1 items-center gap-5 min-w-0">
                            {/* Number - Updated to GOLD and SOLID */}
                            <span className="text-3xl font-display font-black text-premium-gold w-10 text-center leading-none flex-shrink-0">
                                {String(index + 2).padStart(2, '0')}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Source Highlight & Time */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-5 h-5 bg-zinc-800/80 rounded-full border border-white/10 shrink-0" title={story.source}>
                                        <SourceIcon source={story.source || ''} className="w-3 h-3 grayscale group-hover:grayscale-0 transition-all" />
                                    </div>

                                    {/* Source Name - with subtle background */}
                                    <span className="text-[9px] md:text-[10px] font-bold text-premium-gold/90 uppercase tracking-widest leading-none px-2 py-1 rounded bg-premium-gold/10 border border-premium-gold/10 whitespace-nowrap">
                                        {story.source ? story.source.toUpperCase() : 'FOGÃO PRÊMIO'}
                                    </span>

                                    {/* Time - No separator needed with pill, or maybe keep it? Let's check logic. 
                                        If pill is used, space is enough. 
                                        But user wanted "do jeito que estava" relative to order. 
                                        I'll keep the order but maybe remove the dot if it looks cluttered.
                                        Let's keep the dot for now but maybe lighter.
                                    */}
                                    {/* Separator */}
                                    <span className="text-[10px] text-white/10">•</span>

                                    {/* Time */}
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider" suppressHydrationWarning>
                                        {getRelativeTime(story.created_at)}
                                    </span>
                                </div>

                                <h4 className="text-sm md:text-base font-bold text-foreground group-hover:text-white transition-colors leading-tight line-clamp-2">
                                    {story.title?.replace(/\*\*/g, '')}
                                </h4>
                            </div>

                            {/* Arrow */}
                            <ChevronRight className="text-foreground/20 group-hover:text-premium-gold transition-colors transform group-hover:translate-x-1 flex-shrink-0" size={24} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer */}
            <Link
                href="/news"
                className="block p-4 text-center bg-card hover:bg-white/5 border-t text-xs font-bold text-foreground/40 hover:text-white uppercase tracking-widest transition-colors relative z-10"
                style={{ borderColor: 'var(--border-color)' }}
            >
                Ver Todas as Notícias
            </Link>
        </div>
    );
}
