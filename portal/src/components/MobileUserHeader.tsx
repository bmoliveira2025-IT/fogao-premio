"use client";

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MobileUserHeader() {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('Bom dia!');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia!');
        else if (hour < 18) setGreeting('Boa tarde!');
        else setGreeting('Boa noite!');
    }, []);

    const displayName = user?.displayName?.split(' ')[0] || 'Botafoguense';

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-200 shadow-sm">
                    <Image 
                        src={user?.photoURL || 'https://placehold.co/100x100?text=BFR'}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        unoptimized
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-zinc-900 font-bold text-[14px] leading-tight">{displayName}</span>
                    <span className="text-zinc-500 font-medium text-[12px]">{greeting}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link 
                    href="/" 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 shadow-sm group no-underline hover:border-premium-gold/50 transition-all"
                >
                    <Star size={12} className="text-premium-gold fill-premium-gold" />
                    <div className="flex items-center tracking-tighter uppercase italic">
                        <span className="text-[13px] font-black text-white">Fogão</span>
                        <span className="text-[13px] font-black text-premium-gold">360</span>
                    </div>
                </Link>

                <button className="relative p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-premium-gold hover:border-premium-gold/30 transition-all shadow-sm bg-white">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white" />
                </button>
            </div>
        </div>
    );
}
