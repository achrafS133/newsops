'use client';

import Navigation from '../components/Navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function Reports() {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [generatedReport, setGeneratedReport] = useState<any>(null);

    const reportTemplates = [
        { id: 'daily', name: 'Daily Summary', icon: '📅', desc: 'Comprehensive daily news digest' },
        { id: 'sentiment', name: 'Sentiment Analysis', icon: '😊', desc: 'Deep sentiment trends and insights' },
        { id: 'topics', name: 'Topic Overview', icon: '📊', desc: 'Popular topics and categories' },
        { id: 'sources', name: 'Source Analysis', icon: '📰', desc: 'Coverage across news sources' },
        { id: 'geo', name: 'Geographic Distribution', icon: '🌍', desc: 'News by region and country' },
        { id: 'custom', name: 'Custom Report', icon: '⚙️', desc: 'Build your own report' },
    ];

    const handleDownload = (filename: string) => {
        // Create dummy blob for download - use octet-stream to force download behavior
        const blob = new Blob(["%PDF-1.4... (Mock Report Content)"], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleGenerate = () => {
        setGenerating(true);
        // Simulate generation delay
        setTimeout(() => {
            setGenerating(false);
            const reportName = `News_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
            const reportData = {
                name: reportName,
                date: 'Just now',
                format: 'PDF',
                size: '1.2 MB'
            };
            setGeneratedReport(reportData);

            // Auto-trigger download for seamless "just have it" experience
            handleDownload(reportName);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navigation />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <h1
                    className="text-5xl md:text-6xl font-bold mb-6 text-gradient-primary animate-fade-in"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    📋 REPORTS
                </h1>
                <p
                    className="text-xl text-gray-400 mb-12 max-w-3xl animate-fade-in"
                    style={{
                        fontFamily: 'var(--font-body)',
                        animationDelay: '0.2s',
                        animationFillMode: 'backwards'
                    }}
                >
                    Generate comprehensive intelligence reports with customizable templates and export options.
                </p>

                {/* Report Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {reportTemplates.map((template, index) => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`glassmorphism p-8 rounded-xl cursor-pointer transition-all duration-300 group hover:scale-105 animate-fade-in ${selectedTemplate === template.id ? 'glassmorphism-strong ring-2 ring-cyan-400' : 'hover:glassmorphism-strong'
                                }`}
                            style={{
                                animationDelay: `${0.4 + index * 0.1}s`,
                                animationFillMode: 'backwards'
                            }}
                        >
                            <div className="text-5xl mb-4">{template.icon}</div>
                            <h3 className="text-2xl font-bold mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                                {template.name}
                            </h3>
                            <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                                {template.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Report Generation Section */}
                {selectedTemplate && (
                    <div className="glassmorphism-strong p-8 rounded-xl animate-fade-in mb-12">
                        <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                            Configure Report: <span className="text-cyan-400">{reportTemplates.find(t => t.id === selectedTemplate)?.name}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Date Range */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                                    Date Range
                                </label>
                                <select className="w-full px-4 py-3 glassmorphism rounded-lg focus:glassmorphism-strong focus:outline-none transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                                    <option>Last 24 Hours</option>
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Custom Range</option>
                                </select>
                            </div>

                            {/* Format */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                                    Export Format
                                </label>
                                <select className="w-full px-4 py-3 glassmorphism rounded-lg focus:glassmorphism-strong focus:outline-none transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                                    <option>PDF</option>
                                    <option>Excel (.xlsx)</option>
                                    <option>CSV</option>
                                    <option>JSON</option>
                                </select>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'var(--font-primary)' }}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {generating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : '📥 Generate Report'}
                            </span>
                        </button>

                        {/* Generated Success Message */}
                        {generatedReport && !generating && (
                            <div className="mt-6 p-4 border border-green-500/30 bg-green-500/10 rounded-lg flex items-center justify-between animate-fade-in">
                                <div>
                                    <p className="font-bold text-green-400">Report Ready!</p>
                                    <p className="text-sm text-gray-400">{generatedReport.name} ({generatedReport.size})</p>
                                </div>
                                <button
                                    onClick={() => handleDownload(generatedReport.name)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold text-sm transition-colors"
                                >
                                    Download Now
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Reports */}
                <div className="mt-12 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'backwards' }}>
                    <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                        Recent Reports
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Daily Summary - Dec 5, 2025.pdf', date: '2 hours ago', format: 'PDF', size: '2.4 MB' },
                            { name: 'Sentiment Analysis - Week 48.xlsx', date: 'Yesterday', format: 'Excel', size: '1.8 MB' },
                            { name: 'Topic Overview - November.pdf', date: '3 days ago', format: 'PDF', size: '3.1 MB' },
                        ].map((report, index) => (
                            <div key={index} className="glassmorphism p-6 rounded-xl hover:glassmorphism-strong transition-all duration-300 cursor-pointer group flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1 text-cyan-300 group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                                        {report.name}
                                    </h3>
                                    <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                                        {report.date} • {report.format} • {report.size}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(report.name)}
                                    className="px-4 py-2 glassmorphism rounded-lg hover:glassmorphism-strong transition-all text-cyan-400 hover:text-cyan-300"
                                    style={{ fontFamily: 'var(--font-primary)' }}
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
