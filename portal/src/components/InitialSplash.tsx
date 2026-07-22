"use client";

import { useEffect, useState } from "react";
import GloriosoLogo from "./GloriosoLogo";

export default function InitialSplash() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = window.setTimeout(() => setFadeOut(true), 900);
        const timer2 = window.setTimeout(() => setVisible(false), 1400);
        return () => {
            window.clearTimeout(timer1);
            window.clearTimeout(timer2);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 font-sans transition-all duration-500 ease-out ${fadeOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'}`}
            role="status"
            aria-live="polite"
        >
            {/* Ambient Background Aura */}
            <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />

            {/* Central Badge Container */}
            <div className="relative flex flex-col items-center gap-5 z-10">
                <div className="relative p-4 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
                    <GloriosoLogo size={88} />
                </div>

                {/* Brand Title */}
                <div className="flex flex-col items-center text-center space-y-1">
                    <div className="flex items-center gap-1.5">
                        <span className="font-black text-2xl tracking-tight text-zinc-900 dark:text-white uppercase font-sans">
                            FOGÃO
                        </span>
                        <span className="font-black text-2xl tracking-tight text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 font-sans">
                            360
                        </span>
                    </div>
                    <span className="text-[10px] font-extrabold tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase">
                        O PORTAL DO BOTAFOGO
                    </span>
                </div>

                {/* Shimmer Loading Bar */}
                <div className="w-36 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-3 relative">
                    <div className="absolute inset-y-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full w-1/2 animate-shimmer" />
                </div>
            </div>

            <span className="sr-only">Carregando o aplicativo Fogão 360</span>
        </div>
    );
}

