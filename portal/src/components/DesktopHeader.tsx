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
        { href: '/', label: 'Futebol' },
        { href: '/news', label: 'Notícias' },
        { href: '/matches', label: 'Jogos' },
        { href: '/videos', label: 'Vídeos' },
        { href: '/tabela', label: 'Tabela' },
    ];

    return (
        <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md h-16 items-center border-b border-white/[0.05]">
            <div className="container mx-auto max-w-[1400px] flex items-center justify-between px-6">
                
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <GloriosoLogo size={44} className="drop-shadow-lg group-hover:scale-105 transition-transform" />
                </Link>

                {/* NAVIGATION - CENTERED */}
                <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[12px] font-black uppercase tracking-[0.15em] transition-all hover:text-white",
                                isActive(link.href) ? "text-premium-gold" : "text-zinc-500"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* ACTIONS - RIGHT */}
                <div className="flex items-center gap-6">
                    {/* Search Icon */}
                    <button className="text-zinc-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </button>

                    {/* Sign In / Profile Button (Green as per reference) */}
                    <Link 
                        href="/login"
                        className="px-6 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        Entrar
                    </Link>
                </div>

            </div>
        </header>
    );
}

    );
}
