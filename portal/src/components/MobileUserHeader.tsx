"use client";

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Star, CheckCheck, Loader2 } from 'lucide-react';
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

export default function MobileUserHeader() {
    const { user } = useAuth();
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
                    
                    // Check local storage for read status
                    const readStr = localStorage.getItem('read_notifications');
                    const readIds: string[] = readStr ? JSON.parse(readStr) : [];
                    
                    const withReadStatus = data.map(n => ({
                        ...n,
                        read: readIds.includes(n.id)
                    }));
                    
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
        const readIds = updated.map(n => n.id);
        localStorage.setItem('read_notifications', JSON.stringify(readIds));
    };

    const router = useRouter();

    const handleNotificationClick = (notification: AppNotification) => {
        // Mark specific notification as read
        if (!notification.read) {
            const updated = notifications.map(n => n.id === notification.id ? { ...n, read: true } : n);
            setNotifications(updated);
            const readIds = updated.filter(n => n.read).map(n => n.id);
            localStorage.setItem('read_notifications', JSON.stringify(readIds));
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
    const displayName = user?.displayName?.split(' ')[0] || 'Botafoguense';

    return (
        <div className="flex items-center justify-between py-4 relative">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-200 shadow-sm">
                    <Image 
                        src={user?.photoURL || 'https://placehold.co/100x100?text=BFR'}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        unoptimized
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-zinc-900 font-bold text-[14px] leading-tight">{displayName}</span>
                    <span className="text-zinc-500 font-medium text-[12px]">{greeting}</span>
                </div>
            </div>

            <div className="flex items-center gap-4" ref={notificationsRef}>
                <Link 
                    href="/" 
                    className="flex items-center gap-1 group no-underline"
                >
                    <Star size={14} className="text-premium-gold fill-premium-gold drop-shadow-sm group-hover:scale-110 transition-transform" />
                    <div className="flex items-center tracking-tighter uppercase italic">
                        <span className="text-[16px] font-black text-zinc-900 drop-shadow-sm">Fogão</span>
                        <span className="text-[16px] font-black text-premium-gold drop-shadow-sm">360</span>
                    </div>
                </Link>

                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-premium-gold hover:border-premium-gold/30 transition-all shadow-sm bg-white"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white" />
                    )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute top-16 right-0 w-[300px] bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <span className="font-bold text-zinc-900 text-sm">Notificações</span>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-[10px] text-premium-gold font-bold flex items-center gap-1 hover:text-yellow-600 transition-colors uppercase tracking-wider bg-premium-gold/10 px-2 py-1 rounded-md"
                                >
                                    <CheckCheck size={12} />
                                    Lidas
                                </button>
                            )}
                        </div>
                        <div className="max-h-[320px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center flex flex-col items-center justify-center text-zinc-400">
                                    <Loader2 className="animate-spin mb-2" size={20} />
                                    <span className="text-xs">Carregando...</span>
                                </div>
                            ) : notifications.length > 0 ? notifications.map(notification => (
                                <button 
                                    key={notification.id} 
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left p-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors ${!notification.read ? 'bg-blue-50/20' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1.5 flex-shrink-0">
                                            {notification.read ? (
                                                <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-premium-gold shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-[13px] leading-snug ${!notification.read ? 'font-bold text-zinc-900' : 'text-zinc-600 font-medium'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-1 font-medium">{timeAgo(notification.dateStr)}</p>
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
