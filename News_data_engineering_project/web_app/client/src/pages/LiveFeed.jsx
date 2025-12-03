import React, { useState, useEffect } from 'react';
import { Search, Filter, Radio } from 'lucide-react';
import axios from 'axios';
import Navigation from '../components/Navigation';

const LiveFeed = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/articles');
        setArticles(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles, using mock data", error);
        setArticles([
          { title: "SpaceX Successfully Launches Starship to Mars Orbit", publisher: "SpaceX News", published_at: new Date(), sentiment: 0.9, category: "Technology" },
          { title: "AI Breakthrough in Quantum Computing Announced", publisher: "Tech Today", published_at: new Date(), sentiment: 0.8, category: "Technology" },
          { title: "Global Markets Rally on Economic Recovery Signs", publisher: "Financial Times", published_at: new Date(), sentiment: 0.6, category: "Business" },
          { title: "New Climate Agreement Reached at Summit", publisher: "World News", published_at: new Date(), sentiment: 0.5, category: "Politics" },
          { title: "Medical Breakthrough in Cancer Treatment", publisher: "Health Daily", published_at: new Date(), sentiment: 0.7, category: "Health" },
          { title: "Championship Finals Set Record Viewership", publisher: "Sports Network", published_at: new Date(), sentiment: 0.4, category: "Sports" }
        ]);
        setLoading(false);
      }
    };
    fetchArticles();
    
    const interval = setInterval(fetchArticles, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-2xl font-mono animate-pulse">Loading Feed...</div>
      </div>
    );
  }

  const filteredArticles = articles
    .filter(article => 
      (selectedCategory === 'all' || article.category === selectedCategory) &&
      (searchTerm === '' || article.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.published_at) - new Date(a.published_at);
      if (sortBy === 'sentiment') return Math.abs(b.sentiment) - Math.abs(a.sentiment);
      return 0;
    });

  const categories = ['all', 'Technology', 'Business', 'Sports', 'Health', 'Science'];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="p-6 md:p-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold heading-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-emerald-600 neon-text">
              LIVE FEED
            </h1>
            <p className="text-xl text-green-200/60 font-light tracking-widest mt-2 uppercase">
              Real-time News Stream
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-400 animate-pulse">
            <Radio className="animate-pulse" size={20} />
            <span className="text-sm font-mono tracking-wider">STREAMING</span>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="newest">Newest First</option>
            <option value="sentiment">By Sentiment</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredArticles.map((article, idx) => (
            <div key={idx} className="glass-panel p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-cyan-400 px-2 py-1 rounded bg-cyan-400/10 border border-cyan-400/20">
                  {article.publisher}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(article.published_at).toLocaleString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                {article.title}
              </h3>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className={`flex items-center gap-1 font-mono ${article.sentiment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {article.sentiment > 0 ? '▲' : '▼'} {Math.abs(article.sentiment).toFixed(2)}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{article.category}</span>
                </div>
                <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more →
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>No articles found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
