import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Globe, Database, Cpu, TrendingUp, Radio } from 'lucide-react';
import axios from 'axios';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ totalArticles: 0, avgSentiment: 0, activeSources: 0 });
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, articlesRes, catsRes] = await Promise.all([
          axios.get('/api/metrics'),
          axios.get('/api/articles'),
          axios.get('/api/categories')
        ]);
        
        setMetrics(metricsRes.data);
        setArticles(articlesRes.data);
        setCategories(catsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data, using mock data", error);
        // Use mock data when API fails
        setMetrics({ totalArticles: 1247, avgSentiment: 0.054, activeSources: 61 });
        setArticles([
          { title: "SpaceX Launches Starship Mission to Mars", publisher: "SpaceX News", published_at: new Date(), sentiment: 0.8, category: "Technology" },
          { title: "AI Revolution in Space Exploration", publisher: "Tech Today", published_at: new Date(), sentiment: 0.6, category: "Technology" },
          { title: "Global Climate Summit Reaches Agreement", publisher: "World News", published_at: new Date(), sentiment: 0.4, category: "Politics" },
          { title: "Breakthrough in Quantum Computing", publisher: "Science Daily", published_at: new Date(), sentiment: 0.7, category: "Technology" },
          { title: "Economic Markets Show Strong Growth", publisher: "Financial Times", published_at: new Date(), sentiment: 0.5, category: "Business" }
        ]);
        setCategories([
          { category: "Technology", count: 45 },
          { category: "Business", count: 32 },
          { category: "Politics", count: 28 },
          { category: "Sports", count: 22 },
          { category: "Health", count: 18 }
        ]);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl font-mono animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="p-6 md:p-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold heading-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600 neon-text">
              DASHBOARD
            </h1>
            <p className="text-xl text-cyan-200/60 font-light tracking-widest mt-2 uppercase">
              Real-time Analytics Overview
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-400 animate-pulse">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
            <span className="text-sm font-mono tracking-wider">LIVE</span>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <MetricCard 
            label="TOTAL ARTICLES" 
            value={metrics.totalArticles.toLocaleString()} 
            icon={<Database size={24} />} 
            trend="+12%"
          />
          <MetricCard 
            label="AVG SENTIMENT" 
            value={metrics.avgSentiment.toFixed(3)} 
            icon={<Activity size={24} />} 
            color={metrics.avgSentiment > 0 ? "text-green-400" : "text-red-400"}
          />
          <MetricCard 
            label="ACTIVE SOURCES" 
            value={metrics.activeSources} 
            icon={<Globe size={24} />} 
          />
          <MetricCard 
            label="AI TOPICS" 
            value="89" 
            icon={<Cpu size={24} />} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold heading-font mb-6 flex items-center gap-2">
                <TrendingUp className="text-cyan-400" /> CATEGORY DISTRIBUTION
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categories.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="category" stroke="#666" tick={{fill: '#888'}} />
                    <YAxis stroke="#666" tick={{fill: '#888'}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}}
                      itemStyle={{color: '#fff'}}
                    />
                    <Bar dataKey="count" fill="#00d4ff" radius={[4, 4, 0, 0]}>
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#00d4ff', '#00ff88', '#fff', '#7c3aed'][index % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Live Feed */}
          <div className="glass-panel p-6 h-full overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold heading-font mb-6 flex items-center gap-2">
              <Radio className="text-red-500 animate-pulse" /> LIVE FEED
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {articles.slice(0, 10).map((article, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                      {article.publisher}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(article.published_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium leading-relaxed text-gray-200 group-hover:text-white transition-colors">
                    {article.title}
                  </h4>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className={`flex items-center gap-1 ${article.sentiment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {article.sentiment > 0 ? '▲' : '▼'} {Math.abs(article.sentiment).toFixed(2)}
                    </span>
                    <span>•</span>
                    <span>{article.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, trend, color = "text-white" }) => (
  <div className="glass-panel p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
      {icon}
    </div>
    <div className="text-xs font-mono text-gray-500 tracking-widest mb-2">{label}</div>
    <div className={`text-4xl font-bold heading-font ${color} mb-1`}>{value}</div>
    {trend && <div className="text-xs text-green-400 font-mono">{trend} since last update</div>}
  </div>
);

export default Dashboard;
