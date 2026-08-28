"use client";

import { Clock, Flame, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LikeDislikeButtons from './LikeDislikeButtons';

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

    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
}

const toSentenceCase = (str: string) => {
    if (!str) return '';
    const cleanStr = str.replace(/\*\*/g, '').trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};

export default function ModernHeroNews({ news, className = "" }: ModernHeroNewsProps) {
    const { user } = useAuth();

    if (!news) return null;

    return (
        <div className="px-4 md:px-0">
            <Link
                href={`/news/${news.id}`}
                className={`relative w-full aspect-[16/18] md:aspect-[16/9] group overflow-hidden block rounded-xl md:rounded-2xl soft-shadow-cinematic crystal-shine transition-all duration-700 hover:scale-[1.002] hover:shadow-premium-gold/20 ${className}`}
            >
                {/* Image */}
                <img
                    src={getSafeImageSrc(news.image)}
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Cinematic Overlay - Deeper and more nuanced */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95 transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-70" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-20">
                    {/* Badges - Inside flex flow to prevent overlap */}
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                        {news.is_live && (
                            <div className="status-badge status-badge-live px-5 py-2 bg-red-600 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                <span className="text-[12px] font-athletic text-white">AO VIVO</span>
                            </div>
                        )}
                        {news.is_breaking && (
                            <div className="status-badge status-badge-urgent px-5 py-2 bg-premium-gold rounded-full shadow-lg flex items-center gap-2 border border-black/10">
                                <div className="flex items-center gap-2">
                                    <Flame size={16} className="text-black fill-current" />
                                    <span className="text-[12px] font-athletic text-black">URGENTE</span>
                                </div>
                            </div>
                        )}
                        <div className="px-5 py-2 bg-black/50 backdrop-blur-xl rounded-full shadow-lg flex items-center gap-2 border border-premium-gold/40">
                            <Flame size={16} className="text-premium-gold fill-premium-gold animate-pulse" />
                            <span className="text-[12px] font-athletic text-premium-gold">DESTAQUE</span>
                        </div>
                    </div>

                    <div className="max-w-7xl space-y-4 md:space-y-6">
                        <h1 className="text-[24px] md:text-4xl lg:text-6xl font-athletic text-white drop-shadow-2xl group-hover:text-premium-gold transition-colors duration-500 leading-tight">
                            {toSentenceCase(news.title)}
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
                            </div>

                            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                                <Clock size={16} className="text-zinc-400" />
                                <span className="text-xs md:text-sm font-bold text-zinc-300 uppercase tracking-widest" suppressHydrationWarning>
                                    {getRelativeTime(news.created_at)}
                                </span>
                            </div>

                            <LikeDislikeButtons
                                articleId={news.id}
                                initialLikes={(news as any).likes_count}
                                initialDislikes={(news as any).dislikes_count}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
