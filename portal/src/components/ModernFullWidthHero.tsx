"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';
import { timeAgoVerbose, detectCategoryKey, CATEGORY_LABELS, CATEGORY_COLORS_SOLID } from '@/lib/news-utils';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
}

export default function HeroNewsCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const categoryKey = detectCategoryKey(article.title || '');

    return (
        <div className="relative">
            <Link
                href={`/news/${article.id}`}
                className="editorial-card editorial-hero group relative block w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2.2/1] bg-[#0a0a0a] overflow-hidden"
            >
                {/* Full Background Image with Ken Burns effect */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-[8s] ease-out group-hover:scale-[1.08]"
                    unoptimized
                />

                {/* Dramatic cinematic gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

                {/* Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />

                {/* Noise texture overlay for editorial feel */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

                {/* Content Container */}
                <div className="relative p-5 md:p-8 flex flex-col justify-end z-20 min-h-[inherit] pt-24 md:pt-28">
                    <div className="max-w-4xl">
                        {/* Category Label */}
                        {categoryKey && (
                            <div className="mb-3">
                                <span className={`category-badge ${CATEGORY_COLORS_SOLID[categoryKey]} text-[10px] md:text-[11px] font-black tracking-[0.2em] px-3 py-1.5 rounded-sm shadow-xl uppercase`}>
                                    {CATEGORY_LABELS[categoryKey]}
                                </span>
                            </div>
                        )}

                        {/* Huge Editorial Title */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-[900] text-white leading-[1.18] tracking-[-0.03em] drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
                            {article.title?.replace(/\*\*/g, '')}
                        </h1>

                        {/* Summary for Desktop */}
                        {article.summary && (
                            <p className="mt-4 text-[15px] md:text-[18px] text-white/80 font-medium leading-[1.6] line-clamp-2 hidden md:block drop-shadow-md max-w-2xl">
                                {article.summary}
                            </p>
                        )}

                        {/* Meta info row */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="text-[11px] md:text-[12px] font-black text-white/80 flex items-center gap-2 uppercase tracking-widest" suppressHydrationWarning>
                                <Clock size={14} className="text-[#d4af37]" />
                                {timeAgoVerbose(article.created_at)}
                            </span>

                            {article.source && (
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-[#d4af37]/30" />
                                    <SourceIcon source={article.source} className="w-4 h-4 text-[#d4af37]" />
                                    <span className="text-[11px] md:text-[12px] font-black text-white/80 uppercase tracking-widest">{article.source}</span>
                                </div>
                            )}

                            <span className="hidden md:flex items-center gap-2 text-[11px] font-black text-premium-gold uppercase tracking-[0.15em]">
                                <div className="w-2 h-2 rounded-full bg-premium-gold animate-pulse" />
                                Ler Agora
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

        </div>
    );
}
