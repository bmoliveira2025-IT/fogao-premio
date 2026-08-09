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
                src="/loading-player.png"
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
            <div className={styles.goldAura} aria-hidden="true" />
            <div className={styles.lightSweep} aria-hidden="true" />
            <div className={styles.particles} aria-hidden="true">
                <i /><i /><i /><i /><i /><i />
            </div>

            <div className={styles.content}>
                <div className={styles.wordmark} aria-hidden="true">
                    <span>FOGÃO</span><strong>360</strong>
                </div>
                <p className={styles.tagline}>O BOTAFOGO EM TODOS OS ÂNGULOS</p>

                <div className={styles.progress} aria-hidden="true">
                    <span />
                </div>
                <p className={styles.loadingLabel}>CARREGANDO</p>
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
