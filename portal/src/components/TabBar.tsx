"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutList, User, Star, Zap } from "lucide-react"; // Modern Icons
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Modern Minimal Soccer Ball
const SoccerBallIcon = ({ size = 24, className = "", fill = "none" }: { size?: number, className?: string, fill?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill === "currentColor" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16l-4-3 .5-5 7 0 .5 5z" />
        <path d="M12 16v6" />
        <path d="M8 13L4 18" />
        <path d="M8.5 8L3 5" />
        <path d="M15.5 8L21 5" />
        <path d="M16 13l4 5" />
    </svg>
);

const tabs = [
    { icon: Star, label: "INÍCIO", href: "/" },
    { icon: LayoutList, label: "NOTÍCIAS", href: "/news" }, // Modern Feed Icon
    { icon: SoccerBallIcon, label: "JOGOS", href: "/matches" },
    { icon: User, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 pb-safe pt-2 px-6 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] md:hidden">
            <div className="flex items-center justify-between relative">
                {/* Neon Line Top */}
                <div className="absolute -top-[1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent opacity-50" />

                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="relative flex flex-col items-center justify-center w-16 h-14 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -top-2 w-12 h-[3px] bg-premium-gold rounded-full shadow-[0_2px_15px_rgb(var(--premium-gold))]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 relative",
                                isActive
                                    ? "text-premium-gold bg-premium-gold/10"
                                    : "text-zinc-500 group-hover:text-zinc-300"
                            )}>
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className={cn(
                                        "transition-all duration-300",
                                        isActive && "drop-shadow-[0_0_10px_rgb(var(--premium-gold)/0.5)] scale-110"
                                    )}
                                    // Logic for filled state: if active, fill it! 
                                    // Note: Some Lucide icons don't support 'fill' perfectly, but Star and User do. 
                                    // LayoutList doesn't usually fill well, but strokeWidth increase helps.
                                    fill={isActive && (tab.label === "INÍCIO" || tab.label === "PERFIL" || tab.label === "JOGOS") ? "currentColor" : "none"}
                                />
                            </div>

                            <span className={cn(
                                "text-[9px] font-black mt-1 tracking-widest uppercase transition-all duration-300",
                                isActive
                                    ? "text-premium-gold scale-100 translate-y-0"
                                    : "text-zinc-600 scale-75 opacity-0 translate-y-2"
                            )}>
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
