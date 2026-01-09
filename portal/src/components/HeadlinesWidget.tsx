"use client";

import { FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
    id: string;
    title: string;
    category?: string; // We might not have category in standard NewsItem, so optional or derived
    image?: string;
    source?: string;
    summary?: string;
}

interface HeadlinesWidgetProps {
    news: NewsItem[];
    className?: string;
}

export default function HeadlinesWidget({ news, className = "" }: HeadlinesWidgetProps) {
    if (!news || news.length === 0) return null;

    // Take top 10
    const topBriefing = news.slice(0, 10);
    const topStory = topBriefing[0];
    const otherStories = topBriefing.slice(1);

    return (
        <div className={`w-full animate-in slide-in-from-top-4 fade-in duration-500 ${className}`}>
            <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-premium-gold rounded-full mr-1"></div>
                    Últimas do Botafogo
                </h2>
                {/* No close button as requested */}
            </div>

            <div className="bg-zinc-900 border-y border-white/5 md:border md:border-premium-gold/20 md:rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-premium-gold/5 blur-3xl rounded-full pointer-events-none" />

                {/* Rank 01 - Hero (Latest News) */}
                {topStory && (
                    <Link
                        href={`/news/${topStory.id}`}
                        className="relative h-64 md:h-80 w-full group overflow-hidden block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        {topStory.image && (
                            <img
                                src={topStory.image}
                                alt={topStory.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}

                        <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-4xl md:text-5xl font-display font-black text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] opacity-90">
                                    01
                                </span>
                                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg rounded-sm">
                                    Última Hora
                                </span>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-premium-gold uppercase tracking-widest mb-1 block drop-shadow-md">
                                    {topStory.source || 'FOGÃO PRÊMIO'}
                                </span>
                                <h3 className="text-lg md:text-2xl font-bold text-white leading-tight drop-shadow-2xl max-w-2xl">
                                    {topStory.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Rank 02-10 - List */}
                <div className="divide-y divide-white/5 bg-zinc-900/80 backdrop-blur-sm">
                    {otherStories.map((story, index) => (
                        <Link
                            key={story.id}
                            href={`/news/${story.id}`}
                            className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group block"
                        >
                            <span className="text-2xl font-display font-black text-white/20 group-hover:text-premium-gold/40 transition-colors w-8 text-center">
                                {String(index + 2).padStart(2, '0')}
                            </span>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                    {story.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-premium-gold/80 font-bold uppercase tracking-wide">
                                        {story.source}
                                    </span>
                                    {/* Optional: Add time ago if available */}
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-premium-gold transition-colors" />
                        </Link>
                    ))}
                </div>

                {/* Optional Footer Link to all news */}
                <div className="bg-black/40 border-t border-white/5 p-3 text-center">
                    <Link href="/news" className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
                        Ver Todas as Notícias <ChevronRight size={10} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
