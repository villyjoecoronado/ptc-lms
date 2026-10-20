import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, BarChart3, Filter, Search, Printer, Share2 } from 'lucide-react';

const StudentReports = ({ isDarkMode, user }) => {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [dateRange, setDateRange] = useState('semester');
  const [searchQuery, setSearchQuery] = useState('');

  const mockReports = [
    {
      id: 1,
      title: 'Academic Summary Report',
      description: 'Comprehensive summary of your academic performance including GPA, grades, and attendance across all subjects.',
      type: 'academic',
      format: 'PDF',
      size: '1.2 MB',
      lastGenerated: '2024-10-15',
      available: true
    },
    {
      id: 2,
      title: 'Assignment Submission History',
      description: 'Complete log of all assignment submissions with timestamps, grades, and instructor feedback.',
      type: 'submissions',
      format: 'PDF',
      size: '856 KB',
      lastGenerated: '2024-10-14',
      available: true
    },
    {
      id: 3,
      title: 'Attendance Record',
      description: 'Detailed attendance report showing class participation across all enrolled subjects.',
      type: 'attendance',
      format: 'PDF',
      size: '445 KB',
      lastGenerated: '2024-10-13',
      available: true
    },
    {
      id: 4,
      title: 'Grade Breakdown by Subject',
      description: 'Subject-wise grade analysis including midterm, final, and assignment scores.',
      type: 'grades',
      format: 'PDF',
      size: '678 KB',
      lastGenerated: '2024-10-12',
      available: true
    },
    {
      id: 5,
      title: 'Midterm Performance Report',
      description: 'Midterm examination performance analysis with comparative statistics.',
      type: 'academic',
      format: 'PDF',
      size: '923 KB',
      lastGenerated: '2024-10-10',
      available: true
    },
    {
      id: 6,
      title: 'Learning Materials Download Log',
      description: 'History of all learning materials downloaded from the LMS.',
      type: 'materials',
      format: 'CSV',
      size: '125 KB',
      lastGenerated: '2024-10-08',
      available: true
    }
  ];

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    return matchesSearch && matchesType;
  });

  const getReportIcon = (type) => {
    const iconConfig = {
      academic: BarChart3,
      submissions: FileText,
      attendance: Calendar,
      grades: TrendingUp,
      materials: FileText
    };
    return iconConfig[type] || FileText;
  };

  const getReportTypeBadge = (type) => {
    const typeConfig = {
      academic: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', label: 'Academic' },
      submissions: { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', label: 'Submissions' },
      attendance: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', label: 'Attendance' },
      grades: { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', label: 'Grades' },
      materials: { color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300', label: 'Materials' }
    };
    const config = typeConfig[type] || typeConfig.academic;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  const handleDownload = (report) => {
    console.log('Downloading report:', report.title);
  };

  const handleGenerate = (report) => {
    console.log('Generating report:', report.title);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Reports</h2>
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Generate and download your academic reports</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 self-start"
            style={{
              background: 'var(--gradient-electric)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Printer size={16} />
            Generate New Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border p-4 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <FileText size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{mockReports.length}</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Total Reports</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Download size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{mockReports.filter(r => r.available).length}</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Available</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <Calendar size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Current Semester</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Period</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>3.2 MB</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Total Size</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className={`px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            style={{ borderColor: 'var(--border-light)' }}
          >
            <option value="all">All Types</option>
            <option value="academic">Academic</option>
            <option value="submissions">Submissions</option>
            <option value="attendance">Attendance</option>
            <option value="grades">Grades</option>
            <option value="materials">Materials</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            style={{ borderColor: 'var(--border-light)' }}
          >
            <option value="semester">This Semester</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report, index) => {
            const Icon = getReportIcon(report.type);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base" style={{ color: 'var(--color-primary)' }}>
                        {report.title}
                      </h3>
                      {getReportTypeBadge(report.type)}
                    </div>
                    <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--color-secondary)' }}>
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
                  <div className="flex items-center gap-4">
                    <span>Format: {report.format}</span>
                    <span>Size: {report.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{report.lastGenerated}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {report.available ? (
                    <button
                      onClick={() => handleDownload(report)}
                      className="flex-1 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                      style={{
                        background: 'var(--gradient-electric)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                      }}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGenerate(report)}
                      className="flex-1 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    >
                      <FileText size={16} />
                      Generate
                    </button>
                  )}
                  <button
                    className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-primary)' }}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No reports found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Try a different search or filter</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentReports;
