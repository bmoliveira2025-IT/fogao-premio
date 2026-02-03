'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Share2, Crown, Star, Shield } from 'lucide-react';
import GloriosoLogo from '@/components/GloriosoLogo';
import { cn } from '@/lib/utils';

import { useAuth } from '@/context/AuthContext';

export default function DesktopHeader() {
    const pathname = usePathname();
    const { isPremium, points, rank } = useAuth();
    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/news', label: 'Notícias' },
        { href: '/matches', label: 'Jogos' },
        { href: '/premium', label: 'Premium' },
        { href: '/profile', label: 'Perfil' },
    ];

    return (
        <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-background dark:bg-black backdrop-blur-xl border-b border-foreground/5 dark:border-white/10 h-20 items-center justify-between px-8 shadow-2xl">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="relative group cursor-pointer w-12 h-12 min-w-[3rem] flex-shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-premium-gold/20 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                        <GloriosoLogo size={48} className="relative z-10 drop-shadow-2xl" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="text-2xl font-display font-black tracking-tight text-foreground leading-none group-hover:text-premium-gold dark:group-hover:text-premium-gold light:group-hover:text-zinc-600 transition-colors flex items-center gap-2">
                            GLORIOSO <span className="font-light italic text-premium-gold dark:text-premium-gold light:text-zinc-400">360</span>
                            {isPremium && (
                                <Crown size={16} className="text-premium-gold dark:text-premium-gold light:text-zinc-400 fill-premium-gold/20 ml-1.5 self-start -mt-0.5" strokeWidth={2.5} />
                            )}
                        </h1>
                    </div>
                </Link>

                <div className="flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[15px] font-bold transition-all duration-300 tracking-widest uppercase relative font-sans",
                                isActive(link.href)
                                    ? "text-premium-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] scale-105"
                                    : "text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white"
                            )}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-premium-gold dark:via-premium-gold light:via-zinc-400 to-transparent opacity-80" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Points & Rank Display */}
                <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-foreground/10 dark:border-premium-gold/20 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
                            <Star size={14} className="text-premium-gold dark:text-premium-gold light:text-zinc-400 fill-premium-gold dark:fill-premium-gold light:fill-zinc-400" />
                            <span className="text-sm font-black font-sans text-foreground dark:text-white tracking-widest">{points}</span>
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest mt-1",
                            rank === "Platina" ? "text-blue-500" :
                                rank === "Ouro" ? "text-premium-gold dark:text-premium-gold light:text-zinc-600" :
                                    rank === "Prata" ? "text-zinc-400 dark:text-zinc-300" : "text-zinc-500"
                        )}>
                            Torcedor {rank}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
