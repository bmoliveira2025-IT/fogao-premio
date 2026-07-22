'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Home, Play, Trophy, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Início', href: '/' },
        { icon: Trophy, label: 'Tabela', href: '/tabela' },
        { icon: CalendarDays, label: 'Jogos', href: '/matches' },
        { icon: Play, label: 'Vídeos', href: '/videos' },
        { icon: UserRound, label: 'Perfil', href: '/profile' },
    ];

    return (
        <nav aria-label="Navegação principal" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-zinc-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
            <div className="flex items-center justify-around min-h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link 
                            key={item.label}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className="flex min-h-16 flex-col items-center justify-center gap-0.5 w-full group"
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all duration-300",
                                isActive ? "bg-amber-400/15" : "group-hover:bg-zinc-100"
                            )}>
                                <Icon 
                                    size={20} 
                                    className={cn(
                                        "transition-all",
                                        isActive ? "text-amber-600 font-bold scale-110" : "text-zinc-500"
                                    )} 
                                />
                            </div>
                            <span className={cn(
                                "text-[11px] transition-all",
                                isActive ? "text-amber-700 font-bold" : "text-zinc-500 font-medium"
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

