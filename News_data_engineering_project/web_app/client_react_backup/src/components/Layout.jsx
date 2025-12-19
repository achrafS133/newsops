import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Twitter, Linkedin } from 'lucide-react';
import bgTexture from '../assets/news_hero_background.png';

const Layout = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isLanding) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black flex flex-col relative">
            {/* Global Background Texture */}
            <div
                className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `url(${bgTexture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            ></div>

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-[0.2em] uppercase hover:text-cyan-400 transition-colors relative group">
                        News Ops
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-[0.15em]">
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/analytics">Analytics</NavLink>
                        <NavLink to="/feed">Live Feed</NavLink>
                        <NavLink to="/reports">Reports</NavLink>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white hover:text-cyan-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-8 text-xl font-bold uppercase tracking-widest">
                            <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                            <MobileNavLink to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>Analytics</MobileNavLink>
                            <MobileNavLink to="/feed" onClick={() => setIsMobileMenuOpen(false)}>Live Feed</MobileNavLink>
                            <MobileNavLink to="/reports" onClick={() => setIsMobileMenuOpen(false)}>Reports</MobileNavLink>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-grow pt-20 relative z-10">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md py-12 mt-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-xl font-bold tracking-widest uppercase mb-4">News Intelligence</h4>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                            Advanced AI-powered analytics platform for real-time global monitoring.
                            Tracking sentiment, mapping geopolitical shifts, and uncovering hidden patterns.
                        </p>
                    </div>

                    <div>
                        <h5 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">Platform</h5>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Mission Control</Link></li>
                            <li><Link to="/analytics" className="hover:text-cyan-400 transition-colors">Deep Analytics</Link></li>
                            <li><Link to="/feed" className="hover:text-cyan-400 transition-colors">Global Stream</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">Connect</h5>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-gray-600 uppercase tracking-wider">
                    © 2025 News Intelligence Ops. All Systems Nominal.
                </div>
            </footer>
        </div>
    );
};

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`relative py-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
            {children}
            {isActive && (
                <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}
        </Link>
    );
};

const MobileNavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`block py-2 border-b border-white/10 ${isActive ? 'text-cyan-400' : 'text-white'}`}
        >
            {children}
        </Link>
    );
};

export default Layout;
