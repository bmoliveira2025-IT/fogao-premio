"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import GloriosoLogo from '@/components/GloriosoLogo';
import { User, Crown, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function BrandingHeader() {
    const { user, isPremium } = useAuth();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Show simplified version during hydration to match SSR
    const showPremiumUI = mounted && isPremium;

    return (
        <header className="fixed top-0 left-0 right-0 z-[999] w-full bg-[#050505] lg:bg-background/90 lg:backdrop-blur-xl border-b border-white/5 lg:hidden pt-[env(safe-area-inset-top)]">
            <div className="flex items-center justify-between px-4 h-16">
                {/* Logo Area / Back Button */}
                <div className="flex items-center gap-2">
                    {pathname !== '/' ? (
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    ) : (
                        <Link href="/" className="flex items-center gap-2">
                            <GloriosoLogo size={36} className="drop-shadow-lg" />
                        </Link>
                    )}

                    <div className="flex flex-col leading-none">
                        <span className="font-display font-black text-lg text-white tracking-tight">
                            GLORIOSO <span className="text-premium-gold font-light italic">360</span>
                            {isPremium && (
                                <Crown size={14} className="text-premium-gold fill-premium-gold/20 ml-1.5 self-start -mt-0.5 inline-block" strokeWidth={2.5} />
                            )}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link href="?briefing=true" className="p-2 text-zinc-400 hover:text-premium-gold transition-colors">
                        <Zap size={20} className="fill-current" />
                    </Link>


                    <Link
                        href="/profile"
                        className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300",
                            isPremium
                                ? "ring-1 ring-premium-gold"
                                : "ring-1 ring-white/10"
                        )}
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} className={isPremium ? "text-premium-gold" : "text-zinc-400"} />
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
