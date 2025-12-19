'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function LiveFeed() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axios.get('/api/articles');
                setArticles(res.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <Navigation />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
                    <h1
                        className="text-5xl md:text-6xl font-bold text-gradient-primary animate-fade-in"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        🔴 LIVE NEWS FEED
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>LIVE</span>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4 mb-8 flex-wrap animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                    <div className="flex-1 min-w-[250px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 glassmorphism rounded-xl focus:glassmorphism-strong focus:outline-none transition-all text-white placeholder-gray-400"
                            style={{ fontFamily: 'var(--font-body)' }}
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-6 py-4 glassmorphism rounded-xl focus:glassmorphism-strong focus:outline-none transition-all cursor-pointer"
                        style={{ fontFamily: 'var(--font-primary)' }}
                    >
                        <option value="all">All Categories</option>
                        <option value="politics">Politics</option>
                        <option value="technology">Technology</option>
                        <option value="business">Business</option>
                        <option value="sports">Sports</option>
                        <option value="health">Health</option>
                    </select>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="text-xl animate-pulse" style={{ fontFamily: 'var(--font-display)' }}>Loading articles...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article, idx) => (
                            <div
                                key={idx}
                                className="glassmorphism p-6 rounded-xl hover:glassmorphism-strong hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in"
                                style={{
                                    animationDelay: `${0.4 + (idx % 9) * 0.05}s`,
                                    animationFillMode: 'backwards'
                                }}
                            >
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                                        {article.category || 'News'}
                                    </span>
                                    {article.sentiment && (
                                        <span className={`px-3 py-1 text-xs rounded-full ${article.sentiment > 0
                                            ? 'bg-green-500/20 text-green-400'
                                            : article.sentiment < 0
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                            }`} style={{ fontFamily: 'var(--font-primary)' }}>
                                            {article.sentiment > 0 ? '😊 Positive' : article.sentiment < 0 ? '😞 Negative' : '😐 Neutral'}
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-xl mb-3 line-clamp-2 text-cyan-300 group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                                    {article.title}
                                </h3>

                                <p className="text-sm text-gray-400 mb-4 line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                                    {article.description}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500" style={{ fontFamily: 'var(--font-primary)' }}>
                                    <span className="flex items-center gap-1">
                                        📰 {article.source}
                                    </span>
                                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredArticles.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <div className="text-2xl text-gray-400" style={{ fontFamily: 'var(--font-display)' }}>
                            No articles found matching your criteria
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
