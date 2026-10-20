import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, Search, Filter, Folder, Video, File, Image as ImageIcon } from 'lucide-react';

const StudentLearningMaterials = ({ materials, isDarkMode }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockMaterials = materials || [
    {
      id: 1,
      title: 'React Components Guide',
      description: 'Comprehensive guide to creating functional and class components in React',
      subject: 'IT101',
      subjectName: 'Introduction to Computing',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Prof. Edmar',
      uploadedDate: '2024-10-15',
      downloads: 45
    },
    {
      id: 2,
      title: 'Data Structures Lecture Notes',
      description: 'Complete lecture notes on arrays, linked lists, trees, and graphs',
      subject: 'IT103',
      subjectName: 'Data Structures',
      type: 'pdf',
      size: '3.8 MB',
      uploadedBy: 'Prof. Roclyn',
      uploadedDate: '2024-10-14',
      downloads: 38
    },
    {
      id: 3,
      title: 'SQL Tutorial Video',
      description: 'Video tutorial covering basic to advanced SQL queries',
      subject: 'IT104',
      subjectName: 'Database Systems',
      type: 'video',
      size: '156 MB',
      uploadedBy: 'Prof. Sheryl',
      uploadedDate: '2024-10-13',
      downloads: 52
    },
    {
      id: 4,
      title: 'Programming Fundamentals Syllabus',
      description: 'Course syllabus including topics, schedule, and requirements',
      subject: 'IT102',
      subjectName: 'Programming Fundamentals',
      type: 'pdf',
      size: '890 KB',
      uploadedBy: 'Prof. Harvey',
      uploadedDate: '2024-10-12',
      downloads: 67
    },
    {
      id: 5,
      title: 'Algorithm Diagrams',
      description: 'Visual diagrams for sorting and searching algorithms',
      subject: 'IT103',
      subjectName: 'Data Structures',
      type: 'image',
      size: '4.2 MB',
      uploadedBy: 'Prof. Roclyn',
      uploadedDate: '2024-10-11',
      downloads: 29
    },
    {
      id: 6,
      title: 'Database Design Examples',
      description: 'Sample database schemas and ER diagrams for reference',
      subject: 'IT104',
      subjectName: 'Database Systems',
      type: 'pdf',
      size: '1.5 MB',
      uploadedBy: 'Prof. Sheryl',
      uploadedDate: '2024-10-10',
      downloads: 41
    }
  ];

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type) => {
    const iconConfig = {
      pdf: FileText,
      video: Video,
      image: ImageIcon,
      doc: File,
      zip: Folder
    };
    return iconConfig[type] || File;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      pdf: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', label: 'PDF' },
      video: { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', label: 'Video' },
      image: { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', label: 'Image' },
      doc: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', label: 'Document' },
      zip: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', label: 'Archive' }
    };
    const config = typeConfig[type] || typeConfig.pdf;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  const handleDownload = (material) => {
    console.log('Downloading material:', material.title);
  };

  const subjects = [...new Set(mockMaterials.map(m => m.subject))];

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            <BookOpen size={24} />
            Learning Materials
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Access lecture notes, syllabi, and resources from your instructors</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search materials..."
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
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            style={{ borderColor: 'var(--border-light)' }}
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="doc">Document</option>
          </select>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material, index) => {
            const Icon = getTypeIcon(material.type);
            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Icon size={24} className="text-white" />
                  </div>
                  {getTypeBadge(material.type)}
                </div>

                <h3 className="font-bold text-sm mb-2 line-clamp-2" style={{ color: 'var(--color-primary)' }}>
                  {material.title}
                </h3>

                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-secondary)' }}>
                  {material.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                    <BookOpen size={14} />
                    <span>{material.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                    <span>Size: {material.size}</span>
                    <span>•</span>
                    <span>{material.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                    <span>Uploaded by {material.uploadedBy}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(material)}
                  className="w-full py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: 'var(--gradient-electric)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  <Download size={16} />
                  Download
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No materials found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Try a different search or filter</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentLearningMaterials;
