'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'default' | 'outline' | 'ghost' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {
    const variants = {
        default: 'bg-cyan-500 hover:bg-cyan-600 text-white',
        outline: 'border-2 border-white/20 hover:border-cyan-400 hover:text-cyan-400',
        ghost: 'hover:bg-white/10',
        gradient: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:scale-105 ${variants[variant]} ${sizes[size]} ${className}`}
            style={{ fontFamily: 'var(--font-primary)' }}
            {...props}
        >
            {children}
        </button>
    );
}
