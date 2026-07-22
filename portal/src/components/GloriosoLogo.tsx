import React, { useId } from 'react';

interface GloriosoLogoProps {
    size?: number;
    className?: string;
    withText?: boolean;
}

export default function GloriosoLogo({ size = 42, className = "", withText = false }: GloriosoLogoProps) {
    const id = useId();
    const gradientId = `gold-grad-${id}`;
    const darkGradId = `dark-grad-${id}`;
    const glowId = `glow-${id}`;

    const logoSvg = (
        <svg
            width={size}
            height={size}
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${className}`}
        >
            <defs>
                {/* 3D Gold Metallic Gradient */}
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF1B0" />
                    <stop offset="30%" stopColor="#F5C518" />
                    <stop offset="70%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#996515" />
                </linearGradient>

                {/* Dark Metallic Radial Gradient */}
                <radialGradient id={darkGradId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1c1c20" />
                    <stop offset="100%" stopColor="#09090b" />
                </radialGradient>

                {/* Soft Gold Glow */}
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer Gold Border Ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

            {/* Shield Body */}
            <circle cx="50" cy="50" r="41" fill={`url(#${darkGradId})`} />

            {/* Inner Gold Rim */}
            <circle cx="50" cy="50" r="38" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.8" strokeOpacity="0.4" />

            {/* Botafogo Lone Star */}
            <path
                d="M50 20 L58.5 37.5 H78 L63 49.5 L68.5 67.5 L50 56.5 L31.5 67.5 L37 49.5 L22 37.5 H41.5 L50 20Z"
                fill={`url(#${gradientId})`}
                filter={`url(#${glowId})`}
            />

            {/* Star Highlight Overlay */}
            <path
                d="M50 20 L58.5 37.5 L50 49.5 L41.5 37.5 Z"
                fill="rgba(255,255,255,0.25)"
            />
        </svg>
    );

    if (!withText) {
        return logoSvg;
    }

    return (
        <div className="flex items-center gap-2.5 group">
            {logoSvg}
            <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1">
                    <span className="font-black text-[18px] tracking-tight text-zinc-900 dark:text-white uppercase font-sans">
                        FOGÃO
                    </span>
                    <span className="font-black text-[18px] tracking-tight text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20 font-sans">
                        360
                    </span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase mt-0.5">
                    O PORTAL DO BOTAFOGO
                </span>
            </div>
        </div>
    );
}

