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
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants} className="w-full">
            <Link
                href={`/news/${news.id}`}
                className="group relative flex flex-col w-full h-[400px] md:h-[500px] bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden hover:border-premium-gold/30 transition-all duration-700 ease-out hover:-translate-y-1 shadow-2xl"
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
                    {/* Deep gradient for max readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60" />
                </div>

                {/* Content Overlay */}
                <div className="relative flex-1 flex flex-col justify-end p-6 md:p-10 z-10 w-full h-full">
                    {/* Top Badges */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 flex gap-2">
                        <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] ${colors.text} bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-xl`}>
                            {news.source || 'Botafogo'}
                        </span>
                    </div>

                    {/* Bottom Metadata & Title */}
                    <div className="flex flex-col max-w-4xl space-y-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-white leading-[1.15] group-hover:text-premium-gold transition-colors duration-500 drop-shadow-2xl">
                            {toSentenceCase(news.title)}
                        </h3>

                        {news.summary && (
                            <p className="text-base md:text-lg text-zinc-300 font-medium line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-lg hidden md:block">
                                {news.summary}
                            </p>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-2">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <Clock size={14} className="text-zinc-400" />
                                <span className="text-[11px] md:text-[12px] font-bold text-zinc-300 uppercase tracking-widest" suppressHydrationWarning>
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
    const colors = getSourceColor(news.source);

    return (
        <motion.div variants={itemVariants} className="w-full">
            <Link
                href={`/news/${news.id}`}
                className="group flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center p-4 md:p-6 bg-transparent hover:bg-zinc-900/40 rounded-2xl md:rounded-[2rem] border border-transparent hover:border-white/5 transition-all duration-500 hover:shadow-2xl"
            >
                {/* Visual Thumbnail (16:9) */}
                <div className="relative w-full md:w-[320px] lg:w-[400px] aspect-[16/10] flex-shrink-0 rounded-xl md:rounded-[1.5rem] overflow-hidden bg-zinc-950 border border-white/5 shadow-xl">
                    <Image
                        src={getSafeImageSrc(news.image)}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {/* Badge pinned to image on mobile */}
                    <div className="absolute bottom-3 left-3 md:hidden">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${colors.text} bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10`}>
                            {news.source || 'Botafogo'}
                        </span>
                    </div>
                </div>

                {/* Editorial Content */}
                <div className="flex flex-col flex-grow min-w-0 py-2">
                    <div className="hidden md:flex items-center gap-3 mb-4">
                        <SourceIcon source={news.source || 'default'} className="w-4 h-4 text-premium-gold" />
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${colors.text}`}>
                            {news.source || 'Botafogo'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <Clock size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest" suppressHydrationWarning>
                                {getRelativeTime(news.created_at)}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-[18px] md:text-[22px] lg:text-[26px] font-display font-bold text-white/95 leading-[1.3] group-hover:text-premium-gold transition-colors duration-400 drop-shadow-md mb-3 md:mb-4">
                        {toSentenceCase(news.title)}
                    </h3>

                    {/* Meta for mobile since badge is on image */}
                    <div className="flex md:hidden items-center gap-2 text-zinc-500 mb-3">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest" suppressHydrationWarning>
                            {getRelativeTime(news.created_at)}
                        </span>
                    </div>

                    {news.summary && (
                        <p className="text-sm md:text-base text-zinc-400/90 font-medium line-clamp-2 md:line-clamp-3 leading-relaxed mt-auto">
                            {news.summary}
                        </p>
                    )}
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
                        Você chegou ao fim do feed
                    </p>
                </motion.div>
            )}
        </div>
    );
}
