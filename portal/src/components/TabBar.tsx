"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";



function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Premium Custom SVGs ---

import { Home, FileText, Calendar } from "lucide-react";

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
            strokeWidth={active ? "2.5" : "1.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none" // Minimalist style usually avoids fill, or we can toggle it
        />
        <circle
            cx="12" cy="7" r="4"
            stroke="currentColor"
            strokeWidth={active ? "2.5" : "1.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);


const tabs = [
    { icon: IconHome, label: "INÍCIO", href: "/" },
    { icon: IconNews, label: "NOTÍCIAS", href: "/news" },
    { icon: IconGames, label: "JOGOS", href: "/matches" },
    { icon: IconProfile, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if scrolling up or at top, hide if scrolling down and not at top
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current + 10) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current - 10) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-3xl border-t border-white/[0.08] pb-safe pt-1 px-6 shadow-[0_-15px_40px_-5px_rgba(0,0,0,0.8)] md:hidden"
        >
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
