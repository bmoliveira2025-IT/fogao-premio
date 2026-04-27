"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface TickerItem {
    id: string;
    title: string;
}

export default function BreakingNewsTicker({ items }: { items: TickerItem[] }) {
    const [isVisible, setIsVisible] = useState(true);
    const tickerRef = useRef<HTMLDivElement>(null);

    if (!items || items.length === 0 || !isVisible) return null;

    // Duplicate items for seamless loop
    const tickerItems = [...items, ...items, ...items];

    return (
        <div className="relative w-full bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-b border-[#d4af37]/15 overflow-hidden">
            <div className="flex items-center h-9">
                {/* Scrolling Ticker */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                    <div
                        ref={tickerRef}
                        className="flex items-center gap-6 animate-ticker whitespace-nowrap"
                    >
                        {tickerItems.map((item, idx) => (
                            <Link
                                key={`${item.id}-${idx}`}
                                href={`/news/${item.id}`}
                                className="flex items-center gap-2 text-[12px] font-semibold text-zinc-300 hover:text-[#d4af37] transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <Zap size={10} className="text-[#d4af37] flex-shrink-0" />
                                <span className="truncate max-w-[300px]">{item.title?.replace(/\*\*/g, '')}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
