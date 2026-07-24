"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./InitialSplash.module.css";

interface SplashBrandProps {
    onLogoReady?: () => void;
}

export function SplashBrand({ onLogoReady }: SplashBrandProps = {}) {
    return (
        <div className={styles.brand}>
            <div className={styles.logoHalo} aria-hidden="true" />
            <div className={styles.logoWrap}>
                <Image
                    src="/splash-logo.png"
                    alt=""
                    width={150}
                    height={150}
                    priority
                    unoptimized
                    className={styles.logo}
                    onLoad={onLogoReady}
                    onError={onLogoReady}
                />
            </div>

            <div className={styles.wordmark} aria-hidden="true">
                <span>FOGÃO</span><strong>360</strong>
            </div>
            <p className={styles.tagline}>O BOTAFOGO EM TODOS OS ÂNGULOS</p>

            <div className={styles.progress} aria-hidden="true">
                <span />
            </div>
        </div>
    );
}

export default function InitialSplash() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [logoReady, setLogoReady] = useState(false);

    useEffect(() => {
        if (!logoReady) return;

        const startFade = window.setTimeout(() => setFadeOut(true), 1050);
        const removeSplash = window.setTimeout(() => setVisible(false), 1500);
        return () => {
            window.clearTimeout(startFade);
            window.clearTimeout(removeSplash);
        };
    }, [logoReady]);

    useEffect(() => {
        const safetyTimer = window.setTimeout(() => setLogoReady(true), 4000);
        return () => window.clearTimeout(safetyTimer);
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`${styles.screen} ${fadeOut ? styles.leaving : ""}`}
            role="status"
            aria-live="polite"
            aria-label="Carregando o aplicativo Fogão 360"
        >
            <SplashBrand onLogoReady={() => setLogoReady(true)} />
        </div>
    );
}
