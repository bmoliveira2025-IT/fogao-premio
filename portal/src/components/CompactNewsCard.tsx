"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';

export default function CompactNewsCard({ article }: any) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likes || Math.floor(Math.random() * 20));

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    return (
        <div className="group flex flex-col mb-8 animate-in fade-in duration-500">
            <Link href={`/news/${article.id}`} className="flex gap-5 items-start">
                {/* Compact Image (GE Style) - Balanced rounding */}
                <div className="relative w-32 h-20 md:w-48 md:h-32 flex-shrink-0 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 shadow-lg">
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized={true}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-h-[80px] md:min-h-[110px] py-1">
                    <h3 className="text-lg md:text-xl font-bold leading-[1.2] text-white/90 group-hover:text-premium-gold transition-colors line-clamp-3">
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>

                    <div className="flex items-center gap-3 mt-auto">
                        <div className="flex items-center gap-1.5">
                            <SourceIcon source={article.source || 'default'} className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                {article.source || 'FOGÃO'}
                            </span>
                        </div>
                        <span className="text-zinc-700 font-bold text-[10px]">•</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                            <Clock size={10} />
                            <span>{timeAgo(article.created_at)}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Interaction Row (Below) */}
            <div className="flex items-center gap-4 mt-3 pl-1">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLiked(!liked);
                        setLikesCount((prev: number) => liked ? prev - 1 : prev + 1);
                    }}
                    className={`flex items-center gap-2 text-[12px] font-black transition-all active:scale-90 ${liked ? 'text-premium-gold' : 'text-zinc-600'}`}
                >
                    <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
                    <span>{likesCount}</span>
                </button>
            </div>

            {/* Divider */}
            <div className="h-[1px] w-full bg-white/5 mt-6" />
        </div>
    );
}
