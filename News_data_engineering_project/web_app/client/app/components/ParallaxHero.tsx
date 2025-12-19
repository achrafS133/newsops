'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxHeroProps {
    children: React.ReactNode;
}

export default function ParallaxHero({ children }: ParallaxHeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current || !contentRef.current || !bgRef.current) return;

        // Parallax effect for background
        gsap.to(bgRef.current, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Content fade out as you scroll
        gsap.to(contentRef.current, {
            y: -100,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div ref={heroRef} className="relative min-h-screen overflow-hidden">
            {/* Parallax Background */}
            <div ref={bgRef} className="absolute inset-0 will-change-transform">
                {/* Background effects will be passed as children */}
            </div>

            {/* Hero Content */}
            <div ref={contentRef} className="relative z-10 will-change-transform">
                {children}
            </div>
        </div>
    );
}
