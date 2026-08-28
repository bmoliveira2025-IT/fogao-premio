"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { useAuth } from '@/context/AuthContext';
import LikeDislikeButtons from './LikeDislikeButtons';

export default function TextOnlyNewsCard({ article }: any) {
    const { user } = useAuth();

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
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
        <div className="group flex flex-col mb-3 editorial-card glass-puro crystal-border crystal-shine rounded-xl p-6 transition-all duration-500 soft-shadow-cinematic hover:border-premium-gold/40">
            <Link href={`/news/${article.id}`} className="flex flex-col gap-5">
                <h3 className="text-[20px] md:text-3xl font-athletic text-white group-hover:text-premium-gold transition-colors leading-tight">
                    {toSentenceCase(article.title)}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <SourceIcon source={article.source || 'default'} className="w-5 h-5 text-premium-gold" />
                        </div>
                        <div className="flex items-center gap-2.5 bg-black/40 px-5 py-2.5 rounded-full border border-white/10">
                            <Clock size={16} className="text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
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
            </Link>
        </div>
    );
}
