import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, Map, BarChart3 } from 'lucide-react';
import axios from 'axios';
import Navigation from '../components/Navigation';

const Analytics = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesRes, catsRes] = await Promise.all([
          axios.get('/api/articles'),
          axios.get('/api/categories')
        ]);
        setArticles(articlesRes.data);
        setCategories(catsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data, using mock data", error);
        setArticles([
          { sentiment: 0.8 }, { sentiment: 0.6 }, { sentiment: -0.3 }, { sentiment: 0.4 },
          { sentiment: 0.7 }, { sentiment: -0.2 }, { sentiment: 0.5 }, { sentiment: 0.3 },
          { sentiment: -0.4 }, { sentiment: 0.6 }, { sentiment: 0.8 }, { sentiment: 0.2 },
          { sentiment: -0.1 }, { sentiment: 0.5 }, { sentiment: 0.7 }, { sentiment: 0.4 },
          { sentiment: 0.3 }, { sentiment: -0.5 }, { sentiment: 0.6 }, { sentiment: 0.8 }
        ]);
        setCategories([
          { category: 'Technology', count: 45 },
          { category: 'Business', count: 32 },
          { category: 'Politics', count: 28 },
          { category: 'Sports', count: 22 },
          { category: 'Health', count: 18 }
        ]);
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 text-2xl font-mono animate-pulse">Loading Analytics...</div>
      </div>
    );
  }

  const sentimentData = articles.slice(0, 20).map((article, idx) => ({
    name: `Article ${idx + 1}`,
    sentiment: article.sentiment
  }));

  const COLORS = ['#00d4ff', '#00ff88', '#fff', '#7c3aed', '#ff006e'];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="p-6 md:p-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold heading-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-pink-600 neon-text">
              ANALYTICS
            </h1>
            <p className="text-xl text-purple-200/60 font-light tracking-widest mt-2 uppercase">
              Advanced Insights & Trends
            </p>
          </div>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sentiment Timeline */}
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold heading-font mb-6 flex items-center gap-2">
              <TrendingUp className="text-cyan-400" /> SENTIMENT TIMELINE
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                  <YAxis stroke="#666" tick={{fill: '#888'}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}}
                    itemStyle={{color: '#fff'}}
                  />
                  <Line type="monotone" dataKey="sentiment" stroke="#00d4ff" strokeWidth={2} dot={{fill: '#00d4ff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Distribution */}
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold heading-font mb-6 flex items-center gap-2">
              <Target className="text-purple-400" /> TOPIC DISTRIBUTION
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categories.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}}
                    itemStyle={{color: '#fff'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center">
                <BarChart3 className="text-cyan-400" size={24} />
              </div>
              <div>
                <div className="text-xs font-mono text-gray-500">TRENDING UP</div>
                <div className="text-2xl font-bold text-white">Technology</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">+24% in the last week</div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <div>
                <div className="text-xs font-mono text-gray-500">POSITIVE SENTIMENT</div>
                <div className="text-2xl font-bold text-white">72%</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">Across all categories</div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-400/20 flex items-center justify-center">
                <Map className="text-purple-400" size={24} />
              </div>
              <div>
                <div className="text-xs font-mono text-gray-500">TOP REGION</div>
                <div className="text-2xl font-bold text-white">North America</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">45% of all articles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
