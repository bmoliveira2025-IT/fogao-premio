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

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
        return `${Math.floor(diffInSeconds / 86400)}d atrás`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <Link
            href={`/news/${article.id}`}
            className="editorial-card editorial-hero-light group block relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.12)] active:scale-[0.99] transition-all duration-300 border border-zinc-200/40 dark:border-white/10"
        >
            <Image
                src={getSafeImageSrc(article.image, 'https://placehold.co/800x600')}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                unoptimized
            />
            
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            {/* Source Badge on Top Left */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 dark:bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                <SourceIcon source={article.source} className="w-3.5 h-3.5 rounded-full" />
                <span className="text-[11px] font-bold text-white tracking-tight">{article.source || 'Destaque'}</span>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] tracking-wider uppercase">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 backdrop-blur-sm border border-amber-400/30">
                        DESTAQUE
                    </span>
                    <span className="text-white/50">•</span>
                    <span className="text-white/80 font-medium normal-case">{timeAgo(article.created_at)}</span>
                </div>

                <h2 className="text-white text-xl sm:text-2xl font-extrabold leading-[1.25] tracking-tight line-clamp-3 drop-shadow-sm group-hover:text-amber-300 transition-colors">
                    {toSentenceCase(article.title)}
                </h2>
            </div>
        </Link>
    );
}


