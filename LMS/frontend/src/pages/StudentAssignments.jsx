import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Download, Plus, Search, Filter } from 'lucide-react';

const StudentAssignments = ({ assignments, isDarkMode, onUploadSubmission }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockAssignments = assignments || [
    {
      id: 1,
      title: 'Laboratory Exercise 1: React Components',
      description: 'Create functional and class components using React hooks. Include proper state management and props passing.',
      subject: 'IT101',
      instructor: 'Prof. Edmar',
      dueDate: '2024-10-20 23:59',
      points: 100,
      status: 'pending',
      attachments: [
        { name: 'React_Components_Guide.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'Example_Code.zip', type: 'zip', size: '1.1 MB' }
      ],
      submittedFiles: [],
      grade: null
    },
    {
      id: 2,
      title: 'Database Design Project',
      description: 'Design a normalized database schema for a library management system with ER diagram.',
      subject: 'IT104',
      instructor: 'Prof. Sheryl',
      dueDate: '2024-10-18 23:59',
      points: 150,
      status: 'submitted',
      submittedFiles: [
        { name: 'Library_DB_Design.pdf', type: 'pdf', size: '3.2 MB' }
      ],
      submittedAt: '2024-10-17 14:30',
      grade: null
    },
    {
      id: 3,
      title: 'Algorithm Analysis Report',
      description: 'Analyze time complexity of sorting algorithms with empirical data.',
      subject: 'IT103',
      instructor: 'Prof. Roclyn',
      dueDate: '2024-10-15 23:59',
      points: 100,
      status: 'graded',
      submittedFiles: [
        { name: 'Algorithm_Analysis.docx', type: 'docx', size: '1.5 MB' }
      ],
      submittedAt: '2024-10-14 16:45',
      grade: 92,
      feedback: 'Excellent analysis! Good use of empirical data.'
    }
  ];

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', icon: Clock, label: 'Pending' },
      submitted: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: CheckCircle, label: 'Submitted' },
      graded: { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', icon: CheckCircle, label: 'Graded' },
      overdue: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: AlertCircle, label: 'Overdue' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </div>
    );
  };

  const handleUpload = (assignment) => {
    setSelectedAssignment(assignment);
    setShowUploadModal(true);
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Assignments</h2>
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>View and submit your course assignments</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'submitted', 'graded'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
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
                        {assignment.title}
                      </h3>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                        {assignment.subject} • {assignment.instructor}
                      </p>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>

                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-secondary)' }}>
                    {assignment.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                      <Clock size={14} />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                      <FileText size={14} />
                      <span>{assignment.points} points</span>
                    </div>
                    {assignment.grade && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={14} />
                        <span>Grade: {assignment.grade}/100</span>
                      </div>
                    )}
                  </div>

                  {/* Attachments */}
                  {assignment.attachments && assignment.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {assignment.attachments.map((file, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                          >
                            <FileText size={14} />
                            <span>{file.name}</span>
                            <Download size={12} className="cursor-pointer hover:text-blue-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submitted Files */}
                  {assignment.submittedFiles && assignment.submittedFiles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>
                        Submitted: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleString() : 'N/A'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {assignment.submittedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}
                          >
                            <CheckCircle size={14} />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {assignment.feedback && (
                    <div className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      <p className="font-semibold mb-1">Instructor Feedback:</p>
                      <p>{assignment.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {assignment.status === 'pending' && (
                  <button
                    onClick={() => handleUpload(assignment)}
                    className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 self-start"
                    style={{
                      background: 'var(--gradient-electric)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    <Upload size={16} />
                    Submit
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No assignments found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Try a different search or filter</p>
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      {showUploadModal && selectedAssignment && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Submit Assignment
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-secondary)' }}>
                {selectedAssignment.title}
              </p>

              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
                  <Upload size={32} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>
                    Drag and drop files here
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    or click to browse
                  </p>
                  <input type="file" className="hidden" />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onUploadSubmission && onUploadSubmission(selectedAssignment.id);
                      setShowUploadModal(false);
                    }}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                    style={{
                      background: 'var(--gradient-electric)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAssignments;
