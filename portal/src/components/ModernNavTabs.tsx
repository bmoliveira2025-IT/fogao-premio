"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ModernNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Destaques', href: '/' },
    { name: 'Vídeos', href: '/videos' },
    { name: 'Tabela', href: '/tabela' },
    { name: 'Jogos', href: '/matches' },
  ];

  return (
    <div className="w-full bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/[0.06] fixed top-[56px] left-0 right-0 z-40 lg:hidden">
      <div className="container mx-auto px-3 max-w-[1600px] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.href === pathname || (tab.href !== '/' && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative px-4 py-3.5 text-[13px] font-bold tracking-wide uppercase transition-colors whitespace-nowrap"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span className={isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}>
                  {tab.name}
                </span>

                {/* Animated underline indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-[#d4af37] via-[#d4af37] to-[#d4af37]/50 rounded-full"
                    layoutId="navTabIndicator"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
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
