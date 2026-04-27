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
            className={`drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] ${className}`}
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--premium-gold))" />
                    <stop offset="50%" stopColor="rgb(var(--premium-gold))" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="rgb(var(--premium-gold))" />
                </linearGradient>
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer Rings - Fixed Dimensions to avoid clipping */}
            <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
            <circle cx="50" cy="50" r="44" stroke={`url(#${gradientId})`} strokeWidth="3.5" />
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />

            {/* Inner Circle Background */}
            <circle cx="50" cy="50" r="38" fill="#050505" />

            {/* The Lone Star - Centered and defined */}
            <path
                d="M50 22 L58.5 39.5 H78 L63 51.5 L68.5 69.5 L50 58.5 L31.5 69.5 L37 51.5 L22 39.5 H41.5 L50 22Z"
                fill={`url(#${gradientId})`}
                filter={`url(#${glowId})`}
                stroke="rgba(255,215,0,0.2)"
                strokeWidth="0.5"
            />
        </svg>
    );
}
