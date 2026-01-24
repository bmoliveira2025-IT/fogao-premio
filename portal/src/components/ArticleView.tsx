"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Share2, Bookmark, Volume2, Clock, Heart, Plus, Minus } from 'lucide-react';
import TabBar from '@/components/TabBar';
import ArticleReader from '@/components/ArticleReader';
import VoicePlayer from '@/components/VoicePlayer';
import ShareModal from '@/components/ShareModal';
import { AnimatePresence, motion } from 'framer-motion';

import CompactNewsRow from './CompactNewsRow';
import QuoteBanner from './QuoteBanner';
import PremiumGuard from './PremiumGuard';
import DesktopHeader from '@/components/DesktopHeader';
import { getSafeImageSrc } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';

export default function ArticleView({ article, nextMatch, relatedNews = [] }: { article: any, nextMatch: any, relatedNews?: any[] }) {
    const { addPoints } = useAuth();
    const [liked, setLiked] = useState(false);
    const [pointsAwarded, setPointsAwarded] = useState(false);
    const [fontSize, setFontSize] = useState(100);

    const adjustFont = (delta: number) => {
        if (typeof document === 'undefined') return;
        const newSize = Math.min(Math.max(fontSize + delta, 80), 200);
        setFontSize(newSize);
        document.documentElement.style.setProperty('--font-scale', `${newSize / 100}`);
    };

    useEffect(() => {
        // Check if already liked this article in this session/browser
        const hasLiked = localStorage.getItem(`liked_${article.id}`);
        if (hasLiked) {
            setLiked(true);
            setPointsAwarded(true);
        }
    }, [article.id]);

    const handleLike = async () => {
        if (liked) return;

        setLiked(true);
        localStorage.setItem(`liked_${article.id}`, 'true');

        if (!pointsAwarded) {
            await addPoints(5);
            setPointsAwarded(true);
        }
    };
    // ... rest of component

    const [showVoice, setShowVoice] = useState(false);

    const createdDate = new Date(article.created_at);
    // Format date properly in client
    const dateString = createdDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    // Calculate time diff
    const diffMs = Date.now() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const timeString = diffMins < 60 ? `há ${diffMins} min` : `há ${Math.floor(diffMins / 60)} horas`;

    const paragraphs = article.content?.split('\n') || [article.summary || "Conteúdo não disponível."];

    // Calculate offsets for reading
    const titleLength = article.title.length + 2; // + ". "
    const fullText = `${article.title}. ${paragraphs.join('. ')}`;

    const [readingCharIndex, setReadingCharIndex] = useState(-1);

    const getActiveParagraphIndex = (charIndex: number) => {
        if (charIndex === -1) return -1;
        if (charIndex < titleLength) return -2; // Title

        let currentOffset = titleLength;
        for (let i = 0; i < paragraphs.length; i++) {
            const pLength = paragraphs[i].length;
            // Check boundary
            if (charIndex >= currentOffset && charIndex < currentOffset + pLength + 2) {
                return i;
            }
            currentOffset += pLength + 2;
        }
        return -1;
    };

    const activeParagraphIndex = getActiveParagraphIndex(readingCharIndex);

    const [showShare, setShowShare] = useState(false);

    const handleShare = async () => {
        if (typeof window === 'undefined') return;

        const shareData = {
            title: article.title,
            text: "", // Empty text so only URL is shared (WhatsApp yields better preview)
            url: window.location.href,
        };

        // On mobile, try native share first
        if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
            // Check if we can share this data (if API supported)
            if (navigator.canShare && !navigator.canShare(shareData)) {
                // If native validation fails, fallback to modal
                setShowShare(true);
                return;
            }

            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // If user cancels or error (including AbortError), fall through to modal
                // Ideally we shouldn't show an error toast here if it's just a cancel,
                // but if it's a "processing error" from the browser, we interpret it as a failure.
                console.error("Share failed:", err);
            }
        }

        // Otherwise open premium modal
        setShowShare(true);
    };

    const NextMatchWidget = () => nextMatch ? (
        <div className="mt-8 mb-4 border border-premium-gold/15 rounded-xl bg-card overflow-hidden relative shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent"></div>

            <div className="p-4">
                <h4 className="text-[10px] text-premium-gold uppercase tracking-widest font-bold mb-4 italic">Próximo Confronto</h4>

                <div className="flex items-center justify-between">
                    {/* Home */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-10 h-10 mb-2 relative">
                            <img src={getSafeImageSrc(nextMatch.home_team_logo, 'https://placehold.co/80x80')} alt={nextMatch.home_team} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[10px] font-bold text-foreground uppercase text-center leading-tight">{nextMatch.home_team}</span>
                    </div>

                    {/* VS/Time */}
                    <div className="flex flex-col items-center justify-center w-1/3 space-y-1">
                        <span className="text-xs font-black text-foreground/20 italic">VS</span>
                        <span className="text-[10px] font-bold text-foreground/60 bg-foreground/5 px-2 py-0.5 rounded-full">
                            {new Date(nextMatch.date).toLocaleDateString('pt-BR', { weekday: 'short' })}, {new Date(nextMatch.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[9px] text-foreground/40 truncate max-w-full">{nextMatch.stadium}</span>
                    </div>

                    {/* Away */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-10 h-10 mb-2 relative">
                            <img src={getSafeImageSrc(nextMatch.away_team_logo, 'https://placehold.co/80x80')} alt={nextMatch.away_team} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[10px] font-bold text-foreground uppercase text-center leading-tight">{nextMatch.away_team}</span>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    const RelatedNewsWidget = ({ sidebar = false }: { sidebar?: boolean }) => (relatedNews && relatedNews.length > 0) ? (
        <section className={`mt-8 ${sidebar ? '' : 'pt-8 border-t border-premium-gold/15 mb-8'} px-0`}>
            <h3 className="text-sm font-black text-premium-gold uppercase tracking-widest mb-6 border-l-4 border-premium-gold pl-3">
                {sidebar ? 'Mais Notícias' : 'Veja Também'}
            </h3>
            <div className="space-y-3">
                {relatedNews.map((item: any) => (
                    <CompactNewsRow key={item.id} article={item} />
                ))}
            </div>
        </section>
    ) : null;

    return (
        <div className="w-full text-foreground font-sans selection:bg-premium-gold selection:text-black transition-colors duration-300">

            {/* 1. EDITORIAL HEADER (MOBILE ONLY) - REMOVED, NOW GLOBAL */}

            {/* Spacer - reduced because RootLayout already handles top spacer */}
            <div className="h-4 lg:h-12"></div>

            <div className="lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8">

                {/* LEFT COLUMN (Main Content) */}
                <div className="lg:col-span-8">

                    {/* 2. FEATURED IMAGE */}
                    <div className="w-full aspect-[4/3] md:h-96 lg:h-[500px] lg:aspect-auto relative overflow-hidden lg:rounded-2xl shadow-xl">
                        <img
                            src={getSafeImageSrc(article.image)}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                    </div>

                    {/* 3. EDITORIAL CONTENT */}
                    <article className="px-6 -mt-12 relative z-10 max-w-2xl mx-auto lg:mt-10 lg:px-0 lg:max-w-none">

                        {/* Title Block */}
                        <div className="mb-8">
                            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] mb-4 tracking-tight drop-shadow-lg transition-colors duration-300 ${activeParagraphIndex === -2 ? 'text-premium-gold' : 'text-foreground'}`}>
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[11px] lg:text-xs text-foreground/60 font-medium tracking-wide leading-none">
                                <span className="text-premium-gold uppercase font-black bg-premium-gold/10 px-2 py-1 rounded border border-premium-gold/20">{article.source || 'Botafogo'}</span>
                                <div className="flex items-center gap-2">
                                    <span>Por Redação</span>
                                    <span className="w-0.5 h-0.5 bg-foreground/30 rounded-full" />
                                    <span>{timeString}</span>
                                    <span className="w-0.5 h-0.5 bg-foreground/30 rounded-full" />
                                    <span>3 min de leitura</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <button
                                onClick={handleLike}
                                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all font-bold text-xs uppercase ${liked
                                    ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                title={liked ? 'Curtiu' : 'Curtir'}
                            >
                                <Heart size={16} className={liked ? 'fill-current' : ''} />
                                {!liked && <span className="text-[10px] bg-premium-gold/20 text-premium-gold px-1.5 py-0.5 rounded-full font-black animate-pulse">+5</span>}
                            </button>

                            <button
                                onClick={() => setShowVoice(!showVoice)}
                                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all font-bold text-xs uppercase ${showVoice
                                    ? 'bg-premium-gold/10 border-premium-gold/50 text-premium-gold'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <Volume2 size={16} />
                                <span>Ouvir</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 transition-all font-bold text-xs uppercase"
                                title="Compartilhar"
                            >
                                <Share2 size={16} />
                                <span>Compartilhar</span>
                            </button>

                            <div className="flex items-center bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/20">
                                <button
                                    onClick={() => adjustFont(-10)}
                                    className="px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/5 transition-all border-r border-white/5"
                                    title="Diminuir texto"
                                >
                                    <Minus size={16} />
                                </button>

                                <div className="px-2 flex items-center justify-center min-w-[45px]">
                                    <span className="text-[10px] font-black text-premium-gold/80 italic">{fontSize}%</span>
                                </div>

                                <button
                                    onClick={() => adjustFont(10)}
                                    className="px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/5 transition-all border-l border-white/5"
                                    title="Aumentar texto"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-premium-gold/20 to-transparent mb-8"></div>

                        {/* Body Text (Protected by PremiumGuard if needed) */}
                        {article.is_premium ? (
                            <PremiumGuard>
                                <ArticleReader
                                    paragraphs={paragraphs}
                                    isPremium={article.is_premium || article.title.includes('Análise')} // Removed length check
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
                    <div className="lg:hidden px-6 max-w-2xl mx-auto">
                        <RelatedNewsWidget />
                        <div className="h-32 lg:hidden" />
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
