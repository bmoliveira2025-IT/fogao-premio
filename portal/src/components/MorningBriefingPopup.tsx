"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import StoryContainer from './StoryContainer';
import StorySlide from './StorySlide';
import { Trophy, Target, TrendingUp, Calendar, Zap, Tv, Quote, Star, Activity, ArrowRight } from 'lucide-react';

interface DailyBriefing {
    date: string;
    editorial_summary?: string;
    general_summary?: string;
    edition?: string;
    generated_at_formatted?: string;
    indicators?: {
        next_match?: string;
        location?: string;
        transmission?: string;
        market?: string;
        dm?: string;
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
            const seenKey = `briefing_seen_${new Date().toLocaleDateString('en-CA')}`;
            if (!force && localStorage.getItem(seenKey)) return;

            try {
                const res = await fetch('/api/daily-briefing');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setBriefing(data);
                        if (force) setIsVisible(true);
                        // Auto-show only if not seen (could enable this later)
                        // for now, relying on notification click or manual trigger
                        if (!localStorage.getItem(seenKey)) {
                            // setIsVisible(true); // Uncomment to auto-show
                        }
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

    const getBriefingTime = () => {
        if (briefing.generated_at_formatted) {
            const parts = briefing.generated_at_formatted.split('às');
            if (parts.length > 1) return parts[1].trim();
        }
        return briefing.edition || 'Agora';
    };

    // Parser for the new editorial structure
    const parseEditorial = (text: string) => {
        if (!text) return null;

        // Split by double newlines first to get blocks
        const blocks = text.split('\n').filter(line => line.trim().length > 0);

        const abertura = blocks.find(b => b.includes('🎯'))?.replace('🎯', '').trim();
        const destaques = blocks.filter(b => b.includes('⭐') || b.includes('- ')).map(b => b.replace('⭐', '').replace('-', '').trim());
        const radar = blocks.find(b => b.includes('📊'))?.replace('📊', '').trim();

        // Fallback for old format (simple string)
        if (!abertura && destaques.length === 0 && !radar) {
            return (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                    <p className="text-lg text-white/90 leading-relaxed font-medium">{text}</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {abertura && (
                    <div className="bg-gradient-to-br from-premium-gold/20 to-transparent p-6 rounded-2xl border border-premium-gold/20 shadow-lg relative overflow-hidden">
                        <Quote className="absolute top-4 right-4 text-premium-gold/20 w-8 h-8" />
                        <h4 className="text-premium-gold font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                            Panorama
                        </h4>
                        <p className="text-lg text-white font-medium leading-relaxed italic">"{abertura}"</p>
                    </div>
                )}

                {destaques.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-white/60 font-bold uppercase text-xs tracking-wider ml-1 flex items-center gap-2">
                            <Star size={12} className="text-premium-gold" />
                            Destaques do Dia
                        </h4>
                        {destaques.map((d, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="min-w-1.5 h-1.5 rounded-full bg-premium-gold mt-2" />
                                <p className="text-white/90 text-[15px] font-medium leading-snug">{d}</p>
                            </div>
                        ))}
                    </div>
                )}

                {radar && (
                    <div className="bg-zinc-900/40 p-5 rounded-xl border-l-2 border-blue-400 flex items-start gap-4">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                            <Activity size={18} className="text-blue-400" />
                        </div>
                        <div>
                            <span className="text-blue-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Radar Rápido</span>
                            <p className="text-white/80 text-sm font-medium leading-snug">{radar}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const slides = [
        // 1. Cover
        {
            type: 'cover',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-premium-gold blur-2xl opacity-20 rounded-full" />
                        <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-black rounded-3xl border border-premium-gold/30 flex items-center justify-center shadow-2xl relative z-10 transform rotate-3">
                            <Zap size={48} className="text-premium-gold fill-premium-gold/20" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-premium-gold/10 border border-premium-gold/20 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-premium-gold uppercase tracking-wider">Edição {briefing.edition || 'Atual'}</span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Daily<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-yellow-200">Premium</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <span className="text-5xl font-light text-white/40">{getBriefingTime()}</span>
                        <p className="text-white/50 font-medium text-sm tracking-widest uppercase">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>
            )
        },
        // 2. Editorial
        {
            type: 'content',
            content: (
                <div className="flex flex-col h-full pt-8">
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide pb-32">
                        {parseEditorial(briefing.editorial_summary || briefing.general_summary || "")}
                    </div>
                </div>
            )
        },
        // 3. Top Stories
        ...(briefing.top_stories && briefing.top_stories.length > 0 ? [{
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Manchetes</h3>
                    </div>

                    <div className="space-y-4">
                        {briefing.top_stories.slice(0, 3).map((story, i) => (
                            <div key={i} className="group relative bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-premium-gold/50 transition-all active:scale-[0.98]">
                                <div className="absolute top-4 right-4 text-white/20 font-black text-4xl -z-10 group-hover:text-premium-gold/10 transition-colors">
                                    {i + 1}
                                </div>
                                <span className="inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider mb-2 border border-white/5">
                                    {story.category || 'Notícia'}
                                </span>
                                <h4 className="text-[17px] font-bold text-white leading-tight">
                                    {story.title}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }] : []),
        // 4. Indicators
        ...(briefing.indicators ? [{
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Target size={20} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Giro Rápido</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {briefing.indicators.next_match && (
                            <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 p-5 rounded-2xl border border-white/10 backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy size={16} className="text-premium-gold" />
                                    <span className="text-[11px] font-bold text-premium-gold uppercase tracking-wider">Próximo Duelo</span>
                                </div>
                                <p className="text-lg text-white font-bold leading-tight">{briefing.indicators.next_match}</p>
                                <div className="flex items-center gap-2 mt-2 text-white/50 text-xs font-medium">
                                    <span>{briefing.indicators.location}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {briefing.indicators.transmission && (
                                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tv size={14} className="text-green-400" />
                                        <span className="text-[10px] font-bold text-green-400 uppercase">Na TV</span>
                                    </div>
                                    <p className="text-sm text-white font-bold leading-tight">{briefing.indicators.transmission}</p>
                                </div>
                            )}
                            {briefing.indicators.market && (
                                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ArrowRight size={14} className="text-blue-400" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase">Mercado</span>
                                    </div>
                                    <p className="text-sm text-white font-bold leading-tight line-clamp-3">{briefing.indicators.market}</p>
                                </div>
                            )}
                        </div>

                        {briefing.indicators.dm && briefing.indicators.dm !== "Sem novidades" && (
                            <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 backdrop-blur-md">
                                <div className="flex items-center gap-2 mb-1">
                                    <Activity size={14} className="text-red-400" />
                                    <span className="text-[10px] font-bold text-red-400 uppercase">Departamento Médico</span>
                                </div>
                                <p className="text-sm text-white/90 font-medium leading-tight">{briefing.indicators.dm}</p>
                            </div>
                        )}
                    </div>
                </div>
            )
        }] : []),
        // 5. CTA
        {
            type: 'content',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 relative z-10">
                    <div className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transform rotate-6">
                        <Calendar size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white leading-tight mb-4">
                            Você está<br />100% atualizado!
                        </h2>
                        <p className="text-white/60 text-sm max-w-[200px] mx-auto">
                            Volte amanhã para mais resumos exclusivos do Fogão.
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-full py-4 bg-premium-gold text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg pointer-events-auto relative z-30"
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
            backgroundImage="/wallpapers/stadium.png"
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
