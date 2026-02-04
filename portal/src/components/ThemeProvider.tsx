"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "glorioso" | "gloriosa"; // glorioso = dark/gold, gloriosa = pink

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("glorioso"); // Default: Glorioso (dark)

    useEffect(() => {
        // Check local storage on mount
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme && ["glorioso", "gloriosa"].includes(savedTheme)) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            // Default to Glorioso (dark)
            applyTheme("glorioso");
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        // Remove all theme classes
        document.documentElement.classList.remove("glorioso", "gloriosa", "biriba", "dark", "light");

        // Add new theme class
        document.documentElement.classList.add(newTheme);

        // Always add dark for compatibility with existing components since both remaining themes are dark
        document.documentElement.classList.add("dark");
    };

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
