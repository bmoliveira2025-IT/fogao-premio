"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Share2, Bookmark, Volume2, Clock } from 'lucide-react';
import TabBar from '@/components/TabBar';
import ArticleReader from '@/components/ArticleReader';
import VoicePlayer from '@/components/VoicePlayer';
import ShareModal from '@/components/ShareModal';
import { AnimatePresence } from 'framer-motion';

import CompactNewsRow from './CompactNewsRow';
import QuoteBanner from './QuoteBanner';
import PremiumGuard from './PremiumGuard';
import DesktopHeader from '@/components/DesktopHeader';

export default function ArticleView({ article, nextMatch, relatedNews = [] }: { article: any, nextMatch: any, relatedNews?: any[] }) {
    // ... (rest of component)

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

        // Clean summary for sharing
        let shareText = article.title;
        if (article.summary) {
            const summaryStr = Array.isArray(article.summary) ? article.summary.join('. ') : article.summary;
            // Truncate if too long (some apps fail with long text)
            shareText = summaryStr.length > 500 ? summaryStr.substring(0, 497) + '...' : summaryStr;
        }

        const shareData = {
            title: article.title,
            text: shareText,
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
                            <img src={nextMatch.home_team_logo || 'https://via.placeholder.com/40'} alt={nextMatch.home_team} className="w-full h-full object-contain" />
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
                            <img src={nextMatch.away_team_logo || 'https://via.placeholder.com/40'} alt={nextMatch.away_team} className="w-full h-full object-contain" />
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
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-premium-gold selection:text-black pb-32 transition-colors duration-300">

            {/* 1. EDITORIAL HEADER (MOBILE ONLY) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-premium-gold/15 h-14 flex items-center justify-between px-4 transition-all duration-300 shadow-sm">
                <Link href="/" className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[10px] font-black text-premium-gold tracking-[0.2em] uppercase drop-shadow-md">Fogão Prêmio</span>
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setShowVoice(!showVoice)}
                        className={`p-2 transition-colors ${showVoice ? 'text-premium-gold' : 'text-white/70 hover:text-premium-gold'}`}
                    >
                        <Volume2 size={20} />
                    </button>
                    <button className="p-2 text-white/70 hover:text-premium-gold transition-colors">
                        <Bookmark size={20} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </header>

            {/* DESKTOP HEADER */}
            {/* DESKTOP HEADER */}
            <DesktopHeader />


            {/* Spacer */}
            <div className="h-14 lg:h-24"></div>

            <div className="lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-8">

                {/* LEFT COLUMN (Main Content) */}
                <div className="lg:col-span-8">

                    {/* 2. FEATURED IMAGE */}
                    <div className="w-full aspect-[4/3] md:h-96 lg:h-[500px] lg:aspect-auto relative overflow-hidden lg:rounded-2xl shadow-xl">
                        <img
                            src={article.image || 'https://via.placeholder.com/800x600'}
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

                            <div className="flex items-center text-[11px] lg:text-xs text-foreground/60 font-medium space-x-2 tracking-wide">
                                <span className="text-premium-gold uppercase font-bold">{article.source || 'Botafogo'}</span>
                                <span>•</span>
                                <span>Por Redação</span>
                                <span>•</span>
                                <span>{timeString}</span>
                                <span>•</span>
                                <span>3 min de leitura</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-8"></div>

                        {/* Body Text (Protected by PremiumGuard if needed) */}
                        {article.is_premium ? (
                            <PremiumGuard>
                                <ArticleReader
                                    paragraphs={paragraphs}
                                    isPremium={article.is_premium || article.title.includes('Análise') || paragraphs.length > 5}
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

            <div className="lg:hidden">
                <TabBar />
            </div>
        </main >
    );
}
