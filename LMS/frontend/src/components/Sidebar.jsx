import React from 'react';
import { Home, Calendar, CheckSquare, ClipboardList, TrendingUp, Shield, Activity, CheckCircle, Settings, BookOpen, LogOut, Video, MessageSquare, FileText, BarChart3, Megaphone, User, Download, Sparkles } from 'lucide-react';

const Sidebar = ({
  t,
  courses,
  isSidebarOpen,
  setIsSidebarOpen,
  activeNav,
  setActiveNav,
  isDarkMode,
  activeItem,
  handleSubjectSelect,
  handleLogout,
  user,
  userProfile,
  professorCourses
}) => {
  const isProfessor = user?.role === 'professor';
  const isTeacher = user?.role === 'teacher' || user?.role === 'professor';
  const isAdmin = user?.role === 'admin' || user?.role === 'administrator';
  const isDean = user?.role === 'dean';
  const isFaculty = isProfessor || isAdmin || isDean;
  const isStudent = user?.role === 'student';

  // Build role-specific navigation items (DFD Diagram 0 strict separation)
  let navigationItems = [
    { id: 'Home', name: t.home, icon: Home },
    { id: 'Calendar', name: t.calendar, icon: Calendar },
  ];


  // Student-only items (DFD 1.1-1.13)
  if (isStudent) {
    navigationItems.push(
      { id: 'Profile', name: 'My Profile', icon: User },
      { id: 'Subjects', name: 'My Subjects', icon: BookOpen },
      { id: 'Assignments', name: 'Assignments', icon: CheckSquare },
      { id: 'Grades', name: 'Grades', icon: BarChart3 },
      { id: 'LearningMaterials', name: 'Learning Materials', icon: FileText },
      { id: 'VideoConference', name: 'Video Conference', icon: Video },
      { id: 'Messages', name: 'Messages', icon: MessageSquare },
      { id: 'Announcements', name: 'Announcements', icon: Megaphone },
      { id: 'Reports', name: 'Reports', icon: Download }
    );
  }

  // Dean-only items (DFD Diagram 0)
  if (isDean) {
    navigationItems.push(
      { id: 'TaskMonitoring', name: 'Task Monitoring', icon: ClipboardList },
      { id: 'FacultyReports', name: 'Reports', icon: TrendingUp }
    );
  }

  // Admin-only items (DFD Diagram 0)
  if (isAdmin) {
    navigationItems.push(
      { id: 'UserManagement', name: 'User Management', icon: Shield },
      { id: 'ActivityLogs', name: 'Activity Logs', icon: Activity },
      { id: 'Verifications', name: 'Verifications', icon: CheckCircle },
      { id: 'Settings', name: 'Settings', icon: Settings }
    );
  }

  // Teacher/Professor-only items (academic faculty)
  if (isTeacher) {
    navigationItems.push(
      { id: 'Tasks', name: t.todo, icon: CheckSquare },
      { id: 'Messages', name: 'Messages', icon: MessageSquare },
      { id: 'Announcements', name: 'Announcements', icon: Megaphone },
      { id: 'Courses', name: 'My Courses', icon: BookOpen },
      { id: 'Gradebook', name: 'Gradebook', icon: BarChart3 },
      { id: 'Submissions', name: 'Submissions', icon: ClipboardList },
      { id: 'AIAssistant', name: 'AI Assistant', icon: Sparkles },
      { id: 'Settings', name: 'Settings', icon: Settings }
    );
  }

  // Separate courses to list them under "Enrolled" or "Teaching Load"
  const activeEnrolledCourses = (isProfessor || isDean) ? professorCourses : courses;

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`h-full z-50 overflow-hidden flex-shrink-0 fixed inset-y-0 left-0 transform -translate-x-full transition-transform duration-300 w-72 bg-white dark:bg-[#0f172a] backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 ${isSidebarOpen ? 'translate-x-0' : ''}`}
      >
        <div className="flex flex-col h-full min-w-[288px] p-6">
          {/* PTC Logo and Branding */}
          <div className="mb-6 flex flex-col items-center">
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="w-16 h-16 object-contain mb-3" />
            <h1 className={`font-bold uppercase tracking-wide text-sm text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
              PATEROS TECHNOLOGICAL COLLEGE
            </h1>
          </div>

          {/* Nav links rendering loop */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all border-none cursor-pointer text-left font-semibold text-sm hover:scale-[1.02] rounded-2xl ${isActive ? 'shadow-lg' : ''} ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}
                  style={{
                    backgroundColor: isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}

            {/* ENROLLED / SUBJECTS LIST SECTION (Google Classroom Matching Layout) */}
            <div className="mt-4">
              <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {isProfessor ? t.teachingLoad : isDean ? 'All Departments' : t.enrolled}
              </div>
              <div className="mt-1 space-y-1">
                {activeEnrolledCourses?.map((course) => {
                  const isActive = activeItem === course.id;

                  return (
                    <button
                      key={course?.id}
                      onClick={() => {
                        handleSubjectSelect(course);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left text-sm font-medium hover:scale-[1.02] transition-all duration-150 group border-none cursor-pointer ${isActive ? 'shadow-md border-l-4 border-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors'}`}
                      style={{
                        backgroundColor: isActive
                          ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10'
                          : 'transparent',
                        color: isActive
                          ? (isDarkMode ? '#60a5fa' : '#2563eb')
                          : (isDarkMode ? '#cbd5e1' : 'text-slate-700'),
                      }}
                    >
                      {/* Miniature Colored Circle with Initial letter */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm shrink-0 group-hover:scale-110 transition-transform bg-blue-600/10 text-blue-600 border border-blue-500/20 dark:bg-slate-800 dark:text-blue-400 dark:border-slate-700`}
                      >
                        {course?.code?.charAt(0) || 'C'}
                      </div>
                      {/* Subject Code and Section Row */}
                      <div className="overflow-hidden flex-1">
                        <p className="truncate font-semibold m-0 leading-tight" style={{ color: isActive ? (isDarkMode ? '#ffffff' : '#0369a1') : (isDarkMode ? '#cbd5e1' : 'text-slate-700') }}>
                          {course?.code || 'N/A'}
                        </p>
                        <p className="text-[11px] truncate m-0 opacity-70" style={{ color: isActive ? (isDarkMode ? '#ffffff' : '#0369a1') : (isDarkMode ? '#94a3b8' : 'text-slate-500') }}>
                          {course?.section || 'N/A'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Bottom Settings Track */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setActiveNav('Settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-semibold text-sm hover:scale-[1.02] transition-all duration-150 border-none cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setActiveNav('Archived')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-semibold text-sm hover:scale-[1.02] transition-all duration-150 border-none cursor-pointer mt-1 ${isDarkMode ? 'hover:bg-slate-800/50 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Archived classes</span>
            </button>
            <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border-none cursor-pointer font-bold text-sm mt-2 ${isDarkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
