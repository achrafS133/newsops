'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'glass-strong';
    hover?: boolean;
}

export function Card({
    children,
    variant = 'default',
    hover = true,
    className = '',
    ...props
}: CardProps) {
    const variants = {
        default: 'bg-white/5 border border-white/10',
        glass: 'glassmorphism',
        'glass-strong': 'glassmorphism-strong',
    };

    const variantClass = variants[variant];
    const hoverClass = hover
        ? 'hover:scale-[1.02] hover:glassmorphism-strong'
        : '';

    return (
        <div
            className={`rounded-xl p-6 transition-all duration-300 ${variantClass} ${hoverClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={`text-2xl font-bold ${className}`}
            style={{ fontFamily: 'var(--font-display)' }}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={`text-sm text-gray-400 ${className}`}
            style={{ fontFamily: 'var(--font-body)' }}
            {...props}
        >
            {children}
        </p>
    );
}

export function CardContent({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`mt-4 pt-4 border-t border-white/10 ${className}`} {...props}>
            {children}
        </div>
    );
}
