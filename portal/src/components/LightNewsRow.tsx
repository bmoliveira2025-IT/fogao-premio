"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import LikeDislikeButtons from './LikeDislikeButtons';

interface LightNewsRowProps {
    article: any;
}

export default function LightNewsRow({ article }: LightNewsRowProps) {
    if (!article) return null;

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} Minutos Atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} Horas Atrás`;
        return `${Math.floor(diffInSeconds / 86400)} Dias Atrás`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    const readTime = Math.max(2, Math.floor((article.content?.length || 2000) / 1000));

    return (
        <div className="flex gap-4 items-center bg-[#f4f4f5] rounded-2xl py-3 border-b border-zinc-200/50 last:border-0 hover:bg-zinc-100 transition-colors">
            {/* Thumbnail */}
            <Link href={`/news/${article.id}`} className="block relative w-[100px] h-[100px] flex-shrink-0 rounded-[18px] overflow-hidden bg-zinc-200">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                    unoptimized
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow min-w-0 justify-between h-full py-1">
                <Link href={`/news/${article.id}`}>
                    <h3 className="text-zinc-900 font-bold text-[15px] leading-[1.3] line-clamp-3 mb-2">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

                <div className="flex items-center justify-between w-full">
                    <span className="text-zinc-500 text-[10px] font-medium flex items-center gap-1">
                        {timeAgo(article.created_at)}
                        <span className="w-0.5 h-0.5 bg-zinc-400 rounded-full mx-0.5" />
                        {readTime} Min de leitura
                    </span>

                    {/* Small Heart Icon (compact like button) */}
                    <div className="text-zinc-400 hover:text-red-500 transition-colors scale-90 -mr-2">
                        <LikeDislikeButtons 
                            articleId={article.id} 
                            initialLikes={article.likes_count} 
                            initialDislikes={article.dislikes_count} 
                            variant="compact" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
