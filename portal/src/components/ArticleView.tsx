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
        <div className="w-full min-h-screen bg-white font-sans">
            
            {/* HERO SECTION (Image Only) */}
            <div className="relative w-full h-[40vh] md:h-[55vh] bg-zinc-900">
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
                
                {/* Subtle gradient just for top buttons readability if image is light */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-32" />

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
            </div>

            {/* WHITE OVERLAPPING CONTENT CARD */}
            <div className="relative bg-white z-20 max-w-4xl mx-auto rounded-t-[2rem] -mt-8 px-5 pb-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:px-12">
                
                {/* DRAG HANDLE */}
                <div className="w-full flex justify-center py-4 mb-2">
                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
                </div>
                
                {/* HEADER CONTENT (Moved from image) */}
                <div className="flex flex-col items-center text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-[#1A73E8]/10 text-[#1A73E8] text-[12px] font-bold rounded-full mb-4">
                        {categoryKey || 'Futebol'}
                    </span>
                    
                    <h1 className="text-[26px] md:text-[40px] font-bold leading-[1.2] mb-4 tracking-tight text-zinc-900">
                        {toSentenceCase(article.title)}
                    </h1>
                    
                    <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                        <span>🔥 Trending No. 1</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span>{timeAgoStr(article.created_at)}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span>{readTime} min de leitura</span>
                    </div>
                </div>

                {/* AUTHOR INFO (Source) */}
                <div className="flex items-center justify-center gap-3 mb-10 pt-6 border-t border-zinc-100">
                    {article.category === "Resumo Diário" ? (
                        <div className="flex-shrink-0 flex items-center justify-center text-premium-gold text-3xl pb-1">
                            ★
                        </div>
                    ) : (
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 flex items-center justify-center border border-zinc-200">
                            <SourceIcon source={article.source} className="w-8 h-8" />
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[17px] font-bold text-zinc-900 tracking-tight">{article.source || 'Redação'}</span>
                        <div className="w-4 h-4 rounded-full bg-[#1A73E8] text-white flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                        </div>
                    </div>
                </div>

                {/* ARTICLE CONTENT */}
                <div className="flex gap-8 relative">
                    <div className="flex-1 min-w-0">
                        <article className="prose prose-lg max-w-none text-zinc-800">
                            {article.category === "Resumo Diário" ? (
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
                            <div className="mt-12 pt-8 border-t border-zinc-100">
                                <h3 className="text-[18px] font-bold text-zinc-900 mb-4">Veja Também</h3>
                                <div className="space-y-4">
                                    {relatedNews.slice(0, 3).map((item: any) => (
                                        <CompactNewsRow key={item.id} article={item} />
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
