"use client";

import { Home, Video, Users, Trophy, Crown, Zap, User, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GloriosoLogo from './GloriosoLogo';

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
                        <div className="flex flex-col -space-y-1.5">
                            <span className="text-[19px] font-black text-white italic tracking-tighter leading-none">
                                GLORIOSO
                            </span>
                            <span className="text-[14px] font-black text-premium-gold italic tracking-tighter leading-none flex items-start">
                                360<span className="text-[8px] mt-0.5 ml-0.5 font-bold">º</span>
                            </span>
                        </div>
                    </Link>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full text-zinc-400 hover:text-premium-gold hover:bg-white/5 transition-all">
                            <Zap size={18} className="fill-current" />
                        </button>
                        <button className="p-2 rounded-full text-zinc-400 hover:text-premium-gold hover:bg-white/5 transition-all">
                            <User size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Horizontal Navigation */}
            <div className="py-2.5 pb-3">
                <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-[10px] md:text-[12px] uppercase tracking-widest whitespace-nowrap transition-all duration-300
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
