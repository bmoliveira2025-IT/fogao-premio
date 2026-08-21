"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Headphones, Bookmark, MoreHorizontal, Sun } from 'lucide-react';
import ArticleReader from '@/components/ArticleReader';
import VoicePlayer from '@/components/VoicePlayer';
import ShareModal from '@/components/ShareModal';
import { AnimatePresence } from 'framer-motion';
import CompactNewsRow from './CompactNewsRow';
import SourceIcon from './SourceIcon';
import PremiumGuard from './PremiumGuard';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import { detectCategoryKey } from '@/lib/news-utils';

const toSentenceCase = (str: string) => {
    if (!str) return '';
    const cleanStr = str.replace(/\*\*/g, '').trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};

export default function ArticleView({ article, nextMatch, relatedNews = [] }: { article: any, nextMatch: any, relatedNews?: any[] }) {
    const router = useRouter();
    const { user, addPoints } = useAuth();
    const [pointsAwarded, setPointsAwarded] = useState(false);
    
    const [showVoice, setShowVoice] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const paragraphs = article.content?.split('\n') || [article.summary || "Conteúdo não disponível."];
    const safeTitle = article.title || '';
    const titleLength = safeTitle.length + 2;
    const fullText = `${safeTitle}. ${paragraphs.join('. ')}`;
    const [readingCharIndex, setReadingCharIndex] = useState(-1);
    const readTime = Math.max(1, Math.round(paragraphs.join(' ').split(' ').length / 200));

    const getActiveParagraphIndex = (charIndex: number) => {
        if (charIndex === -1) return -1;
        if (charIndex < titleLength) return -2;
        let currentOffset = titleLength;
        for (let i = 0; i < paragraphs.length; i++) {
            const pLength = paragraphs[i].length;
            if (charIndex >= currentOffset && charIndex < currentOffset + pLength + 2) {
                return i;
            }
            currentOffset += pLength + 2;
        }
        return -1;
    };

    const activeParagraphIndex = getActiveParagraphIndex(readingCharIndex);
    const categoryKey = detectCategoryKey(article.title || '');

    const handleShare = async () => {
        if (typeof window === 'undefined') return;
        const shareData = { title: article.title, text: "", url: window.location.href };
        if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
            if (navigator.canShare && !navigator.canShare(shareData)) {
                setShowShare(true);
                return;
            }
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.error("Share failed:", err);
            }
        }
        setShowShare(true);
    };

    const handleSave = async () => {
        setIsSaved(!isSaved);
        if (!pointsAwarded && user && !isSaved) {
            await addPoints(5);
            setPointsAwarded(true);
        }
    };

    const timeAgoStr = (dateStr: string) => {
        if (!dateStr) return '';
        const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} horas atrás`;
        return `${Math.floor(diff / 86400)} dias atrás`;
    };

    return (
        <div className="mb-[calc(-4rem-env(safe-area-inset-bottom))] min-h-screen w-full bg-white pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans lg:mb-0 lg:pb-0">
            
            {/* HERO SECTION (Image Only) */}
            <div className="relative w-full h-[46vh] min-h-[390px] md:h-[58vh] bg-zinc-900">
                {article.image && (
                    <Image
                        src={getSafeImageSrc(article.image)}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover"
                        unoptimized
                    />
                )}
                
                {/* Gradients preserve contrast for navigation and the headline. */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80" />

                {/* TOP NAVIGATION (Absolute over image) */}
                <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-4 max-w-4xl mx-auto z-10 safe-pt">
                    <button 
                        onClick={() => router.back()} 
                        className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSave} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-colors">
                            <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                        </button>
                        <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Headline over the cover image, editorial reader style. */}
                <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-4xl px-5 pb-9 sm:px-6 md:px-12 md:pb-12">
                    <span className="mb-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm border border-white/20">
                        {categoryKey || 'Futebol'}
                    </span>
                    <h1 className="max-w-3xl text-[27px] font-bold leading-[1.08] tracking-tight text-white drop-shadow-md sm:text-[32px] md:text-[44px]">
                        {toSentenceCase(article.title)}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-white/85 sm:text-[13px]">
                        <span>Em destaque</span>
                        <span className="h-1 w-1 rounded-full bg-white/55" />
                        <span>{timeAgoStr(article.created_at)}</span>
                        <span className="h-1 w-1 rounded-full bg-white/55" />
                        <span>{readTime} min de leitura</span>
                    </div>
                </div>
            </div>

            {/* WHITE OVERLAPPING CONTENT CARD */}
            <div className="relative bg-white z-20 max-w-4xl mx-auto rounded-t-[1.75rem] md:rounded-t-[2rem] -mt-5 md:-mt-7 px-5 sm:px-7 pb-24 md:px-12 md:pb-12 shadow-[0_-10px_34px_rgba(0,0,0,0.1)]">

                {/* AUTHOR INFO (Source) */}
                <div className="flex items-center justify-between mb-6 md:mb-8 pt-5 md:pt-6 pb-4 border-b border-zinc-100">
                    <div className="inline-flex items-center gap-3">
                        {article.category === "Resumo Diário" || article.category === "Giro do Fogão" ? (
                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-950 text-amber-400 text-sm font-bold shadow-sm ring-2 ring-amber-400/20">
                                ★
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 flex items-center justify-center border border-zinc-200 shadow-sm">
                                <SourceIcon source={article.source} className="w-6 h-6" />
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm sm:text-[16px] font-extrabold text-zinc-900 tracking-tight leading-none">{article.source || 'Redação Fogão 360'}</span>
                                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs" title="Fonte de notícia verificada">
                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                                </div>
                            </div>
                            <span className="mt-1 block text-[11px] font-semibold text-zinc-400">Fonte jornalística verificada</span>
                        </div>
                    </div>
                    <span className="text-[12px] font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">{timeAgoStr(article.created_at)}</span>
                </div>

                {/* ARTICLE CONTENT */}
                <div className="flex gap-8 relative">
                    <div className="flex-1 min-w-0">
                        <article className="prose prose-lg max-w-none text-zinc-800">
                            {article.category === "Resumo Diário" || article.category === "Giro do Fogão" ? (
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            ) : article.is_premium ? (
                                <PremiumGuard>
                                    <ArticleReader
                                        paragraphs={paragraphs}
                                        isPremium={article.is_premium || article.title.includes('Análise')}
                                        activeParagraphIndex={activeParagraphIndex}
                                    />
                                </PremiumGuard>
                            ) : (
                                <ArticleReader
                                    paragraphs={paragraphs}
                                    isPremium={false}
                                    activeParagraphIndex={activeParagraphIndex}
                                />
                            )}
                        </article>

                        {/* Related News directly below text */}
                        {(relatedNews && relatedNews.length > 0) && (
                            <div className="mt-6 md:mt-8 pt-4 md:pt-5 border-t border-zinc-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="h-4 w-1 rounded-full bg-zinc-900" />
                                    <h3 className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-zinc-900">Veja também</h3>
                                </div>
                                <div className="divide-y divide-zinc-100">
                                    {relatedNews.slice(0, 3).map((item: any) => (
                                        <CompactNewsRow key={item.id} article={item} dense />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DESKTOP SIDEBAR ACTIONS */}
                    <div className="w-12 flex-shrink-0 relative hidden lg:block">
                        <div className="sticky top-6 flex flex-col gap-3">
                            <button 
                                onClick={() => setShowVoice(!showVoice)} 
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${showVoice ? 'bg-blue-50 border border-blue-200 text-blue-600' : 'bg-zinc-50 border border-zinc-100 text-zinc-700 hover:bg-zinc-100'}`}
                                title="Ouvir Áudio"
                            >
                                <Headphones size={20} />
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors"
                                title="Mais Opções"
                            >
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* MOBILE FIXED ACTIONS */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-zinc-100 p-3 flex justify-around items-center z-40">
                <button onClick={handleSave} className={`p-2 rounded-xl flex items-center gap-2 ${isSaved ? 'text-zinc-900 font-bold' : 'text-zinc-600'}`}>
                    <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                </button>
                <button onClick={() => setShowVoice(!showVoice)} className={`p-2 rounded-xl flex items-center gap-2 ${showVoice ? 'text-blue-600 font-bold bg-blue-50' : 'text-zinc-600'}`}>
                    <Headphones size={20} />
                </button>
                <button onClick={handleShare} className="p-2 rounded-xl text-zinc-600">
                    <Share2 size={20} />
                </button>
            </div>

            <AnimatePresence>
                {showVoice && (
                    <VoicePlayer
                        text={fullText}
                        onClose={() => { setShowVoice(false); setReadingCharIndex(-1); }}
                        onProgress={setReadingCharIndex}
                    />
                )}
            </AnimatePresence>

            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                title={article.title}
                url={typeof window !== 'undefined' ? window.location.href : ''}
            />
        </div>
    );
}
