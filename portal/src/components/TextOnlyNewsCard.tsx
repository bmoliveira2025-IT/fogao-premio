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

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <div className="group flex flex-col mb-10 glass-puro crystal-border crystal-shine rounded-[2.5rem] p-8 transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40">
            <Link href={`/news/${article.id}`} className="flex flex-col gap-5">
                <h3 className="text-[24px] md:text-4xl font-athletic text-white group-hover:text-premium-gold transition-colors leading-tight">
                    {toSentenceCase(article.title)}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <SourceIcon source={article.source || 'default'} className="w-5 h-5 text-premium-gold" />
                            <span className="text-[12px] font-athletic text-white">
                                {article.source || 'FOGÃO PRÊMIO'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5 bg-black/40 px-5 py-2.5 rounded-full border border-white/10">
                            <Clock size={16} className="text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                                {timeAgo(article.created_at)}
                            </span>
                        </div>
                    </div>

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
            </Link>
        </div>
    );
}
