import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Globe, Database, Cpu, TrendingUp, Radio } from 'lucide-react';
import axios from 'axios';

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
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold heading-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600 neon-text">
            MISSION CONTROL
          </h1>
          <p className="text-lg text-cyan-200/60 font-light tracking-widest mt-2 uppercase">
            Real-time Operations
          </p>
        </div>
        <div className="flex items-center gap-2 text-green-400 animate-pulse">
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
          <span className="text-xs font-mono tracking-wider">SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricCard
          label="TOTAL INTEL"
          value={metrics.totalArticles.toLocaleString()}
          icon={<Database size={20} />}
          trend="+12%"
        />
        <MetricCard
          label="GLOBAL SENTIMENT"
          value={metrics.avgSentiment.toFixed(3)}
          icon={<Activity size={20} />}
          color={metrics.avgSentiment > 0 ? "text-green-400" : "text-red-400"}
        />
        <MetricCard
          label="ACTIVE SOURCES"
          value={metrics.activeSources}
          icon={<Globe size={20} />}
        />
        <MetricCard
          label="AI TOPICS"
          value="89"
          icon={<Cpu size={20} />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8">
            <h3 className="text-lg font-bold heading-font mb-6 flex items-center gap-2 tracking-wider">
              <TrendingUp className="text-cyan-400" size={18} /> CATEGORY DISTRIBUTION
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="category" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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

        {/* Live Feed Preview */}
        <div className="glass-panel p-6 h-full overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold heading-font mb-6 flex items-center gap-2 tracking-wider">
            <Radio className="text-red-500 animate-pulse" size={18} /> INCOMING TRANSMISSIONS
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {articles.slice(0, 5).map((article, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 uppercase">
                    {article.publisher}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(article.published_at).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="text-sm font-medium leading-relaxed text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, trend, color = "text-white" }) => (
  <div className="glass-panel p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
      {icon}
    </div>
    <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-2 uppercase">{label}</div>
    <div className={`text-3xl font-bold heading-font ${color} mb-1`}>{value}</div>
    {trend && <div className="text-[10px] text-green-400 font-mono">{trend} since last cycle</div>}
  </div>
);

export default Dashboard;
