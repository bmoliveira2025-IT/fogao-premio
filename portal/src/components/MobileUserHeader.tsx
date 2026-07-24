"use client";

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Loader2, Newspaper, Search, Sparkles, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { timeAgo } from '@/lib/news-utils';

interface AppNotification {
    id: string;
    title: string;
    dateStr: string;
    timestamp: number;
    type: string;
    read?: boolean;
}

const READ_RETENTION_MS = 24 * 60 * 60 * 1000;
const NOTIFICATION_RETENTION_MS = 72 * 60 * 60 * 1000;
const MAX_VISIBLE_NOTIFICATIONS = 10;

function HeaderBrand() {
    return (
        <div className="flex items-center gap-2">
            <svg
                aria-hidden="true"
                viewBox="0 0 44 52"
                className="h-10 w-[34px] shrink-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.16)]"
            >
                <path d="M22 1.5 41 7v16.2C41 36.4 32.7 46 22 50.5 11.3 46 3 36.4 3 23.2V7L22 1.5Z" fill="rgb(var(--premium-gold))" />
                <path d="M22 4.6 38 9.2v14C38 34.3 31.3 42.7 22 46.9 12.7 42.7 6 34.3 6 23.2v-14l16-4.6Z" fill="#111114" />
                <path d="m22 11.5 3.4 7 7.7 1.1-5.5 5.4 1.3 7.6-6.9-3.7-6.9 3.7 1.3-7.6-5.5-5.4 7.7-1.1 3.4-7Z" fill="#fff" />
            </svg>
            <div className="flex items-baseline gap-1 whitespace-nowrap leading-none">
                <span className="text-[21px] font-black tracking-[-0.055em] text-zinc-950">Fogão</span>
                <span className="text-[21px] font-black tracking-[-0.045em] text-premium-gold">360</span>
            </div>
        </div>
    );
}

function getStoredReadNotifications(): Record<string, number> {
    try {
        const stored = localStorage.getItem('read_notifications');
        if (!stored) return {};

        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            const migratedAt = Date.now();
            return Object.fromEntries(parsed.filter(id => typeof id === 'string').map(id => [id, migratedAt]));
        }

        if (parsed && typeof parsed === 'object') {
            return Object.fromEntries(
                Object.entries(parsed).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
            );
        }
    } catch {
        localStorage.removeItem('read_notifications');
    }

    return {};
}

function saveReadNotifications(readState: Record<string, number>) {
    localStorage.setItem('read_notifications', JSON.stringify(readState));
}

function getDismissedNotifications(): Record<string, number> {
    try {
        const stored = localStorage.getItem('dismissed_notifications');
        const parsed: unknown = stored ? JSON.parse(stored) : {};
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return Object.fromEntries(
                Object.entries(parsed).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
            );
        }
    } catch {
        localStorage.removeItem('dismissed_notifications');
    }
    return {};
}

export default function MobileUserHeader() {
    const { user, isPremium } = useAuth();
    const [greeting, setGreeting] = useState('Bom dia!');
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia!');
        else if (hour < 18) setGreeting('Boa tarde!');
        else setGreeting('Boa noite!');
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                if (res.ok) {
                    const data: AppNotification[] = await res.json();
                    
                    const now = Date.now();
                    const storedReadState = getStoredReadNotifications();
                    const activeReadState = Object.fromEntries(
                        Object.entries(storedReadState).filter(([, readAt]) => now - readAt < READ_RETENTION_MS)
                    );
                    const activeDismissedState = Object.fromEntries(
                        Object.entries(getDismissedNotifications()).filter(([, dismissedAt]) => now - dismissedAt < NOTIFICATION_RETENTION_MS)
                    );

                    const withReadStatus = data
                        .filter(n => n.type !== 'MATCH_RESULT')
                        .filter(n => now - (n.timestamp || new Date(n.dateStr).getTime()) < NOTIFICATION_RETENTION_MS)
                        .filter(n => !activeDismissedState[n.id])
                        .filter(n => !activeReadState[n.id] || now - activeReadState[n.id] < READ_RETENTION_MS)
                        .slice(0, MAX_VISIBLE_NOTIFICATIONS)
                        .map(n => ({ ...n, read: Boolean(activeReadState[n.id]) }));

                    saveReadNotifications(activeReadState);
                    localStorage.setItem('dismissed_notifications', JSON.stringify(activeDismissedState));
                    setNotifications(withReadStatus);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        const readAt = Date.now();
        saveReadNotifications(Object.fromEntries(updated.map(n => [n.id, readAt])));
    };

    const clearReadNotifications = () => {
        const readNotifications = notifications.filter(notification => notification.read);
        const dismissedState = getDismissedNotifications();
        const dismissedAt = Date.now();
        readNotifications.forEach(notification => {
            dismissedState[notification.id] = dismissedAt;
        });
        localStorage.setItem('dismissed_notifications', JSON.stringify(dismissedState));
        setNotifications(current => current.filter(notification => !notification.read));
    };

    const router = useRouter();

    const handleNotificationClick = (notification: AppNotification) => {
        // Mark specific notification as read
        if (!notification.read) {
            const updated = notifications.map(n => n.id === notification.id ? { ...n, read: true } : n);
            setNotifications(updated);
            const readState = getStoredReadNotifications();
            readState[notification.id] = Date.now();
            saveReadNotifications(readState);
        }

        setShowNotifications(false);

        // Navigate based on type
        if (notification.type === 'DAILY_BRIEFING') {
            router.push(`/news/${notification.id}`);
        } else if (notification.type === 'MATCH_RESULT') {
            router.push('/matches');
        } else {
            router.push(`/news/${notification.id}`);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const hasReadNotifications = notifications.some(n => n.read);
    const displayName = user?.displayName?.split(' ')[0] || 'Botafoguense';

    return (
        <div className="flex items-center justify-between py-3 relative">
            {/* Logo on Left */}
            <Link href="/" aria-label="Fogão 360 — Início" className="flex items-center group no-underline">
                <HeaderBrand />
            </Link>

            {/* Notifications & User on Right */}
            <div className="flex items-center gap-2" ref={notificationsRef}>
                <Link
                    href="/search"
                    aria-label="Pesquisar notícias"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100/80 text-zinc-700 transition-colors hover:bg-zinc-200"
                >
                    <Search size={19} strokeWidth={2.2} />
                </Link>
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    aria-label={showNotifications ? 'Fechar notificações' : `Abrir notificações${unreadCount ? `, ${unreadCount} não lidas` : ''}`}
                    aria-expanded={showNotifications}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100/80 text-zinc-700 hover:bg-zinc-200 hover:text-premium-gold transition-colors"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    )}
                </button>

                <Link href="/profile" className="flex items-center gap-2">
                    <div className="flex flex-col items-end text-right hidden md:flex">
                        <span className="text-zinc-900 font-bold text-[13px] leading-none">{displayName}</span>
                        <span className="text-zinc-500 font-medium text-[11px] mt-1">{greeting}</span>
                    </div>
                    <div className="relative">
                        <div className={`w-9 h-9 rounded-full overflow-hidden bg-zinc-200 shadow-sm border ${isPremium ? 'border-premium-gold ring-2 ring-premium-gold/20' : 'border-zinc-200'}`}>
                            <Image
                                src={user?.photoURL || 'https://placehold.co/100x100?text=BFR'}
                                alt={user ? `Foto de ${user.displayName || 'usuário'}` : 'Perfil de visitante'}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                                unoptimized
                            />
                        </div>
                        {isPremium && (
                            <span className="absolute -bottom-1 -right-2 rounded-full border-2 border-white bg-premium-gold px-1.5 py-0.5 text-[8px] font-black leading-none tracking-wide text-black shadow-md">
                                VIP
                            </span>
                        )}
                    </div>
                </Link>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute top-14 right-0 w-[min(330px,calc(100vw-24px))] bg-white rounded-[22px] shadow-[0_18px_55px_rgba(0,0,0,0.16)] border border-zinc-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-zinc-900 text-[14px]">Notificações</span>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[9px] font-bold text-white">{unreadCount} novas</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                            {hasReadNotifications && (
                                <button
                                    onClick={clearReadNotifications}
                                    className="p-1.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    aria-label="Limpar notificações lidas"
                                    title="Limpar lidas"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-[9px] text-zinc-600 font-bold flex items-center gap-1 hover:text-zinc-900 transition-colors uppercase tracking-wide bg-zinc-100 px-2 py-1.5 rounded-full"
                                >
                                    <CheckCheck size={12} />
                                    Marcar lidas
                                </button>
                            )}
                            </div>
                        </div>
                        <div className="max-h-[360px] overflow-y-auto overscroll-contain">
                            {loading ? (
                                <div className="p-8 text-center flex flex-col items-center justify-center text-zinc-400">
                                    <Loader2 className="animate-spin mb-2" size={20} />
                                    <span className="text-xs">Carregando...</span>
                                </div>
                            ) : notifications.length > 0 ? notifications.map(notification => (
                                <button
                                    key={notification.id} 
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left px-3 py-2.5 border-b border-zinc-100/80 last:border-0 hover:bg-zinc-50 transition-colors ${!notification.read ? 'bg-zinc-50/70' : 'bg-white'}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${notification.type === 'DAILY_BRIEFING' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-700'}`}>
                                            {notification.type === 'DAILY_BRIEFING' ? <Sparkles size={15} /> : <Newspaper size={15} />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`line-clamp-2 text-[12px] leading-[1.3] ${!notification.read ? 'font-bold text-zinc-900' : 'text-zinc-600 font-medium'}`}>
                                                {notification.title}
                                            </p>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                                                <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">{timeAgo(notification.dateStr)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )) : (
                                <div className="p-8 text-center text-zinc-500 text-sm font-medium flex flex-col items-center gap-2">
                                    <Bell size={24} className="text-zinc-300" />
                                    Nenhuma notificação recente.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
