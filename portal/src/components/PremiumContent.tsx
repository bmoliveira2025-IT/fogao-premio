"use client";

import { useAuth } from "@/context/AuthContext";

export default function PremiumContent({ children }: { children: React.ReactNode }) {
    const { isPremium, loading } = useAuth();

    if (loading || !isPremium) {
        return null;
    }

    return <>{children}</>;
}
