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
                        {/* Logo Section */}
                        <Link href="/" className="flex items-center gap-3 group relative">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <GloriosoLogo size={36} className="relative z-10 drop-shadow-xl" />
                            </motion.div>
                        </Link>

                        {/* Action Icons with Staggered Animations */}
                        <div className="flex items-center gap-3">
                            {!user ? (
                                <Link 
                                    href="/login"
                                    className="px-4 py-1.5 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg"
                                >
                                    Entrar
                                </Link>
                            ) : (
                                <Link
                                    href="/profile"
                                    className={cn(
                                        "relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ring-2",
                                        isPremium ? "ring-premium-gold/50" : "ring-white/10"
                                    )}
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-zinc-400" />
                                    )}
                                </Link>
                            )}
                            
                            <Link
                                href="?briefing=true"
                                className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    searchParams.get('briefing') === 'true'
                                        ? "text-premium-gold bg-premium-gold/10"
                                        : "text-zinc-400 hover:text-white"
                                )}
                            >
                                <Zap size={18} className={isPremium ? "animate-glow-pulse" : ""} />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}
