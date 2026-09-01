"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import ModernNewsCard from './ModernNewsCard';
import CompactNewsCard from './CompactNewsCard';
import TextOnlyNewsCard from './TextOnlyNewsCard';
import MixedMediaCard from './MixedMediaCard';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    imported_at?: string;
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
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const [extraNews, setExtraNews] = useState<NewsItem[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    // Mix news and videos together
    const mixMediaItems = useCallback((news: NewsItem[], videos: VideoItem[]): MediaItem[] => {
        const newsWithType = news.map(n => ({ ...n, type: 'news' as const }));
        // In the future, we can add videos back here if needed
        return newsWithType;
    }, []);

    // Initialize with first 6 items
    useEffect(() => {
        const allNews = [...initialNews, ...extraNews];
        const mixed = mixMediaItems(allNews, initialVideos);
        setItems(mixed.slice(0, 6 + (items.length > 6 ? items.length - 6 : 0)));
    }, [initialNews, initialVideos, extraNews, mixMediaItems]);

    // Load more items
    const loadMore = useCallback(async () => {
        if (loading || isFetching || !hasMore) return;

        const allNews = [...initialNews, ...extraNews];
        const mixed = mixMediaItems(allNews, initialVideos);

        // If we still have local items to show
        const nextLocalItem = mixed.find(m => !items.some(p => p.id === m.id));

        if (nextLocalItem) {
            setLoading(true);
            setItems(prev => [...prev, nextLocalItem]);
            setTimeout(() => setLoading(false), 50);
            return;
        }

        // If local items are exhausted, fetch from server
        if (allNews.length > 0) {
            setIsFetching(true);
            setLoading(true);
            const lastNews = allNews[allNews.length - 1];
            const lastDate = lastNews.imported_at || lastNews.created_at;

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
                setIsFetching(false);
                setLoading(false);
            }
        } else {
            setHasMore(false);
        }
    }, [loading, isFetching, hasMore, items, initialNews, extraNews, initialVideos, mixMediaItems]);

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
            {/* Lista Vertical Intercalada (Estilo GE/Veja) */}
            <div className="flex flex-col gap-2">
                {items.map((item, index) => {
                    if (item.type === 'video') {
                        return <MixedMediaCard key={`${item.type}-${item.id}`} item={item} index={index} className="mb-4" />;
                    }

                    // Intercalação para notícias (Pattern: 1 Moderno, 2 Compactos, 1 Texto)
                    const newsIndex = items.filter((it, idx) => it.type === 'news' && idx <= index).length - 1;
                    const patternIndex = newsIndex % 4;

                    if (patternIndex === 0) {
                        return <ModernNewsCard key={item.id} article={item} />;
                    } else if (patternIndex === 3) {
                        return <TextOnlyNewsCard key={item.id} article={item} />;
                    } else {
                        return <CompactNewsCard key={item.id} article={item} />;
                    }
                })}
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="flex flex-col gap-6 mt-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse px-4">
                            <div className="aspect-video bg-zinc-800 rounded-[2rem] mb-4" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-zinc-800 rounded w-1/2" />
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
