"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';
import { timeAgo, detectCategoryKey, CATEGORY_LABELS, CATEGORY_COLORS_SUBTLE } from '@/lib/news-utils';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
}

export default function CompactNewsCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const categoryKey = detectCategoryKey(article.title || '');

    return (
        <Link
            href={`/news/${article.id}`}
            className="editorial-card editorial-compact group relative flex items-start gap-4 p-4 bg-[#111]/80 hover:bg-[#1a1a1a] border-b border-white/[0.04] transition-all duration-300 active:scale-[0.99]"
        >
            {/* Thumbnail */}
            <div className="relative w-[88px] h-[88px] md:w-[100px] md:h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-[#1a1a1a]">
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    sizes="100px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                />
                {/* Subtle border overlay */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.08] group-hover:ring-white/[0.15] transition-all" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between min-h-[88px] md:min-h-[100px] gap-3">
                <div>
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                        {categoryKey && (
                            <span className={`text-xs font-black tracking-[0.1em] px-1.5 py-0.5 rounded border category-badge ${CATEGORY_COLORS_SUBTLE[categoryKey]}`}>
                                {CATEGORY_LABELS[categoryKey]}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[14px] md:text-[15px] font-bold text-white/95 leading-[1.3] line-clamp-3 group-hover:text-white transition-colors">
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                </div>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {article.source && (
                        <div className="flex items-center gap-1.5">
                            <SourceIcon source={article.source} className="w-3 h-3 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{article.source}</span>
                        </div>
                    )}
                    <span className="text-xs text-zinc-600" suppressHydrationWarning>•</span>
                    <span className="text-xs font-medium text-zinc-400 flex items-center gap-1" suppressHydrationWarning>
                        <Clock size={9} className="text-zinc-600" />
                        {timeAgo(article.created_at)}
                    </span>
                </div>
            </div>

            {/* Hover accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    );
}
