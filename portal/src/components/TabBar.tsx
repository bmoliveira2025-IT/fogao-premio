"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Premium Custom SVGs ---

// 1. Star (Home) - Crisp geometric start
const IconStar = ({ active, className }: { active: boolean, className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 2. News (Modern Feed/Newspaper) - Elegant lines
const IconNews = ({ active, className }: { active: boolean, className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M7 7H17" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 12H17" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 17H13" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// 3. Soccer Ball (Games) - Geometric precision
const IconSoccer = ({ active, className }: { active: boolean, className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle
            cx="12" cy="12" r="10"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
        />
        {/* Pattern inside - if active (filled), lines need to be inverted (transparent or black) */}
        <path
            d="M12 16L8.5 13.5L9 9.5H15L15.5 13.5L12 16Z"
            stroke={active ? "black" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M12 16V22" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 13.5L4 17" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 9.5L5.5 6" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 9.5L18.5 6" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 13.5L20 17" stroke={active ? "black" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// 4. Profile (User) - Clean
const IconProfile = ({ active, className }: { active: boolean, className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            classes="transition-all"
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? "currentColor" : "none"}
        />
        <circle
            cx="12" cy="7" r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? "currentColor" : "none"}
        />
    </svg>
);


const tabs = [
    { icon: IconStar, label: "INÍCIO", href: "/" },
    { icon: IconNews, label: "NOTÍCIAS", href: "/news" },
    { icon: IconSoccer, label: "JOGOS", href: "/matches" },
    { icon: IconProfile, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-3xl border-t border-white/[0.08] pb-safe pt-1 px-6 shadow-[0_-15px_40px_-5px_rgba(0,0,0,0.8)] md:hidden">
            <div className="flex items-center justify-between relative">
                {/* Premium Gold Line */}
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80" />

                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="relative flex flex-col items-center justify-center w-16 h-14 group"
                        >
                            {/* Active Indicator Light */}
                            {isActive && (
                                <div className="absolute top-0 w-8 h-8 rounded-full bg-premium-gold/20 blur-xl pointer-events-none" />
                            )}

                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 transition-all duration-500",
                                isActive
                                    ? "text-premium-gold -translate-y-1"
                                    : "text-[#666] group-hover:text-white"
                            )}>
                                <Icon
                                    active={isActive}
                                    className={cn(
                                        "w-[26px] h-[26px]", // Slightly larger icon size
                                        isActive && "drop-shadow-[0_0_12px_rgba(255,32,176,0.6)]"
                                    )}
                                />
                            </div>

                            <span className={cn(
                                "text-[9px] font-black mt-0.5 tracking-[0.2em] uppercase transition-all duration-300",
                                isActive
                                    ? "text-premium-gold scale-100 opacity-100"
                                    : "text-zinc-600 scale-90 opacity-0 group-hover:opacity-100"
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
