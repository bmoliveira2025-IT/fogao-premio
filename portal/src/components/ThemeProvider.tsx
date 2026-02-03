"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "glorioso" | "gloriosa" | "biriba"; // glorioso = dark/gold, gloriosa = pink, biriba = white

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
        if (savedTheme && ["glorioso", "gloriosa", "biriba"].includes(savedTheme)) {
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

        // Also add dark/light for compatibility with existing components
        if (newTheme === "glorioso" || newTheme === "gloriosa") {
            // Both Glorioso and Gloriosa are dark themes
            document.documentElement.classList.add("dark");
        } else if (newTheme === "biriba") {
            // Biriba is the light/white theme
            document.documentElement.classList.add("light");
        }
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
