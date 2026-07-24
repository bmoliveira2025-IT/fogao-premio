import { SplashBrand } from "@/components/InitialSplash";
import styles from "@/components/InitialSplash.module.css";

export default function Loading() {
    return (
        <div className={styles.screen} role="status" aria-label="Carregando conteúdo">
            <SplashBrand />
        </div>
    );
}
