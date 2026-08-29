"use client";

import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const THEME_HINT_KEY = 'theme_toggle_hint_seen';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const containerRef = useRef<HTMLSpanElement>(null);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container || container.getClientRects().length === 0) return;

            try {
                if (localStorage.getItem(THEME_HINT_KEY)) return;
                localStorage.setItem(THEME_HINT_KEY, 'true');
            } catch {
                // The hint can still be shown when storage is unavailable.
            }

            setShowHint(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!showHint) return;
        const timer = window.setTimeout(() => setShowHint(false), 7000);
        return () => window.clearTimeout(timer);
    }, [showHint]);

    return (
      <span ref={containerRef} className="relative inline-flex">
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            aria-pressed={isDark}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
            className={`theme-toggle relative flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-1 shadow-inner transition-all dark:border-zinc-700 dark:bg-zinc-800 ${compact ? 'h-9 w-[58px]' : 'h-10 w-[64px]'}`}
        >
            <span
                className={`theme-toggle-thumb absolute flex items-center justify-center rounded-full border border-transparent bg-white text-zinc-700 shadow-sm transition-transform duration-300 dark:bg-zinc-950 dark:text-amber-300 ${compact ? 'h-7 w-7' : 'h-8 w-8'} ${isDark ? (compact ? 'translate-x-[21px]' : 'translate-x-6') : 'translate-x-0'}`}
            >
                {isDark ? <Moon size={compact ? 16 : 18} fill="currentColor" /> : <Sun size={compact ? 16 : 18} />}
            </span>
        </button>
        {showHint && (
            <span
                role="status"
                className="theme-toggle-hint absolute right-0 top-[calc(100%+10px)] z-[70] w-56 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-left text-xs font-medium leading-relaxed text-zinc-700 shadow-xl"
            >
                Use este botão para alternar entre os temas claro e escuro.
                <span className="theme-toggle-hint-arrow absolute -top-1.5 right-5 h-3 w-3 rotate-45 border-l border-t border-zinc-200 bg-white" aria-hidden="true" />
            </span>
        )}
      </span>
    );
}
