'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function DesktopHeader() {
    const pathname = usePathname();
    const { user, isPremium } = useAuth();
    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/news', label: 'Notícias' },
        { href: '/matches', label: 'Jogos' },
        { href: '/videos', label: 'Vídeos' },
        { href: '/tabela', label: 'Tabela' },
    ];

    return (
        <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md h-16 items-center border-b border-zinc-200 dark:border-zinc-700">
            <div className="container mx-auto max-w-[1400px] flex items-center justify-between px-6">
                
                {/* LOGO */}
                <Link href="/" aria-label="Fogão 360 — Início" className="flex items-center gap-2 group no-underline">
                    <Image
                        src="/logo-shield-360.png"
                        alt=""
                        width={38}
                        height={38}
                        className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    <span className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-premium-gold transition-colors">Fogão</span>
                        <span className="text-xl font-semibold text-premium-gold tracking-tight">360</span>
                    </span>
                </Link>

                {/* NAVIGATION - CENTERED */}
                <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-bold transition-all hover:text-zinc-900 dark:hover:text-white focus-visible:rounded-sm",
                                isActive(link.href) ? "text-premium-gold" : "text-zinc-500"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* ACTIONS - RIGHT */}
                <div className="flex items-center gap-6">
                    <ThemeToggle compact />
                    {/* Search Bar */}
                    <div className="relative flex items-center h-10 px-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full group focus-within:border-premium-gold/30 transition-all">
                        <Search size={18} className="text-zinc-500 group-focus-within:text-premium-gold transition-colors" />
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            const q = new FormData(e.currentTarget).get('search')?.toString().trim();
                            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
                        }}>
                            <input 
                                name="search"
                                type="text" 
                                placeholder="Buscar notícias..."
                                aria-label="Buscar notícias"
                                className="bg-transparent border-none outline-none text-sm font-medium text-zinc-900 dark:text-white px-2 w-36 focus:w-52 transition-all placeholder:text-zinc-500"
                            />
                        </form>
                    </div>

                    {/* Sign In / Profile Button */}
                    <Link 
                        href={user ? "/profile" : "/login"}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg transition-all hover:scale-105 active:scale-95",
                            isPremium
                                ? "border border-premium-gold/50 bg-premium-gold text-black hover:bg-[#e3c35c]"
                                : "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                        )}
                    >
                        {isPremium && <span aria-hidden="true">★</span>}
                        {user ? (isPremium ? "Perfil VIP" : "Perfil") : "Entrar"}
                    </Link>
                </div>

            </div>
        </header>
    );
}
