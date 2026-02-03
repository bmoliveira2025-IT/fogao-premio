"use client";

import { Clock, Flame, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    is_live?: boolean;
    is_breaking?: boolean;
    is_premium?: boolean;
}

interface ModernHeroNewsProps {
    news: NewsItem;
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

export default function ModernHeroNews({ news, className = "" }: ModernHeroNewsProps) {
    if (!news) return null;

    return (
        <Link
            href={`/news/${news.id}`}
            className={`relative w-full aspect-[16/18] md:aspect-[21/10] group overflow-hidden block rounded-none md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-[1.002] hover:shadow-premium-gold/10 ${className}`}
        >
            {/* Image */}
            <img
                src={getSafeImageSrc(news.image)}
                alt={news.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Cinematic Overlay - Deeper and more nuanced */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-60" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-20 z-20">
                {/* Badges (Top Left) */}
                <div className="absolute top-6 md:top-10 left-6 md:left-10 z-30 flex gap-3">
                    {news.is_live && (
                        <div className="px-4 py-1.5 bg-red-600 rounded-full shadow-lg animate-pulse flex items-center gap-2 border border-white/20">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">AO VIVO</span>
                        </div>
                    )}
                    {news.is_breaking && (
                        <div className="px-4 py-1.5 bg-premium-gold dark:bg-premium-gold light:bg-zinc-800 rounded-full shadow-lg flex items-center gap-2 border border-black/10">
                            <div className="flex items-center gap-2">
                                <Flame size={14} className="text-black dark:text-black light:text-white fill-current" />
                                <span className="text-[11px] font-black text-black dark:text-black light:text-white uppercase tracking-widest">URGENTE</span>
                            </div>
                        </div>
                    )}
                    <div className="px-4 py-1.5 bg-premium-gold/90 dark:bg-premium-gold/90 light:bg-zinc-100 rounded-full shadow-lg flex items-center gap-2 border border-black/10">
                        <TrendingUp size={14} className="text-black dark:text-black light:text-zinc-600" />
                        <span className="text-[11px] font-black text-black dark:text-black light:text-zinc-900 uppercase tracking-widest">DESTAQUE</span>
                    </div>
                </div>

                <div className="max-w-7xl space-y-4 md:space-y-6">
                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-black font-sans text-white leading-[1.1] uppercase drop-shadow-xl group-hover:text-premium-gold transition-colors duration-500 tracking-tight">
                        {news.title?.replace(/\*\*/g, '')}
                    </h1>

                    {/* Summary - Desktop Only */}
                    {news.summary && (
                        <p className="hidden md:block text-base lg:text-lg text-zinc-200 line-clamp-2 max-w-4xl font-medium leading-relaxed">
                            {news.summary}
                        </p>
                    )}

                    {/* Source & Time Row */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-xl">
                            <SourceIcon source={news.source || 'default'} className="w-4 h-4 text-premium-gold" />
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">
                                {news.source || 'FOGÃO PRÊMIO'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                            <Clock size={16} className="text-zinc-400" />
                            <span className="text-xs md:text-sm font-bold text-zinc-300 uppercase tracking-widest" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
