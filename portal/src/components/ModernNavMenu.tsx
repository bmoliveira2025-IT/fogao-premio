"use client";

import { Home, Video, Users, Trophy, Crown, Zap, User, Search, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import GloriosoLogo from './GloriosoLogo';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface ModernNavMenuProps {
    className?: string;
}



export default function ModernNavMenu({ className = '' }: ModernNavMenuProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, isPremium } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <nav className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-500",
            className
        )}>
            <div className={cn(
                "glass-ultra border-b transition-all duration-500 safe-pt",
                scrolled
                    ? "border-white/[0.08] shadow-2xl bg-background/90"
                    : "border-transparent shadow-xl bg-background/50"
            )}>
                <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                    <div className="flex items-center justify-between h-14">
                        {/* Profile Section (Left) */}
                        <Link href={user ? "/profile" : "/login"} className="flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                                        <span className="text-zinc-400 text-[10px] font-black">{user ? 'MP' : '?'}</span>
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Logo Section (Centered) */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <Link href="/">
                                <GloriosoLogo size={36} className="drop-shadow-lg transition-transform active:scale-95" />
                            </Link>
                        </div>

                        {/* Action Icons (Right) */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                                <Search size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}
