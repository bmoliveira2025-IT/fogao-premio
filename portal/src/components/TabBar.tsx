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
    { icon: User, label: "PERFIL", path: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 w-full">
            <div className="bg-white dark:bg-black px-6 py-4 flex justify-around items-center border-t border-foreground/10 dark:border-premium-gold/10 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-colors duration-300">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "group flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 relative",
                                isActive ? "text-premium-gold" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-xl transition-all duration-300",
                                isActive ? "bg-premium-gold/10" : "group-hover:bg-foreground/5"
                            )}>
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="premium-caps text-[9px] tracking-[0.2em] font-bold">{item.label}</span>
                            {isActive && (
                                <div className="absolute -top-4 w-12 h-[3px] bg-premium-gold shadow-[0_0_10px_#D4AF37] rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
