import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">

            {/* Premium Gradient Background */}
            <div className="absolute inset-0 z-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

                {/* Animated overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20 animate-pulse"></div>

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-20 flex justify-between items-center px-8 py-6 md:px-12">
                <div className="text-2xl font-bold tracking-widest uppercase">
                    NEWS OPS
                </div>
                <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-wider">
                    <Link to="/dashboard" className="hover:text-cyan-400 transition-colors relative group">
                        Dashboard
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link to="/analytics" className="hover:text-cyan-400 transition-colors relative group">
                        Analytics
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link to="/feed" className="hover:text-cyan-400 transition-colors relative group">
                        Live Feed
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link to="/reports" className="hover:text-cyan-400 transition-colors relative group">
                        Reports
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                    </Link>
                </div>
                <div className="md:hidden">
                    <div className="space-y-1.5 cursor-pointer">
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col justify-center h-[80vh] px-8 md:px-20 max-w-7xl mx-auto">
                <div className="space-y-6">
                    <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-mono mb-4">
                        ⚡ REAL-TIME INTELLIGENCE
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none mb-6">
                        News<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                            Intelligence
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed">
                        Real-time AI-powered analytics for global news monitoring.
                        Track sentiment, analyze trends, and uncover insights across thousands of sources worldwide.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Link
                            to="/dashboard"
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold uppercase tracking-wider text-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] text-center"
                        >
                            <span className="relative z-10">Explore Dashboard</span>
                        </Link>

                        <Link
                            to="/analytics"
                            className="group relative px-8 py-4 border-2 border-white/20 text-white font-bold uppercase tracking-wider text-sm rounded-lg transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 text-center"
                        >
                            View Analytics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

        </div>
    );
};

export default LandingPage;
