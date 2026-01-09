"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Newspaper, Trophy, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: Home, label: "INÍCIO", path: "/" },
    { icon: Newspaper, label: "NOTÍCIAS", path: "/news" },
    { icon: Trophy, label: "JOGOS", path: "/matches" },
const tabs = [ // Renamed navItems to tabs and path to href
    { icon: Home, label: "INÍCIO", href: "/" },
    { icon: Newspaper, label: "NOTÍCIAS", href: "/news" },
    { icon: Trophy, label: "JOGOS", href: "/matches" },
    { icon: User, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();
    const isPremium = false; // Placeholder for isPremium, adjust as needed
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-white/5 pb-safe pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:hidden">
            <div className="flex items-center justify-between">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            onClick={() => {
                                if (tab.href === '/premium' && !isPremium) {
                                    // handle premium click if needed
                                }
                            }}
                            className="relative flex flex-col items-center justify-center w-16 h-14 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -top-2 w-10 h-1 bg-premium-gold rounded-full shadow-[0_0_10px_rgb(var(--premium-gold))]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-300 relative",
                                isActive
                                    ? "text-premium-gold bg-premium-gold/10"
                                    : "text-zinc-500 group-hover:text-white"
                            )}>
                                <Icon
                                    size={isActive ? 24 : 22}
                                    className={cn(
                                        "transition-all duration-300",
                                        isActive && "drop-shadow-[0_0_8px_rgb(var(--premium-gold)/0.5)]"
                                    )}
                                />
                            </div>

                            <span className={cn(
                                "text-[9px] font-bold mt-1 tracking-widest uppercase transition-all duration-300",
                                isActive
                                    ? "text-premium-gold scale-100"
                                    : "text-zinc-500 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
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
