'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/feed', label: 'Live Feed' },
        { href: '/reports', label: 'Reports' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-widest uppercase font-display hover:text-cyan-400 transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        NEWS OPS
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-semibold uppercase tracking-wider transition-colors duration-300 group ${pathname === link.href
                                        ? 'text-cyan-400'
                                        : 'text-white hover:text-cyan-400'
                                    }`}
                                style={{ fontFamily: 'var(--font-primary)' }}
                            >
                                {link.label}
                                <span
                                    className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${pathname === link.href
                                            ? 'w-full'
                                            : 'w-0 group-hover:w-full'
                                        }`}
                                ></span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 z-50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div
                            className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                }`}
                        ></div>
                        <div
                            className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                                }`}
                        ></div>
                        <div
                            className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                }`}
                        ></div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl transition-all duration-500 ${mobileMenuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                style={{ top: '80px' }}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-3xl font-bold uppercase tracking-wider transition-all duration-300 ${pathname === link.href
                                    ? 'text-cyan-400 scale-110'
                                    : 'text-white hover:text-cyan-400 hover:scale-110'
                                }`}
                            style={{
                                fontFamily: 'var(--font-display)',
                                animationDelay: `${index * 0.1}s`,
                                animation: mobileMenuOpen
                                    ? 'fadeInUp 0.5s ease-out forwards'
                                    : 'none',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
