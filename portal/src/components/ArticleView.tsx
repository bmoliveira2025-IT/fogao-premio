"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Share2, Volume2, Clock, Plus, Minus, ArrowLeft } from 'lucide-react';
import ArticleReader from '@/components/ArticleReader';
import VoicePlayer from '@/components/VoicePlayer';
import ShareModal from '@/components/ShareModal';
import { AnimatePresence, motion } from 'framer-motion';
import CompactNewsRow from './CompactNewsRow';
import QuoteBanner from './QuoteBanner';
import PremiumGuard from './PremiumGuard';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import LikeDislikeButtons from './LikeDislikeButtons';
import SourceIcon from './SourceIcon';

const toSentenceCase = (str: string) => {
    if (!str) return '';
    const cleanStr = str.replace(/\*\*/g, '').trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};

function timeAgo(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) {
        const min = Math.floor(diffInSeconds / 60);
        return `há ${min} min`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `há ${hours}h`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `há ${days}d`;
}

function detectCategory(title: string): { label: string; color: string } | null {
    const t = title.toLowerCase();
    if (t.includes('transferência') || t.includes('contrat') || t.includes('reforço') || t.includes('negocia'))
        return { label: 'MERCADO', color: 'bg-emerald-500 text-white' };
    if (t.includes('análise') || t.includes('tática') || t.includes('desempenho'))
        return { label: 'ANÁLISE', color: 'bg-blue-500 text-white' };
    if (t.includes('lesão') || t.includes('lesionad'))
        return { label: 'MÉDICO', color: 'bg-red-500 text-white' };
    if (t.includes('gol') || t.includes('resultado') || t.includes('vitória') || t.includes('derrota'))
        return { label: 'RESULTADO', color: 'bg-amber-500 text-black' };
    if (t.includes('treino') || t.includes('preparação'))
        return { label: 'TREINO', color: 'bg-purple-500 text-white' };
    if (t.includes('entrevista') || t.includes('coletiva'))
        return { label: 'BASTIDORES', color: 'bg-cyan-500 text-white' };
    return null;
}

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
    const category = detectCategory(article.title || '');

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
                <h3 className="text-[12px] font-[800] text-white/70 uppercase tracking-[0.12em]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {sidebar ? 'Mais Notícias' : 'Veja Também'}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>
            <div className="space-y-3">
                {relatedNews.map((item: any) => (
                    <CompactNewsRow key={item.id} article={item} />
                ))}
            </div>
        </section>
    ) : null;

    return (
        <div className="w-full text-white font-sans selection:bg-[#d4af37]/30 selection:text-black">

            {/* Spacer */}
            <div className="h-2 lg:h-8" />

            <div className="lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8">

                {/* LEFT COLUMN (Main Content) */}
                <div className="lg:col-span-8">

                    {/* HERO IMAGE — Immersive, edge-to-edge on mobile */}
                    <div className="w-full aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:h-[480px] relative overflow-hidden lg:rounded-2xl">
                        <Image
                            src={getSafeImageSrc(article.image)}
                            alt={article.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover"
                            unoptimized
                        />
                        {/* Subtle gradient for visual closure */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                        {/* Back button (mobile) */}
                        <Link
                            href="/"
                            className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors lg:hidden"
                        >
                            <ArrowLeft size={18} strokeWidth={2.5} />
                        </Link>

                        {/* Category badge on image */}
                        {category && (
                            <div className="absolute top-4 right-4 z-30">
                                <span className={`${category.color} text-[9px] font-black tracking-[0.12em] px-2.5 py-1 rounded-[4px] shadow-lg`}>
                                    {category.label}
                                </span>
                            </div>
                        )}

                    </div>

                    {/* ARTICLE CONTENT */}
                    <article className="px-5 md:px-6 mt-4 relative z-10 max-w-[640px] mx-auto lg:mt-8 lg:px-0 lg:max-w-none">

                        {/* Title */}
                        <div className="mb-6">
                            <h1
                                className={`text-[22px] md:text-[28px] lg:text-[36px] font-[800] leading-[1.15] tracking-[-0.02em] mb-3 transition-colors duration-300
                                ${activeParagraphIndex === -2 ? 'text-[#d4af37]' : 'text-white'}`}
                                style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                                {toSentenceCase(article.title)}
                            </h1>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 font-medium">
                                {article.source && (
                                    <>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.06]">
                                            <SourceIcon source={article.source} className="w-3 h-3 text-zinc-400" />
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{article.source}</span>
                                        </div>
                                        <span className="w-[3px] h-[3px] bg-zinc-700 rounded-full" />
                                    </>
                                )}
                                <span>Por Redação</span>
                                <span className="w-[3px] h-[3px] bg-zinc-700 rounded-full" />
                                <span suppressHydrationWarning>{timeAgo(article.created_at)}</span>
                                <span className="w-[3px] h-[3px] bg-zinc-700 rounded-full" />
                                <span>{readTime} min de leitura</span>
                            </div>
                        </div>

                        {/* Action Bar — Compact and clean */}
                        <div className="flex items-center gap-2 mb-6 py-3 border-y border-white/[0.04]">
                            <LikeDislikeButtons
                                articleId={article.id}
                                initialLikes={article.likes_count}
                                initialDislikes={article.dislikes_count}
                                variant="full"
                                onLike={handleLikePoints}
                                showPoints={true}
                                className="flex-shrink-0"
                            />

                            <div className="flex items-center gap-1.5 ml-auto">
                                <button
                                    onClick={() => setShowVoice(!showVoice)}
                                    className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all ${showVoice
                                        ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37]'
                                        : 'bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/[0.12]'
                                        }`}
                                    title="Ouvir"
                                >
                                    <Volume2 size={15} />
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/[0.12] transition-all"
                                    title="Compartilhar"
                                >
                                    <Share2 size={15} />
                                </button>

                                {/* Font size controls */}
                                <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => adjustFont(-10)}
                                        className="px-2.5 py-2 text-zinc-500 hover:text-white transition-colors"
                                        title="Diminuir texto"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <div className="px-1.5 border-x border-white/[0.04]">
                                        <span className="text-[9px] font-bold text-zinc-600">{fontSize}%</span>
                                    </div>
                                    <button
                                        onClick={() => adjustFont(10)}
                                        className="px-2.5 py-2 text-zinc-500 hover:text-white transition-colors"
                                        title="Aumentar texto"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Article Body */}
                        {article.is_premium ? (
                            <PremiumGuard>
                                <ArticleReader
                                    paragraphs={paragraphs}
                                    isPremium={article.is_premium || article.title.includes('Análise')}
                                    activeParagraphIndex={activeParagraphIndex}
                                />
                                <QuoteBanner />
                            </PremiumGuard>
                        ) : (
                            <>
                                <ArticleReader
                                    paragraphs={paragraphs}
                                    isPremium={false}
                                    activeParagraphIndex={activeParagraphIndex}
                                />
                                <QuoteBanner />
                            </>
                        )}

                        {/* Mobile Only Widgets */}
                        <div className="lg:hidden">
                            <NextMatchWidget />
                        </div>
                    </article>

                    {/* Related News Mobile Only */}
                    <div className="lg:hidden px-5 max-w-[640px] mx-auto">
                        <RelatedNewsWidget />
                        <div className="h-28" />
                    </div>
                </div>

                {/* RIGHT COLUMN (Sidebar - Desktop Only) */}
                <div className="hidden lg:block lg:col-span-4 space-y-8">
                    <div className="sticky top-28 space-y-8">
                        <NextMatchWidget />
                        <RelatedNewsWidget sidebar />
                    </div>
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
