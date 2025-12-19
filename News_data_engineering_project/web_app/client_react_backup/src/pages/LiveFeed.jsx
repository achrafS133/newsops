import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';

const LiveFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles');
        setArticles(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles", error);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold heading-font tracking-tighter text-white neon-text">
            LIVE FEED
          </h1>
          <p className="text-lg text-gray-400 font-light tracking-widest mt-2 uppercase">
            Global News Stream
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search intelligence database..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2">
          <Filter size={20} />
          <span className="hidden md:inline">FILTER</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono">ESTABLISHING UPLINK...</div>
        ) : (
          articles.map((article, idx) => (
            <div key={idx} className="glass-panel p-6 hover:border-cyan-500/30 transition-colors group">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 uppercase">
                      {article.publisher}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(article.published_at).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 font-mono px-2 py-0.5 border border-gray-700 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`${article.sentiment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      Sentiment: {article.sentiment.toFixed(3)}
                    </span>
                    <span>Topic: {article.topic_label || 'General'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
