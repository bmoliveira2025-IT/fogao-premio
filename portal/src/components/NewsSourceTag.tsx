"use client";

import { Clock } from 'lucide-react';
import SourceIcon from './SourceIcon';

interface NewsSourceTagProps {
    source?: string;
    timestamp?: string;
    variant?: 'default' | 'compact';
    className?: string;
}

function getRelativeTime(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
}

export default function NewsSourceTag({
    source = 'FOGÃO PRÊMIO',
    timestamp,
    variant = 'default',
    className = ''
}: NewsSourceTagProps) {

    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-2 text-xs ${className}`}>
                <div className="flex items-center gap-1.5 text-premium-gold dark:text-premium-gold light:text-zinc-600">
                    <SourceIcon source={source} className="w-3 h-3" />
                    <span className="font-bold uppercase tracking-wide">{source}</span>
                </div>
                {timestamp && (
                    <>
                        <span className="text-zinc-400 dark:text-zinc-500">•</span>
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium" suppressHydrationWarning>
                            {getRelativeTime(timestamp)}
                        </span>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 flex-wrap ${className}`}>
            <div className="flex items-center gap-2 bg-white/90 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/20 shadow-sm">
                <SourceIcon source={source} className="w-3.5 h-3.5 text-premium-gold dark:text-premium-gold light:text-zinc-400" />
                <span className="text-[10px] md:text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">
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
