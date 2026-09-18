"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import { timeAgoVerbose, detectCategoryKey, CATEGORY_LABELS } from '@/lib/news-utils';

interface NewsItem { id: string; title: string; image?: string; source?: string; summary?: string; created_at?: string; image_position?: string; }

export default function ModernFullWidthHero({ article }: { article: NewsItem }) {
    if (!article) return null;
    const categoryKey = detectCategoryKey(article.title || '');
    return (
        <Link href={`/news/${article.id}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-2xl">
            {article.image && <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <Image src={getSafeImageSrc(article.image)} alt={article.title} fill priority sizes="(min-width: 1280px) 900px, (min-width: 1024px) 66vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" style={{ objectPosition: article.image_position || 'center 35%' }} quality={75} />
            </div>}
            <div className="p-5 sm:p-7 lg:p-8">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">
                    {categoryKey ? CATEGORY_LABELS[categoryKey] : 'Destaque'}<span className="mx-2 text-zinc-600">/</span><span className="text-zinc-400">{article.source || 'Fogão 360°'} · {timeAgoVerbose(article.created_at)}</span>
                </p>
                <h1 className="max-w-4xl text-2xl font-black leading-[1.12] tracking-[-0.025em] text-white sm:text-3xl lg:text-4xl">{article.title?.replace(/\*\*/g, '')}</h1>
                {article.summary && <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 line-clamp-2 sm:text-base">{article.summary}</p>}
            </div>
        </Link>
    );
}
