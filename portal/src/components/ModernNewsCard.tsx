"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ThumbsUp, Share2 } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';

export default function ModernNewsCard({ article }: any) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likes || Math.floor(Math.random() * 50));

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'Agora';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <div className="group flex flex-col mb-3 glass-puro crystal-border crystal-shine rounded-xl overflow-hidden transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40">
            {/* Top Image Container - Independent Rounded Block */}
            <Link href={`/news/${article.id}`} className="block p-5">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized={true}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
            </Link>

            {/* Content Area */}
            <div className="px-6 pb-6 pt-2 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <SourceIcon source={article.source || 'FOGÃO'} className="w-6 h-6 text-premium-gold" />
                        <div className="flex flex-col">
                            <span className="text-[12px] font-athletic text-white">
                                {article.source || 'FOGÃO PRÊMIO'}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
                                {timeAgo(article.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Like Action */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLiked(!liked);
                            setLikesCount((prev: number) => liked ? prev - 1 : prev + 1);
                        }}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all active:scale-95 ${liked ? 'bg-premium-gold text-black' : 'bg-white/5 text-zinc-400 border border-white/10'}`}
                    >
                        <ThumbsUp size={20} className={liked ? 'fill-current' : ''} />
                        <span className="text-[14px] font-athletic">{likesCount}</span>
                    </button>
                </div>

                <Link href={`/news/${article.id}`}>
                    <h3 className="text-[24px] md:text-3xl font-athletic text-white group-hover:text-premium-gold transition-colors duration-300 leading-tight">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

            </div>
        </div>
    );
}
