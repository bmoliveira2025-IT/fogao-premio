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

    // Unified view: all items get the "premium" card treatment
    // but in a grid

    return (
        <div className={cn("w-full mt-1", className)}>
            {/* Header removed as requested */}

            {/* COMPACT LIST: Vertical stack of banners */}
            <div className="flex flex-col gap-0 md:gap-2">
                {news.map((item) => (
                    <Link
                        key={item.id}
                        href={`/news/${item.id}`}
                        className="group relative h-[120px] md:h-[140px] w-full rounded-none md:rounded-xl overflow-hidden border-b md:border border-white/5 last:border-0 bg-zinc-900 hover:border-premium-gold/30 transition-all duration-300"
                    >
                        {/* Image - Wide crop */}
                        <img
                            src={item.image || 'https://via.placeholder.com/800x300'}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                        {/* Content - Left Aligned */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-center items-start max-w-2xl">
                            <div className="flex items-center gap-2 mb-1.5">
                                {/* Source Badge */}
                                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-white/10">
                                    <SourceIcon source={item.source || 'default'} className="w-3 h-3 text-premium-gold" />
                                    <span className="text-[9px] font-black text-white/90 uppercase tracking-widest leading-none mt-px">
                                        {item.source || 'FOGÃO'}
                                    </span>
                                </div>
                                {/* Time */}
                                <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {getRelativeTime(item.created_at)}
                                </span>
                            </div>

                            <h3 className="text-[14px] md:text-[16px] font-bold text-white leading-tight group-hover:text-premium-gold transition-colors line-clamp-2 pr-4">
                                {item.title}
                            </h3>
                        </div>

                        {/* Arrow hint */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-premium-gold transition-colors">
                            <ChevronRight size={20} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
