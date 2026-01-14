'use client';

import { Bell, Settings, X, Calendar, Star, FileText, Sunrise, Moon, Check } from 'lucide-react';
import Link from 'next/link';
import GloriosoLogo from '@/components/GloriosoLogo';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

export default function BrandingHeader({ notifications = EMPTY_NOTIFICATIONS }: { notifications?: NotificationItem[] }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);
    const [briefingNotifications, setBriefingNotifications] = useState<BriefingNotification[]>([]);

    useEffect(() => {
        // Load read history from localStorage
        const readHistoryJSON = localStorage.getItem('read_notifications_v1');
        const readHistory: { [key: string]: number } = readHistoryJSON ? JSON.parse(readHistoryJSON) : {};

        // Get briefing notifications
        const briefings = getTodayBriefingNotifications();
        setBriefingNotifications(briefings);

        // Check for unread briefings
        const hasUnreadBriefing = briefings.some(b => !b.isRead);

        // Determine badge state for regular notifications
        const unreadCount = notifications.filter(n => {
            const readTime = readHistory[n.id];
            return !readTime;
        }).length;

        if (unreadCount > 0 || hasUnreadBriefing) {
            setHasNew(true);
        }

        setVisibleNotifications(notifications);
    }, [notifications]);

    const handleOpenNotifications = () => {
        if (!showNotifications) {
            setShowNotifications(true);
            setHasNew(false);

            // Mark regular notifications as read
            const readHistoryJSON = localStorage.getItem('read_notifications_v1');
            const readHistory: { [key: string]: number } = readHistoryJSON ? JSON.parse(readHistoryJSON) : {};
            const now = Date.now();

            visibleNotifications.forEach(n => {
                if (!readHistory[n.id]) {
                    readHistory[n.id] = now;
                }
            });

            // Clean up old history (> 24h)
            Object.keys(readHistory).forEach(key => {
                if (now - readHistory[key] > 24 * 60 * 60 * 1000) {
                    delete readHistory[key];
                }
            });

            localStorage.setItem('read_notifications_v1', JSON.stringify(readHistory));
        } else {
            setShowNotifications(false);
        }
    };

    const handleBriefingClick = (briefing: BriefingNotification) => {
        // Mark as read
        const readHistory = JSON.parse(localStorage.getItem('read_notifications_v1') || '{}');
        readHistory[briefing.id] = Date.now();
        localStorage.setItem('read_notifications_v1', JSON.stringify(readHistory));

        // Update local state
        setBriefingNotifications(prev =>
            prev.map(b => b.id === briefing.id ? { ...b, isRead: true } : b)
        );

        setShowNotifications(false);
    };

    const formatBriefingDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-premium-gold/15 h-16 transition-all duration-300 shadow-2xl">
            <div className="md:max-w-2xl lg:max-w-4xl max-w-md mx-auto h-full flex items-center justify-between px-5">

                {/* Left: Branding (Logo + Text) */}
                <div className="flex items-center space-x-3">
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-premium-gold/20 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                        <GloriosoLogo size={42} className="relative z-10 drop-shadow-2xl" />
                    </div>

                    <div className="flex flex-col leading-none">
                        <h1 className="text-xl font-display font-black tracking-tight text-white leading-none">
                            GLORIOSO <span className="font-light italic text-premium-gold">360</span>
                        </h1>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-4 relative">
                    <button className="relative group" onClick={handleOpenNotifications}>
                        <Bell size={20} className="text-white/80 group-hover:text-white transition-colors" />
                        {hasNew && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-10 right-0 w-80 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Notificações</span>
                                        <button onClick={() => setShowNotifications(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={14} /></button>
                                    </div>

                                    <div className="max-h-[350px] overflow-y-auto">
                                        {/* Daily Briefing Notifications */}
                                        {briefingNotifications.length > 0 && (
                                            <div className="border-b border-zinc-800">
                                                <div className="px-4 py-2 bg-zinc-950/50">
                                                    <span className="text-[9px] font-bold text-premium-gold uppercase tracking-widest">Relatórios Diários</span>
                                                </div>
                                                {briefingNotifications.map((briefing) => (
                                                    <Link
                                                        key={briefing.id}
                                                        href="/?briefing=true"
                                                        onClick={() => handleBriefingClick(briefing)}
                                                        className={`block p-4 border-b border-zinc-800/50 transition-all ${briefing.isRead
                                                                ? 'bg-transparent hover:bg-white/5'
                                                                : 'bg-premium-gold/5 hover:bg-premium-gold/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${briefing.isRead
                                                                    ? 'bg-zinc-800'
                                                                    : 'bg-gradient-to-br from-premium-gold/20 to-transparent'
                                                                }`}>
                                                                {briefing.window === '07h'
                                                                    ? <Sunrise size={16} className={briefing.isRead ? 'text-zinc-600' : 'text-premium-gold'} />
                                                                    : <Moon size={16} className={briefing.isRead ? 'text-zinc-600' : 'text-premium-gold'} />
                                                                }
                                                                {briefing.isRead && (
                                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-600 rounded-full flex items-center justify-center">
                                                                        <Check size={8} className="text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className={`text-xs font-bold leading-tight ${briefing.isRead ? 'text-zinc-500' : 'text-white'}`}>
                                                                        Relatório das {briefing.window}
                                                                    </h4>
                                                                    {!briefing.isRead && (
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse" />
                                                                    )}
                                                                </div>
                                                                <p className={`text-[10px] leading-relaxed mt-0.5 ${briefing.isRead ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                                    {briefing.window === '07h'
                                                                        ? 'Resumo matinal com as principais notícias'
                                                                        : 'Resumo noturno com os destaques do dia'
                                                                    }
                                                                </p>
                                                                <span className={`text-[9px] mt-1.5 block ${briefing.isRead ? 'text-zinc-700' : 'text-zinc-500'}`}>
                                                                    {formatBriefingDate(briefing.date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Dynamic Notifications */}
                                        {visibleNotifications.length > 0 ? (
                                            visibleNotifications.map((notif) => (
                                                <Link
                                                    href={notif.link || '#'}
                                                    key={notif.id}
                                                    onClick={() => notif.link && setShowNotifications(false)}
                                                    className={`block p-4 border-b border-zinc-800/50 hover:bg-white/5 transition-colors ${!notif.link ? 'cursor-default' : ''}`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'MATCH' ? 'bg-emerald-900/30 text-emerald-500' :
                                                            notif.type === 'BRIEFING' ? 'bg-blue-900/30 text-blue-500' :
                                                                'bg-premium-gold/20 text-premium-gold'
                                                            }`}>
                                                            {notif.type === 'MATCH' ? <Calendar size={14} /> :
                                                                notif.type === 'BRIEFING' ? <FileText size={14} /> :
                                                                    <Star size={14} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white mb-1 leading-tight">{notif.title}</h4>
                                                            <p className="text-[10px] text-zinc-500 leading-relaxed">{notif.message}</p>
                                                            <span className="text-[9px] text-zinc-700 mt-2 block">{new Date(notif.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-xs text-zinc-700">Nenhuma outra notificação.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <Link href="/profile">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-zinc-800 flex items-center justify-center cursor-pointer hover:border-premium-gold/50 transition-colors group">
                            <Settings size={18} className="text-white/80 group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
