"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ModernNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Destaques', href: '/' },
    { name: 'Copa BR', href: '/copa-do-brasil' },
    { name: 'Sula', href: '/sulamericana' },
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
                className={cn(
                  "relative px-5 py-2 text-[12px] font-black tracking-widest uppercase transition-all whitespace-nowrap rounded-full border",
                  isActive 
                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                    : "bg-black text-zinc-500 border-white/10 hover:border-white/30"
                )}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
