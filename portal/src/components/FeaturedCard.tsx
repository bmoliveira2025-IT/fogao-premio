"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
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
            className="group relative block w-full aspect-video md:aspect-[4/5] lg:aspect-video overflow-hidden rounded-2xl bg-[#111]"
        >
            {/* Background Image */}
            <Image
                src={getSafeImageSrc(article.image)}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-110"
                unoptimized
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end z-20">
                {/* Category Label */}
                {categoryKey && (
                    <div className="mb-2">
                        <span className={`${CATEGORY_COLORS_SOLID[categoryKey]} text-[8px] font-black tracking-[0.15em] px-2 py-1 rounded-[2px] uppercase shadow-lg`}>
                            {CATEGORY_LABELS[categoryKey]}
                        </span>
                    </div>
                )}

                <h3 className="text-[14px] md:text-[18px] lg:text-[22px] font-[900] text-white leading-[1.2] tracking-tight line-clamp-2 group-hover:text-premium-gold transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {article.title?.replace(/\*\*/g, '')}
                </h3>

                {article.summary && (
                    <p className="mt-2 text-[12px] md:text-[13px] text-zinc-400 line-clamp-2 leading-relaxed hidden md:block">
                        {article.summary}
                    </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-2 mt-3 opacity-60">
                    <span className="text-[9px] font-bold text-white flex items-center gap-1" suppressHydrationWarning>
                        <Clock size={8} className="text-premium-gold" />
                        {timeAgo(article.created_at)}
                    </span>
                </div>
            </div>

            {/* Subtle inner border */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05] rounded-2xl" />
        </Link>
    );
}
