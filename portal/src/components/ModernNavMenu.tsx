"use client";

import { Home, Video, Users, Trophy, Crown, Zap, User, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import GloriosoLogo from './GloriosoLogo';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface ModernNavMenuProps {
    className?: string;
}

const navItems = [
    { href: '/', label: 'INÍCIO', icon: Home },
    { href: '/podcasts', label: 'PODCAST', icon: Video },
    { href: '/elenco', label: 'ELENCO', icon: Users },
    { href: '/tabela', label: 'TABELA', icon: Trophy },
];

export default function ModernNavMenu({ className = '' }: ModernNavMenuProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, isPremium } = useAuth();

    const menuItems = [...navItems];
    if (isPremium) {
        menuItems.push({ href: '/premium', label: 'PREMIUM', icon: Zap });
    }

    return (
        <nav className={`sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 ${className}`}>
            {/* Top Bar: Logo and Quick Actions */}
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                <div className="flex items-center justify-between h-14">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                            <GloriosoLogo size={36} />
                        </div>
                        <div className="flex flex-col -space-y-1.5 font-sans">
                            <span className="text-[19px] font-black text-white tracking-tighter leading-none">
                                GLORIOSO
                            </span>
                            <span className="text-[14px] font-black text-premium-gold tracking-tighter leading-none flex items-start">
                                360<span className="text-[8px] mt-0.5 ml-0.5 font-bold">º</span>
                            </span>
                        </div>
                    </Link>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        {isPremium && (
                            <Link
                                href="/premium"
                                className="p-2 text-premium-gold hover:scale-110 active:scale-95 transition-all"
                            >
                                <Crown size={22} className="fill-premium-gold/20" />
                            </Link>
                        )}

                        <Link
                            href="?briefing=true"
                            className={cn(
                                "p-2 rounded-full transition-all",
                                searchParams.get('briefing') === 'true'
                                    ? "text-premium-gold bg-premium-gold/10"
                                    : "text-zinc-400 hover:text-premium-gold hover:bg-white/5"
                            )}
                        >
                            <Zap size={18} className={cn("fill-current", isPremium && "animate-pulse")} />
                        </Link>

                        <Link
                            href="/profile"
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ring-1",
                                isPremium ? "ring-premium-gold/50" : "ring-white/10",
                                pathname === '/profile' ? "ring-premium-gold" : "hover:ring-premium-gold/50"
                            )}
                        >
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={18} className="text-zinc-400" />
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Horizontal Navigation */}
            <div className="py-3 pb-3">
                <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-[11px] md:text-[13px] uppercase tracking-widest whitespace-nowrap transition-all duration-300
                                        ${isActive
                                            ? 'bg-premium-gold text-black shadow-md shadow-premium-gold/10'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <Icon size={isActive ? 14 : 12} className={isActive ? 'fill-current' : ''} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
