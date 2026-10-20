import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Award, TrendingUp, Download, Filter, Search, BookOpen } from 'lucide-react';

const StudentGrades = ({ grades, isDarkMode }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockGrades = grades || [
    {
      id: 1,
      subject: 'IT101',
      subjectName: 'Introduction to Computing',
      instructor: 'Prof. Edmar',
      midtermGrade: 92,
      finalGrade: 95,
      overallGrade: 93.5,
      status: 'Passed',
      assignments: [
        { title: 'Lab Exercise 1', score: 95, maxScore: 100 },
        { title: 'Lab Exercise 2', score: 88, maxScore: 100 },
        { title: 'Midterm Project', score: 92, maxScore: 100 }
      ],
      attendance: 95
    },
    {
      id: 2,
      subject: 'IT102',
      subjectName: 'Programming Fundamentals',
      instructor: 'Prof. Harvey',
      midtermGrade: 88,
      finalGrade: 91,
      overallGrade: 89.5,
      status: 'Passed',
      assignments: [
        { title: 'Programming Quiz 1', score: 85, maxScore: 100 },
        { title: 'Programming Quiz 2', score: 90, maxScore: 100 },
        { title: 'Final Project', score: 91, maxScore: 100 }
      ],
      attendance: 92
    },
    {
      id: 3,
      subject: 'IT103',
      subjectName: 'Data Structures',
      instructor: 'Prof. Roclyn',
      midtermGrade: 85,
      finalGrade: null,
      overallGrade: 85,
      status: 'In Progress',
      assignments: [
        { title: 'Algorithm Analysis', score: 92, maxScore: 100 },
        { title: 'Tree Implementation', score: 78, maxScore: 100 }
      ],
      attendance: 88
    },
    {
      id: 4,
      subject: 'IT104',
      subjectName: 'Database Systems',
      instructor: 'Prof. Sheryl',
      midtermGrade: 90,
      finalGrade: null,
      overallGrade: 90,
      status: 'In Progress',
      assignments: [
        { title: 'ER Diagram', score: 95, maxScore: 100 },
        { title: 'SQL Queries', score: 85, maxScore: 100 }
      ],
      attendance: 94
    }
  ];

  const filteredGrades = mockGrades.filter(grade => {
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesSearch = grade.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const calculateGPA = () => {
    const completedGrades = mockGrades.filter(g => g.status === 'Passed');
    if (completedGrades.length === 0) return 0;
    const total = completedGrades.reduce((sum, g) => sum + g.overallGrade, 0);
    return (total / completedGrades.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Passed': { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
      'In Progress': { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      'Failed': { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    };
    const config = statusConfig[status] || statusConfig['In Progress'];
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>{status}</span>;
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>My Grades</h2>
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>View your academic performance and grade breakdown</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 self-start"
            style={{
              background: 'var(--gradient-electric)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Download size={16} />
            Download Report
          </button>
        </div>

        {/* GPA Summary Card */}
        <div className="rounded-2xl border p-6 mb-6 shadow-sm"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Award size={32} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Overall GPA</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>{calculateGPA()}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-secondary)' }}>
                  Based on {mockGrades.filter(g => g.status === 'Passed').length} completed subjects
                </p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {mockGrades.filter(g => g.status === 'Passed').length}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Passed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mockGrades.filter(g => g.status === 'In Progress').length}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {mockGrades.length}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Total Subjects</p>
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
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            style={{ borderColor: 'var(--border-light)' }}
          >
            <option value="all">All Subjects</option>
            {mockGrades.map(grade => (
              <option key={grade.id} value={grade.subject}>{grade.subject} - {grade.subjectName}</option>
            ))}
          </select>
        </div>

        {/* Grades List */}
        <div className="space-y-4">
          {filteredGrades.map((grade, index) => (
            <motion.div
              key={grade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary)' }}>
                        {grade.subjectName}
                      </h3>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                        {grade.subject} • {grade.instructor}
                      </p>
                    </div>
                    {getStatusBadge(grade.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Midterm</p>
                      <p className={`text-lg font-bold ${grade.midtermGrade ? getGradeColor(grade.midtermGrade) : 'text-slate-400'}`}>
                        {grade.midtermGrade || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Final</p>
                      <p className={`text-lg font-bold ${grade.finalGrade ? getGradeColor(grade.finalGrade) : 'text-slate-400'}`}>
                        {grade.finalGrade || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Overall</p>
                      <p className={`text-lg font-bold ${getGradeColor(grade.overallGrade)}`}>
                        {grade.overallGrade}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Attendance</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{grade.attendance}%</p>
                    </div>
                  </div>

                  {/* Assignment Breakdown */}
                  <div>
                    <p className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--color-muted)' }}>
                      <BookOpen size={14} />
                      Assignment Breakdown
                    </p>
                    <div className="space-y-2">
                      {grade.assignments.map((assignment, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                        >
                          <span className="text-sm" style={{ color: 'var(--color-primary)' }}>{assignment.title}</span>
                          <span className={`text-sm font-semibold ${getGradeColor((assignment.score / assignment.maxScore) * 100)}`}>
                            {assignment.score}/{assignment.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grade Trend */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl"
                     style={{ backgroundColor: isDarkMode ? 'var(--bg-secondary)' : 'var(--bg-tertiary)' }}>
                  <TrendingUp size={24} className="text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Performance</p>
                  <p className={`text-xl font-bold ${getGradeColor(grade.overallGrade)}`}>
                    {grade.overallGrade >= 90 ? 'Excellent' : grade.overallGrade >= 80 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGrades.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No grades found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Try a different search or filter</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentGrades;
