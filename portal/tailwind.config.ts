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
                sans: ["Inter", "sans-serif"],
                display: ["Montserrat", "sans-serif"],
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};
export default config;
