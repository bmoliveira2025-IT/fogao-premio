"use client";

import { useEffect, useState, ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryContainerProps {
    children: ReactNode;
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
    autoAdvanceDuration?: number; // ms
    backgroundImage?: string;
}

export default function StoryContainer({
    children,
    currentIndex,
    totalSlides,
    onNext,
    onPrev,
    onClose,
    autoAdvanceDuration = 5000,
    backgroundImage
}: StoryContainerProps) {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setProgress(0);
    }, [currentIndex]);

    useEffect(() => {
        if (isPaused) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / autoAdvanceDuration) * 100, 100);

            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(interval);
                onNext();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, onNext, autoAdvanceDuration]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
            {/* Mobile/Desktop Responsive Container */}
            <div className="relative w-full h-[100dvh] md:h-[85vh] md:max-h-[800px] rounded-none md:rounded-3xl overflow-hidden shadow-2xl border-0 md:border border-white/10 bg-black/40 backdrop-blur-xl">

                {/* Background Image Layer */}
                {backgroundImage && (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />
                    </>
                )}

                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5 h-1">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <div key={idx} className="flex-1 bg-white/10 rounded-full h-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{
                                    width: idx < currentIndex ? '100%' :
                                        idx === currentIndex ? `${progress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Close Button - Safe Area & High Z-Index */}
                <button
                    onClick={onClose}
                    className="absolute top-20 right-6 z-[120] p-3 text-white/80 hover:text-white pointer-events-auto bg-black/40 rounded-full backdrop-blur-sm transition-all hover:bg-black/60"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                >
                    <X size={24} />
                </button>

                {/* Content - Interactive for scrolling (z-40) */}
                <div className="relative h-full w-full pointer-events-auto z-40">
                    {children}
                </div>

                {/* Navigation Touch Zones - Edges Only (z-50) */}
                <div className="absolute inset-0 pointer-events-none z-50">
                    {/* Left Zone (Prev) */}
                    <div
                        className="absolute top-0 left-0 bottom-0 w-[15%] cursor-pointer pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        aria-label="Previous Slide Helper"
                    />

                    {/* Right Zone (Next) */}
                    <div
                        className="absolute top-0 right-0 bottom-0 w-[15%] cursor-pointer pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        aria-label="Next Slide Helper"
                    />
                </div>

                {/* Bottom Controls - Super Compact & Floating Higher */}
                <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-[110] flex justify-center items-center gap-6 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/70 transition-all active:scale-90 border border-white/10 shadow-lg pointer-events-auto"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                        className="w-12 h-12 rounded-full bg-premium-gold text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_4_15px_rgba(255,215,0,0.3)] border border-white/20 pointer-events-auto"
                        aria-label={isPaused ? "Play" : "Pause"}
                    >
                        {isPaused ? (
                            <Play size={20} className="ml-0.5 fill-black" />
                        ) : (
                            <Pause size={20} className="fill-black" />
                        )}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/70 transition-all active:scale-90 border border-white/10 shadow-lg pointer-events-auto"
                        aria-label="Próximo"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
