import React, { useId } from 'react';

export default function GloriosoLogo({ size = 40, className = "" }: { size?: number, className?: string }) {
    const id = useId();
    const gradientId = `gold-gradient-${id}`;
    const glowId = `glow-${id}`;

    return (
        <svg
            width={size}
            height={size}
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] ${className}`}
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--premium-gold))" />
                    <stop offset="50%" stopColor="rgb(var(--premium-gold))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(var(--premium-gold))" />
                </linearGradient>
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer Ring - 360 Motion */}
            <circle cx="50" cy="50" r="42" stroke={`url(#${gradientId})`} strokeWidth="2" strokeOpacity="0.3" />

            {/* Dynamic Swirls */}
            <path
                d="M50 10 A40 40 0 0 1 90 50"
                stroke={`url(#${gradientId})`}
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-[spin_3s_linear_infinite]"
                style={{ transformOrigin: "50px 50px" }}
            />
            <path
                d="M50 90 A40 40 0 0 1 10 50"
                stroke={`url(#${gradientId})`}
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-[spin_3s_linear_infinite]"
                style={{ transformOrigin: "50px 50px", animationDelay: "-1.5s" }}
            />

            {/* Inner Circle Background */}
            <circle cx="50" cy="50" r="35" fill="currentColor" className="text-black dark:text-black opacity-90" />

            {/* The Lone Star */}
            <path
                d="M50 25 L57 40 H74 L61 51 L66 67 L50 57 L34 67 L39 51 L26 40 H43 L50 25Z"
                fill={`url(#${gradientId})`}
                filter={`url(#${glowId})`}
            />
        </svg>
    );
}
