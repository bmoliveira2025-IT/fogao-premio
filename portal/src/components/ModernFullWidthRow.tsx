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

export default function ModernFullWidthRow({ article }: { article: NewsItem }) {
    if (!article) return null;

    return (
        <div className="px-3 md:px-0 mb-3 mt-1">
            <Link
                href={`/news/${article.id}`}
                className="editorial-card editorial-image-row group relative block w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-[#111] shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
                {/* Full Background Image */}
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover object-center transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                    unoptimized
                />
                
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end z-20">
                    <h3 className="text-lg md:text-2xl font-[900] text-white leading-[1.3] tracking-tight group-hover:text-zinc-100 transition-colors drop-shadow-lg line-clamp-3">
                        {article.title?.replace(/\*\*/g, '')}
                    </h3>
                    
                    {/* Meta row */}
                    <div className="flex items-center gap-2.5 mt-2.5">
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

                {/* Hover ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06] group-hover:ring-white/[0.12] transition-all duration-500" />
            </Link>
        </div>
    );
}
