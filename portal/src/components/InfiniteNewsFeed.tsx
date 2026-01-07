'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import NewsCard from '@/components/NewsCard';
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
            if (newItems.length < 2) { // If we got less than the limit, we reached the end
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
        <>
            {news.map((item) => (
                <NewsCard key={item.id} article={item} />
            ))}

            {hasMore ? (
                <div ref={ref} className="col-span-full py-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="col-span-full py-8 text-center text-xs text-foreground/40 uppercase tracking-widest">
                    Você chegou ao fim
                </div>
            )}
        </>
    );
}
