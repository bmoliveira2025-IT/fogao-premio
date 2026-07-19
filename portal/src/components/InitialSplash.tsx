"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../app/loading.module.css";

export default function InitialSplash() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = window.setTimeout(() => setVisible(false), 1200);
        return () => window.clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={styles.loadingScreen} role="status" aria-live="polite">
            <div className={styles.crestScene} aria-hidden="true">
                <div className={styles.crest}>
                    <Image
                        src="/logo-shield-360.png"
                        alt=""
                        width={154}
                        height={154}
                        priority
                    />
                </div>
            </div>

            <div className={styles.copy}>
                <span className={styles.eyebrow}>FOGÃO PRÊMIO</span>
                <span className={styles.loadingText}>Carregando</span>
                <span className={styles.dots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </span>
            </div>
            <span className={styles.srOnly}>Carregando o aplicativo</span>
        </div>
    );
}
