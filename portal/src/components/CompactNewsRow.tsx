"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LikeDislikeButtons from './LikeDislikeButtons';

export default function CompactNewsRow({ article }: any) {
    const { user } = useAuth();
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h atrás`;
        }
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d atrás`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <Link
            href={`/news/${article.id}`}
            className="group flex gap-4 items-center p-3 md:p-6 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all hover:scale-[1.01]"
        >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 80px, 128px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized={true}
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0 justify-center gap-2 md:gap-3">
                <h4 className="text-[15px] md:text-[21px] leading-tight font-semibold text-zinc-800 group-hover:text-premium-gold transition-colors line-clamp-2 md:line-clamp-3">
                    {toSentenceCase(article.title)}
                </h4>

                {/* Metadata Pill */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <SourceIcon source={article.source} className="w-3.5 h-3.5 md:w-4 md:h-4 text-premium-gold" />

                        <span className="text-[10px] md:text-[12px] text-zinc-500 font-black tracking-wider md:tracking-widest uppercase whitespace-nowrap">
                            {timeAgo(article.created_at)}
                        </span>
                    </div>

                    <LikeDislikeButtons
                        articleId={article.id}
                        initialLikes={article.likes_count}
                        initialDislikes={article.dislikes_count}
                    />
                </div>
            </div>
        </Link>
    );
}
