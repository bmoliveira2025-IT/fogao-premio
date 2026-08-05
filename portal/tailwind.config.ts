import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "card-bg": "var(--card-bg)",
                card: "var(--card-bg)",
                graphite: "var(--graphite)",
                "premium-gold": "rgb(var(--premium-gold) / <alpha-value>)",
                premium: {
                    gold: "rgb(var(--premium-gold) / <alpha-value>)",
                    dark: "#050505",
                    gray: "#121212",
                    light: "#E5E5E5"
                },
                "social-tiktok": "#22d3ee", // cyan-400
                "social-instagram": "#ec4899", // pink-500
                "social-twitter": "#60a5fa", // blue-400
                "social-facebook": "#2563eb", // blue-600
            },
            fontFamily: {
                sans: ["var(--font-roboto)", "sans-serif"],
                display: ["var(--font-roboto)", "sans-serif"],
                serif: ["var(--font-roboto)", "sans-serif"],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'scale-up': 'scaleIn 0.3s ease-out forwards',
            },
            boxShadow: {
                'premium': '0 20px 40px rgba(0, 0, 0, 0.4)',
                'gold-glow': '0 0 20px rgba(255, 215, 0, 0.15), 0 0 40px rgba(255, 215, 0, 0.05)',
                'card-hover': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
            },
            transitionTimingFunction: {
                'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'cinematic': 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};
export default config;
