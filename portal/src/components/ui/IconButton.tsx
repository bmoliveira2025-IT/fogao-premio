import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    children: ReactNode;
    compact?: boolean;
}

/** Accessible icon-only control with a consistent mouse and touch target. */
export function IconButton({ label, children, compact = false, className = '', ...props }: IconButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            className={`icon-button ${compact ? 'icon-button--compact' : ''} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
}
