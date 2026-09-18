"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import { timeAgo, detectCategoryKey, CATEGORY_LABELS } from '@/lib/news-utils';

interface HighlightArticle { id: string; title: string; image?: string; source?: string; created_at: string; summary?: string; image_position?: string; }

export default function HighlightNewsCarousel({ news }: { news: HighlightArticle[] }) {
    const [lead, ...secondary] = news.slice(0, 3);
    if (!lead) return null;
    const leadCategory = detectCategoryKey(lead.title || '');

    return <section aria-label="Notícias em destaque" className="mb-7 space-y-5">
        <Link href={`/news/${lead.id}`} className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            {lead.image && <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                <Image src={getSafeImageSrc(lead.image)} alt={lead.title} fill priority sizes="100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" style={{ objectPosition: lead.image_position || 'center 35%' }} quality={75} />
            </div>}
            <div className="p-4 pb-5">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-700">{leadCategory ? CATEGORY_LABELS[leadCategory] : 'Destaque'} <span className="text-zinc-300">/</span> <span className="text-zinc-500">{lead.source || 'Fogão 360°'} · {timeAgo(lead.created_at)}</span></p>
                <h1 className="text-[25px] font-black leading-[1.12] tracking-[-0.025em] text-zinc-950">{lead.title.replace(/\*\*/g, '').trim()}</h1>
                {lead.summary && <p className="mt-3 line-clamp-2 text-sm leading-5 text-zinc-600">{lead.summary}</p>}
            </div>
        </Link>

        {secondary.length > 0 && <div className="grid grid-cols-2 gap-3">
            {secondary.map(article => <Link key={article.id} href={`/news/${article.id}`} className="group min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                {article.image && <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                    <Image src={getSafeImageSrc(article.image)} alt={article.title} fill sizes="50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" style={{ objectPosition: article.image_position || 'center 35%' }} loading="lazy" quality={60} />
                </div>}
                <div className="p-3">
                    <h2 className="line-clamp-3 text-[14px] font-extrabold leading-[1.25] text-zinc-900">{article.title.replace(/\*\*/g, '').trim()}</h2>
                    <p className="mt-2 truncate text-[10px] font-semibold text-zinc-500">{article.source || 'Fogão 360°'} · {timeAgo(article.created_at)}</p>
                </div>
            </Link>)}
        </div>}
    </section>;
}
