"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import MixedMediaCard from './MixedMediaCard';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    is_premium?: boolean;
}

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
}

interface InfiniteNewsGridProps {
    initialNews: NewsItem[];
    initialVideos: VideoItem[];
    className?: string;
}

type MediaItem = (NewsItem & { type: 'news' }) | (VideoItem & { type: 'video' });

export default function InfiniteNewsGrid({
    initialNews,
    initialVideos,
    className = ''
}: InfiniteNewsGridProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Mix news and videos together
    const mixMediaItems = useCallback((news: NewsItem[], videos: VideoItem[], startIndex: number = 0): MediaItem[] => {
        // Only return news items, no videos in the feed
        const newsWithType = news.map(n => ({ ...n, type: 'news' as const }));
        return newsWithType;
    }, []);

    // Initialize with first 10 items
    useEffect(() => {
        const mixed = mixMediaItems(initialNews, initialVideos);
        setItems(mixed.slice(0, 10));
        setPage(1);
    }, [initialNews, initialVideos, mixMediaItems]);

    // Load more items
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const mixed = mixMediaItems(initialNews, initialVideos);
            const startIndex = page * 10;
            const endIndex = startIndex + 10;
            const newItems = mixed.slice(startIndex, endIndex);

            if (newItems.length === 0) {
                setHasMore(false);
            } else {
                setItems(prev => [...prev, ...newItems]);
                setPage(prev => prev + 1);
            }

            setLoading(false);
        }, 500);
    }, [loading, hasMore, page, initialNews, initialVideos, mixMediaItems]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasMore, loading, loadMore]);

    return (
        <div className={className}>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
                {items.map((item, index) => (
                    <div
                        key={`${item.type}-${item.id}-${index}`}
                        className="animate-fade-in-up relative"
                        style={{ animationDelay: `${(index % 10) * 50}ms` }}
                    >
                        <MixedMediaCard item={item} index={index} />

                        {/* Subtle divider line after each card (except last) */}
                        {index < items.length - 1 && (
                            <div
                                className="absolute -bottom-1.5 left-0 right-0 h-px"
                                style={{
                                    background: 'linear-gradient(to right, transparent, rgba(184, 134, 11, 0.2), transparent)'
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 overflow-hidden animate-pulse">
                            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Intersection Observer Target - Invisible */}
            <div ref={loadMoreRef} className="h-1" />

            {/* End Message */}
            {!hasMore && (
                <div className="text-center py-12">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Você viu todas as notícias das últimas 24 horas
                    </p>
                </div>
            )}
        </div>
    );
}
