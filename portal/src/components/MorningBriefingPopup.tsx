"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import StoryContainer from './StoryContainer';
import StorySlide from './StorySlide';
import { Trophy, Target, TrendingUp, Calendar, Zap } from 'lucide-react';

interface DailyBriefing {
    date: string;
    editorial_summary?: string;
    general_summary?: string;
    edition?: string;
    generated_at_formatted?: string;
    indicators?: {
        next_match?: string;
        location?: string;
        market?: string;
    };
    top_stories?: any[];
}

export default function MorningBriefingPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const check = async () => {
            const force = searchParams.get('briefing') === 'true';

            // If already seen today (and not forced), skip
            const seenKey = `briefing_seen_${new Date().toLocaleDateString('en-CA')}`;
            if (!force && localStorage.getItem(seenKey)) return;

            try {
                const res = await fetch('/api/daily-briefing');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setBriefing(data);
                        if (force) setIsVisible(true);
                        // Auto-show logic can be added here if desired for first visit
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        check();
    }, [searchParams]);

    const handleClose = () => {
        setIsVisible(false);
        const seenKey = `briefing_seen_${new Date().toLocaleDateString('en-CA')}`;
        localStorage.setItem(seenKey, 'true');
        if (searchParams.get('briefing') === 'true') {
            router.replace(pathname, { scroll: false });
        }
    };

    if (!isVisible || !briefing) return null;

    // Helper to extract time or use edition
    const getBriefingTime = () => {
        if (briefing.generated_at_formatted) {
            // content is "dd/mm às HH:MM" -> split to get HH:MM
            const parts = briefing.generated_at_formatted.split('às');
            if (parts.length > 1) return parts[1].trim();
        }
        return briefing.edition || '24h';
    };

    // Define Slides
    const slides = [
        // 1. Cover Slide
        {
            type: 'cover',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-20 h-20 bg-premium-gold/20 rounded-full flex items-center justify-center animate-pulse">
                        <Zap size={40} className="text-premium-gold" />
                    </div>
                    <div>
                        <h2 className="text-[37px] font-black text-white uppercase tracking-tighter mb-2">
                            Resumo<br /><span className="text-premium-gold">Das {getBriefingTime()}</span>
                        </h2>
                        <p className="text-zinc-400 font-medium">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>
            )
        },
        // 2. Editorial Summary
        {
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center">
                    <h3 className="text-[21px] font-bold text-premium-gold mb-6 uppercase tracking-wide border-l-4 border-premium-gold pl-4">
                        Destaques
                    </h3>
                    <p className="text-[19px] text-white/90 leading-relaxed font-medium">
                        {briefing.editorial_summary || briefing.general_summary}
                    </p>
                </div>
            )
        },
        // 3. Top Stories Slide
        ...(briefing.top_stories && briefing.top_stories.length > 0 ? [{
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center space-y-6">
                    <h3 className="text-[21px] font-bold text-white mb-2 uppercase tracking-wide">
                        Manchetes
                    </h3>
                    <div className="space-y-4">
                        {briefing.top_stories.slice(0, 3).map((story, i) => (
                            <div key={i} className="bg-zinc-800/40 p-4 rounded-xl border-l-2 border-premium-gold/50">
                                <span className="text-[11px] font-bold text-premium-gold uppercase tracking-wider mb-1 block">
                                    {story.category || 'Notícia'}
                                </span>
                                <p className="text-[15px] font-medium text-white line-clamp-2 leading-snug">
                                    {story.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }] : []),
        // 4. Indicators (if available)
        ...(briefing.indicators ? [{
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center space-y-8">
                    <h3 className="text-[21px] font-bold text-white mb-2 uppercase tracking-wide">
                        Giro Rápido
                    </h3>

                    {briefing.indicators.next_match && (
                        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2 text-premium-gold">
                                <Trophy size={24} />
                                <span className="font-bold uppercase text-[15px]">Próximo Jogo</span>
                            </div>
                            <p className="text-[21px] text-white font-bold">{briefing.indicators.next_match}</p>
                        </div>
                    )}

                    {briefing.indicators.location && (
                        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2 text-blue-400">
                                <Target size={24} />
                                <span className="font-bold uppercase text-[15px]">Local</span>
                            </div>
                            <p className="text-[21px] text-white font-bold">{briefing.indicators.location}</p>
                        </div>
                    )}
                </div>
            )
        }] : []),
        // 4. CTA / End
        {
            type: 'content',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                    <div className="w-16 h-16 bg-premium-gold rounded-full flex items-center justify-center">
                        <Calendar size={32} className="text-black" />
                    </div>
                    <h2 className="text-[31px] font-bold text-white">
                        Você está<br />atualizado!
                    </h2>
                    <button
                        onClick={handleClose}
                        className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-full hover:scale-105 transition-transform pointer-events-auto relative z-30"
                    >
                        Voltar ao Portal
                    </button>
                </div>
            )
        }
    ];

    return (
        <StoryContainer
            currentIndex={currentSlide}
            totalSlides={slides.length}
            onNext={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            onPrev={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            onClose={handleClose}
        >
            {slides.map((slide, idx) => (
                <StorySlide
                    key={idx}
                    isActive={currentSlide === idx}
                    type={slide.type as any}
                >
                    {slide.content}
                </StorySlide>
            ))}
        </StoryContainer>
    );
}
