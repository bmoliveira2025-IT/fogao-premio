'use client';

import { Bell, Settings, X, Calendar, Star, FileText, Sunrise, Moon, Check, Crown } from 'lucide-react';
import Link from 'next/link';
import GloriosoLogo from '@/components/GloriosoLogo';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export interface NotificationItem {
    id: string;
    type: 'MATCH' | 'PREMIUM' | 'BRIEFING';
    title: string;
    message: string;
    timestamp: string;
    link?: string;
}

interface BriefingNotification {
    id: string;
    window: '07h' | '20h';
    date: string;
    isRead: boolean;
}

const EMPTY_NOTIFICATIONS: NotificationItem[] = [];

// Get today's briefing notifications
function getTodayBriefingNotifications(): BriefingNotification[] {
    const today = new Date().toLocaleDateString('en-CA');
    const hour = new Date().getHours();
    const readHistory = JSON.parse(localStorage.getItem('read_notifications_v1') || '{}');

    const notifications: BriefingNotification[] = [];

    // Morning briefing (available after 6h)
    if (hour >= 6) {
        const morningId = `briefing-${today}-07h`;
        notifications.push({
            id: morningId,
            window: '07h',
            date: today,
            isRead: !!readHistory[morningId]
        });
    }

    // Evening briefing (available after 19h)
    if (hour >= 19) {
        const eveningId = `briefing-${today}-20h`;
        notifications.push({
            id: eveningId,
            window: '20h',
            date: today,
            isRead: !!readHistory[eveningId]
        });
    }

    return notifications;
}

import { useAuth } from '@/context/AuthContext';

export default function BrandingHeader() {
    const [briefing, setBriefing] = useState<{ edition?: string, generated_at_formatted?: string } | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { isPremium } = useAuth(); // Import useAuth to check premium status

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                const res = await fetch('/api/daily-briefing');
                if (res.ok) {
                    const data = await res.json();
                    setBriefing(data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchBriefing();
    }, []);

    const getBriefingTime = () => {
        if (!briefing) return '';
        if (briefing.generated_at_formatted) {
            const parts = briefing.generated_at_formatted.split('às');
            if (parts.length > 1) return parts[1].trim();
        }
        return briefing.edition || '24h';
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-premium-gold/10 h-16 transition-all duration-300 shadow-lg shadow-black/50">
            <div className="md:max-w-2xl lg:max-w-4xl max-w-md mx-auto h-full flex items-center justify-between px-5">

                {/* Left: Branding (Logo + Text) */}
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-premium-gold/20 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                        <GloriosoLogo size={36} className="relative z-10 drop-shadow-2xl transition-transform group-hover:scale-105" />
                    </div>

                    <div className="flex flex-col leading-none">
                        <h1 className="text-[19px] font-display font-black tracking-tight text-white leading-none flex items-center gap-1.5">
                            GLORIOSO <span className="font-light italic text-premium-gold">360</span>
                            {isPremium && (
                                <Crown size={14} className="text-premium-gold fill-premium-gold/20 ml-0.5 self-start -mt-0.5" strokeWidth={2.5} />
                            )}
                        </h1>
                    </div>
                </Link>

                {/* Right: Actions */}
                <div className="flex items-center space-x-3">
                    {/* Compact Daily Briefing Trigger */}
                    {briefing && (
                        <button
                            onClick={() => router.push(pathname + '?briefing=true', { scroll: false })}
                            className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/50 border border-zinc-800 rounded-md hover:border-premium-gold/50 hover:bg-zinc-800/80 transition-all group"
                        >
                            <div className="w-1.5 h-1.5 bg-premium-gold rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-premium-gold transition-colors tracking-tight uppercase">
                                Resumo {getBriefingTime()}
                            </span>
                        </button>
                    )}

                    <Link href="/profile">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center cursor-pointer hover:border-premium-gold/50 transition-colors group">
                            <Settings size={16} className="text-zinc-500 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
