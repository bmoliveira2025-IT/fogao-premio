"use client";

import { useEffect, useState, ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryContainerProps {
    children: ReactNode;
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
    autoAdvanceDuration?: number; // ms
}

export default function StoryContainer({
    children,
    currentIndex,
    totalSlides,
    onNext,
    onPrev,
    onClose,
    autoAdvanceDuration = 5000
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
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            {/* Mobile/Desktop Responsive Container */}
            <div className="relative w-full h-full md:max-w-md md:h-[90vh] md:max-h-[800px] md:rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl">

                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5 h-1">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <div key={idx} className="flex-1 bg-white/20 rounded-full h-full overflow-hidden">
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
                    className="absolute top-12 right-4 z-50 p-3 text-white/80 hover:text-white pointer-events-auto bg-black/20 rounded-full backdrop-blur-sm"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                >
                    <X size={24} />
                </button>

                {/* Navigation Touch Areas */}
                <div
                    className="absolute inset-0 z-10 grid grid-cols-2"
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                >
                    <div onClick={(e) => { e.stopPropagation(); onPrev(); }} className="h-full w-full" />
                    <div onClick={(e) => { e.stopPropagation(); onNext(); }} className="h-full w-full" />
                </div>

                {/* Content */}
                <div className="relative h-full w-full pointer-events-none">
                    {children}
                </div>

            </div>
        </div>
    );
}
