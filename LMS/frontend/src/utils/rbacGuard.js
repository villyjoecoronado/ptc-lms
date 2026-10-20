/**
 * RBAC Guard Utility
 * Enforces strict role-based access control for PTC LMS
 */

/**
 * Check if user role is student
 */
export const isStudent = (userRole) => {
  return userRole === 'student';
};

/**
 * Check if user role is faculty (professor, dean, admin)
 */
export const isFaculty = (userRole) => {
  return ['teacher', 'professor', 'dean', 'admin', 'administrator'].includes(userRole);
};

/**
 * Check if user role is teacher/professor (academic faculty only)
 */
export const isTeacher = (userRole) => {
  return ['teacher', 'professor'].includes(userRole);
};

/**
 * Check if user role is admin/dean (administrative faculty)
 */
export const isAdminFaculty = (userRole) => {
  return ['dean', 'admin', 'administrator'].includes(userRole);
};

/**
 * Validate if user can access a specific navigation item
 * @param {string} navItem - The navigation item to check
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether access is allowed
 */
export const validateRoleAccess = (navItem, userRole) => {
  if (!userRole) return false;

  // Student-only navigation items
  const studentOnlyItems = [
    'Home',
    'Calendar',
    'Tasks',
    'Profile',
    'Subjects',
    'VideoConference',
    'Materials',
    'Assignments',
    'Grades',
    'Announcements',
    'Reports',
    'Messages'
  ];

  // Teacher/Professor-only navigation items (academic faculty)
  const teacherOnlyItems = [
    'Tasks',
    'Messages',
    'Announcements',
    'Courses',
    'Gradebook',
    'Submissions',
    'AIAssistant'
  ];

  // Admin/Dean-only navigation items (administrative faculty)
  const adminOnlyItems = [
    'UserManagement',
    'ActivityLogs',
    'Verifications',
    'TaskMonitoring',
    'FacultyReports'
  ];

  // Student access
  if (isStudent(userRole)) {
    return studentOnlyItems.includes(navItem);
  }

  // Teacher/Professor access (academic faculty only)
  if (isTeacher(userRole)) {
    return teacherOnlyItems.includes(navItem) || ['Home', 'Calendar', 'Settings'].includes(navItem);
  }

  // Admin/Dean access (administrative faculty)
  if (isAdminFaculty(userRole)) {
    return adminOnlyItems.includes(navItem) || teacherOnlyItems.includes(navItem) || ['Home', 'Calendar', 'Settings'].includes(navItem);
  }

  return false;
};

/**
 * Get allowed navigation items for a specific role
 * @param {string} userRole - The user's role
 * @returns {Array} - Array of allowed navigation items
 */
export const getAllowedNavigationItems = (userRole) => {
  if (isStudent(userRole)) {
    return [
      { id: 'Home', label: 'Home', icon: 'Home' },
      { id: 'Calendar', label: 'Calendar', icon: 'Calendar' },
      { id: 'Tasks', label: 'Tasks', icon: 'CheckSquare' },
      { id: 'Profile', label: 'Profile', icon: 'User' },
      { id: 'Subjects', label: 'Subjects', icon: 'BookOpen' },
      { id: 'VideoConference', label: 'Video Conference', icon: 'Video' },
      { id: 'Materials', label: 'Materials', icon: 'FileText' },
      { id: 'Assignments', label: 'Assignments', icon: 'ClipboardList' },
      { id: 'Grades', label: 'Grades', icon: 'BarChart3' },
      { id: 'Announcements', label: 'Announcements', icon: 'Bell' },
      { id: 'Reports', label: 'Reports', icon: 'TrendingUp' },
      { id: 'Messages', label: 'Messages', icon: 'MessageSquare' }
    ];
  }

  if (isTeacher(userRole)) {
    return [
      { id: 'Home', label: 'Home', icon: 'Home' },
      { id: 'Calendar', label: 'Calendar', icon: 'Calendar' },
      { id: 'Tasks', label: 'Tasks', icon: 'CheckSquare' },
      { id: 'Messages', label: 'Messages', icon: 'MessageSquare' },
      { id: 'Announcements', label: 'Announcements', icon: 'Bell' },
      { id: 'Courses', label: 'Courses', icon: 'BookOpen' },
      { id: 'Gradebook', label: 'Gradebook', icon: 'BarChart3' },
      { id: 'Submissions', label: 'Submissions', icon: 'ClipboardList' },
      { id: 'AIAssistant', label: 'AI Assistant', icon: 'Sparkles' },
      { id: 'Settings', label: 'Settings', icon: 'Settings' }
    ];
  }

  if (isAdminFaculty(userRole)) {
    return [
      { id: 'Home', label: 'Home', icon: 'Home' },
      { id: 'Calendar', label: 'Calendar', icon: 'Calendar' },
      { id: 'UserManagement', label: 'User Management', icon: 'Users' },
      { id: 'ActivityLogs', label: 'Activity Logs', icon: 'Activity' },
      { id: 'Verifications', label: 'Verifications', icon: 'Shield' },
      { id: 'TaskMonitoring', label: 'Task Monitoring', icon: 'ClipboardList' },
      { id: 'FacultyReports', label: 'Reports', icon: 'TrendingUp' },
      { id: 'Settings', label: 'Settings', icon: 'Settings' }
    ];
  }

  return [];
};

/**
 * Get role-based default route
 * @param {string} userRole - The user's role
 * @returns {string} - The default route for the role
 */
export const getRoleBasedRoute = (userRole) => {
  const routes = {
    student: '/student-dashboard',
    teacher: '/teacher-dashboard',
    professor: '/teacher-dashboard',
    dean: '/dean-dashboard',
    admin: '/admin-dashboard',
    administrator: '/admin-dashboard'
  };
  return routes[userRole] || '/student-dashboard';
};

/**
 * Check if current route is allowed for user role
 * @param {string} route - The current route
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether route access is allowed
 */
export const isRouteAllowed = (route, userRole) => {
  if (!userRole) return false;

  const studentRoutes = ['/student-dashboard'];
  const facultyRoutes = ['/teacher-dashboard', '/dean-dashboard', '/admin-dashboard'];

  if (isStudent(userRole)) {
    return studentRoutes.some(r => route.startsWith(r));
  }

  if (isFaculty(userRole)) {
    return facultyRoutes.some(r => route.startsWith(r));
  }

  return false;
};
