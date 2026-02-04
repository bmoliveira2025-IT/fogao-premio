"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import StoryContainer from './StoryContainer';
import StorySlide from './StorySlide';
import { Trophy, Target, TrendingUp, Calendar, Zap, Tv, Quote, Star, Activity, ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import GloriosoLogo from './GloriosoLogo';

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
                        // Data correction for today's match
                        if (data.indicators && data.indicators.next_match?.toLowerCase().includes('grêmio')) {
                            data.indicators.transmission = "TV Globo, Premiere";
                        }
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
            <div className="space-y-4">
                {abertura && (
                    <div className="bg-gradient-to-br from-premium-gold/20 to-transparent p-4 rounded-2xl border border-premium-gold/20 shadow-lg relative overflow-hidden">
                        <Quote className="absolute top-4 right-4 text-premium-gold/20 w-8 h-8" />
                        <h4 className="text-premium-gold font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                            Panorama
                        </h4>
                        <p className="text-[15px] text-white font-medium leading-relaxed italic">"{abertura}"</p>
                    </div>
                )}

                {destaques.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-white/60 font-bold uppercase text-xs tracking-wider ml-1 flex items-center gap-2">
                            <Star size={12} className="text-premium-gold" />
                            Destaques do Dia
                        </h4>
                        {destaques.map((d, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="min-w-1.5 h-1.5 rounded-full bg-premium-gold mt-2" />
                                <p className="text-white/90 text-sm font-medium leading-snug">{d}</p>
                            </div>
                        ))}
                    </div>
                )}

                {radar && (
                    <div className="bg-zinc-900/40 p-3 rounded-xl border-l-2 border-blue-400 flex items-start gap-4">
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
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 relative z-10 px-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-premium-gold blur-3xl opacity-20 rounded-full scale-150" />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg/1920px-Botafogo_de_Futebol_e_Regatas_logo.svg.png"
                            alt="Botafogo"
                            className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] relative z-10 transform -rotate-3 hover:scale-110 transition-transform duration-500"
                        />
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
                <div className="flex flex-col h-full px-6 pt-24">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {parseEditorial(briefing.editorial_summary || briefing.general_summary || "")}
                        {/* Explicit Spacer for scrolling past bottom controls */}
                        <div className="h-48 w-full shrink-0" />
                    </div>
                </div>
            )
        },
        // 3. Top Stories
        ...(briefing.top_stories && briefing.top_stories.length > 0 ? [{
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center space-y-8 px-6">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-8 bg-premium-gold/50" />
                            <span className="text-[10px] font-black text-premium-gold uppercase tracking-[0.3em]">Exclusivo</span>
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-none">
                            Principais<br />Manchetes
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {briefing.top_stories.slice(0, 3).map((story, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                                className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-premium-gold/30 transition-all duration-500 active:scale-[0.98] overflow-hidden"
                            >
                                {/* Number Indicator - Modern & Subtle */}
                                <div className="absolute -top-2 -right-2 text-white/5 font-black text-8xl transition-colors duration-500 group-hover:text-premium-gold/10">
                                    {i + 1}
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-premium-gold text-black uppercase tracking-wider">
                                            {story.category || 'Notícia'}
                                        </span>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>

                                    <h4 className="text-[18px] md:text-[20px] font-bold text-white leading-tight group-hover:text-premium-gold transition-colors duration-300">
                                        {story.title}
                                    </h4>

                                    <div className="mt-4 flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <span>Ler Agora</span>
                                        <ArrowRight size={10} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        }] : []),
        // 4. Indicators
        ...(briefing.indicators ? [{
            type: 'content',
            content: (
                <div className="flex flex-col h-full justify-center space-y-6 px-6">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-8 bg-blue-400/50" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Em Tempo Real</span>
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-none">
                            Giro<br />Rápido
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {briefing.indicators.next_match && (
                            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={48} className="text-premium-gold" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy size={14} className="text-premium-gold" />
                                        <span className="text-[10px] font-black text-premium-gold uppercase tracking-widest">Próxima Partida</span>
                                    </div>
                                    <p className="text-xl text-white font-black leading-tight mb-2">{briefing.indicators.next_match}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                            <MapPin size={10} className="text-white/40" />
                                            <span className="text-[10px] font-bold text-white/60">{briefing.indicators.location}</span>
                                        </div>
                                        {briefing.indicators.transmission && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                                                <Tv size={10} className="text-green-400" />
                                                <span className="text-[10px] font-bold text-green-400 uppercase">{briefing.indicators.transmission}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3">
                            {briefing.indicators.market && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 group"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                                            <ArrowRight size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Mercado</span>
                                    </div>
                                    <p className="text-[13px] text-white/90 font-bold leading-tight group-hover:text-blue-400 transition-colors">{briefing.indicators.market}</p>
                                </motion.div>
                            )}

                            {briefing.indicators.dm && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 group"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                                            <Activity size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">DM</span>
                                    </div>
                                    <p className="text-[13px] text-white/90 font-bold leading-tight group-hover:text-red-400 transition-colors">
                                        {briefing.indicators.dm === "Sem novidades" ? "Elenco completo à disposição." : briefing.indicators.dm}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }] : []),
        // 5. CTA
        {
            type: 'content',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-10 relative z-10 px-6">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-premium-gold blur-3xl opacity-20 rounded-full scale-150" />
                        <div className="w-32 h-32 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 flex items-center justify-center shadow-2xl relative z-10 p-6">
                            <CheckCircle size={64} className="text-premium-gold" />
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-black text-white leading-none uppercase tracking-tight"
                        >
                            Você está<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-yellow-200">100% Atualizado</span>
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/50 text-sm max-w-[240px] mx-auto font-medium"
                        >
                            O Giro do Fogão termina aqui.<br />Volte amanhã para uma nova edição exclusiva.
                        </motion.p>
                    </div>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={handleClose}
                        className="w-full py-5 bg-gradient-to-r from-premium-gold to-yellow-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,215,0,0.2)] pointer-events-auto relative z-30"
                    >
                        Voltar ao Portal
                    </motion.button>
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
            <AnimatePresence mode="wait">
                {slides.map((slide, idx) => idx === currentSlide && (
                    <StorySlide
                        key={idx}
                        isActive={currentSlide === idx}
                        type={slide.type as any}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full w-full"
                        >
                            {slide.content}
                        </motion.div>
                    </StorySlide>
                ))}
            </AnimatePresence>
        </StoryContainer>
    );
}
