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
                premium: {
                    black: "#050505",
                    gray: "#121212",
                    lightGray: "#1a1a1a",
                    gold: "#D4AF37",
                    goldMuted: "#AA8A2E",
                }
            },
            fontFamily: {
                inter: ["var(--font-inter)"],
                montserrat: ["var(--font-montserrat)"],
            },
            backgroundImage: {
                'premium-gradient': 'linear-gradient(180deg, #121212 0%, #050505 100%)',
            }
        },
    },
    plugins: [],
};
export default config;
