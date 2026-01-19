'use client';

import NewsCard from './NewsCard';
import { Search } from 'lucide-react';

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
    // No filtering, just direct display
    const filteredNews = initialNews;

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12 mt-0">
            {/* Simple Cleaner Header or No Header if preferred, but spacing is good */}

            {/* Content Area - Check if we have news */}
            {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((newsItem) => (
                        <NewsCard key={newsItem.id} article={newsItem} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Nenhuma notícia encontrada</h3>
                    <p className="text-zinc-500">
                        Não encontramos notícias recentes nas últimas 24 horas.
                    </p>
                </div>
            )}
        </div>
    );
}
