"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    const applyTheme = (newTheme: Theme) => {
        document.documentElement.classList.remove("glorioso", "gloriosa", "biriba", "dark", "light");
        document.documentElement.classList.add(newTheme);
        document.documentElement.style.colorScheme = newTheme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute(
            'content',
            newTheme === 'dark' ? '#18181B' : '#F8F9FA'
        );
    };

    useEffect(() => {
        // Check local storage on mount
        const savedTheme = localStorage.getItem("theme");
        const initialTheme: Theme = savedTheme === "dark" || savedTheme === "glorioso" ? "dark" : "light";
        applyTheme(initialTheme);
        const frame = requestAnimationFrame(() => setTheme(initialTheme));
        return () => cancelAnimationFrame(frame);
    }, []);

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
