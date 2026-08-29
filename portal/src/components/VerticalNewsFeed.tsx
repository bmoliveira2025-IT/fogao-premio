"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import VerticalNewsSlide from './VerticalNewsSlide';

interface VerticalNewsFeedProps {
    initialNews: any[];
}

export default function VerticalNewsFeed({ initialNews }: VerticalNewsFeedProps) {
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const NEWS_PER_PAGE = 5; // Load 5 items at a time

    if (!initialNews || initialNews.length === 0) return null;

    const visibleNews = initialNews.slice(0, page * NEWS_PER_PAGE);
    const hasMore = visibleNews.length < initialNews.length;

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { rootMargin: '400px' });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    return (
        <div className="w-full h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-background scrollbar-hide">
            {visibleNews.map((article, idx) => {
                const isLast = idx === visibleNews.length - 1;
                return (
                    <div
                        ref={isLast ? lastElementRef : undefined}
                        key={article.id || idx}
                        className="w-full h-[100dvh] snap-start snap-always"
                    >
                        <VerticalNewsSlide article={article} index={idx} />
                    </div>
                );
            })}

            {hasMore && (
                <div className="w-full h-[100dvh] snap-start snap-always flex items-center justify-center bg-[#111]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            )}
        </div>
    );
}
