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
    const titleLength = article.title.length + 2;
    const fullText = `${article.title}. ${paragraphs.join('. ')}`;
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

        const shareData = {
            title: article.title,
            text: "",
            url: window.location.href,
        };

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

    return (
        <div className="w-full min-h-screen bg-white font-sans">
            {/* Top Navigation */}
            <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-zinc-900 font-bold text-[18px] tracking-tight hover:opacity-70 transition-opacity"
                >
                    <ChevronLeft size={22} strokeWidth={2.5} /> Notícia
                </button>
                <div className="flex items-center gap-4">
                    {/* Theme toggle lookalike */}
                    <div className="w-12 h-7 bg-orange-50 rounded-full flex items-center px-1 border border-orange-100 cursor-pointer">
                        <Sun size={14} className="text-orange-400" />
                    </div>
                    <button onClick={handleShare} className="text-zinc-900 hover:opacity-70 transition-opacity">
                        <Share2 size={20} strokeWidth={2} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Grey Title Card */}
                <div className="bg-[#F8F9FA] rounded-[1.5rem] p-6 mx-4 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-pink-100 text-pink-800 text-[11px] font-bold rounded-full">
                                {categoryKey || 'Futebol'}
                            </span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-[11px] font-bold rounded-full">
                                Botafogo
                            </span>
                        </div>
                        <span className="text-xs text-zinc-500 font-medium whitespace-nowrap ml-2">
                            {readTime} min de leitura
                        </span>
                    </div>
                    
                    <h1 className="text-[28px] md:text-[40px] font-bold text-zinc-900 leading-[1.15] mb-6 tracking-tight">
                        {toSentenceCase(article.title)}
                    </h1>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 flex-shrink-0 flex items-center justify-center">
                                <span className="text-white font-bold text-[18px]">F</span>
                            </div>
                            <span className="text-[15px] font-semibold text-zinc-900">Fogão Premium</span>
                        </div>
                        <button className="bg-[#FF8A65] text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-sm hover:bg-[#FF7043] transition-colors active:scale-95">
                            Seguir
                        </button>
                    </div>
                </div>

                {/* Article Main Image */}
                {article.image && (
                    <div className="mx-4 mb-8 rounded-[1.5rem] overflow-hidden relative aspect-video bg-zinc-100">
                        <Image
                            src={getSafeImageSrc(article.image)}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                )}

                {/* Content Layout */}
                <div className="flex px-4 gap-6 pb-24 relative">
                    {/* Left: Text Content */}
                    <div className="flex-1 min-w-0">
                        <article className="prose prose-lg max-w-none text-zinc-800">
                            {article.is_premium ? (
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

                    {/* Right: Floating Sidebar Actions */}
                    <div className="w-12 flex-shrink-0 relative hidden sm:block">
                        <div className="sticky top-6 flex flex-col gap-3">
                            <button 
                                onClick={handleSave} 
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSaved ? 'bg-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-100 text-zinc-700 hover:bg-zinc-100'}`}
                                title={isSaved ? "Salvo" : "Salvar"}
                            >
                                <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                            </button>
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
            
            {/* Mobile Action Bar (Fixed bottom when sidebar is hidden) */}
            <div className="sm:hidden fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-zinc-100 p-3 flex justify-around items-center z-40">
                <button onClick={handleSave} className={`p-2 rounded-xl flex items-center gap-2 ${isSaved ? 'text-zinc-900 font-bold' : 'text-zinc-600'}`}>
                    <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                </button>
                <button onClick={() => setShowVoice(!showVoice)} className={`p-2 rounded-xl flex items-center gap-2 ${showVoice ? 'text-blue-600 font-bold bg-blue-50' : 'text-zinc-600'}`}>
                    <Headphones size={20} />
                </button>
                <button onClick={handleShare} className="p-2 rounded-xl text-zinc-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Voice Player */}
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


