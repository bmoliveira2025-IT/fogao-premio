"use client";

import React from 'react';
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

export default function HomeNewsGrid({ news, className = '' }: HomeNewsGridProps) {
    if (!news || news.length === 0) return null;

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
                {news.map((item, index) => {
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
