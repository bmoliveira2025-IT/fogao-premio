"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import GloriosoLogo from '@/components/GloriosoLogo';
import { User, Crown, Zap, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandingHeader() {
    const { user, isPremium } = useAuth();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Show simplified version during hydration to match SSR
    const showPremiumUI = mounted && isPremium;

    return (
        <header className="fixed top-0 left-0 right-0 z-[999] w-full glass-ultra border-b border-white/[0.04] lg:hidden pt-[env(safe-area-inset-top)] shadow-premium">
            {/* Animated Gradient Border Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-90 animate-shimmer-gold"
                style={{ backgroundSize: '200% 100%' }}
            />

            {/* Subtle Background Gradient Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/5 via-transparent to-premium-gold/5 opacity-50 animate-shimmer-gold"
                style={{ backgroundSize: '200% 100%' }}
            />

            <div className="flex items-center justify-between px-4 h-16 relative z-10">
                {/* Logo Area / Back Button */}
                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {pathname !== '/' ? (
                            <motion.button
                                key="back-button"
                                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => router.back()}
                                className="relative p-2.5 -ml-2 text-foreground/80 hover:text-premium-gold transition-colors rounded-xl hover:bg-white/5 active:bg-white/10 group overflow-hidden"
                            >
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <ArrowLeft size={24} className="relative z-10 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]" />
                            </motion.button>
                        ) : (
                            <motion.div
                                key="logo"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Link href="/" className="flex items-center gap-2 relative group">
                                    {/* Multi-layer Glow Effect */}
                                    <div className="absolute -inset-2 bg-gradient-radial from-premium-gold/30 to-transparent opacity-0 group-active:opacity-100 blur-xl transition-opacity duration-300 rounded-full" />
                                    <div className="absolute -inset-1 bg-premium-gold/20 opacity-30 blur-md rounded-full animate-glow-pulse" />

                                    <motion.div
                                        whileTap={{ scale: 0.9, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <GloriosoLogo size={38} className="drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] relative z-10" />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>


                </div>

                {/* Actions with Staggered Animations */}
                <div className="flex items-center gap-2">
                    {isPremium && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                        >
                            <Link
                                href="/premium"
                                className="relative p-2.5 rounded-xl text-premium-gold hover:bg-premium-gold/15 active:scale-95 transition-all overflow-hidden group"
                            >
                                {/* Animated gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/10 via-premium-gold/20 to-premium-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Sparkle effect */}
                                <motion.div
                                    className="absolute top-0 right-0"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles size={10} className="text-premium-gold" />
                                </motion.div>

                                <Crown
                                    size={22}
                                    className="relative z-10 fill-premium-gold/30 group-hover:fill-premium-gold/50 transition-all drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                />
                            </Link>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                        <Link
                            href="?briefing=true"
                            className="relative p-2.5 rounded-xl text-zinc-300 hover:text-premium-gold hover:bg-white/10 active:scale-95 transition-all overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Zap
                                size={20}
                                className="relative z-10 fill-current group-hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                            />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                    >
                        <Link
                            href="/profile"
                            className={cn(
                                "relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ring-2 active:scale-95 hover:ring-4",
                                isPremium
                                    ? "ring-premium-gold/60 hover:ring-premium-gold shadow-gold-glow"
                                    : "ring-white/20 hover:ring-white/40"
                            )}
                        >
                            {isPremium && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-gold animate-shimmer-gold" style={{ backgroundSize: '200% 100%' }} />
                                    <div className="absolute inset-0 bg-premium-gold/10 animate-glow-pulse" />
                                </>
                            )}
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover relative z-10" />
                            ) : (
                                <User
                                    size={19}
                                    className={cn(
                                        "relative z-10",
                                        isPremium ? "text-premium-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : "text-zinc-400"
                                    )}
                                />
                            )}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </header>
    );
}
