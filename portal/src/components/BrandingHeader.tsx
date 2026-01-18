"use client";

import Link from 'next/link';
import GloriosoLogo from '@/components/GloriosoLogo';
import { Search, User, Menu, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BrandingHeader() {
    // Basic mobile header
    const { user, isPremium } = useAuth();

    return (
        <header className="fixed top-0 z-40 w-full bg-background/90 backdrop-blur-xl border-b border-white/5 lg:hidden pt-[env(safe-area-inset-top)]">
            <div className="flex items-center justify-between px-4 h-16">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2">
                    <GloriosoLogo size={36} className="drop-shadow-lg" />
                    <div className="flex flex-col leading-none">
                        <span className="font-display font-black text-lg text-white tracking-tight">
                            GLORIOSO <span className="text-premium-gold font-light italic">360</span>
                            {isPremium && (
                                <Crown size={14} className="text-premium-gold fill-premium-gold/20 ml-1.5 self-start -mt-0.5 inline-block" strokeWidth={2.5} />
                            )}
                        </span>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link href="?briefing=true" className="p-2 text-zinc-400 hover:text-premium-gold transition-colors">
                        <Zap size={20} className="fill-current" />
                    </Link>


                    <Link
                        href="/profile"
                        className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden"
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} className="text-zinc-400" />
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
