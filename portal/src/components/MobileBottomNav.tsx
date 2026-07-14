'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Play, UserRound, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Início', href: '/' },
        { icon: Newspaper, label: 'Notícias', href: '/news' },
        { icon: Trophy, label: 'Jogos', href: '/matches' },
        { icon: Play, label: 'Vídeos', href: '/videos' },
        { icon: UserRound, label: 'Perfil', href: '/profile' },
    ];

    return (
        <nav aria-label="Navegação principal" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-xl border-t border-[#2a2a30] pb-safe">
            <div className="flex items-center justify-around min-h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link 
                            key={item.label}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className="flex min-h-16 flex-col items-center justify-center gap-1 w-full group"
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all duration-300",
                                isActive ? "bg-premium-gold/20" : "group-hover:bg-white/5"
                            )}>
                                <Icon 
                                    size={20} 
                                    className={cn(
                                        "transition-all",
                                        isActive ? "text-premium-gold scale-110" : "text-zinc-500"
                                    )} 
                                />
                            </div>
                            <span className={cn(
                                "text-[11px] font-semibold transition-all",
                                isActive ? "text-premium-gold" : "text-zinc-500"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
