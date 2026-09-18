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
            <Image
                src="/loading-botafogo-shirt.png"
                alt=""
                fill
                sizes="100vw"
                priority
                unoptimized
                className={styles.heroImage}
                onLoad={onLogoReady}
                onError={onLogoReady}
            />
            <div className={styles.vignette} aria-hidden="true" />
            <div className={styles.lightBeam} aria-hidden="true" />
            <div className={styles.focusRing} aria-hidden="true" />

            <div className={styles.content}>
                <div className={styles.brandLine} aria-hidden="true">
                    <span>FOGÃO</span><strong>360</strong>
                </div>
                <div className={styles.progress} aria-hidden="true">
                    <span />
                </div>
                <p className={styles.loadingLabel}>CARREGANDO</p>
            </div>
        </div>
    );
}

export default function InitialSplash() {
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [logoReady, setLogoReady] = useState(false);

    useEffect(() => {
        // Show only once per browser session
        if (sessionStorage.getItem('fogao_splash_seen')) {
            return;
        }
        setVisible(true);

        const safetyTimer = window.setTimeout(() => setLogoReady(true), 1200);
        return () => window.clearTimeout(safetyTimer);
    }, []);

    useEffect(() => {
        if (!logoReady || !visible) return;

        sessionStorage.setItem('fogao_splash_seen', '1');
        const startFade = window.setTimeout(() => setFadeOut(true), 400);
        const removeSplash = window.setTimeout(() => setVisible(false), 700);
        return () => {
            window.clearTimeout(startFade);
            window.clearTimeout(removeSplash);
        };
    }, [logoReady, visible]);

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
