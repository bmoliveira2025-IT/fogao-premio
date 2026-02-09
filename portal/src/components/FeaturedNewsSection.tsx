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
}

interface FeaturedNewsSectionProps {
    news: NewsItem[];
    className?: string;
}

const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
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

const itemVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

// Like/Dislike Action Component
function LikeActions({ className = "" }: { className?: string }) {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        if (!liked) setDisliked(false);
    };

    const handleDislike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDisliked(!disliked);
        if (!disliked) setLiked(false);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handleLike}
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${liked
                    ? 'bg-premium-gold text-black scale-110 shadow-lg shadow-premium-gold/20'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
            >
                <ThumbsUp size={16} className={liked ? 'fill-current' : ''} />
            </button>
            <button
                onClick={handleDislike}
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${disliked
                    ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/20'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
            >
                <ThumbsDown size={16} className={disliked ? 'fill-current' : ''} />
            </button>
        </div>
    );
}

// Hero Card Component (Main Featured)
function HeroCard({ news }: { news: NewsItem }) {
    return (
        <motion.div variants={itemVariants}>
            <Link
                href={`/news/${news.id}`}
                className="relative w-full aspect-[16/10] md:aspect-[21/9] group overflow-hidden block rounded-2xl md:rounded-3xl shadow-2xl"
            >
                <Image
                    src={getSafeImageSrc(news.image)}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    unoptimized
                    priority
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                    <div className="flex items-center gap-2 px-4 py-2 bg-premium-gold rounded-full shadow-lg">
                        <Flame size={14} className="text-black fill-current" />
                        <span className="text-xs font-bold text-black uppercase tracking-wider">Destaque</span>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 z-10">
                    <div className="max-w-4xl space-y-3 md:space-y-4">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight group-hover:text-premium-gold transition-colors duration-300">
                            {toSentenceCase(news.title)}
                        </h2>

                        {news.summary && (
                            <p className="hidden md:block text-base lg:text-lg text-zinc-200 line-clamp-2 max-w-3xl">
                                {news.summary}
                            </p>
                        )}

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                <SourceIcon source={news.source || 'default'} className="w-4 h-4 text-premium-gold" />
                                <span className="text-xs font-bold text-white uppercase">{news.source || 'Fogão'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full">
                                <Clock size={12} className="text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-300 uppercase" suppressHydrationWarning>
                                    {getRelativeTime(news.created_at)}
                                </span>
                            </div>

                            <LikeActions className="ml-auto" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Secondary Card Component (Grid Items)
// Secondary Card Component (Horizontal List Item)
function SecondaryCard({ news, index }: { news: NewsItem; index: number }) {
    return (
        <motion.div variants={itemVariants}>
            <Link
                href={`/news/${news.id}`}
                className="group relative flex gap-4 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-3 hover:border-premium-gold/30 transition-all duration-500 hover:shadow-lg hover:shadow-premium-gold/5"
            >
                {/* Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent opacity-40" />

                    {/* Compact Trending Badge */}
                    <div className="absolute top-1.5 left-1.5">
                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded-md border border-white/10">
                            <TrendingUp size={8} className="text-premium-gold" />
                            <span className="text-[8px] font-bold text-white uppercase">#{index + 2}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                    <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2 md:line-clamp-3">
                        {toSentenceCase(news.title)}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                            <SourceIcon source={news.source || 'default'} className="w-3 h-3 text-premium-gold" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">{news.source || 'Fogão'}</span>
                        </div>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase" suppressHydrationWarning>
                            {getRelativeTime(news.created_at)}
                        </span>
                    </div>

                    <LikeActions className="mt-3" />
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
