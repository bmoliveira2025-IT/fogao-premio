'use client';

import Link from 'next/link';
import { Home, Newspaper, Calendar, Star, ShoppingBag, Settings, LogOut, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DesktopSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: Home, label: 'Início', href: '/' },
        { icon: Newspaper, label: 'Notícias', href: '/news' },
        { icon: Calendar, label: 'Jogos', href: '/matches' },
        { icon: Users, label: 'Elenco', href: '/elenco' },
        { icon: Star, label: 'Premium', href: '/premium', isPremium: true },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-white/5 flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-8 pb-8 flex justify-center border-b border-white/5">
                <div className="relative w-16 h-16">
                    <img
                        src="/logo-glorioso.png"
                        alt="Fogão Premium"
                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-white/5 text-premium-gold"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-premium-gold rounded-r-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                            )}

                            <Icon
                                size={20}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-premium-gold" : "text-zinc-500 group-hover:text-white",
                                    item.isPremium && "text-premium-gold drop-shadow-md"
                                )}
                            />

                            <span className={cn(
                                "text-sm font-bold tracking-wide uppercase",
                                isActive && "font-black"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-premium-gold/20 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center">
                        <Shield size={18} className="text-premium-gold" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate group-hover:text-premium-gold transition-colors">Torcedor Alvinegro</p>
                        <p className="text-[10px] text-zinc-500">Plano Gratuito</p>
                    </div>
                    <Settings size={16} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
            </div>
        </aside>
    );
}

// Helper icon
import { Users } from 'lucide-react';
