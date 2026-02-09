"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, TrendingUp, BookOpen, Loader2 } from 'lucide-react';
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

interface SmartNewsFeedProps {
    initialNews: NewsItem[];
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

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

// Large Card with Full Image
function LargeCard({ news }: { news: NewsItem }) {
    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={`/news/${news.id}`}
                className="group relative block bg-zinc-900/70 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-premium-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-premium-gold/10"
            >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                </div>

                <div className="p-5 space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2">
                        {toSentenceCase(news.title)}
                    </h3>

                    {news.summary && (
                        <p className="text-sm text-zinc-400 line-clamp-2">{news.summary}</p>
                    )}

                    <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <SourceIcon source={news.source || 'default'} className="w-4 h-4 text-premium-gold" />
                            <span className="text-xs font-bold text-zinc-300 uppercase">{news.source || 'Fogão'}</span>
                        </div>
                        <span className="text-zinc-600">•</span>
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-zinc-500" />
                            <span className="text-xs font-bold text-zinc-500 uppercase" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Compact Card with Small Image
function CompactCard({ news }: { news: NewsItem }) {
    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={`/news/${news.id}`}
                className="group flex gap-4 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-premium-gold/30 transition-all duration-500 hover:shadow-lg hover:shadow-premium-gold/5"
            >
                <div className="relative w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                    <h3 className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-premium-gold transition-colors line-clamp-2">
                        {toSentenceCase(news.title)}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                        <SourceIcon source={news.source || 'default'} className="w-3.5 h-3.5 text-premium-gold" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{news.source || 'Fogão'}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[10px] font-bold text-zinc-500" suppressHydrationWarning>
                            {getRelativeTime(news.created_at)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Text Only Card (no image)
function TextCard({ news }: { news: NewsItem }) {
    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={`/news/${news.id}`}
                className="group block bg-zinc-900/40 backdrop-blur-sm border-l-4 border-l-premium-gold border border-white/5 rounded-lg p-4 hover:bg-zinc-900/60 transition-all duration-300"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-premium-gold/10 rounded-lg">
                        <BookOpen size={16} className="text-premium-gold" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-premium-gold transition-colors line-clamp-2">
                            {toSentenceCase(news.title)}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">{news.source || 'Fogão'}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-[10px] font-bold text-zinc-500" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Skeleton Loader
function SkeletonCard() {
    return (
        <div className="animate-pulse bg-zinc-900/50 rounded-xl p-4">
            <div className="flex gap-4">
                <div className="w-24 h-20 bg-zinc-800 rounded-lg" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}

export default function SmartNewsFeed({ initialNews, className = '' }: SmartNewsFeedProps) {
    const INITIAL_COUNT = 8;
    const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [extraNews, setExtraNews] = useState<NewsItem[]>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Initialize with first 8 items
    useEffect(() => {
        const allNews = [...initialNews, ...extraNews];
        if (displayedNews.length === 0) {
            setDisplayedNews(allNews.slice(0, INITIAL_COUNT));
        }
    }, [initialNews, extraNews]);

    // Load one more item
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        const allNews = [...initialNews, ...extraNews];
        const currentCount = displayedNews.length;

        // Check if we have more local items
        if (currentCount < allNews.length) {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 150)); // Small delay for animation
            setDisplayedNews(prev => [...prev, allNews[currentCount]]);
            setLoading(false);
            return;
        }

        // Fetch more from server
        if (allNews.length > 0) {
            setLoading(true);
            const lastDate = allNews[allNews.length - 1].created_at;

            try {
                const { fetchMoreNews } = await import('@/app/news/actions');
                const moreNews = await fetchMoreNews(lastDate as string);

                if (moreNews && moreNews.length > 0) {
                    setExtraNews(prev => [...prev, ...moreNews]);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error("Error loading more news:", err);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        } else {
            setHasMore(false);
        }
    }, [loading, hasMore, displayedNews, initialNews, extraNews]);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasMore, loading, loadMore]);

    // Get card type based on index pattern (Large, Compact, Compact, Text, repeat)
    const getCardComponent = (news: NewsItem, index: number) => {
        const pattern = index % 4;

        switch (pattern) {
            case 0:
                return <LargeCard key={news.id} news={news} />;
            case 1:
            case 2:
                return <CompactCard key={news.id} news={news} />;
            case 3:
                return <TextCard key={news.id} news={news} />;
            default:
                return <CompactCard key={news.id} news={news} />;
        }
    };

    return (
        <section className={`space-y-4 ${className}`}>
            {/* Section Header */}
            <div className="flex items-center gap-3 px-4 md:px-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-800/80 to-transparent rounded-full border border-white/10">
                    <TrendingUp size={16} className="text-premium-gold" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Últimas Notícias</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {/* News Feed */}
            <div className="px-4 md:px-0 space-y-3">
                <AnimatePresence mode="popLayout">
                    {displayedNews.map((news, index) => (
                        <div key={news.id}>
                            {getCardComponent(news, index)}
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="px-4 md:px-0">
                    <SkeletonCard />
                </div>
            )}

            {/* Loader Spinner */}
            {loading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 text-premium-gold animate-spin" />
                </div>
            )}

            {/* Intersection Observer Target */}
            <div ref={loadMoreRef} className="h-1" />

            {/* End Message */}
            {!hasMore && displayedNews.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 px-4"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900/50 rounded-full border border-white/5">
                        <Flame size={14} className="text-premium-gold" />
                        <span className="text-sm text-zinc-400">
                            Você viu todas as notícias das últimas 24 horas
                        </span>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
