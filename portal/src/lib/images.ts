/**
 * Safely handles image source URLs.
 * Returns a placeholder if the source is null, undefined, or "None".
 */
export function getSafeImageSrc(src?: string | null, fallback?: string): string {
    // Branded default fallback
    const defaultPlaceholder = 'https://placehold.co/800x600/111111/FFFFFF?text=FOGAO+PREMIO';

    if (!src || src === 'None' || src === '') {
        const finalFallback = fallback || defaultPlaceholder;
        // If the fallback is a generic placeholder, brand it
        if (finalFallback.includes('placehold.co') && !finalFallback.includes('text=')) {
            const separator = finalFallback.includes('?') ? '&' : '?';
            return `${finalFallback}${separator}text=FOGAO+PREMIO`;
        }
        return finalFallback;
    }

    // Ensure relative paths start with a slash for Next.js Image
    if (!src.startsWith('http') && !src.startsWith('/')) {
        return `/${src}`;
    }

    return src;
}
