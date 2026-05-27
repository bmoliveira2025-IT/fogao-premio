"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Share2, Volume2, Clock, Plus, Minus, ArrowLeft, MoreHorizontal } from 'lucide-react';
import ArticleReader from '@/components/ArticleReader';
import VoicePlayer from '@/components/VoicePlayer';
import ShareModal from '@/components/ShareModal';
import { AnimatePresence, motion } from 'framer-motion';
import CompactNewsRow from './CompactNewsRow';
import PremiumGuard from './PremiumGuard';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import LikeDislikeButtons from './LikeDislikeButtons';
import SourceIcon from './SourceIcon';
import { timeAgo, timeAgoVerbose, detectCategoryKey, CATEGORY_LABELS, CATEGORY_COLORS_SOLID } from '@/lib/news-utils';

const toSentenceCase = (str: string) => {
    if (!str) return '';
    const cleanStr = str.replace(/\*\*/g, '').trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};


export default function ArticleView({ article, nextMatch, relatedNews = [] }: { article: any, nextMatch: any, relatedNews?: any[] }) {
    const { user, addPoints } = useAuth();
    const [pointsAwarded, setPointsAwarded] = useState(false);
    const [fontSize, setFontSize] = useState(100);

    const adjustFont = (delta: number) => {
        if (typeof document === 'undefined') return;
        const newSize = Math.min(Math.max(fontSize + delta, 80), 150);
        setFontSize(newSize);
        document.documentElement.style.setProperty('--font-scale', `${newSize / 100}`);
    };

    const handleLikePoints = async () => {
        if (!pointsAwarded && user) {
            await addPoints(5);
            setPointsAwarded(true);
        }
    };

    const [showVoice, setShowVoice] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const createdDate = new Date(article.created_at);
    const dateString = createdDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const diffMs = Date.now() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

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

    const NextMatchWidget = () => nextMatch ? (
        <div className="mt-8 mb-4 border border-white/[0.06] rounded-xl bg-[#111] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
            <div className="p-4">
                <h4 className="text-[10px] text-[#d4af37] uppercase tracking-[0.15em] font-black mb-4">Próximo Confronto</h4>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-10 h-10 mb-2 relative">
                            <img src={getSafeImageSrc(nextMatch.home_team_logo, 'https://placehold.co/80x80')} alt={nextMatch.home_team} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[11px] font-bold text-white uppercase text-center leading-tight">{nextMatch.home_team}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-1/3 space-y-1">
                        <span className="text-xs font-black text-zinc-600 italic">VS</span>
                        <span className="text-[10px] font-bold text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full">
                            {new Date(nextMatch.date).toLocaleDateString('pt-BR', { weekday: 'short' })}, {new Date(nextMatch.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-10 h-10 mb-2 relative">
                            <img src={getSafeImageSrc(nextMatch.away_team_logo, 'https://placehold.co/80x80')} alt={nextMatch.away_team} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[11px] font-bold text-white uppercase text-center leading-tight">{nextMatch.away_team}</span>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    const RelatedNewsWidget = ({ sidebar = false }: { sidebar?: boolean }) => (relatedNews && relatedNews.length > 0) ? (
        <section className={`mt-8 ${sidebar ? 'pt-0' : 'pt-6 mb-8'} px-0`}>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#d4af37] to-[#d4af37]/20 rounded-full" />
                <h3 className="text-[12px] font-[800] text-zinc-500 uppercase tracking-[0.12em]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {sidebar ? 'Mais Notícias' : 'Veja Também'}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent" />
            </div>
            <div className="space-y-3">
                {relatedNews.map((item: any) => (
                    <CompactNewsRow key={item.id} article={item} />
                ))}
            </div>
        </section>
    ) : null;

    return (
        <div className="w-full min-h-screen bg-[#111] font-sans selection:bg-[#d4af37]/30 selection:text-black">
            {/* HERO IMAGE — Full-bleed */}
            <div className="fixed top-0 left-0 w-full h-[60vh] z-0">
                <Image
                    src={getSafeImageSrc(article.image)}
                    alt={article.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    unoptimized
                />
                
                {/* Floating Navigation Buttons */}
                <div className="absolute top-10 left-0 right-0 px-5 flex justify-between items-center z-10">
                    <Link
                        href="/"
                        className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/60 transition-colors"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleShare}
                            className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/60 transition-colors"
                        >
                            <Share2 size={20} strokeWidth={2.5} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/60 transition-colors">
                            <MoreHorizontal size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* WHITE CARD CONTENT */}
            <div className="relative z-30 mt-[45vh] bg-white rounded-t-[32px] min-h-screen shadow-2xl">
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 md:px-10 pt-4 pb-24 text-zinc-900">
                    
                    {/* Header inside card */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <h1
                            className="text-zinc-900 text-[26px] md:text-[40px] font-medium leading-[1.2] mb-6 px-2"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                            {toSentenceCase(article.title)}
                        </h1>

                        <div className="flex items-center gap-4 text-[13px] font-medium text-zinc-400">
                            <span className="flex items-center gap-1">
                                <span>🔥</span> Trending No.1
                            </span>
                            <span>{timeAgoVerbose(article.created_at) || timeAgo(article.created_at)}</span>
                        </div>
                    </div>

                    {/* Article Body */}
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
                            <>
                                <ArticleReader
                                    paragraphs={paragraphs}
                                    isPremium={false}
                                    activeParagraphIndex={activeParagraphIndex}
                                />
                            </>
                        )}
                    </article>

                    {/* Action Bar at the bottom */}
                    <div className="flex items-center justify-between mt-10 py-5 border-t border-zinc-200">
                        <LikeDislikeButtons
                            articleId={article.id}
                            initialLikes={article.likes_count}
                            initialDislikes={article.dislikes_count}
                            variant="full"
                            onLike={handleLikePoints}
                            showPoints={true}
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowVoice(!showVoice)}
                                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${showVoice
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                title="Ouvir"
                            >
                                <Volume2 size={18} />
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                                title="Compartilhar"
                            >
                                <Share2 size={18} />
                            </button>

                            {/* Font size controls */}
                            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-full overflow-hidden ml-2">
                                <button onClick={() => adjustFont(-10)} className="px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                                    <Minus size={14} />
                                </button>
                                <span className="text-[10px] font-bold text-zinc-600 px-1">{fontSize}%</span>
                                <button onClick={() => adjustFont(10)} className="px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <NextMatchWidget />
                    <RelatedNewsWidget />
                </div>
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
