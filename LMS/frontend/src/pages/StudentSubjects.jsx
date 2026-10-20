import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, CheckCircle, Clock, Users, ChevronRight } from 'lucide-react';

const StudentSubjects = ({ courses, isDarkMode, onJoinSubject }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const mockSubjects = courses || [
    { id: 1, code: 'IT101', name: 'Introduction to Computing', section: 'BSIT-1A', instructor: 'Prof. Edmar', schedule: 'MWF 8:00-9:30 AM', units: 3, enrolled: 45, status: 'active' },
    { id: 2, code: 'IT102', name: 'Programming Fundamentals', section: 'BSIT-1A', instructor: 'Prof. Harvey', schedule: 'TTH 10:00-11:30 AM', units: 3, enrolled: 42, status: 'active' },
    { id: 3, code: 'IT103', name: 'Data Structures', section: 'BSIT-2A', instructor: 'Prof. Roclyn', schedule: 'MWF 1:00-2:30 PM', units: 3, enrolled: 38, status: 'active' },
    { id: 4, code: 'IT104', name: 'Database Systems', section: 'BSIT-2A', instructor: 'Prof. Sheryl', schedule: 'TTH 2:00-3:30 PM', units: 3, enrolled: 40, status: 'active' },
  ];

  const filteredSubjects = mockSubjects.filter(subject =>
    subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinSubject = () => {
    if (classCode.trim()) {
      console.log('Joining subject with code:', classCode);
      onJoinSubject && onJoinSubject(classCode);
      setClassCode('');
      setShowJoinModal(false);
    }
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>My Subjects</h2>
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>View and manage your enrolled subjects</p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 self-start"
            style={{
              background: 'var(--gradient-electric)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Plus size={16} />
            Join Subject
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects by code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {subject.code.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{subject.code}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>{subject.section}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle size={12} />
                  Active
                </div>
              </div>

              <h4 className="font-semibold text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-primary)' }}>
                {subject.name}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-secondary)' }}>
                  <Users size={14} />
                  <span>{subject.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-secondary)' }}>
                  <Clock size={14} />
                  <span>{subject.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-secondary)' }}>
                  <BookOpen size={14} />
                  <span>{subject.units} Units</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {subject.enrolled} students enrolled
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No subjects found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Try a different search term or join a new subject</p>
          </div>
        )}
      </motion.div>

      {/* Join Subject Modal */}
      {showJoinModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowJoinModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Join a Subject</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-secondary)' }}>Enter the class code provided by your instructor</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Class Code</label>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="e.g., IT101-SPRING2024"
                    className={`w-full px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    style={{ borderColor: 'var(--border-light)' }}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinSubject}
                    disabled={!classCode.trim()}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--gradient-electric)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    Join Subject
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

export default StudentSubjects;
