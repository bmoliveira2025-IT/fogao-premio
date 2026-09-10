'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Home, Play, Trophy, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppIcon } from '@/components/ui/AppIcon';

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
        <nav
            aria-label="Navegação principal"
            className="editorial-bottom-nav fixed inset-x-0 bottom-0 z-50 overflow-hidden border-t border-zinc-200/80 bg-white/95 shadow-[0_-8px_28px_rgba(0,0,0,0.09)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 lg:hidden"
        >
            <div className="grid min-h-[68px] w-full grid-cols-5 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
                {navItems.map((item) => {
                    const isActive = item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link 
                            key={item.label}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className="mobile-bottom-nav-link group relative flex min-h-[68px] w-full flex-col items-center justify-center gap-1"
                        >
                            <AppIcon
                                icon={Icon}
                                size="nav"
                                active={isActive}
                                className={cn(
                                    "transition-colors duration-200",
                                    isActive ? "text-premium-gold" : "text-zinc-500 group-hover:text-zinc-800"
                                )}
                            />
                            <span className={cn("text-xs font-semibold leading-none transition-colors duration-200", isActive ? "text-premium-gold" : "text-zinc-500")}>
                                {item.label}
                            </span>
                            {isActive && <span aria-hidden="true" className="absolute bottom-1 h-0.5 w-5 rounded-full bg-premium-gold" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

