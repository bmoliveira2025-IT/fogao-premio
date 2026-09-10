"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Home, Play, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { AppIcon } from '@/components/ui/AppIcon';

const navTabs = [
    { icon: Home, label: "INÍCIO", href: "/" },
    { icon: Play, label: "VÍDEOS", href: "/videos" },
    { icon: CalendarDays, label: "JOGOS", href: "/matches" },
    { icon: UserRound, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();
    const { points } = useAuth();

    const tabs = [...navTabs];

    return (
        <div className="fixed inset-x-0 bottom-0 z-[999] md:hidden bg-[#121214]/90 backdrop-blur-xl border-t border-white/5 safe-pb">
            <nav className="relative mx-auto max-w-md w-full flex items-center justify-between px-2 h-[64px]">
                {/* Subtle internal gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

                <div className="flex items-center justify-between w-full px-2 relative">
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
                                    aria-current={isActive ? 'page' : undefined}
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
                                        <AppIcon
                                            icon={Icon}
                                            size="nav"
                                            active={isActive}
                                            className={cn(
                                                isActive ? "text-premium-gold" : "text-zinc-400 group-hover:text-white"
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
