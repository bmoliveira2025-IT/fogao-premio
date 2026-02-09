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
    source = 'FOGÃO PRÊMIO',
    timestamp,
    variant = 'default',
    showText = true,
    className = ''
}: NewsSourceTagProps) {

    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-2 text-xs ${className}`}>
                <div className="flex items-center gap-2 text-premium-gold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    <SourceIcon source={source} className="w-3.5 h-3.5" />
                    {showText && <span className="font-athletic text-[11px] uppercase">{source}</span>}
                </div>
                {timestamp && (
                    <>
                        <span className="text-zinc-400 dark:text-zinc-500 flex-shrink-0">•</span>
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap flex-shrink-0" suppressHydrationWarning>
                            {getRelativeTime(timestamp)}
                        </span>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 flex-wrap ${className}`}>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                <SourceIcon source={source} className="w-4 h-4 text-premium-gold" />
                <span className="text-[12px] font-athletic text-white uppercase">
                    {source}
                </span>
            </div>

            {timestamp && (
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10">
                    <Clock size={14} className="text-zinc-500 dark:text-zinc-400" />
                    <span className="text-[10px] md:text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide" suppressHydrationWarning>
                        {getRelativeTime(timestamp)}
                    </span>
                </div>
            )}
        </div>
    );
}
