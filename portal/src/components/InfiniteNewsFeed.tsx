'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ModernNewsCard from '@/components/ModernNewsCard';
import CompactNewsCard from '@/components/CompactNewsCard';
import TextOnlyNewsCard from '@/components/TextOnlyNewsCard';
import { fetchMoreNews } from '@/app/news/actions';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    is_premium?: boolean;
    summary?: string;
    content?: string;
    created_at: string;
}

export default function InfiniteNewsFeed({ initialNews }: { initialNews: NewsItem[] }) {
    const [news, setNews] = useState<NewsItem[]>(initialNews);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView();

    const loadMoreNews = async () => {
        const lastItem = news[news.length - 1];
        if (!lastItem) return;

        const newItems = await fetchMoreNews(lastItem.created_at);

        if (newItems.length === 0) {
            setHasMore(false);
        } else {
            setNews((prev) => [...prev, ...newItems]);
            if (newItems.length < 2) {
                setHasMore(false);
            }
        }
    };

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreNews();
        }
    }, [inView, hasMore]);

    return (
        <div className="flex flex-col">
            {news.map((item, index) => {
                // Intercalação de 4 itens: 1 Moderno, 2 Compactos, 1 Texto
                const patternIndex = index % 4;

                if (patternIndex === 0) {
                    return <ModernNewsCard key={item.id} article={item} />;
                } else if (patternIndex === 3) {
                    return <TextOnlyNewsCard key={item.id} article={item} />;
                } else {
                    return <CompactNewsCard key={item.id} article={item} />;
                }
            })}

            {hasMore ? (
                <div ref={ref} className="col-span-full py-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="col-span-full py-8 text-center text-xs text-foreground/40 uppercase tracking-widest">
                    Você chegou ao fim
                </div>
            )}
        </div>
    );
}
