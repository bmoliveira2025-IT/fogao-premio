"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import { timeAgo, detectCategoryKey, CATEGORY_LABELS, CATEGORY_COLORS_SOLID } from '@/lib/news-utils';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
}

export default function FeaturedCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const categoryKey = detectCategoryKey(article.title || '');

    return (
        <Link
            href={`/news/${article.id}`}
            className="editorial-card editorial-featured group relative block w-full aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-lg active:scale-[0.98] transition-all duration-300"
        >
            {/* Background Image */}
            <Image
                src={getSafeImageSrc(article.image)}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                unoptimized
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end z-20">
                {/* Source & Category Row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                        <SourceIcon source={article.source} className="w-3 h-3" />
                        <span className="text-xs font-bold text-white tracking-tight">{article.source || 'Botafogo'}</span>
                    </div>

                    {categoryKey && (
                        <span className={`category-badge ${CATEGORY_COLORS_SOLID[categoryKey]} text-xs font-black tracking-[0.12em] px-2 py-0.5 rounded-full uppercase shadow-sm`}>
                            {CATEGORY_LABELS[categoryKey]}
                        </span>
                    )}
                </div>

                <h3 className="text-base font-extrabold text-white leading-[1.25] tracking-tight line-clamp-3 group-hover:text-amber-300 transition-colors">
                    {article.title?.replace(/\*\*/g, '')}
                </h3>

                {/* Meta row */}
                <div className="flex items-center gap-2 mt-2 text-white/70">
                    <span className="text-xs font-medium flex items-center gap-1" suppressHydrationWarning>
                        <Clock size={10} className="text-amber-400" />
                        {timeAgo(article.created_at)}
                    </span>
                </div>
            </div>

            {/* Subtle inner border */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        </Link>
    );
}

