"use client";

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { Bell } from 'lucide-react';
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
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-200">
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

            <button className="relative p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>
        </div>
    );
}
