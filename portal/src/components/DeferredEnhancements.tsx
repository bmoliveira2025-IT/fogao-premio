"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AutoRefresh = dynamic(() => import("./AutoRefresh"));
const NotificationManager = dynamic(() => import("./NotificationManager"));
const InstallPrompt = dynamic(() => import("./InstallPrompt"));
const MorningBriefingPopup = dynamic(() => import("./MorningBriefingPopup"));

type NetworkInformation = {
    effectiveType?: string;
    saveData?: boolean;
};

export default function DeferredEnhancements() {
    const [ready, setReady] = useState(false);
    const [showBriefing, setShowBriefing] = useState(false);

    useEffect(() => {
        const briefingRequested = new URLSearchParams(window.location.search).get("briefing") === "true";
        const briefingTimeout = window.setTimeout(() => setShowBriefing(briefingRequested), 0);

        const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
        const isSlow = connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g";
        const delay = isSlow ? 12000 : 2500;

        if (isSlow) document.documentElement.dataset.constrained = "true";

        const timeout = window.setTimeout(() => setReady(true), delay);
        const reveal = () => {
            window.clearTimeout(timeout);
            window.clearTimeout(briefingTimeout);
            setReady(true);
        };

        if (!isSlow) {
            window.addEventListener("pointerdown", reveal, { once: true, passive: true });
            window.addEventListener("keydown", reveal, { once: true });
        }

        return () => {
            window.clearTimeout(timeout);
            window.removeEventListener("pointerdown", reveal);
            window.removeEventListener("keydown", reveal);
            delete document.documentElement.dataset.constrained;
        };
    }, []);

    return (
        <>
            {showBriefing && <MorningBriefingPopup />}
            {ready && (
                <>
                    <AutoRefresh />
                    <NotificationManager />
                    <InstallPrompt />
                </>
            )}
        </>
    );
}
