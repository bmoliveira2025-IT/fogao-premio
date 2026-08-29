"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            aria-pressed={isDark}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
            className={`relative flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-1 shadow-inner transition-colors dark:border-zinc-700 dark:bg-zinc-800 ${compact ? 'h-9 w-[58px]' : 'h-10 w-[64px]'}`}
        >
            <span
                className={`absolute flex items-center justify-center rounded-full bg-white text-zinc-700 shadow-sm transition-transform duration-300 dark:bg-zinc-950 dark:text-amber-300 ${compact ? 'h-7 w-7' : 'h-8 w-8'} ${isDark ? (compact ? 'translate-x-[21px]' : 'translate-x-6') : 'translate-x-0'}`}
            >
                {isDark ? <Moon size={compact ? 16 : 18} fill="currentColor" /> : <Sun size={compact ? 16 : 18} />}
            </span>
        </button>
    );
}
