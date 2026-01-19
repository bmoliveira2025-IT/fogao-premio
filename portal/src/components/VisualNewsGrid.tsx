"use client";

import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { cn } from '@/lib/utils';
import { getSafeImageSrc } from '@/lib/images';

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

    return (
        <div className={cn("w-full", className)}>

            <div className="flex flex-col gap-6">
                {news.map((item) => (
                    <Link
                        key={item.id}
                        href={`/news/${item.id}`}
                        className="group relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-premium-gold/10 hover:border-premium-gold/30"
                    >
                        {/* Full Background Image */}
                        <img
                            src={getSafeImageSrc(item.image, 'https://placehold.co/800x600')}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        {/* Cinematic Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 z-20">

                            {/* Meta Badges */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-premium-gold/40 transition-colors">
                                    <SourceIcon source={item.source || 'default'} className="w-3.5 h-3.5 text-premium-gold" />
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.15em]">
                                        {item.source || 'FOGÃO'}
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-2 drop-shadow-md" suppressHydrationWarning>
                                    <Clock size={12} className="text-premium-gold" />
                                    {getRelativeTime(item.created_at)} atrás
                                </span>
                            </div>

                            {/* Large Title */}
                            <h3 className="text-lg md:text-xl lg:text-2xl font-black font-sans text-white leading-[1.1] uppercase drop-shadow-xl group-hover:text-premium-gold transition-colors duration-300 mb-2">
                                {item.title}
                            </h3>

                            {/* Optional: Read More Hint */}
                            <div className="h-0 group-hover:h-8 transition-all duration-500 overflow-hidden flex items-center gap-2 text-premium-gold font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                                Ler Matéria Completa <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
