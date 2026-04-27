'use client';

import { useState } from 'react';
import FeaturedCard from './FeaturedCard';
import CompactNewsCard from './CompactNewsCard';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: string;
  title: string;
  image?: string;
  source?: string;
  created_at: string;
  is_premium?: boolean;
  summary?: string;
}

interface SmartNewsFeedProps {
  news: NewsItem[];
}

export default function SmartNewsFeed({ news }: SmartNewsFeedProps) {
    const [activeTab, setActiveTab] = useState<'LATEST' | 'TRENDING' | 'FOR_YOU'>('LATEST');

    // Simple simulation of trending/for you for now
    const getNewsForTab = () => {
        if (activeTab === 'TRENDING') {
            return [...news].sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
        }
        if (activeTab === 'FOR_YOU') {
            return [...news].reverse();
        }
        return news;
    };

    const displayNews = getNewsForTab();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('LATEST')}
                        className={cn(
                            "text-[12px] md:text-[14px] font-black tracking-widest transition-all pb-4 -mb-4.5 whitespace-nowrap border-b-2",
                            activeTab === 'LATEST' ? "text-premium-gold border-premium-gold" : "text-zinc-500 border-transparent hover:text-white"
                        )}
                    >
                        ÚLTIMAS
                    </button>
                    <button 
                        onClick={() => setActiveTab('TRENDING')}
                        className={cn(
                            "text-[12px] md:text-[14px] font-black tracking-widest transition-all pb-4 -mb-4.5 whitespace-nowrap border-b-2",
                            activeTab === 'TRENDING' ? "text-premium-gold border-premium-gold" : "text-zinc-500 border-transparent hover:text-white"
                        )}
                    >
                        TENDÊNCIAS
                    </button>
                    <button 
                        onClick={() => setActiveTab('FOR_YOU')}
                        className={cn(
                            "text-[12px] md:text-[14px] font-black tracking-widest transition-all pb-4 -mb-4.5 whitespace-nowrap border-b-2",
                            activeTab === 'FOR_YOU' ? "text-premium-gold border-premium-gold" : "text-zinc-500 border-transparent hover:text-white"
                        )}
                    >
                        PARA VOCÊ
                    </button>
                </div>
            </div>

            {/* One Large News below tabs */}
            {displayNews[0] && (
                <div className="mb-8">
                    <FeaturedCard article={displayNews[0]} />
                </div>
            )}

            {/* Remaining Compact List */}
            <div className="bg-[#111]/40 rounded-3xl overflow-hidden border border-white/5 shadow-xl divide-y divide-white/[0.03]">
                {displayNews.slice(1).map(article => (
                    <CompactNewsCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
