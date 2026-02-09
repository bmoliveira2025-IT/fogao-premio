"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LikeDislikeButtons from './LikeDislikeButtons';

export default function CompactNewsRow({ article }: any) {
    const { user } = useAuth();
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora mesmo';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
        }
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <Link
            href={`/news/${article.id}`}
            className="group flex gap-4 md:gap-6 items-center p-4 md:p-6 rounded-2xl hover:bg-white/5 border transition-all hover:scale-[1.01]"
            style={{ borderColor: 'var(--border-color)' }}
        >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-lg">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized={true}
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0 justify-center gap-3">
                <h4 className="text-[18px] md:text-[21px] font-semibold text-foreground group-hover:text-premium-gold dark:group-hover:text-premium-gold light:group-hover:text-zinc-600 transition-colors">
                    {toSentenceCase(article.title)}
                </h4>

                {/* Metadata Pill */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <SourceIcon source={article.source} className="w-3 h-3 text-[11px] transition-all grayscale group-hover:grayscale-0" />

                        <span className="text-[11px] md:text-[12px] font-bold text-premium-gold/90 dark:text-premium-gold/90 light:text-zinc-900 uppercase tracking-widest leading-none px-1.5 py-0.5 rounded bg-premium-gold/10 dark:bg-premium-gold/10 light:bg-zinc-100 border border-premium-gold/10 dark:border-premium-gold/10 light:border-zinc-200">
                            {article.source || 'FOGÃO'}
                        </span>

                        <span className="text-[10px] text-foreground/20">•</span>

                        <span className="text-[11px] md:text-[12px] text-foreground/40 font-bold tabular-nums">
                            {timeAgo(article.created_at)}
                        </span>
                    </div>

                    <LikeDislikeButtons
                        articleId={article.id}
                        initialLikes={article.likes_count}
                        initialDislikes={article.dislikes_count}
                    />
                </div>
            </div>
        </Link>
    );
}
