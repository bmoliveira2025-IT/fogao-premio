'use client';

import Link from 'next/link';
import { Home, Newspaper, Calendar, Star, ShoppingBag, Settings, LogOut, Shield, Users, Trophy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import GloriosoLogo from '@/components/GloriosoLogo';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
    { icon: Home, label: 'Início', href: '/' },
    { icon: Newspaper, label: 'Notícias', href: '/news' },
    { icon: Calendar, label: 'Jogos', href: '/matches' },
    { icon: Trophy, label: 'Tabela', href: '/tabela' },
    { icon: Users, label: 'Elenco', href: '/elenco' },
    { icon: Star, label: 'Premium', href: '/premium', isPremium: true },
];

export default function DesktopSidebar() {
    const { user, isPremium, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-white/5 flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-8 pb-8 flex flex-col items-center justify-center border-b border-white/5 gap-3">
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-premium-gold/20 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                    <GloriosoLogo size={56} className="relative z-10 drop-shadow-2xl" />
                </div>
                <div className="flex flex-col leading-none text-center">
                    <h1 className="text-[21px] font-display font-black tracking-tight text-white leading-none">
                        GLORIOSO <span className="font-light text-premium-gold">360</span>
                    </h1>
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
                                "text-[15px] font-bold tracking-wide uppercase",
                                isActive && "font-black"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-white/5">
                {user ? (
                    <div className="relative group p-3 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-premium-gold/20 transition-all duration-300">

                        {/* Premium Glow */}
                        {isPremium && (
                            <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/10 to-transparent opacity-50 rounded-2xl pointer-events-none" />
                        )}

                        <div className="flex items-center gap-3 relative z-10">
                            {/* Avatar */}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden transition-all duration-300",
                                isPremium
                                    ? "ring-1 ring-premium-gold"
                                    : "ring-1 ring-white/5"
                            )}>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[13px] font-bold text-white truncate">
                                    {user.displayName || 'Torcedor'}
                                </p>
                                <p className={cn(
                                    "text-[11px] uppercase tracking-wider font-bold",
                                    isPremium ? "text-premium-gold" : "text-zinc-500"
                                )}>
                                    {isPremium ? 'Membro Premium' : 'Plano Gratuito'}
                                </p>
                            </div>

                            {/* Logout Action */}
                            <button
                                onClick={() => logout()}
                                className="p-2 -mr-1 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Sair"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center justify-center w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-[13px] font-bold text-white uppercase tracking-widest gap-2 group">
                        <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        <span>Entrar</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}


