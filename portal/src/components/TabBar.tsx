import { usePathname } from "next/navigation";
import Link from "next/link";
import { Newspaper, User, Star } from "lucide-react"; // Removed Home, Trophy
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Custom Soccer Ball Icon
const SoccerBallIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
        <path d="M12 2v20" />
        <path d="M4.93 4.93l14.14 14.14" />
        <path d="M19.07 4.93L4.93 19.07" />
    </svg>
);

// Better Soccer Ball (Simple Geometric)
const SoccerBallSimple = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16l-4.2-3 .6-4.9 7.2 0 .6 4.9z" />
        <path d="M12 16v6" />
        <path d="M7.8 13L4 18" />
        <path d="M8.4 8.1L3 5" />
        <path d="M15.6 8.1L21 5" />
        <path d="M16.2 13l3.8 5" />
    </svg>
);

const tabs = [
    { icon: Star, label: "INÍCIO", href: "/" }, // Changed Home to Star
    { icon: Newspaper, label: "NOTÍCIAS", href: "/news" },
    { icon: SoccerBallSimple, label: "JOGOS", href: "/matches" }, // Changed Trophy to Soccer Ball
    { icon: User, label: "PERFIL", href: "/profile" },
];

export default function TabBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe pt-2 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:hidden">
            <div className="flex items-center justify-between relative">
                {/* Glow Effect Top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent" />

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
                                    className="absolute -top-2 w-8 h-1 bg-premium-gold rounded-full shadow-[0_0_15px_rgb(var(--premium-gold))]"
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
                                        isActive && "drop-shadow-[0_0_8px_rgb(var(--premium-gold)/0.6)]"
                                    )}
                                    // Make the Star fill if active for extra pop
                                    fill={isActive && tab.label === "INÍCIO" ? "currentColor" : "none"}
                                />
                            </div>

                            <span className={cn(
                                "text-[9px] font-black mt-1 tracking-widest uppercase transition-all duration-300",
                                isActive
                                    ? "text-premium-gold scale-100 translate-y-0"
                                    : "text-zinc-600 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
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
