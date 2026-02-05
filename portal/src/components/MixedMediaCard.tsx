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

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        // If it's all uppercase, transform it. If it has mixed case, it might be curated, but mostly data is flat.
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    if (item.type === 'video') {
        return (
            <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-xl glass-puro crystal-border crystal-shine transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40 mb-6 ${className}`}
            >
                {/* Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-lg md:rounded-xl m-5 shadow-2xl">
                    <img
                        src={getSafeImageSrc(item.thumbnail)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-premium-gold/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.4)] group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                            <Play size={32} className="text-black fill-current ml-1" />
                        </div>
                    </div>

                    {/* Video Badge */}
                    <div className="absolute top-4 left-4 px-5 py-2 bg-red-600 rounded-full text-[12px] font-athletic text-white shadow-xl border border-white/20">
                        VÍDEO
                    </div>
                </div>

                {/* Video Info */}
                <div className="px-6 pb-6 pt-2">
                    <h3 className="text-[18px] md:text-2xl font-athletic text-white group-hover:text-premium-gold transition-colors leading-tight">
                        {toSentenceCase(item.title)}
                    </h3>

                    <div className="mt-5">
                        <NewsSourceTag
                            source="BOTAFOGO TV"
                            timestamp={item.published_at}
                            variant="compact"
                        />
                    </div>
                </div>
            </Link>
        );
    }

    // Determine if this card should be text-only (no image)
    const cyclePosition = index % 4;
    const shouldBeTextOnly = !item.image || cyclePosition !== 0;

    // Text-Only News Card (Enhanced Design)
    if (shouldBeTextOnly) {
        return (
            <Link
                href={`/news/${item.id}`}
                className={`group relative overflow-hidden rounded-xl glass-puro crystal-border crystal-shine p-6 transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40 mb-6 ${className}`}
            >
                {/* Content */}
                <div className="relative">
                    {/* Premium Badge */}
                    {item.is_premium && (
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-premium-gold rounded-full text-[11px] font-athletic text-black shadow-lg flex items-center gap-1.5 border border-white/20">
                            ⭐ PREMIUM
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-[20px] md:text-3xl font-athletic text-white group-hover:text-premium-gold transition-colors leading-tight pr-24">
                        {toSentenceCase(item.title)}
                    </h3>

                    {/* Summary */}
                    {item.summary && (
                        <p className="text-[17px] md:text-xl text-zinc-400 mt-5 line-clamp-2 leading-relaxed font-medium">
                            {item.summary}
                        </p>
                    )}

                    {/* Source Tag & Like Button */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                        <NewsSourceTag
                            source={item.source}
                            timestamp={item.created_at}
                            variant="compact"
                        />
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); setLikesCount(prev => liked ? prev - 1 : prev + 1); }}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all active:scale-95 ${liked ? 'bg-premium-gold text-black' : 'bg-white/5 text-zinc-400 border border-white/10 font-athletic'}`}
                        >
                            <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
                            <span className="text-[14px] font-athletic">{likesCount > 0 ? likesCount : ''}</span>
                        </button>
                    </div>
                </div>
            </Link>
        );
    }

    // Standard News Card with Image
    return (
        <div className="group flex flex-col mb-6 glass-puro crystal-border crystal-shine rounded-xl transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40">
            <Link href={`/news/${item.id}`} className="block p-5">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg md:rounded-xl shadow-2xl">
                    <img
                        src={getSafeImageSrc(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    {item.is_premium && (
                        <div className="absolute top-4 right-4 px-4 py-1.5 bg-premium-gold rounded-full text-[11px] font-athletic text-black shadow-lg border border-white/20">
                            ⭐ PREMIUM
                        </div>
                    )}
                </div>
            </Link>

            <div className="px-6 pb-6 pt-2">
                <h3 className="text-[20px] md:text-3xl font-athletic text-white group-hover:text-premium-gold transition-colors leading-tight">
                    {toSentenceCase(item.title)}
                </h3>

                {item.summary && (
                    <p className="text-[15px] md:text-lg text-zinc-400 mt-4 line-clamp-2 leading-relaxed hidden md:block">
                        {item.summary}
                    </p>
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                    <NewsSourceTag
                        source={item.source}
                        timestamp={item.created_at}
                        variant="compact"
                    />
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); setLikesCount(prev => liked ? prev - 1 : prev + 1); }}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all active:scale-95 ${liked ? 'bg-premium-gold text-black' : 'bg-white/5 text-zinc-400 border border-white/10 font-athletic'}`}
                    >
                        <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
                        <span className="text-[14px] font-athletic">{likesCount > 0 ? likesCount : ''}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
