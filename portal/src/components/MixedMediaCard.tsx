"use client";

import { Play, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import NewsSourceTag from './NewsSourceTag';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
    is_premium?: boolean;
}

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    published_at: string;
}

type MediaItem = (NewsItem & { type: 'news' }) | (VideoItem & { type: 'video' });

interface MixedMediaCardProps {
    item: MediaItem;
    index?: number; // For determining card variant pattern
    className?: string;
}

export default function MixedMediaCard({ item, index = 0, className = '' }: MixedMediaCardProps) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    if (item.type === 'video') {
        return (
            <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-premium-gold/40 transition-all duration-500 shadow-lg hover:shadow-premium-gold/10 ${className}`}
            >
                {/* Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-2xl md:rounded-3xl m-2 shadow-inner">
                    <img
                        src={getSafeImageSrc(item.thumbnail)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-premium-gold/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white/20">
                            <Play size={28} className="text-black fill-current ml-1" />
                        </div>
                    </div>

                    {/* Video Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                        Vídeo
                    </div>
                </div>

                {/* Video Info */}
                <div className="p-4 md:p-5">
                    <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white leading-tight line-clamp-2 group-hover:text-premium-gold transition-colors">
                        {item.title}
                    </h3>

                    <NewsSourceTag
                        source="BOTAFOGO TV"
                        timestamp={item.published_at}
                        variant="compact"
                        className="mt-3"
                    />
                </div>
            </Link>
        );
    }

    // Determine if this card should be text-only (no image)
    // Pattern: 1 with image, 3 without, 1 with image, 3 without...
    // Positions 0, 4, 8, 12... have images
    // Positions 1, 2, 3, 5, 6, 7, 9, 10, 11... are text-only
    const cyclePosition = index % 4;
    const shouldBeTextOnly = !item.image || cyclePosition !== 0;

    // Text-Only News Card (Enhanced Design)
    if (shouldBeTextOnly) {
        return (
            <Link
                href={`/news/${item.id}`}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 bg-transparent ${className}`}
            >
                {/* Content */}
                <div className="relative p-4 md:p-5">
                    {/* Premium Badge */}
                    {item.is_premium && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-premium-gold/90 dark:bg-premium-gold/90 light:bg-zinc-800 rounded-full text-[10px] font-black text-black dark:text-black light:text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                            ⭐ Premium
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-[22px] md:text-[25px] font-black leading-tight mb-3 group-hover:text-premium-gold transition-colors" style={{ color: 'var(--foreground)' }}>
                        {item.title?.replace(/\*\*/g, '')}
                    </h3>

                    {/* Summary */}
                    {item.summary && (
                        <p className="text-[17px] md:text-[19px] leading-relaxed line-clamp-2 mb-4 opacity-70" style={{ color: 'var(--foreground)' }}>
                            {item.summary}
                        </p>
                    )}

                    {/* Source Tag & Like Button */}
                    <div className="flex items-center justify-between mt-auto">
                        <NewsSourceTag
                            source={item.source}
                            timestamp={item.created_at}
                            variant="compact"
                        />
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); setLikesCount(prev => liked ? prev - 1 : prev + 1); }}
                            className={`flex items-center gap-1.5 text-[10px] font-black transition-all ${liked ? 'text-premium-gold' : 'text-zinc-500'}`}
                        >
                            <ThumbsUp size={12} className={liked ? 'fill-current' : ''} />
                            <span>{likesCount > 0 ? likesCount : ''}</span>
                        </button>
                    </div>
                </div>
            </Link>
        );
    }

    // Standard News Card with Image
    return (
        <Link
            href={`/news/${item.id}`}
            className={`group relative overflow-hidden rounded-2xl bg-transparent transition-all duration-500 ${className}`}
        >
            {/* News Image */}
            <div className="relative aspect-video overflow-hidden rounded-2xl md:rounded-3xl m-2 shadow-inner">
                <img
                    src={getSafeImageSrc(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                {/* Premium Badge */}
                {item.is_premium && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-premium-gold dark:bg-premium-gold light:bg-zinc-800 rounded-full text-[10px] font-black text-black dark:text-black light:text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                        ⭐ Premium
                    </div>
                )}
            </div>

            {/* News Info */}
            <div className="p-4 md:p-5">
                <h3 className="text-[15px] md:text-[20px] font-bold leading-tight line-clamp-2 mb-3 group-hover:text-premium-gold transition-colors" style={{ color: 'var(--foreground)' }}>
                    {item.title?.replace(/\*\*/g, '')}
                </h3>

                {item.summary && (
                    <p className="text-[13px] md:text-[15px] line-clamp-2 mb-3 leading-relaxed hidden md:block opacity-70" style={{ color: 'var(--foreground)' }}>
                        {item.summary}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <NewsSourceTag
                        source={item.source}
                        timestamp={item.created_at}
                        variant="compact"
                    />
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); setLikesCount(prev => liked ? prev - 1 : prev + 1); }}
                        className={`flex items-center gap-1.5 text-[10px] font-black transition-all ${liked ? 'text-premium-gold' : 'text-zinc-500'}`}
                    >
                        <ThumbsUp size={12} className={liked ? 'fill-current' : ''} />
                        <span>{likesCount > 0 ? likesCount : ''}</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}
