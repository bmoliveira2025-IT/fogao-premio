"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '@/lib/images';
import { Bookmark, Check, Copy, MoreVertical, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LightNewsRowProps {
    article: {
        id: string;
        title: string;
        image?: string;
        created_at: string;
        content?: string;
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

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} Minutos Atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} Horas Atrás`;
        return `${Math.floor(diffInSeconds / 86400)} Dias Atrás`;
    };

    const toSentenceCase = (str: string) => {
        if (!str) return '';
        const cleanStr = str.replace(/\*\*/g, '').trim();
        return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
    };

    const readTime = Math.max(2, Math.floor((article.content?.length || 2000) / 1000));

    return (
        <div className="flex gap-3 items-center bg-zinc-50 rounded-[20px] p-2.5 border border-zinc-100 hover:bg-zinc-100 transition-colors">
            {/* Thumbnail */}
            <Link href={`/news/${article.id}`} className="block relative w-[92px] h-[92px] flex-shrink-0 rounded-[15px] overflow-hidden bg-zinc-200">
                <Image
                    src={getSafeImageSrc(article.image, 'https://placehold.co/150')}
                    alt={article.title}
                    fill
                    sizes="92px"
                    className="object-cover"
                    unoptimized
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow min-w-0 justify-between h-[92px] py-0.5">
                <Link href={`/news/${article.id}`}>
                    <h3 className="text-zinc-900 font-bold text-[14px] leading-[1.28] line-clamp-3 pr-4">
                        {toSentenceCase(article.title)}
                    </h3>
                </Link>

                <div className="flex items-center justify-between w-full">
                    <span className="text-zinc-500 text-[9px] font-semibold uppercase tracking-wide flex items-center gap-1">
                        {timeAgo(article.created_at)}
                        <span className="w-0.5 h-0.5 bg-zinc-400 rounded-full mx-0.5" />
                        {readTime} Min de leitura
                    </span>

                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(current => !current)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-white hover:text-zinc-800"
                            aria-label="Mais opções"
                            aria-expanded={menuOpen}
                        >
                            {feedback ? <Check size={15} className="text-green-600" /> : <MoreVertical size={16} />}
                        </button>

                        {menuOpen && (
                            <div className="absolute bottom-8 right-0 z-30 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.16)]">
                                <button onClick={handleShare} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Share2 size={15} /> Compartilhar
                                </button>
                                <button onClick={handleSave} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Bookmark size={15} /> Salvar notícia
                                </button>
                                <button onClick={handleCopy} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                                    <Copy size={15} /> Copiar link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
