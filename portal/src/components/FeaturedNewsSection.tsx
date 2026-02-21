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
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                            <Flame size={14} className="text-premium-gold fill-current" />
                            <span className="text-[10px] font-bold text-premium-gold uppercase tracking-[0.2em]">Destaque</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                            <SourceIcon source={news.source} className="w-4 h-4 text-premium-gold" />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text}`}>{news.source || 'Botafogo'}</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-athletic text-white leading-tight group-hover:text-premium-gold transition-colors duration-300">
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

// Secondary Card Component (Grid Items)
// Secondary Card Component (Horizontal List Item)
function SecondaryCard({ news, index }: { news: NewsItem; index: number }) {
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants}>
            <Link
                href={`/news/${news.id}`}
                className="group relative flex gap-4 bg-card/60 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-4 hover:border-premium-gold/40 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-card-hover"
            >
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <SourceIcon source={news.source} className="w-3.5 h-3.5 text-premium-gold" />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text}`}>
                                {news.source || 'Botafogo'}
                            </span>
                        </div>
                        <h3 className="text-[17px] md:text-2xl font-athletic text-white/90 leading-snug group-hover:text-premium-gold transition-colors line-clamp-2">
                            {toSentenceCase(news.title)}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 min-w-0">
                        <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-shrink flex-grow-0 overflow-hidden">
                            <Clock size={12} className="text-zinc-500 flex-shrink-0" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap flex-shrink-0" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>

                        <LikeDislikeButtons
                            articleId={news.id}
                            initialLikes={news.likes_count}
                            initialDislikes={news.dislikes_count}
                            className="flex-shrink-0 ml-2 scale-[0.9] origin-right"
                        />
                    </div>
                </div>

                {/* Image */}
                <div className="relative w-28 h-20 md:w-52 md:h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl group-hover:shadow-premium-gold/10 transition-shadow">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent opacity-40" />
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

            {/* Hero Card */}
            <div className="px-4 md:px-0">
                <HeroCard news={heroNews} />
            </div>

            {/* Secondary Grid - Horizontal List */}
            {secondaryNews.length > 0 && (
                <div className="px-4 md:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {secondaryNews.map((item, index) => (
                            <SecondaryCard key={item.id} news={item} index={index} />
                        ))}
                    </div>
                </div>
            )}
        </motion.section>
    );
}
