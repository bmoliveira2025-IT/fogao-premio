"use client";

import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { cn } from '@/lib/utils';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at?: string;
}

interface VisualNewsGridProps {
    news: NewsItem[];
    className?: string;
}

function getRelativeTime(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
}

export default function VisualNewsGrid({ news, className }: VisualNewsGridProps) {
    if (!news || news.length === 0) return null;

    // We expect 5 items here (Indices 5-9 from the main list)
    const lead = news[0];
    const others = news.slice(1);

    return (
        <div className={cn("w-full mt-1", className)}>
            {/* Header / Divisor if needed, or just the grid */}
            <div className="flex items-center gap-2 mb-3 px-1 opacity-60">
                <div className="h-4 w-1 bg-premium-gold rounded-full" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    Mais Notícias
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-auto md:h-[320px]">
                {/* LEAD ITEM (Left - Spans 7 cols) */}
                {lead && (
                    <Link
                        href={`/news/${lead.id}`}
                        className="group relative md:col-span-7 h-[200px] md:h-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-900"
                    >
                        {/* Image */}
                        <img
                            src={lead.image || 'https://via.placeholder.com/800x600'}
                            alt={lead.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-premium-gold text-black uppercase">
                                    {lead.source || 'FOGÃO'}
                                </span>
                                <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {getRelativeTime(lead.created_at)}
                                </span>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight group-hover:text-premium-gold transition-colors">
                                {lead.title}
                            </h3>
                        </div>
                    </Link>
                )}

                {/* COMPACT GRID (Right - Spans 5 cols) - 2x2 Grid */}
                <div className="md:col-span-5 grid grid-cols-2 gap-2">
                    {others.map((item) => (
                        <Link
                            key={item.id}
                            href={`/news/${item.id}`}
                            className="group relative h-[140px] md:h-auto rounded-xl overflow-hidden border border-white/5 bg-zinc-900"
                        >
                            <img
                                src={item.image || 'https://via.placeholder.com/400x300'}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                            <div className="absolute inset-0 p-3 flex flex-col justify-end">
                                <div className="flex items-center justify-between mb-1">
                                    <SourceIcon source={item.source || 'default'} className="w-3 h-3 text-white/70" />
                                    <span className="text-[9px] text-zinc-400 font-bold">
                                        {getRelativeTime(item.created_at)}
                                    </span>
                                </div>
                                <h4 className="text-[11px] sm:text-xs font-bold text-white leading-snug line-clamp-3 group-hover:text-premium-gold transition-colors">
                                    {item.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
