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

function timeAgo(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}min`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
}

// Category detection from title keywords
function detectCategory(title: string): { label: string; color: string } | null {
    const t = title.toLowerCase();
    if (t.includes('transferência') || t.includes('contrat') || t.includes('reforço') || t.includes('negocia'))
        return { label: 'MERCADO', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (t.includes('análise') || t.includes('tática') || t.includes('desempenho'))
        return { label: 'ANÁLISE', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (t.includes('lesão') || t.includes('lesionad') || t.includes('departamento médico'))
        return { label: 'MÉDICO', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (t.includes('gol') || t.includes('resultado') || t.includes('vitória') || t.includes('derrota') || t.includes('empat'))
        return { label: 'RESULTADO', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (t.includes('treino') || t.includes('preparação'))
        return { label: 'TREINO', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    return null;
}

export default function CompactNewsCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const category = detectCategory(article.title || '');

    return (
        <Link
            href={`/news/${article.id}`}
            className="group flex items-start gap-4 p-4 bg-[#111]/80 hover:bg-[#1a1a1a] border-b border-white/[0.04] transition-all duration-300 active:scale-[0.99]"
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
            <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-[88px] md:h-[100px]">
                <div>
                    {/* Category Badge + Time */}
                    <div className="flex items-center gap-2 mb-1.5">
                        {category && (
                            <span className={`text-[9px] font-black tracking-[0.1em] px-1.5 py-0.5 rounded border ${category.color}`}>
                                {category.label}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[14px] md:text-[15px] font-bold text-white/95 leading-[1.3] line-clamp-3 group-hover:text-white transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-2 mt-auto">
                    {article.source && (
                        <div className="flex items-center gap-1.5">
                            <SourceIcon source={article.source} className="w-3 h-3 text-zinc-500" />
                            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{article.source}</span>
                        </div>
                    )}
                    <span className="text-[10px] text-zinc-600" suppressHydrationWarning>•</span>
                    <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1" suppressHydrationWarning>
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
