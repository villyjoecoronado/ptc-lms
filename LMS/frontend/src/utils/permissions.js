/**
 * Role-Based Management Permission Matrix
 * Source of truth for navigation and access control
 */
export const ROLE_PERMISSIONS = {
  // Admin: Access to all 4 management modules + Verification
  administrator: {
    canAccessAdminManagement: true,
    canAccessDeanManagement: true,
    canAccessFacultyManagement: true,
    canAccessStudentManagement: true,
    canAccessVerification: true,
    managementModules: [
      { id: 'AdminManagement', name: 'Admin Management', icon: 'Shield', targetRole: 'administrator' },
      { id: 'DeanManagement', name: 'Dean Management', icon: 'Award', targetRole: 'dean' },
      { id: 'FacultyManagement', name: 'Faculty Management', icon: 'Users', targetRole: 'professor' },
      { id: 'StudentManagement', name: 'Student Management', icon: 'GraduationCap', targetRole: 'student' },
    ]
  },
  admin: {
    canAccessAdminManagement: true,
    canAccessDeanManagement: true,
    canAccessFacultyManagement: true,
    canAccessStudentManagement: true,
    canAccessVerification: true,
    managementModules: [
      { id: 'AdminManagement', name: 'Admin Management', icon: 'Shield', targetRole: 'administrator' },
      { id: 'DeanManagement', name: 'Dean Management', icon: 'Award', targetRole: 'dean' },
      { id: 'FacultyManagement', name: 'Faculty Management', icon: 'Users', targetRole: 'professor' },
      { id: 'StudentManagement', name: 'Student Management', icon: 'GraduationCap', targetRole: 'student' },
    ]
  },
  // Dean: Faculty Management, Student Management + Verification
  dean: {
    canAccessAdminManagement: false,
    canAccessDeanManagement: false,
    canAccessFacultyManagement: true,
    canAccessStudentManagement: true,
    canAccessVerification: true,
    managementModules: [
      { id: 'FacultyManagement', name: 'Faculty Management', icon: 'Users', targetRole: 'professor' },
      { id: 'StudentManagement', name: 'Student Management', icon: 'GraduationCap', targetRole: 'student' },
    ]
  },
  // Faculty: Student Management + Verification
  professor: {
    canAccessAdminManagement: false,
    canAccessDeanManagement: false,
    canAccessFacultyManagement: false,
    canAccessStudentManagement: true,
    canAccessVerification: true,
    managementModules: [
      { id: 'StudentManagement', name: 'Student Management', icon: 'GraduationCap', targetRole: 'student' },
    ]
  },
  teacher: {
    canAccessAdminManagement: false,
    canAccessDeanManagement: false,
    canAccessFacultyManagement: false,
    canAccessStudentManagement: true,
    canAccessVerification: true,
    managementModules: [
      { id: 'StudentManagement', name: 'Student Management', icon: 'GraduationCap', targetRole: 'student' },
    ]
  },
  // Student: Student-facing features only
  student: {
    canAccessAdminManagement: false,
    canAccessDeanManagement: false,
    canAccessFacultyManagement: false,
    canAccessStudentManagement: false,
    canAccessVerification: false,
    managementModules: []
  }
};

export const getRolePermissions = (role) => {
  const normalized = (role || '').toLowerCase();
  return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS.student;
};

export const canAccessModule = (role, moduleId) => {
  const permissions = getRolePermissions(role);
  if (moduleId === 'Verifications' || moduleId === 'Verification') {
    return permissions.canAccessVerification;
  }
  return permissions.managementModules.some(m => m.id === moduleId);
};
