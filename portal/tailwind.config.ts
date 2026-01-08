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
                graphite: "var(--graphite)",
                "premium-gold": "var(--premium-gold)",
                premium: {
                    gold: "var(--premium-gold)",
                    dark: "#050505",
                    gray: "#121212",
                    light: "#E5E5E5"
                }
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
