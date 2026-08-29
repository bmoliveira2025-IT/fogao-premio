'use client';

import NewsCard from './NewsCard';
import { Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    is_premium?: boolean;
    summary?: string;
    created_at: string;
    content?: string;
}

export default function NewsContent({ initialNews }: { initialNews: NewsItem[] }) {
    const [visibleCount, setVisibleCount] = useState(10);
    const loadRef = useRef<HTMLDivElement>(null);

    // Filtered news is just initialNews for now, but we slice it for display
    const visibleNews = initialNews.slice(0, visibleCount);
    const hasMore = visibleCount < initialNews.length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    // User wants "1 por 1" (1 by 1), so we increment by 1
                    setVisibleCount((prev) => prev + 1);
                }
            },
            { threshold: 0.5, rootMargin: '100px' }
        );

        if (loadRef.current) {
            observer.observe(loadRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, visibleCount]);

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12 mt-0">
            {/* Content Area */}
            {visibleNews.length > 0 ? (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleNews.map((newsItem) => (
                            <NewsCard key={newsItem.id} article={newsItem} />
                        ))}
                    </div>

                    {/* Sentinel for Infinite Scroll */}
                    {hasMore && (
                        <div
                            ref={loadRef}
                            className="w-full flex justify-center py-8 opacity-50"
                        >
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Nenhuma notícia encontrada</h3>
                    <p className="text-zinc-500">
                        Não encontramos notícias recentes nos últimos quatro dias.
                    </p>
                </div>
            )}
        </div>
    );
}
