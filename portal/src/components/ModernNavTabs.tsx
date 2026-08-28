"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ModernNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Destaques', href: '/' },
    { name: 'Vídeos', href: '/videos' },
    { name: 'Tabela', href: '/tabela' },
    { name: 'Jogos', href: '/matches' },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 fixed top-[56px] left-0 right-0 z-40 lg:hidden">
      <div className="container mx-auto px-3 max-w-[1600px] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.href === pathname || (tab.href !== '/' && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative px-4 py-4 text-[12px] font-black tracking-widest uppercase transition-all whitespace-nowrap"

              >
                <span className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-premium-gold" : "text-zinc-500 hover:text-zinc-900"
                )}>
                  {tab.name}
                </span>

                {/* Premium gold underline indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-premium-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                    layoutId="navTabIndicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
