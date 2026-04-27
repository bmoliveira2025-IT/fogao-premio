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
            className="group relative block w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#111]"
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
                {/* Category Label (Subtle) */}
                {category && (
                    <div className="mb-2">
                        <span className={`${category.color} text-[8px] font-black tracking-[0.15em] px-2 py-1 rounded-[2px] uppercase shadow-lg`}>
                            {category.label}
                        </span>
                    </div>
                )}

                <h3 className="text-[14px] md:text-[15px] font-[900] text-white leading-[1.2] tracking-tight line-clamp-3 group-hover:text-premium-gold transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {article.title?.replace(/\*\*/g, '')}
                </h3>

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
