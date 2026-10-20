import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Megaphone, Calendar, Clock, User, Filter, Search, Pin } from 'lucide-react';

const StudentAnnouncements = ({ announcements, isDarkMode }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockAnnouncements = announcements || [
    {
      id: 1,
      title: 'Midterm Examination Schedule Released',
      content: 'The midterm examination schedule for all BSIT subjects has been released. Please check your respective subject pages for specific dates and times. Make sure to review all materials before the exam.',
      author: 'Dean\'s Office',
      authorRole: 'Administration',
      category: 'institution',
      priority: 'high',
      pinned: true,
      createdAt: '2024-10-18 09:00',
      attachments: [
        { name: 'Midterm_Schedule.pdf', type: 'pdf', size: '245 KB' }
      ]
    },
    {
      id: 2,
      title: 'IT101 - Lab Exercise 4 Deadline Extended',
      content: 'Due to the upcoming holiday, the deadline for Lab Exercise 4 has been extended to October 25, 2024. Please use this extra time to complete your work thoroughly.',
      author: 'Prof. Edmar Tan',
      authorRole: 'Instructor',
      category: 'subject',
      priority: 'medium',
      pinned: false,
      subject: 'IT101',
      createdAt: '2024-10-17 14:30',
      attachments: []
    },
    {
      id: 3,
      title: 'Campus Maintenance Notice',
      content: 'The campus library will be closed for maintenance from October 20-22, 2024. Students are advised to use the online resources available through the LMS during this period.',
      author: 'Facilities Office',
      authorRole: 'Administration',
      category: 'institution',
      priority: 'low',
      pinned: false,
      createdAt: '2024-10-16 10:00',
      attachments: []
    },
    {
      id: 4,
      title: 'IT104 - Database Project Guidelines',
      content: 'Guidelines for the final database project have been posted. Please review the requirements carefully and start working on your proposals. Group formation deadline is October 25.',
      author: 'Prof. Sheryl Ann Ricafort',
      authorRole: 'Instructor',
      category: 'subject',
      priority: 'high',
      pinned: true,
      subject: 'IT104',
      createdAt: '2024-10-15 16:00',
      attachments: [
        { name: 'Project_Guidelines.pdf', type: 'pdf', size: '1.2 MB' },
        { name: 'Rubric.docx', type: 'docx', size: '45 KB' }
      ]
    }
  ];

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'pinned' && announcement.pinned) ||
                         (selectedFilter === 'subject' && announcement.category === 'subject') ||
                         (selectedFilter === 'institution' && announcement.category === 'institution');
    return matchesSearch && matchesFilter;
  });

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', label: 'Important' },
      medium: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', label: 'Update' },
      low: { color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', label: 'Info' }
    };
    const config = priorityConfig[priority] || priorityConfig.low;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      subject: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', label: 'Subject' },
      institution: { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', label: 'Institution' }
    };
    const config = categoryConfig[category] || categoryConfig.subject;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
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
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              <Megaphone size={24} />
              Announcements
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Stay updated with class and institution news</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
              style={{ borderColor: 'var(--border-light)' }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pinned', 'subject', 'institution'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all ${announcement.pinned ? 'border-l-4 border-l-blue-600' : ''}`}
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {announcement.pinned && (
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Pin size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary)' }}>
                      {announcement.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                      <User size={14} />
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.authorRole}</span>
                      {announcement.subject && (
                        <>
                          <span>•</span>
                          <span>{announcement.subject}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(announcement.priority)}
                  {getCategoryBadge(announcement.category)}
                </div>
              </div>

              <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--color-secondary)' }}>
                {announcement.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                  <Clock size={14} />
                  <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                </div>

                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Attachments:</span>
                    {announcement.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                      >
                        <span>{file.name}</span>
                        <span className="text-slate-400">({file.size})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No announcements found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Try a different search or filter</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentAnnouncements;
