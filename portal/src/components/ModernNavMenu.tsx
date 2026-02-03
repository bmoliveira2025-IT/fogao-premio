"use client";

import { Home, Newspaper, Video, Users, Trophy, Crown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ModernNavMenuProps {
    className?: string;
}

const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/podcasts', label: 'Podcast', icon: Video },
    { href: '/elenco', label: 'Elenco', icon: Users },
    { href: '/tabela', label: 'Tabela', icon: Trophy },
    { href: '/premium', label: 'Premium', icon: Crown },
];

export default function ModernNavMenu({ className = '' }: ModernNavMenuProps) {
    const pathname = usePathname();

    return (
        <nav className={`sticky top-0 z-50 bg-white dark:bg-black backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-sm ${className}`}>
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-premium-gold dark:bg-premium-gold light:bg-zinc-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-black dark:text-black light:text-white font-black text-sm">FP</span>
                        </div>
                        <span className="hidden md:block font-black text-lg text-zinc-900 dark:text-white">
                            Fogão Prêmio
                        </span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all
                                        ${isActive
                                            ? 'text-premium-gold dark:text-premium-gold light:text-zinc-900 bg-premium-gold/10 dark:bg-premium-gold/10 light:bg-zinc-100'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <Icon size={16} />
                                    <span>{item.label}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-premium-gold dark:bg-premium-gold light:bg-zinc-900 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu - Horizontal Scroll */}
                    <div className="md:hidden flex-1 ml-4 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide whitespace-nowrap transition-all
                                            ${isActive
                                                ? 'text-premium-gold dark:text-premium-gold light:text-zinc-900 bg-premium-gold/10 dark:bg-premium-gold/10 light:bg-zinc-100'
                                                : 'text-zinc-600 dark:text-zinc-400'
                                            }
                                        `}
                                    >
                                        <Icon size={14} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
