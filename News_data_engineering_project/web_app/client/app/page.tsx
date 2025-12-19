'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import AnimatedSection from './components/AnimatedSection';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">

      {/* Navigation */}
      <Navigation />

      {/* Hero Section - News Theme */}
      <section className="relative flex flex-col justify-center min-h-screen px-6 md:px-20 max-w-7xl mx-auto pt-20">
        {/* Hero Background Image - World News Globe */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black z-10"></div>
          <img
            src="/images/world_news_globe_1764959662653.png"
            alt="Global News Coverage"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className={`relative z-20 space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Heading - News Focused */}
          <h1
            className="text-7xl md:text-9xl lg:text-[12rem] font-bold uppercase leading-none mb-6 animate-fade-in"
            style={{
              fontFamily: 'var(--font-display)',
              animationDelay: '0.2s',
              animationFillMode: 'backwards',
              letterSpacing: '-0.02em'
            }}
          >
            MAKING<br />
            NEWS<br />
            <span className="text-gradient-primary">
              INTELLIGENT
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-xl md:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed animate-fade-in"
            style={{
              fontFamily: 'var(--font-body)',
              animationDelay: '0.6s',
              animationFillMode: 'backwards'
            }}
          >
            We built this platform under the belief that a future where humanity stays informed through AI-powered intelligence is fundamentally more exciting than one where we are not.
          </p>

          {/* CTA Button */}
          <div
            className="pt-6 animate-fade-in"
            style={{
              animationDelay: '0.8s',
              animationFillMode: 'backwards'
            }}
          >
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-black transition-all duration-300">
                EXPLORE
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="relative z-10 px-6 md:px-20 py-32 max-w-6xl mx-auto bg-black">
        <AnimatedSection animation="fadeUp">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 uppercase" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              THE MISSION
            </h2>
            <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
              Real-time global news monitoring with AI-powered sentiment analysis.
              Track breaking stories, analyze trends, and uncover insights across thousands of sources worldwide.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section with News Images */}
      <AnimatedSection animation="fadeUp" className="relative z-10 px-6 md:px-20 py-20 max-w-7xl mx-auto bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-white/10">
          {[
            {
              title: 'GLOBAL NEWSROOM',
              desc: '142+ countries monitored 24/7',
              image: '/images/news_press_room_1764959615200.png'
            },
            {
              title: 'AI INTELLIGENCE',
              desc: 'Advanced sentiment & trend detection',
              image: '/images/digital_newspapers_1764959636885.png'
            },
            {
              title: 'REAL-TIME DATA',
              desc: 'Live streaming news analytics',
              image: '/images/world_news_globe_1764959662653.png'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="relative group overflow-hidden bg-black"
              style={{ aspectRatio: '1/1' }}
            >
              {/* Feature Image */}
              <img
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold mb-2 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Stats Section - Minimalist */}
      <AnimatedSection animation="fadeUp" className="relative z-10 px-6 md:px-20 py-32 max-w-7xl mx-auto bg-black border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: '10,000+', label: 'ARTICLES DAILY' },
            { value: '142', label: 'COUNTRIES' },
            { value: '99.9%', label: 'UPTIME' },
            { value: '24/7', label: 'MONITORING' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-primary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA Section - SpaceX Style */}
      <AnimatedSection animation="fadeUp" className="relative z-10 px-6 md:px-20 py-32 max-w-5xl mx-auto text-center bg-black">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 uppercase" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          STAY INFORMED
        </h2>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light" style={{ fontFamily: 'var(--font-body)' }}>
          Join leading organizations using our AI-powered platform to monitor global news trends and make data-driven decisions.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-black transition-all duration-300 min-w-[200px]">
              DASHBOARD
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-black transition-all duration-300 min-w-[200px]">
              ANALYTICS
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Footer - Minimal */}
      <footer className="relative z-10 px-6 py-12 text-center text-gray-500 text-xs bg-black border-t border-white/5 uppercase tracking-widest" style={{ fontFamily: 'var(--font-primary)' }}>
        <p>NEWS INTELLIGENCE © 2024</p>
      </footer>
    </div>
  );
}
