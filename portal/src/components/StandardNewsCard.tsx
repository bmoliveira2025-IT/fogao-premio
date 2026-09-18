"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import { timeAgo, cleanMarkdown } from '@/lib/news-utils';

interface StandardArticle {
    id: string;
    title: string;
    image?: string;
    source?: string;
    created_at?: string;
    summary?: string;
    image_position?: string;
}

export default function StandardNewsCard({ article }: { article: StandardArticle }) {
    if (!article) return null;
    return <Link href={`/news/${article.id}`} className="group flex min-h-[132px] gap-4 border-b border-white/[0.06] bg-[#111]/70 p-4 transition-colors hover:bg-[#181818]">
        <div className="min-w-0 flex-1 py-0.5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{article.source || 'Fogão 360°'} · {timeAgo(article.created_at)}</p>
            <h3 className="line-clamp-3 text-base font-extrabold leading-[1.3] text-white group-hover:text-amber-300 sm:text-lg">{cleanMarkdown(article.title)}</h3>
            {article.summary && <p className="mt-2 hidden text-sm leading-5 text-zinc-500 line-clamp-2 sm:block">{cleanMarkdown(article.summary)}</p>}
        </div>
        {article.image && <div className="relative aspect-[4/3] w-[34%] max-w-[190px] shrink-0 self-start overflow-hidden rounded-xl bg-zinc-900">
            <Image src={getSafeImageSrc(article.image)} alt={article.title} fill sizes="(min-width: 1024px) 190px, 34vw" className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: article.image_position || 'center 35%' }} loading="lazy" quality={60} />
        </div>}
    </Link>;
}
