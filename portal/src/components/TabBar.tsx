"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, FileText, Calendar, Play, Star, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

// 1. Home - Lucide Home
const IconHome = ({ active, className }: { active: boolean, className?: string }) => (
    <Home
        className={className}
        strokeWidth={active ? 2.5 : 1.5}
        absoluteStrokeWidth // Ensures consistent stroke width across sizes
    />
);

// 2. News - Lucide FileText
const IconNews = ({ active, className }: { active: boolean, className?: string }) => (
    <FileText
        className={className}
        strokeWidth={active ? 2.5 : 1.5}
        absoluteStrokeWidth
    />
);

// 3. Games - Lucide Calendar
const IconGames = ({ active, className }: { active: boolean, className?: string }) => (
    <Calendar
        className={className}
        strokeWidth={active ? 2.5 : 1.5}
        absoluteStrokeWidth
    />
);

// 4. Profile (User) - Keep existing Custom SVG but with Photo support
const IconProfile = ({ active, className }: { active: boolean, className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            className="transition-all"
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="currentColor"
            strokeWidth={active ? 2.5 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <circle
            cx="12" cy="7" r="4"
            stroke="currentColor"
            strokeWidth={active ? 2.5 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);



const navTabs = [
    { icon: IconHome, label: "INÍCIO", href: "/" },
    { icon: ({ active, className }: any) => <Play className={className} strokeWidth={active ? 2.5 : 1.5} />, label: "PODCAST", href: "/podcasts" },
    { icon: IconGames, label: "JOGOS", href: "/matches" },
    { icon: IconProfile, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();
    const { user, isPremium, points } = useAuth();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background h-16 md:hidden border-t border-foreground/[0.08]" />;
    }

    const tabs = [...navTabs];

    return (
        <div className="fixed inset-x-0 bottom-6 z-[999] px-4 md:hidden pb-safe-offset">
            <nav className="relative mx-auto max-w-sm w-full glass-ultra rounded-[2rem] border border-white/[0.04] shadow-premium flex items-center justify-between px-2 h-[72px] overflow-hidden">
                {/* Subtle internal gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

                <div className="flex items-center justify-between relative">
                    {tabs.map((tab, index) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;

                        return (
                            <motion.div
                                key={tab.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={tab.href}
                                    className="relative flex flex-col items-center justify-center w-20 h-full group outline-none"
                                >
                                    {/* Active Indicator - Enhanced Glow */}
                                    {isActive && (
                                        <>
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <div className="w-14 h-14 rounded-full bg-premium-gold/20 blur-xl animate-glow-pulse" />
                                            </motion.div>

                                            {/* Glassmorphic Background */}
                                            <div className="absolute inset-0 mx-2 rounded-2xl glass-ultra border border-premium-gold/20" />
                                        </>
                                    )}

                                    <motion.div
                                        className={cn(
                                            "relative flex items-center justify-center transition-all duration-300 z-10",
                                            isActive
                                                ? "text-premium-gold -translate-y-1"
                                                : "text-zinc-400 group-hover:text-white group-active:scale-95"
                                        )}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Icon
                                            active={isActive}
                                            className={cn(
                                                "w-[28px] h-[28px]",
                                                isActive && "drop-shadow-[0_0_12px_rgba(255,215,0,0.6)] animate-float"
                                            )}
                                        />

                                        {/* Points Badge for Profile */}
                                        {tab.label === "PERFIL" && points > 0 && (
                                            <motion.div
                                                className="absolute -top-1 -right-1 bg-premium-gold text-black text-[9px] font-black px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center border border-black shadow-gold-glow"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", delay: 0.2 }}
                                            >
                                                {points > 999 ? "1k+" : points}
                                            </motion.div>
                                        )}

                                        {/* Active Dot - Enhanced */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-premium-gold shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                                                layoutId="activeTab"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>

                                    {/* Label - VERY BRIGHT TEXT */}
                                    <span className={cn(
                                        "text-[11px] font-black mt-1 tracking-tight uppercase transition-all duration-300 font-sans whitespace-nowrap relative z-10",
                                        isActive
                                            ? "opacity-100 scale-105 text-premium-gold font-extrabold drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                                            : "opacity-90 scale-100 text-white font-bold group-hover:text-premium-gold group-hover:opacity-100"
                                    )}>
                                        {tab.label}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
