"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, TrendingUp, BookOpen, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
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

interface SmartNewsFeedProps {
    initialNews: NewsItem[];
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

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
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

// Large Card with Full Image
function LargeCard({ news }: { news: NewsItem }) {
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={`/news/${news.id}`}
                className="group relative block bg-card/60 backdrop-blur-xl border border-white/[0.04] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-premium-gold/40 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] active:opacity-90"
            >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>

                <div className="p-5 md:p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider ${colors.text}`}>
                            {news.source || 'Portal'}
                        </span>
                    </div>

                    <h3 className="text-lg md:text-2xl font-bold text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2">
                        {toSentenceCase(news.title)}
                    </h3>

                    {news.summary && (
                        <div className="pt-1.5">
                            <div className="flex items-start gap-2.5 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                                <div className={`mt-2 flex-shrink-0 w-1 h-1 rounded-full ${colors.bg} opacity-80`} />
                                <p className="text-sm md:text-base leading-relaxed line-clamp-3">
                                    {Array.isArray(news.summary) ? news.summary[0] : news.summary}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 mt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5 leading-none">
                            <Clock size={12} className="text-zinc-500" />
                            <span className="text-xs font-bold text-zinc-500 uppercase" suppressHydrationWarning>
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

// Compact Card with Small Image
function CompactCard({ news }: { news: NewsItem }) {
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={`/news/${news.id}`}
                className="group flex gap-4 bg-card/60 backdrop-blur-xl border border-white/[0.04] rounded-2xl md:rounded-[2rem] p-3 md:p-4 hover:border-premium-gold/40 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] active:opacity-90"
            >
                <div className="relative w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-premium-gold/10 transition-shadow">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        unoptimized
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${colors.text}`}>
                            {news.source || 'Portal'}
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-premium-gold transition-colors line-clamp-2">
                            {toSentenceCase(news.title)}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                            <Clock size={12} className="text-zinc-500 flex-shrink-0" />
                            <span className="text-[10px] font-bold text-zinc-500 whitespace-nowrap flex-shrink-0" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>
                        <LikeDislikeButtons
                            articleId={news.id}
                            initialLikes={news.likes_count}
                            initialDislikes={news.dislikes_count}
                            className="flex-shrink-0 ml-2 scale-[0.85] origin-right"
                        />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Text Only Card (no image)
function TextCard({ news }: { news: NewsItem }) {
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={`/news/${news.id}`}
                className="group block bg-card/60 backdrop-blur-xl border border-white/[0.04] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 ease-out hover:border-premium-gold/40 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] active:opacity-90 relative overflow-hidden"
            >
                {/* Dynamic colored side glow */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors.text.replace('text-', 'from-')} to-transparent opacity-30 group-hover:opacity-100 transition-opacity`} />

                <div className="flex items-start gap-4">
                    <div className={`p-3 ${colors.bg.replace('bg-', 'bg-')}/10 rounded-xl shadow-inner border border-white/5 group-hover:border-white/10 transition-colors`}>
                        <BookOpen size={20} className={colors.text} />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col gap-1.5 mb-1.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${colors.text}`}>
                                {news.source || 'Portal'}
                            </span>
                            <h3 className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-premium-gold transition-colors line-clamp-2">
                                {toSentenceCase(news.title)}
                            </h3>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                                <Clock size={12} className="text-zinc-500 flex-shrink-0" />
                                <span className="text-[10px] font-bold text-zinc-500 whitespace-nowrap flex-shrink-0" suppressHydrationWarning>
                                    {getRelativeTime(news.created_at)}
                                </span>
                            </div>
                            <LikeDislikeButtons
                                articleId={news.id}
                                initialLikes={news.likes_count}
                                initialDislikes={news.dislikes_count}
                                className="flex-shrink-0 ml-2 scale-[0.85] origin-right"
                            />
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
