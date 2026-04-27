'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function DesktopHeader() {
    const pathname = usePathname();
    const { user, points } = useAuth();
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
                <Link href="/" className="flex items-center gap-1.5 group no-underline">
                    <span className="text-xl font-black text-white tracking-tighter uppercase italic group-hover:text-premium-gold transition-colors">Fogão</span>
                    <span className="text-xl font-black text-premium-gold tracking-tighter uppercase italic">360</span>
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
                    {/* Search Bar */}
                    <div className="relative flex items-center h-10 px-3 bg-zinc-900/50 border border-white/5 rounded-full group focus-within:border-premium-gold/30 transition-all">
                        <Search size={18} className="text-zinc-500 group-focus-within:text-premium-gold transition-colors" />
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const q = (e.target as any).search.value;
                            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
                        }}>
                            <input 
                                name="search"
                                type="text" 
                                placeholder="Pesquisar..." 
                                className="bg-transparent border-none outline-none text-[12px] font-medium text-white px-2 w-32 focus:w-48 transition-all placeholder:text-zinc-600"
                            />
                        </form>
                    </div>

                    {/* Sign In / Profile Button */}
                    <Link 
                        href={user ? "/profile" : "/login"}
                        className="px-6 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        {user ? "Perfil" : "Entrar"}
                    </Link>
                </div>

            </div>
        </header>
    );
}
