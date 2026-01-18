"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, FileText, Calendar, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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

// 4. Profile (User) - Keep existing Custom SVG
const IconProfile = ({ active, className }: { active: boolean, className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            className="transition-all"
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="currentColor"
            strokeWidth={active ? 2.5 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none" // Minimalist style usually avoids fill, or we can toggle it
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


const tabs = [
    { icon: IconHome, label: "INÍCIO", href: "/" },
    { icon: IconNews, label: "NOTÍCIAS", href: "/news" },
    { icon: ({ active, className }: any) => <Play className={className} strokeWidth={active ? 2.5 : 1.5} />, label: "VÍDEOS", href: "/videos" },
    { icon: IconGames, label: "JOGOS", href: "/matches" },
    { icon: IconProfile, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();
    const { points } = useAuth();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505] h-16 md:hidden border-t border-white/[0.08]" />;
    }

    return (
        <nav className="fixed inset-x-0 bottom-0 z-[999] bg-[#050505]/95 backdrop-blur-3xl border-t border-white/[0.08] pb-safe pt-1 px-2 shadow-[0_-15px_40px_-5px_rgba(0,0,0,0.8)] md:hidden transform translate-z-0">
            <div className="flex items-center justify-between relative">
                {/* Premium Gold Line */}
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80" />

                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            className="relative flex flex-col items-center justify-center flex-1 h-16 group outline-none"
                        >
                            {/* Active Indicator Light - Subtle Glow behind icon */}
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-premium-gold/15 blur-xl" />
                                </div>
                            )}

                            <div className={cn(
                                "relative flex items-center justify-center transition-all duration-300",
                                isActive
                                    ? "text-premium-gold -translate-y-1.5"
                                    : "text-zinc-500 group-hover:text-white"
                            )}>
                                <Icon
                                    active={isActive}
                                    className={cn(
                                        "w-[28px] h-[28px]", // Slightly larger for better reachability
                                        isActive && "drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                                    )}
                                />

                                {/* Points Badge for Profile */}
                                {tab.label === "PERFIL" && points > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-premium-gold text-black text-[9px] font-black px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center border border-black shadow-lg">
                                        {points > 999 ? "1k+" : points}
                                    </div>
                                )}

                                {/* Active Dot */}
                                {isActive && (
                                    <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-premium-gold" />
                                )}
                            </div>

                            <span className={cn(
                                "text-[11px] font-bold mt-1 tracking-tight uppercase transition-all duration-300 font-sans whitespace-nowrap",
                                isActive
                                    ? "opacity-100 scale-100 text-premium-gold"
                                    : "opacity-40 scale-90 text-zinc-400 group-hover:opacity-70"
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
