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
        <div className="group flex flex-col mb-10 bg-zinc-900/50 dark:bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-premium-gold/30 shadow-2xl">
            {/* Top Image Container - Independent Rounded Block */}
            <Link href={`/news/${article.id}`} className="block p-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
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
            <div className="p-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SourceIcon source={article.source || 'FOGÃO'} className="w-5 h-5" />
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
                                {article.source || 'FOGÃO PRÊMIO'}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
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
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-90 ${liked ? 'bg-premium-gold text-black' : 'bg-white/5 text-zinc-400 border border-white/5'}`}
                    >
                        <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
                        <span className="text-[13px] font-black">{likesCount}</span>
                    </button>
                </div>

                <Link href={`/news/${article.id}`}>
                    <h3 className="text-[25.5px] md:text-3xl font-black font-sans text-white group-hover:text-premium-gold transition-colors duration-300 normal-case">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

            </div>
        </div>
    );
}
