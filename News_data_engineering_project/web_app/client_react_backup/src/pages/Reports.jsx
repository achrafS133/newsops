import React, { useState } from 'react';
import { FileText, Download, Filter, Search, ChevronDown } from 'lucide-react';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const reports = [
    { id: 1, title: 'Daily Intelligence Briefing', type: 'Briefing', date: '2023-12-03', author: 'AI Analyst', size: '2.4 MB', status: 'Ready' },
    { id: 2, title: 'Geopolitical Risk Assessment', type: 'Assessment', date: '2023-12-02', author: 'System', size: '1.8 MB', status: 'Ready' },
    { id: 3, title: 'Tech Sector Sentiment Analysis', type: 'Analysis', date: '2023-12-01', author: 'AI Analyst', size: '3.1 MB', status: 'Archived' },
    { id: 4, title: 'Global Market Volatility', type: 'Forecast', date: '2023-11-30', author: 'System', size: '4.2 MB', status: 'Ready' },
    { id: 5, title: 'Cybersecurity Threat Landscape', type: 'Security', date: '2023-11-29', author: 'SecOps', size: '1.5 MB', status: 'Ready' },
  ];

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold heading-font tracking-tighter text-white neon-text">
            REPORTS
          </h1>
          <p className="text-lg text-gray-400 font-light tracking-widest mt-2 uppercase">
            Generated Intelligence Documents
          </p>
        </div>
        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2">
          <Download size={20} /> Export All
        </button>
      </header>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2">
          <Filter size={20} />
          <span>FILTER TYPE</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="p-6">Document Name</th>
                <th className="p-6">Type</th>
                <th className="p-6">Date Generated</th>
                <th className="p-6">Author</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6 font-medium text-white flex items-center gap-3">
                    <FileText size={18} className="text-cyan-400" />
                    {report.title}
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-1 rounded bg-white/10 text-xs border border-white/10">{report.type}</span>
                  </td>
                  <td className="p-6 font-mono text-gray-500">{report.date}</td>
                  <td className="p-6">{report.author}</td>
                  <td className="p-6">
                    <span className={`flex items-center gap-2 ${report.status === 'Ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'Ready' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-gray-500 hover:text-cyan-400 transition-colors">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
