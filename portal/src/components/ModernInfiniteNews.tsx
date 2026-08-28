"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import FeaturedCard from '@/components/FeaturedCard';
import CompactNewsCard from '@/components/CompactNewsCard';

interface ModernInfiniteNewsProps {
    initialNews: any[];
}

export default function ModernInfiniteNews({ initialNews }: ModernInfiniteNewsProps) {
    if (!initialNews || initialNews.length === 0) return null;

    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const NEWS_PER_PAGE = 4; // Load 4 items at a time

    const visibleNews = initialNews.slice(0, page * NEWS_PER_PAGE);
    const hasMore = visibleNews.length < initialNews.length;

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { rootMargin: '200px' });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col w-full">
            {/* Section Header */}
            <div className="px-4 md:px-0 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#d4af37] to-[#d4af37]/30 rounded-full" />
                    <h2 className="text-[14px] md:text-[16px] font-[800] text-white/90 uppercase tracking-[0.08em]">
                        Mais Notícias
                    </h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent ml-4" />
            </div>

            {visibleNews.map((article, idx) => {
                // Every 5th item gets a featured card for visual variety
                const isFeatured = idx % 5 === 0;
                const isLast = idx === visibleNews.length - 1;

                if (isFeatured) {
                    return (
                        <div
                            ref={isLast ? lastElementRef : undefined}
                            key={article.id || idx}
                            className="px-3 md:px-0 mb-3 animate-fade-in-up"
                            style={{ animationDelay: `${(idx % NEWS_PER_PAGE) * 0.05}s` }}
                        >
                            <FeaturedCard article={article} />
                        </div>
                    );
                }

                return (
                    <div
                        ref={isLast ? lastElementRef : undefined}
                        key={article.id || idx}
                        className="relative animate-fade-in-up"
                        style={{ animationDelay: `${(idx % NEWS_PER_PAGE) * 0.05}s` }}
                    >
                        <CompactNewsCard article={article} />
                    </div>
                );
            })}

            {hasMore ? (
                <div className="flex justify-center py-8">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60 animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/20 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center py-10 gap-2">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    <span className="text-zinc-600 text-xs font-medium tracking-wide">Fim das notícias</span>
                </div>
            )}
        </div>
    );
}
