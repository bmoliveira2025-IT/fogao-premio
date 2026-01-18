'use client';

import { useState } from 'react';
import NewsHeroGrid from './NewsHeroGrid';
import InfiniteNewsFeed from './InfiniteNewsFeed';
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

const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Transferências': ['contrata', 'reforço', 'mercado', 'venda', 'sondagem', 'proposta', 'fechado', 'assina', 'chegada', 'saída', 'interesse', 'comprado'],
    'Jogos': ['jogo', 'partida', 'gol', 'venceu', 'perdeu', 'empatou', 'escalação', 'arbitragem', 'time', 'vs', 'contra', 'estreia', 'final', 'decisão'],
    'Bastidores': ['textor', 'saf', 'dívida', 'financeiro', 'estádio', 'nilton santos', 'ct', 'lonier', 'diretoria', 'mazzuco', 'hoolahan']
};

export default function NewsContent({ initialNews }: { initialNews: NewsItem[] }) {
    const [filter, setFilter] = useState('Todos');
    const [news, setNews] = useState(initialNews);

    // Filter Logic
    const filteredNews = news.filter(item => {
        if (filter === 'Todos') return true;

        const keywords = CATEGORY_KEYWORDS[filter];
        if (!keywords) return true;

        const text = (item.title + ' ' + (item.summary || '')).toLowerCase();
        return keywords.some(k => text.includes(k));
    });

    const heroNews = filteredNews.slice(0, 3);
    const feedNews = filteredNews.slice(3);

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
            {/* Modern Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pt-4 md:pt-0">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-premium-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-premium-gold"></span>
                        </div>
                        <p className="text-zinc-400 font-medium text-xs md:text-sm tracking-wide">
                            <span className="text-white font-bold uppercase mr-1">Notícias:</span>
                            Cobertura 24h via <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold via-yellow-200 to-premium-gold font-bold animate-shimmer bg-[length:200%_100%]">IA</span>
                        </p>
                    </div>
                </div>

                <div className="flex p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-hide">
                    {['Todos', 'Transferências', 'Jogos', 'Bastidores'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === cat
                                ? 'bg-premium-gold text-black shadow-lg shadow-premium-gold/20'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {filteredNews.length > 0 ? (
                <>
                    {/* Hero Grid (Top 3 Stories) */}
                    {heroNews.length > 0 && <NewsHeroGrid news={heroNews} />}

                    {/* Section Divider */}
                    {feedNews.length > 0 && (
                        <div className="flex items-center gap-4 mb-8 mt-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                                {filter === 'Todos' ? 'Últimas Atualizações' : `Mais sobre ${filter}`}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                    )}

                    {/* Infinite Feed (Remaining Stories) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 
                            Note: If functionality allows, we should probably pass the 'filter' to InitialNewsFeed 
                            so it knows to filter incoming new items too. 
                            For now, we pass the filtered list.
                        */}
                        <InfiniteNewsFeed initialNews={feedNews} />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Nenhuma notícia encontrada</h3>
                    <p className="text-zinc-500">
                        Não encontramos notícias recentes sobre <span className="text-premium-gold">"{filter}"</span>.
                    </p>
                    <button
                        onClick={() => setFilter('Todos')}
                        className="mt-6 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        Limpar Filtros
                    </button>
                </div>
            )}
        </div>
    );
}
