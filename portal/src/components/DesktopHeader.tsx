'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Share2, Crown, Star, Shield } from 'lucide-react';
import GloriosoLogo from '@/components/GloriosoLogo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function DesktopHeader() {
    const pathname = usePathname();
    const { isPremium, points, rank } = useAuth();
    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/news', label: 'Notícias' },
        { href: '/matches', label: 'Jogos' },
        { href: '/profile', label: 'Perfil' },
    ];

    if (isPremium) {
        navLinks.splice(3, 0, { href: '/premium', label: 'Premium' });
    }

    return (
        <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 glass-ultra h-20 items-center justify-between px-8 shadow-2xl border-b border-white/10">
            {/* Animated Gradient Border Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-premium-gold/30 to-transparent" />

            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                {/* Logo Section with Premium Effects */}
                <Link href="/" className="flex items-center space-x-3 group relative">
                    {/* Glow Effect Background */}
                    <div className="absolute -inset-4 bg-gradient-radial from-premium-gold/20 via-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 rounded-full" />

                    <motion.div
                        className="relative w-12 h-12 min-w-[3rem] flex-shrink-0 flex items-center justify-center"
                        whileHover={{
                            scale: 1.1,
                            rotateY: 15,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="absolute inset-0 bg-premium-gold/20 blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full animate-glow-pulse" />
                        <GloriosoLogo size={48} className="relative z-10 drop-shadow-2xl" />
                    </motion.div>
                </Link>

                {/* Navigation Links with Glassmorphic Hover */}
                <div className="flex items-center space-x-8">
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className={cn(
                                    "relative text-[15px] font-bold transition-all duration-300 tracking-widest uppercase font-sans px-4 py-2 rounded-lg group",
                                    isActive(link.href)
                                        ? "text-premium-gold"
                                        : "text-foreground/60 hover:text-foreground"
                                )}
                            >
                                {/* Glassmorphic Background on Hover */}
                                <div className={cn(
                                    "absolute inset-0 glass-ultra opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg",
                                    !isActive(link.href) && "group-hover:shadow-gold-glow"
                                )} />

                                {/* Gradient Background for Active */}
                                {isActive(link.href) && (
                                    <div className="absolute inset-0 bg-gradient-gold rounded-lg" />
                                )}

                                {/* Text */}
                                <span className="relative z-10">{link.label}</span>

                                {/* Animated Underline */}
                                {isActive(link.href) && (
                                    <motion.span
                                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                {/* Hover Glow Line */}
                                {!isActive(link.href) && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent group-hover:w-full transition-all duration-300" />
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Points & Rank Display with Premium Effects */}
                <motion.div
                    className="flex items-center space-x-4 pl-6 border-l border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex flex-col items-end">
                        <motion.div
                            className="relative flex items-center space-x-1.5 glass-ultra px-4 py-2 rounded-full border border-premium-gold/20 shadow-gold-glow overflow-hidden group cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            {/* Animated Shimmer Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <Star
                                    size={16}
                                    className="text-premium-gold fill-premium-gold relative z-10"
                                />
                            </motion.div>

                            <span className="text-sm font-black font-sans text-white tracking-widest relative z-10">
                                {points}
                            </span>
                        </motion.div>

                        <motion.span
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-widest mt-1.5",
                                rank === "Platina" ? "text-blue-500" :
                                    rank === "Ouro" ? "text-premium-gold" :
                                        rank === "Prata" ? "text-zinc-400" : "text-zinc-500"
                            )}
                            animate={{
                                textShadow: [
                                    "0 0 5px rgba(255, 215, 0, 0.3)",
                                    "0 0 10px rgba(255, 215, 0, 0.5)",
                                    "0 0 5px rgba(255, 215, 0, 0.3)",
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Torcedor {rank}
                        </motion.span>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
