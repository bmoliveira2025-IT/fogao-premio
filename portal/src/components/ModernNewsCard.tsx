"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Share2 } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

import LikeDislikeButtons from './LikeDislikeButtons';

export default function ModernNewsCard({ article }: any) {
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
        <div className="group flex flex-col mb-3 editorial-card glass-puro crystal-border crystal-shine rounded-xl overflow-hidden transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40">
            {/* Top Image Container - Independent Rounded Block */}
            <Link href={`/news/${article.id}`} className="block p-5">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized={true}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
            </Link>

            {/* Content Area */}
            <div className="px-6 pb-6 pt-2 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <SourceIcon source={article.source} className="w-6 h-6 text-premium-gold" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
                                {timeAgo(article.created_at)}
                            </span>
                        </div>
                    </div>

                    <LikeDislikeButtons
                        articleId={article.id}
                        initialLikes={article.likes_count}
                        initialDislikes={article.dislikes_count}
                    />
                </div>

                <Link href={`/news/${article.id}`}>
                    <h3 className="text-[24px] md:text-3xl font-athletic text-white group-hover:text-premium-gold transition-colors duration-300 leading-tight">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

            </div>
        </div>
    );
}
