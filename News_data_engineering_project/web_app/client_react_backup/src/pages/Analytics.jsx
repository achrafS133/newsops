import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import axios from 'axios';

const Analytics = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for analytics timeline
  const sentimentData = [
    { name: '00:00', sentiment: 0.2 },
    { name: '04:00', sentiment: 0.5 },
    { name: '08:00', sentiment: -0.1 },
    { name: '12:00', sentiment: 0.8 },
    { name: '16:00', sentiment: 0.4 },
    { name: '20:00', sentiment: 0.6 },
    { name: '23:59', sentiment: 0.3 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-12 border-b border-white/10 pb-6">
        <h1 className="text-4xl md:text-6xl font-bold heading-font tracking-tighter text-white neon-text">
          DEEP ANALYTICS
        </h1>
        <p className="text-lg text-gray-400 font-light tracking-widest mt-2 uppercase">
          Pattern Recognition & Sentiment Tracking
        </p>
      </header>

      {/* Sentiment Timeline */}
      <div className="glass-panel p-8 mb-8">
        <h3 className="text-lg font-bold heading-font mb-6 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          SENTIMENT TIMELINE (24H)
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888' }} />
              <YAxis stroke="#666" tick={{ fill: '#888' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="sentiment" stroke="#00ff88" strokeWidth={3} dot={{ fill: '#00ff88', r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold heading-font mb-6 tracking-wider">CATEGORY DISTRIBUTION</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Topic Clusters */}
        <div className="glass-panel p-8 flex flex-col">
          <h3 className="text-lg font-bold heading-font mb-6 tracking-wider">TOPIC CLUSTERS</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg bg-white/5">
            <div className="text-center">
              <p className="text-gray-500 font-mono mb-2">VISUALIZATION MODULE</p>
              <p className="text-xs text-gray-600">Awaiting data stream...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
