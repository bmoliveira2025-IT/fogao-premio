"use client";

import { FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SourceIcon from './SourceIcon';

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

    // Take top 8 for a balanced view
    const topBriefing = news.slice(0, 8);
    const topStory = topBriefing[0];
    const otherStories = topBriefing.slice(1);

    return (
        <div className={`w-full flex flex-col gap-0 bg-zinc-950 border border-white/5 md:rounded-3xl overflow-hidden shadow-2xl ${className}`}>

            {/* Rank 01 - Hero Section (Immersive) */}
            {topStory && (
                <Link
                    href={`/news/${topStory.id}`}
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] group overflow-hidden block"
                >
                    {/* Image */}
                    {topStory.image ? (
                        <img
                            src={topStory.image}
                            alt={topStory.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-zinc-900" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-6xl md:text-8xl font-black text-white/10 tracking-tighter leading-none select-none">
                                01
                            </span>
                            <span className="px-3 py-1 bg-red-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded shadow-lg animate-pulse">
                                Última Hora
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-4xl font-black text-white leading-tight drop-shadow-xl max-w-4xl group-hover:text-premium-gold/90 transition-colors">
                            {topStory.title}
                        </h3>

                        {/* Source */}
                        <div className="flex items-center gap-2 mt-4 opacity-80">
                            <SourceIcon source={topStory.source || ''} className="w-5 h-5 rounded-full bg-black p-0.5" />
                            <span className="text-xs font-bold text-premium-gold uppercase tracking-widest">
                                {topStory.source || 'Fogão Prêmio'}
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {/* Rank 02-08 - List Section */}
            <div className="grid grid-cols-1 divide-y divide-white/5 bg-zinc-950">
                {otherStories.map((story, index) => (
                    <Link
                        key={story.id}
                        href={`/news/${story.id}`}
                        className="group relative flex items-center gap-5 p-5 md:p-6 hover:bg-white/5 transition-all duration-300"
                    >
                        {/* Number */}
                        <span className="text-3xl md:text-4xl font-black text-zinc-800 group-hover:text-premium-gold/30 transition-colors w-12 text-center leading-none">
                            {String(index + 2).padStart(2, '0')}
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Source Highlight */}
                            <div className="flex items-center gap-2 mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <SourceIcon source={story.source || ''} className="w-3 h-3 grayscale group-hover:grayscale-0 transition-all" />
                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-premium-gold uppercase tracking-wider">
                                    {story.source}
                                </span>
                            </div>

                            <h4 className="text-sm md:text-base font-bold text-zinc-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                                {story.title}
                            </h4>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="text-zinc-700 group-hover:text-premium-gold transition-colors transform group-hover:translate-x-1" size={20} />
                    </Link>
                ))}
            </div>

            {/* Footer */}
            <Link
                href="/news"
                className="block p-4 text-center bg-zinc-900/50 hover:bg-zinc-900 border-t border-white/5 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
            >
                Ver Todas as Notícias
            </Link>
        </div>
    );
}
