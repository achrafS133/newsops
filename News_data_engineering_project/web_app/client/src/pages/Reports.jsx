import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import Navigation from '../components/Navigation';

const Reports = () => {
  const [reportType, setReportType] = useState('executive');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTemplates = [
    { id: 'executive', name: 'Executive Summary', description: 'High-level overview of key metrics and trends' },
    { id: 'detailed', name: 'Detailed Analysis', description: 'In-depth breakdown of all categories and sources' },
    { id: 'sentiment', name: 'Sentiment Report', description: 'Focused analysis of sentiment trends' },
    { id: 'custom', name: 'Custom Report', description: 'Build your own report with selected metrics' }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', { reportType, startDate, endDate });
    // In a real app, this would trigger report generation
    alert(`Generating ${reportType} report from ${startDate} to ${endDate}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="p-6 md:p-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold heading-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-red-600 neon-text">
              REPORTS
            </h1>
            <p className="text-xl text-orange-200/60 font-light tracking-widest mt-2 uppercase">
              Generate Custom Insights
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold heading-font mb-6 flex items-center gap-2">
                <FileText className="text-orange-400" /> SELECT REPORT TYPE
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {reportTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setReportType(template.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      reportType === template.id
                        ? 'border-orange-400 bg-orange-400/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-white mb-1">{template.name}</div>
                    <div className="text-sm text-gray-400">{template.description}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="text-cyan-400" size={20} /> DATE RANGE
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <button
                  onClick={handleGenerateReport}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  GENERATE REPORT
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold heading-font mb-6 flex items-center gap-2">
              <FileText className="text-cyan-400" size={20} /> PREVIEW
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-white/5 rounded">
                <div className="text-gray-400 text-xs mb-1">Report Type</div>
                <div className="text-white font-bold capitalize">{reportType}</div>
              </div>

              <div className="p-4 bg-white/5 rounded">
                <div className="text-gray-400 text-xs mb-1">Date Range</div>
                <div className="text-white">{startDate || 'Not set'} to {endDate || 'Not set'}</div>
              </div>

              <div className="p-4 bg-white/5 rounded">
                <div className="text-gray-400 text-xs mb-1">Export Formats</div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">PDF</span>
                  <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">CSV</span>
                  <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">JSON</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded">
                <div className="text-orange-400 text-xs font-bold mb-2">⚡ PREMIUM FEATURE</div>
                <div className="text-gray-300 text-xs">
                  Automated scheduled reports and email delivery available with premium subscription
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
