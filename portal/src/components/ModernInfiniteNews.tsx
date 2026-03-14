"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import ModernFullWidthRow from '@/components/ModernFullWidthRow';

interface ModernInfiniteNewsProps {
    initialNews: any[];
}

export default function ModernInfiniteNews({ initialNews }: ModernInfiniteNewsProps) {
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const NEWS_PER_PAGE = 2; // Load 2 by 2

    const visibleNews = initialNews.slice(0, page * NEWS_PER_PAGE);
    const hasMore = visibleNews.length < initialNews.length;

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    return (
        <div className="flex flex-col w-full">
            {visibleNews.map((article, idx) => {
                if (idx === visibleNews.length - 1) {
                    return (
                        <div ref={lastElementRef} key={article.id || idx}>
                            <ModernFullWidthRow article={article} />
                        </div>
                    );
                } else {
                    return <ModernFullWidthRow key={article.id || idx} article={article} />;
                }
            })}

            {hasMore ? (
                <div className="flex justify-center mt-6 mb-12">
                    {/* Small visual indicator of loading to prevent UI jumping when network is slow */}
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex justify-center mt-6 mb-12">
                    <span className="text-zinc-500 text-sm font-medium">Você já leu todas as notícias das últimas 48 horas.</span>
                </div>
            )}
        </div>
    );
}
