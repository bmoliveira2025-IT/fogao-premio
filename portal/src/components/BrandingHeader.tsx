'use client';

import { Bell, Settings, X, Calendar, Star } from 'lucide-react';
import Link from 'next/link';
import GloriosoLogo from '@/components/GloriosoLogo';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface NotificationItem {
    id: string;
    type: 'MATCH' | 'PREMIUM';
    title: string;
    message: string;
    timestamp: string;
    link?: string;
}

const EMPTY_NOTIFICATIONS: NotificationItem[] = [];

export default function BrandingHeader({ notifications = EMPTY_NOTIFICATIONS }: { notifications?: NotificationItem[] }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        // Load read history from localStorage
        const readHistoryJSON = localStorage.getItem('read_notifications_v1');
        const readHistory: { [key: string]: number } = readHistoryJSON ? JSON.parse(readHistoryJSON) : {};
        const now = Date.now();
        const twelveHoursCheck = 12 * 60 * 60 * 1000;

        // Filter valid notifications (recent) and check if read
        let hasUnread = false;

        const validList = notifications.filter(n => {
            // Basic validity check, server already sends recent stuff mostly
            return true;
        });

        // Determine badge state
        const unreadCount = validList.filter(n => {
            const readTime = readHistory[n.id];
            // If never read, or read more than 12h ago (shouldn't happen technically given server filters recent, but logic holds)
            // Actually spec says: leaves in history for 12h.
            // Badge logic: disappears when opened.
            // So if NOT in history, it's new.
            return !readTime;
        }).length;

        if (unreadCount > 0) {
            setHasNew(true);
        }

        // Available for display: All passed from server essentially, 
        // but we might want to hide "old" MATCH notifications if we wanted, 
        // but the server logic `isMatchDay` handles that.
        setVisibleNotifications(validList);

    }, [notifications]);

    const handleOpenNotifications = () => {
        if (!showNotifications) {
            setShowNotifications(true);
            setHasNew(false); // Clear badge immediately on open

            // Mark all as read in localStorage with timestamp
            const readHistoryJSON = localStorage.getItem('read_notifications_v1');
            const readHistory: { [key: string]: number } = readHistoryJSON ? JSON.parse(readHistoryJSON) : {};
            const now = Date.now();

            visibleNotifications.forEach(n => {
                if (!readHistory[n.id]) {
                    readHistory[n.id] = now;
                }
            });

            // Clean up old history (> 24h just to keep it clean)
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

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-premium-gold/10 h-16 transition-all duration-300 shadow-2xl">
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
                                    className="absolute top-10 right-0 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Notificações</span>
                                        <button onClick={() => setShowNotifications(false)} className="text-white/50 hover:text-white"><X size={14} /></button>
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto">
                                        {visibleNotifications.length > 0 ? (
                                            visibleNotifications.map((notif) => (
                                                <Link
                                                    href={notif.link || '#'}
                                                    key={notif.id}
                                                    onClick={() => notif.link && setShowNotifications(false)}
                                                    className={`block p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.link ? 'cursor-default' : ''}`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'MATCH' ? 'bg-green-600/20 text-green-500' : 'bg-premium-gold/20 text-premium-gold'}`}>
                                                            {notif.type === 'MATCH' ? <Calendar size={14} /> : <Star size={14} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white mb-1 leading-tight">{notif.title}</h4>
                                                            <p className="text-[10px] text-white/60 leading-relaxed">{notif.message}</p>
                                                            <span className="text-[9px] text-white/30 mt-2 block">{new Date(notif.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-xs text-white/30">Nenhuma notificação recente.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <Link href="/profile">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center cursor-pointer hover:border-premium-gold/50 transition-colors group">
                            <Settings size={18} className="text-white/80 group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
