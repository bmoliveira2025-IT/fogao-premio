"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LikeDislikeButtons from './LikeDislikeButtons';

export default function HeroNewsCard({ article }: { article: any }) {
    const { user } = useAuth();

    if (!article) return null;

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Link
            href={`/news/${article.id}`}
            className="editorial-card group relative w-full aspect-[16/12] md:aspect-[21/7.5] overflow-hidden rounded-none md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] block premium-card glass-card-hover gradient-border-animated"
        >    {/* Background Image - Position Top to Keep Faces */}
            <Image
                src={getSafeImageSrc(article.image)}
                alt={article.title}
                fill
                priority={true}
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                unoptimized={true}
            />

            {/* Gradient Overlay - Premium */}
            <div className="absolute inset-0 hero-gradient" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                <h2 className="text-lg md:text-4xl lg:text-5xl font-black text-white leading-[1.2] font-sans uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] group-hover:text-premium-gold transition-colors mb-2 md:mb-4">
                    {article.title?.replace(/\*\*/g, '')}
                </h2>

                {/* Footer Tags & Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-[#222]/80 backdrop-blur-sm border border-premium-gold/15 rounded-md text-[11px] font-bold text-white/50 uppercase tracking-wider">
                            #BOTAFOGO
                        </span>

                        {/* Source Moved Here */}
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-premium-gold/15">
                            <SourceIcon source={article.source} className="w-3.5 h-3.5 text-premium-gold" />
                        </div>
                    </div>

                    {/* Date Moved Here */}
                    <LikeDislikeButtons
                        articleId={article.id}
                        initialLikes={article.likes_count}
                        initialDislikes={article.dislikes_count}
                    />

                    <div className="flex items-center gap-1.5 text-zinc-300 drop-shadow-md bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5">
                        <Clock size={12} className="md:w-3 md:h-3 w-2.5 h-2.5" />
                        <span className="text-[11px] md:text-[13px] font-medium uppercase tracking-wider" suppressHydrationWarning>
                            {new Date(article.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            <span className="hidden md:inline"> às {new Date(article.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
