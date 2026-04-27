"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
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
    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) {
        const min = Math.floor(diffInSeconds / 60);
        return `há ${min} min`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `há ${hours}h`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `há ${days}d`;
}

function detectCategory(title: string): { label: string; color: string } | null {
    const t = title.toLowerCase();
    if (t.includes('transferência') || t.includes('contrat') || t.includes('reforço') || t.includes('negocia'))
        return { label: 'MERCADO', color: 'bg-emerald-500' };
    if (t.includes('análise') || t.includes('tática') || t.includes('desempenho'))
        return { label: 'ANÁLISE', color: 'bg-blue-500' };
    if (t.includes('lesão') || t.includes('lesionad') || t.includes('departamento médico'))
        return { label: 'MÉDICO', color: 'bg-red-500' };
    if (t.includes('gol') || t.includes('resultado') || t.includes('vitória') || t.includes('derrota'))
        return { label: 'RESULTADO', color: 'bg-amber-500' };
    if (t.includes('treino') || t.includes('preparação'))
        return { label: 'TREINO', color: 'bg-purple-500' };
    if (t.includes('entrevista') || t.includes('coletiva') || t.includes('declarou'))
        return { label: 'BASTIDORES', color: 'bg-cyan-500' };
    return null;
}

export default function HeroNewsCard({ article }: { article: NewsItem }) {
    if (!article) return null;

    const category = detectCategory(article.title || '');

    return (
        <div className="relative">
            <Link
                href={`/news/${article.id}`}
                className="group relative block w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[2.4/1] bg-[#0a0a0a] overflow-hidden"
            >
                {/* Full Background Image with Ken Burns effect */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-[6s] ease-out group-hover:scale-[1.04]"
                    unoptimized
                />

                {/* Multi-layer gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_20%,transparent_20%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.9)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#0a0a0a] via-black/70 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

                {/* Noise texture overlay for editorial feel */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

                {/* Content */}
                <div className="absolute inset-0 p-5 md:p-8 lg:px-12 lg:py-10 flex flex-col justify-end z-20">
                    {/* Category + Time badge */}
                    <div className="flex items-center gap-2.5 mb-3 md:mb-4">
                        {category && (
                            <span className={`${category.color} text-white text-[9px] md:text-[10px] font-black tracking-[0.12em] px-2.5 py-1 rounded-[4px] shadow-lg`}>
                                {category.label}
                            </span>
                        )}
                        <span className="text-[10px] md:text-[11px] font-semibold text-white/70 flex items-center gap-1.5 backdrop-blur-sm bg-white/[0.06] px-2.5 py-1 rounded-[4px]" suppressHydrationWarning>
                            <Clock size={10} className="text-white/50" />
                            {timeAgo(article.created_at)}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="max-w-[90%] md:max-w-[70%] lg:max-w-[55%]">
                        <h1 className="text-[24px] md:text-[36px] lg:text-[44px] font-[900] text-white leading-[1.08] tracking-[-0.02em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {article.title?.replace(/\*\*/g, '')}
                        </h1>

                        {article.summary && (
                            <p className="mt-3 text-[13px] md:text-[15px] text-white/75 font-medium leading-[1.5] line-clamp-2 hidden md:block drop-shadow-md max-w-[90%]">
                                {article.summary}
                            </p>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 md:mt-6 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#d4af37] text-black text-[11px] md:text-[12px] font-[800] tracking-[0.08em] uppercase rounded-lg shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] group-hover:brightness-110" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            LER MATÉRIA
                            <ChevronRight size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>

                        {article.source && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] backdrop-blur-sm">
                                <SourceIcon source={article.source} className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{article.source}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
