import type { ComponentProps, ComponentType } from 'react';

export const iconSizes = {
    xs: 16,
    sm: 18,
    md: 20,
    nav: 22,
    lg: 24,
    xl: 28,
} as const;

type LucideLikeIcon = ComponentType<ComponentProps<'svg'> & {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
}>;

interface AppIconProps extends Omit<ComponentProps<'svg'>, 'ref'> {
    icon: LucideLikeIcon;
    size?: keyof typeof iconSizes;
    active?: boolean;
}

/** Shared optical sizing and stroke rules for every functional icon. */
export function AppIcon({ icon: Icon, size = 'md', active = false, className = '', ...props }: AppIconProps) {
    return (
        <Icon
            aria-hidden={props['aria-label'] ? undefined : true}
            focusable="false"
            size={iconSizes[size]}
            strokeWidth={1.8}
            absoluteStrokeWidth
            className={`app-icon ${active ? 'app-icon--active' : ''} ${className}`.trim()}
            {...props}
        />
    );
}
