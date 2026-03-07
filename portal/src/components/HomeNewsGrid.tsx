"use client";

import { useMemo } from 'react';
import HomeNewsCard from './HomeNewsCard';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    content?: string;
    summary?: string;
    created_at: string;
}

interface HomeNewsGridProps {
    news: NewsItem[];
    className?: string;
}

/**
 * Deterministic shuffle using a simple seed based on the current date.
 * This produces the same order throughout a single day so the page
 * doesn't re-shuffle on every render / navigation, but changes daily.
 */
function shuffleWithSeed(arr: NewsItem[]): NewsItem[] {
    const copy = [...arr];
    // Seed: YYYYMMDD as integer
    const today = new Date();
    let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Simple seeded pseudo-random (mulberry32-ish)
    function random() {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0xffffffff;
    }

    // Fisher-Yates shuffle
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function HomeNewsGrid({ news, className = '' }: HomeNewsGridProps) {
    const shuffled = useMemo(() => shuffleWithSeed(news), [news]);

    if (!shuffled || shuffled.length === 0) return null;

    return (
        <div className={className}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-1 h-6 rounded-full bg-premium-gold" />
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                    Últimas Notícias
                </h2>
            </div>

            {/* Grid Layout */}
            <div className="home-news-grid">
                {shuffled.map((item, index) => {
                    // Every 7th card (starting from 0) spans 2 columns for editorial variety
                    const isWide = index % 7 === 0 && index > 0;

                    return (
                        <HomeNewsCard
                            key={item.id}
                            article={item}
                            index={index}
                            isWide={isWide}
                        />
                    );
                })}
            </div>
        </div>
    );
}
