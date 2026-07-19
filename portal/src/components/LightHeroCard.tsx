"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';

interface HeroArticle {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at: string;
}

interface LightHeroCardProps {
    article: HeroArticle | null;
}

export default function LightHeroCard({ article }: LightHeroCardProps) {
    if (!article) return null;

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
        <Link href={`/news/${article.id}`} className="block relative w-full aspect-[4/3] rounded-[26px] overflow-hidden bg-zinc-200 shadow-[0_12px_30px_rgba(0,0,0,0.12)] active:scale-[0.99] transition-transform">
            <Image
                src={getSafeImageSrc(article.image, 'https://placehold.co/800x600')}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
                priority
                unoptimized
            />
            
            {/* Gradient Overlay for bottom text */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Badge on Top Left */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1.5 bg-white/92 backdrop-blur-sm rounded-full shadow-sm">
                <SourceIcon source={article.source} className="w-4 h-4 rounded-full" />
                <span className="text-[10px] font-bold text-zinc-800">{article.source || 'Destaque'}</span>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2">
                <h2 className="text-white text-[21px] font-bold leading-[1.16] line-clamp-3 drop-shadow-sm">
                    {toSentenceCase(article.title)}
                </h2>
                <div className="flex items-center gap-2 text-white/80">
                    <span className="text-[11px] font-medium">Em destaque</span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span className="text-[11px]">{timeAgo(article.created_at)} atrás</span>
                </div>
            </div>
        </Link>
    );
}
