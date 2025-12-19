import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from './assets/news_hero_background.png';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 animate-fade-in"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/90"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 md:px-12 animate-slide-up">
        <div className="text-2xl font-bold tracking-widest uppercase">
          NEWS OPS
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-wider">
          <Link to="/dashboard" className="hover:text-gray-300 transition-colors relative group">
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/analytics" className="hover:text-gray-300 transition-colors relative group">
            Analytics
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/feed" className="hover:text-gray-300 transition-colors relative group">
            Live Feed
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/reports" className="hover:text-gray-300 transition-colors relative group">
            Reports
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
          </Link>
        </div>
        <div className="md:hidden">
          {/* Mobile Menu Icon */}
          <div className="space-y-1.5 cursor-pointer">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-[80vh] px-8 md:px-20 max-w-7xl mx-auto">
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-tight mb-6 max-w-4xl">
            News<br/>Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-10 font-light leading-relaxed">
            Real-time AI-powered analytics for global news monitoring. 
            Track sentiment, analyze trends, and uncover insights across thousands of sources worldwide.
          </p>

          <Link 
            to="/dashboard"
            className="inline-block group relative px-10 py-4 border border-white text-white font-semibold uppercase tracking-[0.15em] text-sm overflow-hidden transition-all duration-300 hover:text-black hover:bg-white"
          >
            <span className="relative z-10">Explore Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

    </div>
  );
};

export default LandingPage;


