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
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    return (
        <div className="group flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-zinc-300 transition-all duration-200">
            {/* Standard Mobile Thumbnail (72x72) */}
            <Link href={`/news/${article.id}`} className="relative w-[72px] h-[72px] flex-shrink-0 overflow-hidden bg-zinc-100 rounded-xl border border-zinc-200/60">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    unoptimized
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow min-w-0 justify-between h-[72px] py-0.5">
                <Link href={`/news/${article.id}`}>
                    <h3 className="text-zinc-900 font-bold text-[15px] leading-[1.3] line-clamp-2 group-hover:text-amber-600 transition-colors tracking-tight">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                    <div className="flex min-w-0 shrink items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/80">
                            <SourceIcon source={article.source} className="w-3.5 h-3.5" />
                            <span className="max-w-[62px] truncate text-[10px] font-bold text-zinc-700 sm:max-w-[82px]">
                                {article.source || 'Botafogo'}
                            </span>
                        </div>

                        <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                            <span className="mr-1 text-zinc-300">•</span>{timeAgo(article.created_at)}
                        </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5" ref={menuRef}>
                        <LikeDislikeButtons
                            articleId={article.id}
                            initialLikes={article.likes_count}
                            initialDislikes={article.dislikes_count}
                        />

                        <button
                            type="button"
                            onClick={() => setMenuOpen(current => !current)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"
                            aria-label="Mais opções"
                        >
                            {feedback ? <Check size={14} className="text-emerald-600" /> : <MoreVertical size={15} />}
                        </button>

                        {menuOpen && (
                            <div className="absolute bottom-8 right-0 z-30 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
                                <button onClick={handleShare} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Share2 size={14} /> Compartilhar
                                </button>
                                <button onClick={handleSave} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Bookmark size={14} /> Salvar notícia
                                </button>
                                <button onClick={handleCopy} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Copy size={14} /> Copiar link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


