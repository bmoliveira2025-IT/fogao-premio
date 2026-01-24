"use client";
import React, { useState } from 'react';
import { Type, Moon, Sun, Minus, Plus } from 'lucide-react';

export default function ReadingControls({ onClose }: { onClose?: () => void }) {
    const [fontSize, setFontSize] = useState(100);
    const [isHighContrast, setIsHighContrast] = useState(false);

    const toggleContrast = () => {
        if (typeof document === 'undefined') return;
        document.documentElement.classList.toggle('high-contrast');
        setIsHighContrast(!isHighContrast);
    };

    const adjustFont = (delta: number) => {
        if (typeof document === 'undefined') return;
        const newSize = Math.min(Math.max(fontSize + delta, 80), 150);
        setFontSize(newSize);
        document.documentElement.style.setProperty('--font-scale', `${newSize / 100}`);
    };

    return (
        <div className="absolute bottom-full mb-3 right-0 z-50 flex flex-col gap-1.5 bg-zinc-900/98 backdrop-blur-xl p-2 rounded-2xl border border-premium-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[50px] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
                onClick={toggleContrast}
                className={`p-2 rounded-xl transition-all duration-300 ${isHighContrast ? 'bg-premium-gold text-black' : 'text-zinc-400 hover:text-premium-gold hover:bg-white/5'}`}
                title="Contraste"
            >
                {isHighContrast ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-full h-px bg-premium-gold/10 mx-auto w-4/5" />
            <button
                onClick={() => adjustFont(10)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Aumentar Texto"
            >
                <Plus size={18} />
            </button>
            <div className="flex items-center justify-center">
                <span className="text-[10px] font-black text-premium-gold/70">{fontSize}%</span>
            </div>
            <button
                onClick={() => adjustFont(-10)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Diminuir Texto"
            >
                <Minus size={18} />
            </button>
        </div>
    );
}
