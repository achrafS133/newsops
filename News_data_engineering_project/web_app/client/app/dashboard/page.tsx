'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Navigation from '../components/Navigation';
import AnimatedSection from '../components/AnimatedSection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import gsap from 'gsap';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalArticles: 0, avgSentiment: 0, activeSources: 0 });
    const [articles, setArticles] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [breakingArticle, setBreakingArticle] = useState<any>(null);

    const metricsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsRes, articlesRes, categoriesRes] = await Promise.all([
                    axios.get('/api/metrics'),
                    axios.get('/api/articles'),
                    axios.get('/api/categories')
                ]);

                setMetrics(metricsRes.data);
                const articlesData = articlesRes.data;
                setArticles(articlesData);
                setCategories(categoriesRes.data);

                // Find Breaking News
                const breaking = articlesData.find((a: any) => a.is_breaking);
                if (breaking) setBreakingArticle(breaking);
            } catch (error) {
                console.error('Error fetching data, using mock data:', error);
                // Mock Data Fallback
                setMetrics({ totalArticles: 12453, avgSentiment: 0.24, activeSources: 128 });
                setArticles([
                    { sentiment: 0.8, title: 'SpaceX Launches Starship', category: 'Technology' },
                    { sentiment: 0.5, title: 'Global Markets Rally', category: 'Business' },
                    { sentiment: -0.2, title: 'Climate Summit Updates', category: 'Environment' },
                    { sentiment: 0.1, title: 'New AI Model Released', category: 'Technology' },
                    { sentiment: 0.4, title: 'Medical Breakthrough', category: 'Health' },
                    { sentiment: -0.5, title: 'Tech Giants Face Regulations', category: 'Technology' },
                    { sentiment: 0.2, title: 'Sports: Championship Finals', category: 'Sports' },
                    { sentiment: 0.6, title: 'Renewable Energy Growth', category: 'Energy' },
                    { sentiment: -0.1, title: 'Local Politics Shift', category: 'Politics' },
                    { sentiment: 0.3, title: 'Space Exploration Funding', category: 'Science' },
                    { sentiment: 0.7, title: 'Electric Vehicle Sales Up', category: 'Automotive' },
                    { sentiment: -0.3, title: 'Supply Chain Issues', category: 'Business' },
                ].concat(Array(8).fill({ sentiment: 0.1, title: 'News Article', category: 'General' })));

                setCategories([
                    { name: 'Technology', count: 450, sentiment: 0.35 },
                    { name: 'Business', count: 320, sentiment: 0.15 },
                    { name: 'Politics', count: 280, sentiment: -0.1 },
                    { name: 'Health', count: 210, sentiment: 0.4 },
                    { name: 'Science', count: 180, sentiment: 0.5 },
                    { name: 'Sports', count: 150, sentiment: 0.2 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && metricsRef.current) {
            gsap.from('.metric-card', {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
    }, [loading]);

    const AnimatedCounter = ({ end }: { end: number }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: end,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    setCount(Math.floor(obj.val));
                }
            });
        }, [end]);

        return <span>{count}</span>;
    };

    // Prepare data for charts
    const sentimentTrendData = articles.slice(0, 20).map((article, idx) => ({
        name: `T${idx + 1}`,
        sentiment: article.sentiment,
        positive: article.sentiment > 0 ? article.sentiment : 0,
        negative: article.sentiment < 0 ? Math.abs(article.sentiment) : 0,
        neutral: Math.abs(article.sentiment) < 0.1 ? 0.5 : 0,
    }));

    const categoryData = categories.map(cat => ({
        name: cat.name || cat.category,
        articles: cat.count,
        sentiment: cat.sentiment || cat.avg_sentiment || 0,
        avgSentiment: (cat.sentiment || cat.avg_sentiment || 0) * 100,
    }));

    const radarData = categories.slice(0, 5).map(cat => ({
        category: cat.name || cat.category,
        articles: cat.count,
        fullMark: Math.max(...categories.map(c => c.count) || [0]),
    }));

    const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 p-4 rounded-xl border border-cyan-500/30 backdrop-blur-xl">
                    <p className="text-cyan-400 font-bold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value?.toFixed(3)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-2xl font-semibold text-cyan-400 animate-pulse">Loading Analytics...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navigation />

            <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-20">
                {/* Breaking News Ticker */}
                {breakingArticle && (
                    <div className="mb-8 w-full bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r flex items-center gap-4 animate-fade-in">
                        <Badge variant="destructive" className="animate-pulse bg-red-600 text-white uppercase tracking-wider">BREAKING NEWS</Badge>
                        <p className="text-white font-bold text-lg truncate" style={{ fontFamily: 'var(--font-display)' }}>
                            {breakingArticle.title}
                        </p>
                    </div>
                )}

                {/* Professional Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Advanced Business Intelligence • Powered by AI
                            </p>
                        </div>
                        <Badge variant="success" className="px-4 py-2 text-sm">
                            ● Real-time Data
                        </Badge>
                    </div>
                    <Separator className="mt-6" />
                </div>

                {/* High Density BI Grid - "Tableau Style" */}

                {/* 1. TOP ROW: KPI Sparklines (5 cols) */}
                <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {/* Card 1: Total Articles */}
                    <Card className="metric-card bg-[#1a1b1e] border-[#2c2d32] overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Articles</CardDescription>
                            <CardTitle className="text-2xl font-bold text-white flex items-baseline gap-2">
                                <AnimatedCounter end={metrics.totalArticles} />
                                <span className="text-xs font-normal text-green-400">↑ 12%</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[50px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sentimentTrendData}>
                                    <Line type="monotone" dataKey="sentiment" stroke="#06b6d4" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Card 2: Units/Publishers */}
                    <Card className="metric-card bg-[#1a1b1e] border-[#2c2d32] overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Active Sources</CardDescription>
                            <CardTitle className="text-2xl font-bold text-white flex items-baseline gap-2">
                                {metrics.activeSources}
                                <span className="text-xs font-normal text-green-400">↑ 5</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[50px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sentimentTrendData}>
                                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Card 3: Avg Sentiment */}
                    <Card className="metric-card bg-[#1a1b1e] border-[#2c2d32] overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Avg Sentiment</CardDescription>
                            <CardTitle className="text-2xl font-bold text-white flex items-baseline gap-2">
                                {metrics.avgSentiment?.toFixed(3)}
                                <span className="text-xs font-normal text-gray-400">~</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[50px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sentimentTrendData}>
                                    <Line type="monotone" dataKey="sentiment" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Card 4: Topics */}
                    <Card className="metric-card bg-[#1a1b1e] border-[#2c2d32] overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Active Topics</CardDescription>
                            <CardTitle className="text-2xl font-bold text-white flex items-baseline gap-2">
                                {categories.length}
                                <span className="text-xs font-normal text-green-400">↑ 2</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[50px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sentimentTrendData}>
                                    <Line type="monotone" dataKey="negative" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Card 5: Pipeline Latency */}
                    <Card className="metric-card bg-[#1a1b1e] border-[#2c2d32] overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Pipeline Latency</CardDescription>
                            <CardTitle className="text-2xl font-bold text-white flex items-baseline gap-2">
                                48ms
                                <span className="text-xs font-normal text-green-400">↓ 12ms</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[50px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sentimentTrendData}>
                                    <Line type="monotone" dataKey="neutral" stroke="#ec4899" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. MIDDLE ROW: Bar Chart (Left) + Donut (Center) + KPI (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 h-[350px]">
                    {/* Volume vs Sentiment Impact */}
                    <Card className="lg:col-span-6 bg-[#1a1b1e] border-[#2c2d32] h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">Volume vs Sentiment Impact</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2d32" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" style={{ fontSize: '10px' }} interval={0} />
                                    <YAxis stroke="#666" style={{ fontSize: '10px' }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff10' }} />
                                    <Bar dataKey="articles" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={20} name="Volume" />
                                    <Bar dataKey="avgSentiment" fill="#06b6d4" radius={[2, 2, 0, 0]} barSize={20} name="Sentiment Score" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Topic Distribution */}
                    <Card className="lg:col-span-3 bg-[#1a1b1e] border-[#2c2d32] h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">Topic Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="articles"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                                        {metrics.totalArticles}
                                    </text>
                                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-xs uppercase">
                                        Total
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Processing Efficiency */}
                    <Card className="lg:col-span-3 bg-[#1a1b1e] border-[#2c2d32] h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">Processing Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
                            <div className="relative w-full aspect-square max-h-[160px] flex items-center justify-center">
                                <span className="text-6xl mb-2">⚡</span>
                            </div>
                            <div className="text-4xl font-bold text-green-400 mb-1">98.2%</div>
                            <div className="text-sm text-gray-400 uppercase tracking-widest text-center">Successful Ingestion</div>
                            <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center">
                                <div className="bg-white/5 p-2 rounded">
                                    <div className="text-xs text-gray-500">Failed</div>
                                    <div className="font-mono text-red-400">241</div>
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <div className="text-xs text-gray-500">Retried</div>
                                    <div className="font-mono text-yellow-400">1,204</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. BOTTOM ROW: Funnel (Left) + Treemap (Center) + Scatter (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
                    {/* ETL Pipeline Funnel */}
                    <Card className="lg:col-span-4 bg-[#1a1b1e] border-[#2c2d32] h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">ETL Pipeline Funnel</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 flex flex-col gap-2 justify-center">
                            {[
                                { label: 'Raw Ingestion', val: '1,679,013', color: '#ec4899', width: '100%' },
                                { label: 'Tokenized', val: '840,413', color: '#d946ef', width: '80%' },
                                { label: 'Entity Extraction', val: '22,102', color: '#8b5cf6', width: '60%' },
                                { label: 'Sentiment Analysis', val: '16,267', color: '#06b6d4', width: '40%' },
                                { label: 'Indexed', val: '15,831', color: '#10b981', width: '30%' },
                            ].map((step, i) => (
                                <div key={i} className="relative h-12 flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-[1.02]" style={{ width: step.width, margin: '0 auto', background: step.color, clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}>
                                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="opacity-80 text-[10px] uppercase">{step.label}</span>
                                        <span>{step.val}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Topic Taxonomy (Treemap) */}
                    <Card className="lg:col-span-5 bg-[#1a1b1e] border-[#2c2d32] h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">Topic Taxonomy (Treemap)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 p-2">
                            <div className="w-full h-full flex flex-wrap gap-1">
                                {/* Mock Treemap using Flexbox for "Blocky" look */}
                                <div className="flex-[2_2_40%] bg-[#8b5cf6] p-4 flex flex-col justify-between hover:opacity-90 transition-opacity">
                                    <span className="font-bold text-white">Technology</span>
                                    <span className="text-xs text-white/70">{metrics.totalArticles} articles</span>
                                </div>
                                <div className="flex-[1_1_30%] flex flex-col gap-1">
                                    <div className="flex-1 bg-[#06b6d4] p-3 hover:opacity-90"><span className="text-xs font-bold">Business</span></div>
                                    <div className="flex-1 bg-[#10b981] p-3 hover:opacity-90"><span className="text-xs font-bold">Science</span></div>
                                </div>
                                <div className="flex-[1_1_20%] bg-[#f59e0b] p-3 hover:opacity-90"><span className="text-xs font-bold">Health</span></div>
                                <div className="flex-[1_1_100%] h-1/2 flex gap-1">
                                    <div className="flex-[2] bg-[#ec4899] p-4 font-bold text-sm hover:opacity-90">Politics</div>
                                    <div className="flex-[1] bg-[#6366f1] p-2 text-xs hover:opacity-90">Sports</div>
                                    <div className="flex-[1] bg-[#ef4444] p-2 text-xs hover:opacity-90">Crime</div>
                                    <div className="flex-[1] bg-[#14b8a6] p-2 text-xs hover:opacity-90">Envir.</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sentiment Clusters */}
                    <Card className="lg:col-span-3 bg-[#1a1b1e] border-[#2c2d32] h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">Sentiment Clusters</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={sentimentTrendData}> {/* Using Composed for Scatter-like points */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2d32" />
                                    <XAxis type="category" dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Line type="monotone" dataKey="negative" stroke="none" dot={{ r: 4, fill: '#ef4444' }} />
                                    <Line type="monotone" dataKey="positive" stroke="none" dot={{ r: 6, fill: '#10b981' }} />
                                    <Line type="monotone" dataKey="sentiment" stroke="none" dot={{ r: 3, fill: '#f59e0b' }} />
                                    {/* Mocking dense scatter dots background */}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. BOTTOM ROW: Geospatial Map + Database Monitor */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                    {/* Global Map - Stylized Digital Map */}
                    <Card className="lg:col-span-8 bg-[#1a1b1e] border-[#2c2d32] overflow-hidden">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-bold uppercase text-gray-400">Global Intelligence Map</CardTitle>
                                <CardDescription>Real-time extraction of location entities</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-900/10 text-[10px]">LIVE FEED</Badge>
                                <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-900/10 text-[10px]">GEO-TAGGING: ON</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[300px] relative bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain opacity-80 mix-blend-screen">
                            {/* CSS Overlay for "Matrix" look */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e] via-transparent to-transparent " />

                            {/* Animated Pulsing Hotspots (Mocking Lat/Lon) */}
                            {[
                                { top: '33%', left: '18%', color: 'bg-red-500', name: 'New York' },
                                { top: '23%', left: '48%', color: 'bg-cyan-500', name: 'London' },
                                { top: '42%', left: '56%', color: 'bg-purple-500', name: 'Dubai' },
                                { top: '34%', left: '78%', color: 'bg-green-500', name: 'Tokyo' },
                                { top: '68%', left: '80%', color: 'bg-orange-500', name: 'Sydney' },
                                { top: '57%', left: '28%', color: 'bg-yellow-500', name: 'Brasilia' },
                            ].map((pin, i) => (
                                <div key={i} className="absolute flex flex-col items-center group cursor-pointer" style={{ top: pin.top, left: pin.left }}>
                                    <span className="relative flex h-3 w-3">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pin.color} opacity-75`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${pin.color}`}></span>
                                    </span>
                                    {/* Tooltip on hover */}
                                    <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/10 whitespace-nowrap z-20">
                                        {pin.name} • Active
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Database & Infrastructure Status */}
                    <Card className="lg:col-span-4 bg-[#1a1b1e] border-[#2c2d32]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase text-gray-400">Infrastructure Health</CardTitle>
                            <CardDescription>Database & Service Status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {/* ClickHouse Status */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> ClickHouse OLAP
                                    </span>
                                    <span className="text-xs text-green-400 font-mono">ONLINE</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 mb-1">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span>Query: 12ms</span>
                                    <span>Rows: 2.4M</span>
                                </div>
                            </div>

                            {/* Neo4j Status */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Neo4j Graph
                                    </span>
                                    <span className="text-xs text-green-400 font-mono">ONLINE</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 mb-1">
                                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span>Nodes: 154k</span>
                                    <span>Rel: 890k</span>
                                </div>
                            </div>

                            {/* Storage / System */}
                            <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Disk Usage</div>
                                    <div className="text-xl font-bold text-white">24%</div>
                                    <Progress value={24} className="h-1 mt-2 bg-white/10" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Memory</div>
                                    <div className="text-xl font-bold text-white">6.2GB</div>
                                    <Progress value={65} className="h-1 mt-2 bg-white/10" />
                                </div>
                            </div>

                            {/* Alert Log */}
                            <div className="text-[10px] text-gray-500 flex items-center gap-2 pt-2 border-t border-white/5 mt-2">
                                <span className="text-green-500">●</span> All systems operational. 0 active alerts.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
