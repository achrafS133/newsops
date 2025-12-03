import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="relative z-20 flex justify-between items-center px-8 py-6 md:px-12 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <Link to="/">
        <div className="text-2xl font-bold tracking-widest uppercase cursor-pointer hover:text-cyan-400 transition-colors">
          NEWS OPS
        </div>
      </Link>
      
      <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-wider">
        <Link 
          to="/dashboard" 
          className={`hover:text-gray-300 transition-colors relative group ${isActive('/dashboard') ? 'text-cyan-400' : ''}`}
        >
          Dashboard
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all ${isActive('/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
        
        <Link 
          to="/analytics" 
          className={`hover:text-gray-300 transition-colors relative group ${isActive('/analytics') ? 'text-cyan-400' : ''}`}
        >
          Analytics
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all ${isActive('/analytics') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
        
        <Link 
          to="/feed" 
          className={`hover:text-gray-300 transition-colors relative group ${isActive('/feed') ? 'text-cyan-400' : ''}`}
        >
          Live Feed
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all ${isActive('/feed') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
        
        <Link 
          to="/reports" 
          className={`hover:text-gray-300 transition-colors relative group ${isActive('/reports') ? 'text-cyan-400' : ''}`}
        >
          Reports
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all ${isActive('/reports') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
