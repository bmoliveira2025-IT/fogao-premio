"use client";

import { Home, Video, Users, Trophy, Crown, Zap, User, Search, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <nav className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-500",
            className
        )}>
            <div className={cn(
                "backdrop-blur-md border-b transition-all duration-500 safe-pt",
                scrolled
                    ? "border-zinc-200 shadow-md bg-white/95"
                    : "border-transparent bg-white/90"
            )}>
                <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                    <div className="flex items-center justify-between h-14 relative">
                        {/* Profile Section (Left) */}
                        <div className={cn("flex items-center transition-opacity duration-300", isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100")}>
                            <Link href={user ? "/profile" : "/login"} className="flex-shrink-0">
                                <div className="w-9 h-9 rounded-full bg-zinc-200 border border-zinc-200 flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                                            <span className="text-zinc-500 text-[10px] font-black">{user ? 'MP' : '?'}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>

                        {/* Logo Section (Centered) */}
                        <div className={cn("absolute left-1/2 -translate-x-1/2 transition-all duration-300", isSearchOpen ? "scale-90 opacity-0 pointer-events-none" : "scale-100 opacity-100")}>
                            <Link href="/" className="flex items-center gap-1.5 no-underline">
                                <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase italic">Fogão</span>
                                <span className="text-xl font-black text-premium-gold tracking-tighter uppercase italic">360</span>
                            </Link>
                        </div>

                        {/* Search Bar (Overlays) */}
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 flex items-center px-2 z-50"
                                >
                                    <form onSubmit={handleSearch} className="w-full flex items-center bg-zinc-100 border border-zinc-200 rounded-xl px-3 h-10">
                                        <Search size={18} className="text-zinc-500 mr-2" />
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Pesquisar notícias, jogos..."
                                            className="bg-transparent border-none outline-none text-sm text-zinc-900 w-full placeholder:text-zinc-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setIsSearchOpen(false)}
                                            className="text-[10px] font-black text-zinc-500 hover:text-zinc-900 uppercase tracking-widest px-2"
                                        >
                                            Fechar
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Icons (Right) */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className={cn("p-2 text-zinc-500 hover:text-zinc-900 transition-all", isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100")}
                            >
                                <Search size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}
