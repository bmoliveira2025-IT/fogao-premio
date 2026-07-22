"use client";

import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';

interface NewsSourceTagProps {
    source?: string;
    timestamp?: string;
    variant?: 'default' | 'compact';
    showText?: boolean;
    className?: string;
}

function getRelativeTime(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
}

export default function NewsSourceTag({
    source = 'Fogão 360',
    timestamp,
    variant = 'default',
    showText = true,
    className = ''
}: NewsSourceTagProps) {

    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-2 text-xs ${className}`}>
                <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
                    <SourceIcon source={source} className="w-3.5 h-3.5" />
                    {showText && (
                        <span className="text-[10px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                            {source}
                        </span>
                    )}
                </div>
                {timestamp && (
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap flex-shrink-0" suppressHydrationWarning>
                        {getRelativeTime(timestamp)}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2.5 flex-wrap ${className}`}>
            <div className="flex items-center gap-2 bg-zinc-100/90 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/15 shadow-sm">
                <SourceIcon source={source} className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">
                    {source}
                </span>
            </div>

            {timestamp && (
                <div className="flex items-center gap-1.5 bg-zinc-100/80 dark:bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-200/60 dark:border-white/10">
                    <Clock size={12} className="text-zinc-500 dark:text-zinc-400" />
                    <span className="text-[10px] md:text-xs font-semibold text-zinc-600 dark:text-zinc-300 tracking-wide" suppressHydrationWarning>
                        {getRelativeTime(timestamp)}
                    </span>
                </div>
            )}
        </div>
    );
}

