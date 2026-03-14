"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ModernNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Destaques', href: '/' },
    { name: 'Vídeos', href: '/videos' },
    { name: 'Tabela', href: '/tabela' },
    { name: 'Jogos', href: '/matches' },
  ];

  return (
    <div className="w-full bg-[#111] border-b border-white/10 fixed top-[56px] left-0 right-0 z-40 lg:hidden shadow-md">
      <div className="container mx-auto px-4 max-w-[1600px] overflow-x-auto scrollbar-hide">
        <div className="flex items-center min-w-max pt-2 bg-[#0d0d0d]">
          {tabs.map((tab, index) => {
        const isActive = tab.href === pathname || (tab.href !== '/' && pathname.startsWith(tab.href));

        return (
          <div key={tab.name} className="flex items-center whitespace-nowrap">
            <Link
              href={tab.href}
              className={`relative px-4 py-4 text-[16px] transition-colors ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-zinc-400 font-medium hover:text-white'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {tab.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#d4af37]" />
              )}
            </Link>
            
            {/* Thick Dark Gold Vertical Divider (Except for the last item) */}
            {index < tabs.length - 1 && (
              <div className="h-[24px] w-[5px] bg-[#8c6a0f] mx-2" />
            )}
          </div>
        );
      })}
        </div>
      </div>
    </div>
  );
}
