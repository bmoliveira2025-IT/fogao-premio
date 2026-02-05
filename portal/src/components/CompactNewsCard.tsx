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

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <div className="group flex flex-col mb-10 glass-puro crystal-border crystal-shine rounded-[2.5rem] p-5 transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40">
            <Link href={`/news/${article.id}`} className="flex gap-5 items-start justify-between">
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-h-[100px] md:min-h-[140px] py-1">
                    <h3 className="text-[22px] md:text-3xl font-athletic text-white/90 group-hover:text-premium-gold transition-colors leading-tight">
                        {toSentenceCase(article.title)}
                    </h3>

                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                            <SourceIcon source={article.source || 'default'} className="w-4 h-4 text-premium-gold" />
                            <span className="text-[12px] font-athletic text-white">
                                {article.source || 'FOGÃO'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-2">
                            <Clock size={12} />
                            <span>{timeAgo(article.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Compact Image (Right Side) */}
                <div className="relative w-32 h-24 md:w-56 md:h-36 flex-shrink-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-xl self-center">
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        unoptimized={true}
                    />
                </div>
            </Link>

            {/* Interaction Row (Below) */}
            <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLiked(!liked);
                        setLikesCount((prev: number) => liked ? prev - 1 : prev + 1);
                    }}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all active:scale-95 ${liked ? 'bg-premium-gold text-black' : 'bg-white/5 text-zinc-400 border border-white/10 font-athletic'}`}
                >
                    <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
                    <span className="text-[14px] font-athletic">{likesCount}</span>
                </button>
            </div>
        </div>
    );
}
