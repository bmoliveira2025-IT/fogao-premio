"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, TrendingUp, Clock, Newspaper, ThumbsUp, ThumbsDown } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    is_premium?: boolean;
    likes_count?: number;
    dislikes_count?: number;
}

interface FeaturedNewsSectionProps {
    news: NewsItem[];
    className?: string;
}

import LikeDislikeButtons from './LikeDislikeButtons';

const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora';
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
};

const toSentenceCase = (str: string) => {
    if (!str) return '';
    const cleanStr = str.replace(/\*\*/g, '').trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const getSourceColor = (source?: string) => {
    if (!source) return { text: 'text-premium-gold', bg: 'bg-premium-gold' };
    const s = source.toLowerCase();
    if (s.includes('globo')) return { text: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (s.includes('fogaonet') || s.includes('fogãonet')) return { text: 'text-amber-400', bg: 'bg-amber-500' };
    if (s.includes('lance') || s.includes('cnn')) return { text: 'text-rose-500', bg: 'bg-rose-500' };
    if (s.includes('oficial')) return { text: 'text-white', bg: 'bg-white' };
    return { text: 'text-premium-gold', bg: 'bg-premium-gold' };
};

const itemVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

// Hero Card Component (Main Featured)
function HeroCard({ news }: { news: NewsItem }) {
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants}>
            <Link
                href={`/news/${news.id}`}
                className="group relative block w-full overflow-hidden rounded-3xl md:rounded-[2rem] shadow-premium bg-card/60 backdrop-blur-3xl border border-white/[0.04] hover:border-premium-gold/40 hover:shadow-gold-glow transition-all duration-700 hover:-translate-y-1"
            >
                {/* Top Image Section */}
                <div className="relative w-full aspect-[16/10] md:h-[450px] lg:h-[520px] overflow-hidden">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                        unoptimized
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                {/* Bottom Content Section (Solid Block) */}
                <div className="p-6 md:p-10 space-y-5">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur-md rounded-full border border-white/5">
                            <Flame size={14} className="text-premium-gold fill-current" />
                            <span className="text-[10px] font-bold text-premium-gold uppercase tracking-[0.2em]">Destaque</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur-md rounded-full border border-white/5">
                            <SourceIcon source={news.source} className="w-4 h-4 text-premium-gold" />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text}`}>{news.source || 'Botafogo'}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-white leading-tight lg:leading-[1.1] group-hover:text-premium-gold transition-colors duration-300 tracking-tight">
                        {toSentenceCase(news.title)}
                    </h2>

                    {news.summary && (
                        <div className="pt-2">
                            <p className="text-base md:text-xl font-medium text-zinc-400 leading-relaxed max-w-4xl line-clamp-3">
                                {Array.isArray(news.summary) ? news.summary[0] : news.summary}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap pt-6 mt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 leading-none">
                            <Clock size={14} className="text-zinc-500" />
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>

                        <LikeDislikeButtons
                            articleId={news.id}
                            initialLikes={news.likes_count}
                            initialDislikes={news.dislikes_count}
                            className="ml-auto"
                        />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Square Secondary Card Component (Bento Grid)
function SecondaryCard({ news, index }: { news: NewsItem; index: number }) {
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants} className="h-full">
            <Link
                href={`/news/${news.id}`}
                className="group relative flex flex-col h-full bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[1.75rem] overflow-hidden hover:border-premium-gold/30 transition-all duration-500 ease-out hover:-translate-y-1 shadow-2xl"
            >
                {/* Image Background */}
                <div className="absolute inset-0 w-full h-full bg-zinc-900">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="relative flex-1 flex flex-col justify-between p-4 md:p-5 z-10 w-full h-full">
                    {/* Source Badge at TOP */}
                    <div className="flex justify-start">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] ${colors.text} bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5`}>
                            {news.source || 'Botafogo'}
                        </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="flex flex-col mt-auto pt-16">
                        <h3 className="text-[15px] md:text-[17px] font-display font-bold text-white/95 leading-[1.3] group-hover:text-white transition-colors line-clamp-3 mb-4 drop-shadow-lg">
                            {toSentenceCase(news.title)}
                        </h3>

                        <div className="flex items-center min-w-0 pt-3.5 border-t border-white/10 mt-auto">
                            <div className="flex items-center gap-1.5 min-w-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                <Clock size={12} className="text-white flex-shrink-0" />
                                <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap" suppressHydrationWarning>
                                    {getRelativeTime(news.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function FeaturedNewsSection({ news, className = '' }: FeaturedNewsSectionProps) {
    if (!news || news.length === 0) return null;

    const heroNews = news[0];
    const secondaryNews = news.slice(1, 7);

    return (
        <motion.section
            className={`space-y-4 md:space-y-6 ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            {/* Bento Grid */}
            <div className="px-4 md:px-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {/* Hero Card - Spans full width on mobile, 2 columns on desktop */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:row-span-2 h-full">
                        <HeroCard news={heroNews} />
                    </div>
                    {/* Secondary Cards */}
                    {secondaryNews.map((item, index) => (
                        <div key={item.id} className="col-span-1 md:col-span-2 lg:col-span-1 aspect-square md:aspect-auto md:h-64 lg:h-auto lg:min-h-[220px]">
                            <SecondaryCard news={item} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
