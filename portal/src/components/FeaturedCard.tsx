"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { getSafeImageSrc } from '@/lib/images';
import SourceIcon from './SourceIcon';

interface NewsItem {
    id: string;
    title: string;
    image?: string;
    source?: string;
    summary?: string;
    created_at?: string;
}

function timeAgo(dateStr: string | undefined) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
}

function detectCategory(title: string): { label: string; color: string } | null {
    const t = title.toLowerCase();
    if (t.includes('transferência') || t.includes('contrat') || t.includes('reforço') || t.includes('negocia'))
        return { label: 'MERCADO', color: 'bg-emerald-500/90 text-white' };
    if (t.includes('análise') || t.includes('tática') || t.includes('desempenho'))
        return { label: 'ANÁLISE', color: 'bg-blue-500/90 text-white' };
    if (t.includes('lesão') || t.includes('lesionad') || t.includes('departamento médico'))
        return { label: 'MÉDICO', color: 'bg-red-500/90 text-white' };
    if (t.includes('gol') || t.includes('resultado') || t.includes('vitória') || t.includes('derrota'))
        return { label: 'RESULTADO', color: 'bg-amber-500/90 text-black' };
    if (t.includes('treino') || t.includes('preparação'))
        return { label: 'TREINO', color: 'bg-purple-500/90 text-white' };
    return null;
}

export default function FeaturedCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const category = detectCategory(article.title || '');

    return (
        <Link
            href={`/news/${article.id}`}
            className="group relative block w-full aspect-[16/10] overflow-hidden rounded-2xl bg-[#111]"
        >
            {/* Background Image */}
            <Image
                src={getSafeImageSrc(article.image)}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                unoptimized
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

            {/* Category Badge (top-left) */}
            {category && (
                <div className="absolute top-3 left-3 z-20">
                    <span className={`text-[9px] font-black tracking-[0.12em] px-2 py-1 rounded-md ${category.color} shadow-lg backdrop-blur-sm`}>
                        {category.label}
                    </span>
                </div>
            )}

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-20 flex flex-col justify-end">
                <h3 className="text-[17px] md:text-xl font-black text-white leading-[1.2] tracking-tight line-clamp-3 drop-shadow-lg group-hover:text-zinc-100 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {article.title?.replace(/\*\*/g, '')}
                </h3>

                {/* Meta row */}
                <div className="flex items-center gap-2 mt-2.5">
                    {article.source && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md">
                            <SourceIcon source={article.source} className="w-3 h-3 text-zinc-300" />
                            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider">{article.source}</span>
                        </div>
                    )}
                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1" suppressHydrationWarning>
                        <Clock size={9} />
                        {timeAgo(article.created_at)}
                    </span>
                </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06] group-hover:ring-white/[0.12] transition-all duration-500" />
        </Link>
    );
}
