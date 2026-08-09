"use client";

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Loader2, Newspaper, Search, Sparkles, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef, type FormEvent } from 'react';
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
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = searchQuery.trim();
        router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
    };

    return (
        <header className="relative flex flex-col gap-4 pb-4 pt-4">
            <div className="flex items-center justify-between">
                <Link href="/profile" className="flex min-w-0 items-center gap-3 no-underline">
                    <div className="relative shrink-0">
                        <div className={`h-12 w-12 overflow-hidden rounded-full bg-zinc-200 shadow-sm ring-2 ${isPremium ? 'ring-premium-gold/60' : 'ring-zinc-100'}`}>
                            <Image
                                src={user?.photoURL || 'https://placehold.co/100x100?text=BFR'}
                                alt={user ? `Foto de ${user.displayName || 'usuário'}` : 'Perfil de visitante'}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                                unoptimized
                            />
                        </div>
                        {isPremium && (
                            <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-premium-gold px-1.5 py-0.5 text-[8px] font-black leading-none text-black">
                                VIP
                            </span>
                        )}
                    </div>
                    <div className="min-w-0 leading-tight">
                        <p className="truncate text-[12px] font-medium text-zinc-500">Olá, {displayName}</p>
                        <p className="mt-0.5 truncate text-[17px] font-extrabold tracking-tight text-zinc-950">{greeting}</p>
                    </div>
                </Link>

                <div ref={notificationsRef}>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    aria-label={showNotifications ? 'Fechar notificações' : `Abrir notificações${unreadCount ? `, ${unreadCount} não lidas` : ''}`}
                    aria-expanded={showNotifications}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-premium-gold"
                >
                    <Bell size={24} strokeWidth={2} />
                    {unreadCount > 0 && (
                        <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                    )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute right-0 top-[70px] z-50 w-[min(330px,calc(100vw-24px))] overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.16)] animate-in fade-in slide-in-from-top-2">
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

            <form onSubmit={handleSearch} role="search" className="relative">
                <Search aria-hidden="true" size={22} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Pesquisar notícias..."
                    aria-label="Pesquisar notícias"
                    className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/90 pl-12 pr-4 text-[14px] font-medium text-zinc-900 outline-none transition focus:border-premium-gold/50 focus:bg-white focus:ring-4 focus:ring-premium-gold/10 placeholder:text-zinc-400"
                />
            </form>
        </header>
    );
}
