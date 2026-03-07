"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, TrendingUp, BookOpen, Loader2, ThumbsUp, ThumbsDown, Newspaper } from 'lucide-react';
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
    hidden: { opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring" as const,
            stiffness: 80,
            damping: 15,
            mass: 0.8
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

// Editorial Showcase Card (Large visual impact for every 1st item)
function EditorialShowcaseCard({ news }: { news: NewsItem }) {
    return (
        <motion.div variants={itemVariants} className="w-full">
            <Link
                href={`/news/${news.id}`}
                className="group flex flex-col w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/5 transition-all duration-700 hover:-translate-y-1 shadow-2xl hover:border-white/10"
            >
                {/* Cinematic Image Top */}
                <div className="relative w-full aspect-[4/3] md:aspect-[21/10] bg-zinc-900 overflow-hidden shrink-0">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-700" />
                </div>

                {/* Content Panel Bottom */}
                <div className="flex flex-col flex-1 p-6 md:p-10 justify-center relative">
                    {/* Top Badges */}
                    <div className="flex gap-2 mb-4 md:mb-5">
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-premium-gold bg-premium-gold/10 border border-premium-gold/20 px-3.5 py-1.5 rounded-full shadow-sm">
                            {news.source || 'Botafogo'}
                        </span>
                    </div>

                    {/* Title & Metadata */}
                    <div className="flex flex-col space-y-3 md:space-y-4 max-w-4xl">
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-white leading-[1.15] group-hover:text-premium-gold transition-colors duration-500 tracking-tight">
                            {toSentenceCase(news.title)}
                        </h3>

                        {news.summary && (
                            <p className="text-sm md:text-lg text-zinc-400 font-medium line-clamp-2 md:line-clamp-3 leading-relaxed opacity-90 hidden md:block">
                                {news.summary}
                            </p>
                        )}

                        <div className="flex items-center gap-4 pt-4 mt-1 border-t border-white/5">
                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Clock size={12} className="text-zinc-500" />
                                <span className="text-[10px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-widest" suppressHydrationWarning>
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

// Editorial Row Card (Reading-optimized list view for 2nd, 3rd, 4th items)
function EditorialRowCard({ news }: { news: NewsItem }) {
    return (
        <motion.div variants={itemVariants} className="w-full">
            <Link
                href={`/news/${news.id}`}
                className="group flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center p-4 md:p-6 bg-zinc-950/50 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl md:rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
            >
                {/* Visual Thumbnail */}
                <div className="relative w-full md:w-[260px] lg:w-[320px] aspect-[16/10] md:aspect-[4/3] flex-shrink-0 rounded-xl md:rounded-[1.25rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-lg">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        unoptimized
                    />
                </div>

                {/* Editorial Content */}
                <div className="flex flex-col flex-grow min-w-0 py-1 md:py-3 h-full justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                {news.source || 'Botafogo'}
                            </span>
                        </div>

                        <h3 className="text-[18px] md:text-[22px] lg:text-[28px] font-display font-bold text-white/95 leading-[1.3] group-hover:text-premium-gold transition-colors duration-500 tracking-tight mb-3 md:mb-4">
                            {toSentenceCase(news.title)}
                        </h3>

                        {news.summary && (
                            <p className="text-sm md:text-base text-zinc-400/90 font-medium line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
                                {news.summary}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-500 opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest" suppressHydrationWarning>
                            {getRelativeTime(news.created_at)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Skeleton Loader for Editorial Layout
function SkeletonCard({ index }: { index: number }) {
    const isShowcase = index % 4 === 0;

    if (isShowcase) {
        return (
            <div className="animate-pulse bg-zinc-950/50 border border-white/5 rounded-2xl md:rounded-[2rem] w-full h-[400px] md:h-[500px] p-6 md:p-10 flex flex-col justify-end">
                <div className="w-24 h-8 bg-zinc-900 rounded-xl mb-4" />
                <div className="h-8 bg-zinc-900 rounded-md w-3/4 mb-4" />
                <div className="h-8 bg-zinc-900 rounded-md w-1/2 mb-6" />
                <div className="h-4 bg-zinc-900 rounded-md w-full mb-2" />
                <div className="h-4 bg-zinc-900 rounded-md w-5/6" />
            </div>
        );
    }

    return (
        <div className="animate-pulse flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center p-4 md:p-6 w-full">
            <div className="w-full md:w-[320px] lg:w-[400px] aspect-[16/10] bg-zinc-950/50 rounded-xl md:rounded-[1.5rem] border border-white/5" />
            <div className="flex flex-col flex-grow py-2 w-full">
                <div className="w-32 h-4 bg-zinc-900 rounded-md mb-4 hidden md:block" />
                <div className="h-6 bg-zinc-900 rounded-md w-full mb-3" />
                <div className="h-6 bg-zinc-900 rounded-md w-4/5 mb-4" />
                <div className="h-4 bg-zinc-900 rounded-md w-24 mb-3 md:hidden" />
                <div className="h-4 bg-zinc-900 rounded-md w-full mb-2" />
                <div className="h-4 bg-zinc-900 rounded-md w-2/3" />
            </div>
        </div>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function SmartNewsFeed({ initialNews, className = '' }: SmartNewsFeedProps) {
    const INITIAL_COUNT = 20;
    const LOAD_AMOUNT = 2;
    const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [extraNews, setExtraNews] = useState<NewsItem[]>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Initialize with first 20 items
    useEffect(() => {
        const allNews = [...initialNews, ...extraNews];
        if (displayedNews.length === 0) {
            setDisplayedNews(allNews.slice(0, INITIAL_COUNT));
        }
    }, [initialNews, extraNews]);

    // Load two more items
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        const allNews = [...initialNews, ...extraNews];
        const currentCount = displayedNews.length;

        // Check if we have more local items
        if (currentCount < allNews.length) {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 150)); // Small delay for animation
            const nextNews = allNews.slice(currentCount, currentCount + LOAD_AMOUNT);
            setDisplayedNews(prev => [...prev, ...nextNews]);
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
                    setExtraNews(prev => {
                        const existingIds = new Set([...initialNews.map(n => n.id), ...prev.map(n => n.id)]);
                        const unique = moreNews.filter((n: NewsItem) => !existingIds.has(n.id));
                        return [...prev, ...unique];
                    });
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
    }, [loadMore, hasMore, loading]);

    if (!displayedNews || displayedNews.length === 0) return null;

    return (
        <div className={className}>
            <div className="flex items-center gap-3 mb-6 pl-2">
                <div className="p-2 rounded-xl bg-premium-gold/10 border border-premium-gold/20 shadow-lg shadow-premium-gold/5 hidden md:block">
                    <Newspaper className="text-premium-gold" size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                        Últimas Notícias
                    </h2>
                </div>
            </div>

            {/* Editorial Feed Implementation */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6 md:gap-8 lg:gap-12"
            >
                <AnimatePresence mode="popLayout">
                    {displayedNews.map((item, index) => {
                        const isShowcase = index % 4 === 0;

                        return (
                            <motion.div key={item.id} layout>
                                {isShowcase ? (
                                    <EditorialShowcaseCard news={item} />
                                ) : (
                                    <EditorialRowCard news={item} />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Loading Skeletons */}
                {loading && (
                    <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 mt-4">
                        <SkeletonCard index={displayedNews.length} />
                    </div>
                )}
            </motion.div>

            {/* Loader Spinner */}
            {loading && (
                <div className="flex justify-center py-4 mt-4">
                    <Loader2 className="w-6 h-6 text-premium-gold animate-spin" />
                </div>
            )}

            {/* Intersection Observer Target */}
            <div ref={loadMoreRef} className="h-1 mt-8" />

            {/* End Message */}
            {!hasMore && displayedNews.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 px-4 mt-8"
                >
                    <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase px-6 py-3 rounded-full border border-white/5 bg-white/[0.02] inline-block">
                        Você leu todas as notícias por hoje
                    </p>
                </motion.div>
            )}
        </div>
    );
}
