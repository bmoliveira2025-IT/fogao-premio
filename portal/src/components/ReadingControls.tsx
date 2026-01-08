"use client";
import React, { useState } from 'react';
import { Type, Moon, Sun, Minus, Plus } from 'lucide-react';

export default function ReadingControls() {
    const [fontSize, setFontSize] = useState(100);
    const [isHighContrast, setIsHighContrast] = useState(false);

    const toggleContrast = () => {
        document.documentElement.classList.toggle('high-contrast');
        setIsHighContrast(!isHighContrast);
    };

    const adjustFont = (delta: number) => {
        const newSize = Math.min(Math.max(fontSize + delta, 80), 150);
        setFontSize(newSize);
        document.documentElement.style.setProperty('--font-scale', `${newSize / 100}`);
    };

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 bg-[#121212]/90 backdrop-blur p-2 rounded-full border border-premium-gold/15">
            <button onClick={toggleContrast} className="p-2 text-white/60 hover:text-premium-gold transition-colors">
                {isHighContrast ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-full h-px bg-premium-gold/20" />
            <button onClick={() => adjustFont(10)} className="p-2 text-white/60 hover:text-white transition-colors">
                <Plus size={18} />
            </button>
            <button onClick={() => adjustFont(-10)} className="p-2 text-white/60 hover:text-white transition-colors">
                <Minus size={18} />
            </button>
        </div>
    );
}
