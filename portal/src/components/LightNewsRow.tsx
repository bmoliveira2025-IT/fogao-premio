"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import { Bookmark, Check, Copy, MoreVertical, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SourceIcon from './SourceIcon';
import LikeDislikeButtons from './LikeDislikeButtons';

interface LightNewsRowProps {
    article: {
        id: string;
        title: string;
        image?: string;
        source?: string;
        created_at: string;
        content?: string;
        likes_count?: number;
        dislikes_count?: number;
    } | null;
}

export default function LightNewsRow({ article }: LightNewsRowProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [feedback, setFeedback] = useState<'saved' | 'copied' | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const closeMenu = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('pointerdown', closeMenu);
        return () => document.removeEventListener('pointerdown', closeMenu);
    }, [menuOpen]);

    if (!article) return null;

    const articleUrl = typeof window !== 'undefined' ? `${window.location.origin}/news/${article.id}` : `/news/${article.id}`;

    const showFeedback = (type: 'saved' | 'copied') => {
        setFeedback(type);
        window.setTimeout(() => setFeedback(null), 1600);
        setMenuOpen(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: article.title, url: articleUrl });
                setMenuOpen(false);
                return;
            } catch {
                return;
            }
        }
        await navigator.clipboard.writeText(articleUrl);
        showFeedback('copied');
    };

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('saved_news') || '[]') as string[];
        localStorage.setItem('saved_news', JSON.stringify(Array.from(new Set([...saved, article.id]))));
        showFeedback('saved');
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(articleUrl);
        showFeedback('copied');
    };

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        if (!Number.isFinite(date.getTime())) return '';
        const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

        if (diffInSeconds === 0) return 'agora';
        if (diffInSeconds < 60) return `${diffInSeconds} ${diffInSeconds === 1 ? 'segundo' : 'segundos'} atrás`;
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
        <div className="editorial-card editorial-row group flex items-start gap-3 p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-zinc-300 transition-all duration-200">
            {/* Thumbnail fills the shared row height. */}
            <Link href={`/news/${article.id}`} className="relative w-[80px] h-[88px] flex-shrink-0 overflow-hidden bg-zinc-100 rounded-xl border border-zinc-200/60">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    unoptimized
                />
            </Link>

            {/* Content */}
            <div className="editorial-row-content flex flex-col flex-grow min-w-0">
                <Link href={`/news/${article.id}`}>
                    <h3 className="text-zinc-900 font-bold text-base leading-[1.4] line-clamp-2 group-hover:text-amber-600 transition-colors tracking-tight">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

                <div className="editorial-row-footer flex w-full min-w-0 flex-col items-start justify-end gap-1.5">
                    <div className="flex min-w-0 shrink items-center gap-1.5">
                        <div className="flex min-w-0 items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/80">
                            <SourceIcon source={article.source} className="w-3.5 h-3.5 shrink-0" />
                            <span className="min-w-0 truncate text-[10px] font-bold text-zinc-700">
                                {article.source || 'Botafogo'}
                            </span>
                        </div>

                    </div>

                    <div className="editorial-row-actions relative flex w-full min-w-0 shrink-0 items-center justify-between gap-2" ref={menuRef}>
                        <LikeDislikeButtons
                            articleId={article.id}
                            initialLikes={article.likes_count}
                            initialDislikes={article.dislikes_count}
                        />

                        <span className="editorial-row-time min-w-0 flex-1 text-center text-xs leading-tight font-medium text-zinc-600" suppressHydrationWarning>
                            {timeAgo(article.created_at)}
                        </span>

                        <button
                            type="button"
                            onClick={() => setMenuOpen(current => !current)}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${menuOpen
                                ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white'
                                : 'bg-transparent text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-white'
                            }`}
                            aria-label="Mais opções"
                            aria-expanded={menuOpen}
                        >
                            {feedback ? <Check size={14} className="text-emerald-600" /> : <MoreVertical size={15} />}
                        </button>

                        {menuOpen && (
                            <div className="absolute bottom-11 right-0 z-30 w-52 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                                <button onClick={handleShare} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Share2 size={18} /> Compartilhar
                                </button>
                                <button onClick={handleSave} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Bookmark size={18} /> Salvar notícia
                                </button>
                                <button onClick={handleCopy} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Copy size={18} /> Copiar link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


