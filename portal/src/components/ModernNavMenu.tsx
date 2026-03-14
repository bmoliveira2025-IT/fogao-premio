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
                        {/* Logo Section with Glow Effect */}
                        <Link href="/" className="flex items-center gap-3 group relative">
                            {/* Animated Glow Background */}
                            <div className="absolute -inset-2 bg-gradient-radial from-premium-gold/20 via-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-full" />

                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <div className="absolute inset-0 bg-premium-gold/10 blur-md rounded-full animate-glow-pulse" />
                                <GloriosoLogo size={40} className="relative z-10 drop-shadow-2xl" />
                            </motion.div>

                            <div className="flex flex-col -space-y-1.5 font-sans relative">
                                <span className="text-[20px] font-black text-white tracking-tighter leading-none group-hover:text-premium-gold transition-colors duration-300">
                                    GLORIOSO
                                </span>
                                <div className="flex items-start">
                                    <motion.span
                                        className="text-[15px] font-black text-premium-gold tracking-tighter leading-none flex items-start"
                                        animate={{
                                            textShadow: [
                                                "0 0 10px rgba(255, 215, 0, 0.3)",
                                                "0 0 20px rgba(255, 215, 0, 0.6)",
                                                "0 0 10px rgba(255, 215, 0, 0.3)",
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        360<span className="text-[9px] mt-0.5 ml-0.5 font-bold animate-float">º</span>
                                    </motion.span>
                                </div>
                            </div>
                        </Link>

                        {/* Action Icons with Staggered Animations */}
                        <div className="flex items-center gap-3.5">
                            {isPremium && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Link
                                        href="/premium"
                                        className="relative p-2.5 rounded-xl text-premium-gold hover:bg-premium-gold/10 transition-all duration-300 group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <Crown size={22} className="relative z-10 fill-premium-gold/20 group-hover:fill-premium-gold/40 transition-all animate-glow-pulse" />
                                    </Link>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link
                                    href="?briefing=true"
                                    className={cn(
                                        "relative p-2.5 rounded-xl transition-all duration-300 overflow-hidden group",
                                        searchParams.get('briefing') === 'true'
                                            ? "text-premium-gold bg-premium-gold/10 shadow-gold-glow"
                                            : "text-zinc-400 hover:text-premium-gold hover:bg-white/5"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Zap
                                        size={18}
                                        className={cn(
                                            "relative z-10 fill-current transition-all",
                                            isPremium && "animate-glow-pulse"
                                        )}
                                    />
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link
                                    href="/profile"
                                    className={cn(
                                        "relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ring-2 hover:ring-4 hover:scale-110",
                                        isPremium
                                            ? "ring-premium-gold/50 hover:ring-premium-gold shadow-gold-glow"
                                            : "ring-white/10 hover:ring-white/30",
                                        pathname === '/profile' && "ring-premium-gold scale-110"
                                    )}
                                >
                                    {isPremium && (
                                        <div className="absolute inset-0 bg-gradient-gold animate-shimmer-gold" />
                                    )}
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover relative z-10" />
                                    ) : (
                                        <User size={18} className="text-zinc-400 relative z-10" />
                                    )}
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}
