"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';

export default function TextOnlyNewsCard({ article }: any) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(article.likes || Math.floor(Math.random() * 15));

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
        <div className="group flex flex-col mb-6 animate-in fade-in duration-500">
            <Link href={`/news/${article.id}`} className="flex flex-col gap-3">
                <h3 className="text-lg md:text-xl font-bold leading-[1.3] text-white/90 group-hover:text-premium-gold transition-colors line-clamp-2">
                    {article.title?.replace(/\*\*/g, '')}
                </h3>

                <div className="flex items-center gap-3">
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
            </Link>

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

            <div className="h-[1px] w-full bg-white/5 mt-6" />
        </div>
    );
}
