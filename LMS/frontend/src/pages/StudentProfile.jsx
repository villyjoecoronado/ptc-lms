import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, GraduationCap, Camera, Edit3, Save, Key, Eye, EyeOff } from 'lucide-react';

const StudentProfile = ({ user, userProfile, isDarkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || user?.name || 'Student User',
    email: userProfile?.email || user?.email || 'student@paterostechnologicalcollege.edu.ph',
    phone: userProfile?.phone || '+63 912 345 6789',
    address: userProfile?.address || 'Pateros, Metro Manila',
    department: userProfile?.department || 'Bachelor of Science in Information Technology',
    studentId: userProfile?.studentId || 'PTC-2024-0001',
    yearLevel: userProfile?.yearLevel || '3rd Year',
    gpa: userProfile?.gpa || '1.75',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>My Profile</h2>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Manage your personal information and account settings</p>
        </div>

        <div className="rounded-2xl border p-6 mb-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profileData.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform">
                <Camera size={16} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{profileData.name}</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--color-secondary)' }}>{profileData.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {profileData.yearLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  GPA: {profileData.gpa}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
              style={{
                background: 'var(--gradient-electric)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${isEditing ? '' : 'bg-transparent border-transparent cursor-default'} ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  style={{ borderColor: isEditing ? 'var(--border-light)' : 'transparent' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Email Address</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Mail size={16} className="text-slate-500" />
                  <span style={{ color: 'var(--color-primary)' }}>{profileData.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Phone Number</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${isEditing ? '' : 'bg-transparent border-transparent cursor-default'} ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  style={{ borderColor: isEditing ? 'var(--border-light)' : 'transparent' }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Student ID</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <User size={16} className="text-slate-500" />
                  <span style={{ color: 'var(--color-primary)' }}>{profileData.studentId}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Department</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <GraduationCap size={16} className="text-slate-500" />
                  <span style={{ color: 'var(--color-primary)' }}>{profileData.department}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${isEditing ? '' : 'bg-transparent border-transparent cursor-default'} ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  style={{ borderColor: isEditing ? 'var(--border-light)' : 'transparent' }}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: 'var(--gradient-electric)',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                }}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Key size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>Change Password</h3>
              <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>Update your account password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                placeholder="Confirm new password"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                background: 'var(--gradient-electric)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              Update Password
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
