'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
    children: ReactNode;
    animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
    delay?: number;
    duration?: number;
    className?: string;
}

export default function AnimatedSection({
    children,
    animation = 'fadeUp',
    delay = 0,
    duration = 0.8,
    className = '',
}: AnimatedSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const element = sectionRef.current;

        // Animation configurations
        const animations = {
            fadeUp: {
                y: 60,
                opacity: 0,
                duration,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1,
                },
            },
            fadeIn: {
                opacity: 0,
                duration,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            },
            slideLeft: {
                x: 100,
                opacity: 0,
                duration,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1,
                },
            },
            slideRight: {
                x: -100,
                opacity: 0,
                duration,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1,
                },
            },
            scale: {
                scale: 0.8,
                opacity: 0,
                duration,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1,
                },
            },
        };

        const config = animations[animation];

        gsap.from(element, {
            ...config,
            delay,
            ease: 'power3.out',
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [animation, delay, duration]);

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    );
}
