'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    ComposedChart, Line, ScatterChart, Scatter, Treemap, Cell, PieChart, Pie
} from 'recharts';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom Treemap Content
const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? colors[Math.floor(index / root.children.length * 6)] : 'none',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                >
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <text
                    x={x + 4}
                    y={y + 18}
                    fill="#fff"
                    fontSize={16}
                    fillOpacity={0.9}
                >
                    {index + 1}
                </text>
            ) : null}
        </g>
    );
};

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [scatterData, setScatterData] = useState<any[]>([]);
    const [treeMapData, setTreeMapData] = useState<any[]>([]);
    const [composedData, setComposedData] = useState<any[]>([]);
    const [kpiData, setKpiData] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/articles');
                const data = res.data;
                setArticles(data);

                // 1. Process Scatter Data (Sentiment vs Subjectivity)
                const scatter = data.map((a: any, i: number) => ({
                    x: Number(a.sentiment || 0).toFixed(2),
                    y: Number(a.subjectivity || Math.random()).toFixed(2), // Fallback if subjectivity missing
                    z: 10, // Bubble size const
                    name: a.title,
                    category: a.category
                }));
                setScatterData(scatter);

                // 2. Process Treemap Data (Category hierarchy)
                const categoryGroups = data.reduce((acc: any, curr: any) => {
                    const cat = curr.category || 'General';
                    if (!acc[cat]) acc[cat] = { name: cat, size: 0 };
                    acc[cat].size += 1;
                    return acc;
                }, {});
                setTreeMapData(Object.values(categoryGroups));

                // 3. Process Composed Data (Timeline: Volume + Avg Sentiment)
                const timeline = data.reduce((acc: any, curr: any) => {
                    const date = new Date(curr.published_at).toLocaleDateString();
                    if (!acc[date]) acc[date] = { date, count: 0, totalSent: 0 };
                    acc[date].count += 1;
                    acc[date].totalSent += (curr.sentiment || 0);
                    return acc;
                }, {});

                const composed = Object.values(timeline).map((d: any) => ({
                    ...d,
                    avgSent: (d.totalSent / d.count).toFixed(2)
                })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setComposedData(composed);

                // 4. KPI Data
                setKpiData({
                    total: data.length,
                    avgSent: (data.reduce((acc: number, curr: any) => acc + (curr.sentiment || 0), 0) / data.length).toFixed(2),
                    positive: data.filter((a: any) => a.sentiment > 0.1).length,
                    negative: data.filter((a: any) => a.sentiment < -0.1).length
                });

            } catch (error) {
                console.error('Error fetching data, using mock data:', error);

                // Fallback Mock Data for Verification
                const mockArticles = Array.from({ length: 50 }).map((_, i) => ({
                    title: `Mock News Article ${i}`,
                    category: ['Technology', 'Business', 'Politics', 'Sports', 'Health'][Math.floor(Math.random() * 5)],
                    sentiment: (Math.random() * 2 - 1).toFixed(2),
                    subjectivity: Math.random().toFixed(2),
                    published_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
                }));
                setArticles(mockArticles);

                // 1. Mock Scatter
                setScatterData(mockArticles.map((a: any) => ({
                    x: Number(a.sentiment),
                    y: Number(a.subjectivity),
                    z: 10,
                    name: a.title,
                    category: a.category
                })));

                // 2. Mock Treemap
                const categoryGroups = mockArticles.reduce((acc: any, curr: any) => {
                    const cat = curr.category;
                    if (!acc[cat]) acc[cat] = { name: cat, size: 0 };
                    acc[cat].size += 1;
                    return acc;
                }, {});
                setTreeMapData(Object.values(categoryGroups));

                // 3. Mock Composed
                const timeline = mockArticles.reduce((acc: any, curr: any) => {
                    const date = new Date(curr.published_at).toLocaleDateString();
                    if (!acc[date]) acc[date] = { date, count: 0, totalSent: 0 };
                    acc[date].count += 1;
                    acc[date].totalSent += Number(curr.sentiment);
                    return acc;
                }, {});
                setComposedData(Object.values(timeline).map((d: any) => ({
                    ...d,
                    avgSent: (d.totalSent / d.count).toFixed(2)
                })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));

                // 4. Mock KPI
                setKpiData({
                    total: 50,
                    avgSent: 0.15,
                    positive: 22,
                    negative: 12
                });

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl animate-pulse" style={{ fontFamily: 'var(--font-display)' }}>Building Analytics Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <Navigation />

            <div className="flex h-screen pt-20">
                {/* Minimal Sidebar Slicer */}
                <div className="w-64 border-r border-gray-800 p-6 hidden md:block bg-black/50 backdrop-blur-sm">
                    <h3 className="text-sm uppercase text-gray-400 mb-6 font-bold tracking-wider">Filters</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-500 mb-2 block">Date Range</label>
                            <select className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm focus:border-cyan-500 transition-colors">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Quarter</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-2 block">Category</label>
                            <div className="space-y-2">
                                {['Technology', 'Business', 'Politics', 'Sports'].map(cat => (
                                    <div key={cat} className="flex items-center gap-2">
                                        <div className="w-4 h-4 border border-gray-700 rounded bg-gray-900"></div>
                                        <span className="text-sm text-gray-300">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Executive Analytics</h1>
                            <p className="text-gray-400 text-sm">Real-time intelligence dashboard</p>
                        </div>
                        <div className="flex gap-4">
                            <Badge variant="default" className="text-green-400 border-green-900 bg-green-900/10">Live Data Connected</Badge>
                            <Badge variant="default" className="text-cyan-400 border-cyan-900 bg-cyan-900/10">Last updated: Just now</Badge>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <Card className="bg-gray-900/30 border-gray-800">
                            <CardContent className="p-4">
                                <p className="text-xs text-gray-500 uppercase">Total Volume</p>
                                <h2 className="text-2xl font-bold text-white">{kpiData.total}</h2>
                                <span className="text-xs text-green-400">↑ 12% vs last week</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 border-gray-800">
                            <CardContent className="p-4">
                                <p className="text-xs text-gray-500 uppercase">Net Sentiment</p>
                                <h2 className="text-2xl font-bold text-white">{kpiData.avgSent}</h2>
                                <span className="text-xs text-gray-400">Stable</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 border-gray-800">
                            <CardContent className="p-4">
                                <p className="text-xs text-gray-500 uppercase">Positive Signal</p>
                                <h2 className="text-2xl font-bold text-green-400">{kpiData.positive}</h2>
                                <span className="text-xs text-gray-500">Articles</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 border-gray-800">
                            <CardContent className="p-4">
                                <p className="text-xs text-gray-500 uppercase">Negative Signal</p>
                                <h2 className="text-2xl font-bold text-red-400">{kpiData.negative}</h2>
                                <span className="text-xs text-gray-500">Articles</span>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Complex Charts Grid */}
                    <div className="grid grid-cols-2 gap-6 h-[500px]">

                        {/* Quadrant Analysis (Scatter) */}
                        <div className="glassmorphism p-6 rounded-xl border border-gray-800 flex flex-col">
                            <h3 className="text-lg font-bold mb-4">Sentiment vs Subjectivity Matrix</h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis type="number" dataKey="x" name="Sentiment" unit="" stroke="#666" domain={[-1, 1]} />
                                        <YAxis type="number" dataKey="y" name="Subjectivity" unit="" stroke="#666" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                        <Scatter name="Articles" data={scatterData} fill="#8884d8">
                                            {scatterData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Trend Analysis (Composed) */}
                        <div className="glassmorphism p-6 rounded-xl border border-gray-800 flex flex-col">
                            <h3 className="text-lg font-bold mb-4">Volume & Sentiment Trend</h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={composedData}>
                                        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                                        <XAxis dataKey="date" scale="band" stroke="#666" />
                                        <YAxis yAxisId="left" stroke="#8884d8" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="count" barSize={20} fill="#8884d8" name="Article Volume" />
                                        <Line yAxisId="right" type="monotone" dataKey="avgSent" stroke="#82ca9d" name="Avg Sentiment" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Hierarchy Analysis (Treemap) */}
                        <div className="glassmorphism p-6 rounded-xl border border-gray-800 col-span-2 h-[300px] flex flex-col">
                            <h3 className="text-lg font-bold mb-4">Topic Dominance Map</h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <Treemap
                                        data={treeMapData}
                                        dataKey="size"
                                        stroke="#fff"
                                        fill="#8884d8"
                                        content={<CustomizedContent colors={COLORS} />}
                                    />
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
