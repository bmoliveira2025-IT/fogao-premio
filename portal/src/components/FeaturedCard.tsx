"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import { timeAgo } from '@/lib/news-utils';

interface NewsItem { id: string; title: string; image?: string; source?: string; created_at?: string; image_position?: string; }

export default function FeaturedCard({ article }: { article: NewsItem }) {
    if (!article) return null;
    return <Link href={`/news/${article.id}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition-colors hover:border-white/20">
        {article.image && <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 xl:aspect-[3/2]">
            <Image src={getSafeImageSrc(article.image)} alt={article.title} fill sizes="(min-width: 1280px) 220px, (min-width: 768px) 40vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: article.image_position || 'center 35%' }} loading="lazy" quality={65} />
        </div>}
        <div className="p-4">
            <h3 className="line-clamp-3 text-[15px] font-extrabold leading-[1.3] text-white transition-colors group-hover:text-amber-300">{article.title?.replace(/\*\*/g, '')}</h3>
            <p className="mt-2 text-[11px] font-semibold text-zinc-500">{article.source || 'Fogão 360°'} · {timeAgo(article.created_at)}</p>
        </div>
    </Link>;
}
