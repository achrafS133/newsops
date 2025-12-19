'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({
    children,
    variant = 'default',
    className = '',
    ...props
}: BadgeProps) {
    const variants = {
        default: 'bg-gray-500/20 text-gray-400',
        success: 'bg-green-500/20 text-green-400',
        warning: 'bg-orange-500/20 text-orange-400',
        error: 'bg-red-500/20 text-red-400',
        info: 'bg-cyan-500/20 text-cyan-400',
    };

    return (
        <span
            className={`inline-block px-3 py-1 text-xs uppercase tracking-wider rounded-full ${variants[variant]} ${className}`}
            style={{ fontFamily: 'var(--font-primary)' }}
            {...props}
        >
            {children}
        </span>
    );
}
