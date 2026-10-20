"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Calendar, ClipboardList, Settings, Bell,
  Search, Menu, X, Sparkles, LogOut, CheckSquare, Send,
  MessageSquare, FileText, Camera, Video, Moon, Sun, TrendingUp,
  CheckCircle, CheckCircle2, Activity, Zap, ExternalLink, Monitor, MonitorOff,
  PhoneOff, MicOff, Hand, Copy, Mic, User, Users, Clock, MapPin, Download, Trash2,
  Plus, FolderPlus, Mail, Pencil, Edit3, BrainCircuit, HelpCircle, Layers, Image, Check, Shield, Key, Save, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, GraduationCap, BarChart3, Award, ChevronLeft, ChevronRight, Archive, UserPlus, Building2, RefreshCw, MoreVertical
} from 'lucide-react';
import AdminUserManagement from './AdminUserManagement';
import UserAccountInfo from './components/UserAccountInfo';
import RoleManagementView from './components/RoleManagementView';
import VerificationView from './components/VerificationView';
import { ROLE_PERMISSIONS, canAccessModule } from './utils/permissions';
import VideoMeeting from './VideoMeeting';
import StudentSubjects from './pages/StudentSubjects';
import StudentAssignments from './pages/StudentAssignments';
import StudentGrades from './pages/StudentGrades';
import StudentLearningMaterials from './pages/StudentLearningMaterials';
import StudentVideoConference from './pages/StudentVideoConference';
import StudentMessages from './pages/StudentMessages';
import StudentReports from './pages/StudentReports';
import StudentProfile from './pages/StudentProfile';
import StudentAnnouncements from './pages/StudentAnnouncements';
import axios from 'axios';

// --- PREMIUM UI CSS-IN-JS (Bubbly Typography + Perfect Dark Mode Background Fix) ---
const injectProfessionalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      --font-weight-heading: 700;
      --font-weight-body: 500;
      --letter-spacing-tight: -0.025em;
      --letter-spacing-normal: 0em;
      --line-height-body: 1.6;
      --line-height-heading: 1.25;
      
      /* Light Mode Colors (Enhanced Contrast) */
      --bg-main-light: #ffffff;
      --bg-secondary-light: #f8fafc;
      --bg-tertiary-light: #f1f5f9;
      --card-bg-light: #ffffff;
      --sidebar-bg-light: #ffffff;
      --color-primary-light: #0f172a;
      --color-secondary-light: #475569;
      --color-muted-light: #64748b;
      --border-light-light: #cbd5e1;
      --border-dark-light: #94a3b8;
      --highlight-light: #e8f0fe;
      --highlight-border-light: #c2e7ff;
      
      /* Dark Mode Colors (Deep Rich Dark Setup - Enhanced Contrast) */
      --bg-main-dark: #0f172a;
      --bg-secondary-dark: #1e293b;
      --bg-tertiary-dark: #334155;
      --card-bg-dark: #1e293b;
      --sidebar-bg-dark: #0f172a;
      --color-primary-dark: #ffffff;
      --color-secondary-dark: #e2e8f0;
      --color-muted-dark: #cbd5e1;
      --border-light-dark: #475569;
      --border-dark-dark: #64748b;
      --highlight-dark: #334155;
      --highlight-border-dark: #64748b;
      --accent-dark: #bb86fc;
      
      /* Electric Gradient Premium Tokens */
      --gradient-electric: linear-gradient(135deg, #4f46e5, #0ea5e9);
      --gradient-electric-hover: linear-gradient(135deg, #4338ca, #0284c7);
      --gradient-premium: linear-gradient(135deg, #7c3aed, #2563eb);
      --gradient-premium-hover: linear-gradient(135deg, #6d28d9, #1d4ed8);
      
      /* Default Core Variables mapped to Light Mode */
      --bg-main: var(--bg-main-light);
      --bg-secondary: var(--bg-secondary-light);
      --bg-tertiary: var(--bg-tertiary-light);
      --card-bg: var(--card-bg-light);
      --sidebar-bg: var(--sidebar-bg-light);
      --color-primary: var(--color-primary-light);
      --color-secondary: var(--color-secondary-light);
      --color-muted: var(--color-muted-light);
      --border-light: var(--border-light-light);
      --border-dark: var(--border-dark-light);
      --highlight: var(--highlight-light);
      --highlight-border: var(--highlight-border-light);
      --accent: var(--accent-dark);
    }
    
    /* Strict Dark mode style overrides when .dark-mode class is active */
    body.dark-mode, .dark-mode, :root.dark-mode {
      --bg-main: var(--bg-main-dark) !important;
      --bg-secondary: var(--bg-secondary-dark) !important;
      --bg-tertiary: var(--bg-tertiary-dark) !important;
      --card-bg: var(--card-bg-dark) !important;
      --sidebar-bg: var(--sidebar-bg-dark) !important;
      --color-primary: var(--color-primary-dark) !important;
      --color-secondary: var(--color-secondary-dark) !important;
      --color-muted: var(--color-muted-dark) !important;
      --border-light: var(--border-light-dark) !important;
      --border-dark: var(--border-dark-dark) !important;
      --highlight: var(--highlight-dark) !important;
      --highlight-border: var(--highlight-border-dark) !important;
      --accent: var(--accent-dark) !important;
    }  

    /* Global Typography Override for Bubbly & Bouncy Feel */
    * {
      box-sizing: border-box;
      font-family: var(--font-family) !important;
    }

    body {
      font-family: var(--font-family) !important;
      font-weight: var(--font-weight-body);
      font-style: normal !important;
      background-color: var(--bg-main) !important;
      color: var(--color-primary) !important;
      line-height: var(--line-height-body);
      letter-spacing: var(--letter-spacing-normal);
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    /* Elegant Italic Accents for Subheadings and Badges */
    .text-accent-italic {
      font-style: italic;
      font-weight: 500;
      letter-spacing: var(--letter-spacing-tight);
    }

    .text-accent-subtitle {
      font-style: italic;
      font-weight: 400;
      opacity: 0.85;
    }

    .badge-elegant {
      font-style: italic;
      font-weight: 600;
      letter-spacing: var(--letter-spacing-tight);
    }

    /* High-contrast text for dark mode */
    .dark-mode .text-slate-800,
    .dark-mode .text-gray-900,
    .dark-mode .text-slate-900 {
      color: #f8fafc !important;
    }

    .dark-mode .text-slate-700,
    .dark-mode .text-gray-700 {
      color: #e2e8f0 !important;
    }

    .dark-mode .text-slate-600,
    .dark-mode .text-gray-600 {
      color: #cbd5e1 !important;
    }

    .dark-mode .text-slate-500,
    .dark-mode .text-gray-500 {
      color: #94a3b8 !important;
    }

    .dark-mode .text-slate-400,
    .dark-mode .text-gray-400 {
      color: #64748b !important;
    }

    /* Ensure inputs have proper contrast */
    .dark-mode input,
    .dark-mode textarea,
    .dark-mode select {
      background-color: var(--bg-secondary) !important;
      color: var(--color-primary) !important;
      border-color: var(--border-light) !important;
    }

    .dark-mode input::placeholder,
    .dark-mode textarea::placeholder {
      color: var(--color-muted) !important;
    }
    }

    h1, h2, h3, h4, h5, h6, .app-brand-title {
      font-family: var(--font-family) !important;
      font-weight: var(--font-weight-heading) !important;
      font-style: normal !important;
      line-height: var(--line-height-heading);
      letter-spacing: var(--letter-spacing-tight);
      margin: 0;
      margin-bottom: 0.75rem;
      color: var(--color-primary) !important;
    }

    h1 { font-size: 28px; }
    h2 { font-size: 26px; }
    h3 { font-size: 24px; }
    h4 { font-size: 22px; }
    h5 { font-size: 20px; }
    h6 { font-size: 18px; }

    /* Custom Input elements dynamic font assignment */
    input, select, textarea, button {
      font-family: var(--font-family) !important;
    }

    /* Subject banner font fixes */
    .course-card .course-title {
      font-size: 14px !important;
      line-height: 1.2 !important;
      font-weight: 600 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .course-card .course-code {
      font-size: 12px !important;
      line-height: 1.1 !important;
      font-weight: 500 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Mobile optimization */
    @media (max-width: 768px) {
      .course-card .course-title {
        font-size: 12px !important;
      }
      .course-card .course-code {
        font-size: 10px !important;
      }
    }

    p {
      font-family: var(--font-family) !important;
      font-weight: var(--font-weight-body);
      line-height: var(--line-height-body);
      letter-spacing: var(--letter-spacing-normal);
      margin: 0;
      margin-bottom: 1rem;
      color: var(--color-primary) !important;
    }

    .text-secondary {
      color: var(--color-secondary) !important;
    }

    .text-muted {
      color: var(--color-muted) !important;
    }

    .heading-large {
      font-size: 28px;
      font-weight: var(--font-weight-heading);
      letter-spacing: var(--letter-spacing-tight);
      line-height: var(--line-height-heading);
      color: var(--color-primary) !important;
    }

    .heading-medium {
      font-size: 24px;
      font-weight: var(--font-weight-heading);
      letter-spacing: var(--letter-spacing-tight);
      line-height: var(--line-height-heading);
      color: var(--color-primary) !important;
    }

    .body-text {
      font-size: 16px;
      font-weight: var(--font-weight-body);
      line-height: var(--line-height-body);
      letter-spacing: var(--letter-spacing-normal);
      color: var(--color-primary) !important;
    }

    .caption-text {
      font-size: 14px;
      font-weight: var(--font-weight-body);
      line-height: var(--line-height-body);
      letter-spacing: var(--letter-spacing-normal);
      color: var(--color-secondary) !important;
    }

    /* Google Classroom Sidebar Styles */
    .sidebar-item {
      minHeight: 60px;
      padding: 12px 16px;
      margin: 2px 8px;
      border-radius: 25px;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .sidebar-item:hover {
      background-color: rgba(0,0,0,0.05);
    }
    
    body.dark-mode .sidebar-item:hover {
      background-color: rgba(255,255,255,0.05);
    }

    .sidebar-item.active {
      background-color: #e8f0fe;
      border: 1px solid #c2e7ff;
      font-weight: 600;
      margin: 2px 4px;
    }

    .sidebar-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-primary);
    }

    .sidebar-sublabel {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-secondary);
      margin-top: 2px;
    }

    .sidebar-icon {
      width: 20px;
      height: 20px;
      color: var(--color-secondary);
      flex-shrink: 0;
    }

    .sidebar-avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: white;
      font-size: 14px;
      flex-shrink: 0;
    }

    .sidebar-separator {
      height: 1px;
      background-color: var(--border-light);
      margin: 8px 16px;
    }

    .sidebar-section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 16px;
    }

    .glass {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .glass-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-light);
    }

    .premium-card {
      background: var(--card-bg);
      border-radius: 1rem;
      border: 1px solid var(--border-light);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    /* Course cards */
    .course-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .course-card:hover {
      transform: translateY(-4px);
    }

    /* Sidebar activation animation fixes */
    .sidebar-item {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg-secondary);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--border-light);
      border-radius: 4px;
    }

    /* Text truncation */
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInFromRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    .animate-slide-in-from-right {
      animation: slideInFromRight 0.5s ease-out;
    }
  `;
  document.head.appendChild(style);
};

// --- LOGIN SCREEN COMPONENT (moved outside App to prevent remount) ---
const LoginScreen = ({
  isDarkMode,
  setIsDarkMode,
  isRegisterMode,
  setIsRegisterMode,
  handleLogin,
  handleRegister,
  username,
  setUsername,
  password,
  setPassword,
  registerData,
  setRegisterData,
  setUser,
  setIsLoggedIn,
  setCurrentUser,
  setActiveNav,
  t,
  emailError,
  setEmailError,
  emailValid,
  setEmailValid,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordError,
  setPasswordError,
  confirmPasswordError,
  setConfirmPasswordError,
  isSubmitting,
  setIsSubmitting,
  passwordRequirements,
  setPasswordRequirements,
  validateEmail,
  checkPasswordRequirements,
  loginSuccessMessage,
  error,
  setError,
  loading
}) => {

  return (
    <div className={`min-h-screen flex overflow-x-hidden overflow-y-auto ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'} dark:bg-slate-950 dark:text-white transition-colors duration-300`}>
      {/* Left Panel - Hero Branding Section (55%) */}
      <div className={`hidden lg:flex lg:w-[55%] relative ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 via-slate-950 to-indigo-950' : 'bg-gradient-to-br from-blue-100 via-white to-indigo-100'}`}>
        {/* Animated Glowing Mesh Orbs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 h-full">
          {/* PTC Logo with Glowing Aura */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="relative w-48 h-48 object-contain" style={{ filter: 'drop-shadow(0 10px 15px rgba(37,99,235,0.2))' }} />
          </div>
          
          {/* Bold Branding */}
          <h1 className={`font-bold uppercase tracking-wide text-5xl lg:text-6xl mb-2 text-center drop-shadow-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
            PATEROS TECHNOLOGICAL COLLEGE
          </h1>
          
          {/* Academic Motto Badge */}
          <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mt-2">Empowering Quality Technological Education</p>
          
          {/* Academic Portal Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Academic Portal • S.Y. 2026-2027</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Interactive Auth Studio (45%) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative">
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950' : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50'}`} />
        <div className={`absolute top-0 right-0 w-64 h-64 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 left-0 w64 h-64 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-200/20'} rounded-full blur-3xl`} />
        
        {/* Glassmorphic Auth Card */}
        <div className={`relative z-10 w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-blue-500/30 rounded-3xl p-8 shadow-2xl dark:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-colors duration-300 auth-card login-card-forced-dark`}>
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 border ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}`}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-cyan-300" />
              ) : (
                <Moon size={20} className="text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="w-24 h-24 object-contain drop-shadow-md" />
          </div>

          {/* Decorative Welcome Header */}
          <div className="mb-6 text-center">
            <span className="bg-blue-100 dark:bg-blue-950/90 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700 font-bold px-4 py-1.5 rounded-full text-xs shadow-sm inline-block">
              ✨ Welcome to PTC Learning Management System
            </span>
            <h2 className="text-slate-950 dark:text-white font-black text-2xl mt-4 mb-1 tracking-tight drop-shadow-none dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] transition-colors">{isRegisterMode ? 'Create Account' : 'Sign in to your account'}</h2>
            <p className="text-slate-700 dark:text-slate-300 font-bold text-xs mb-6 transition-colors">{isRegisterMode ? 'Create your PTC Learning Management System account using your official PTC email address.' : 'Sign in with your registered PTC credentials'}</p>
          </div>

          {loginSuccessMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-400 text-xs font-semibold">{loginSuccessMessage}</p>
            </div>
          )}


          {!isRegisterMode ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                key="global-login-username-field"
                id="login-username"
                type="text"
                placeholder="PTC Email Address or Username (student, prof, dean, admin)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
className="w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
              <input
                key="global-login-password-field"
                id="login-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
className="w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
              {error && (
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <LogOut size={20} className="rotate-180" />
                {loading ? 'Signing in...' : t.signIn}
              </button>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister} className="space-y-5">
              <input
                key="global-register-fullname-field"
                id="register-fullname"
                name="name"
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
className="w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600"
                required
              />
              
              {/* PTC Email Field with Validation */}
              <div>
                <input
                  key="global-register-email-field"
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="username@paterostechnologicalcollege.edu.ph"
                  value={registerData.email}
                  onChange={(e) => {
                    setRegisterData(prev => ({ ...prev, email: e.target.value }));
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(registerData.email)}
                  className={`w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600 ${emailValid ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}
                  required
                />
              </div>
              
              {/* Password Field with Show/Hide and Requirements Checklist */}
              <div>
                <div className="relative">
                  <input
                    key="global-register-password-field"
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={registerData.password}
                    onChange={(e) => {
                      setRegisterData(prev => ({ ...prev, password: e.target.value }));
                      checkPasswordRequirements(e.target.value);
                      setPasswordError("");
                    }}
                    className="w-full px-4 py-3 pr-12 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                
                {/* Live Password Requirement Checklist */}
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-bold mb-3">Password must contain:</p>
                  <ul className="space-y-2">
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.length ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.uppercase ? '✓' : '○'} At least one uppercase letter (A-Z)
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.lowercase ? '✓' : '○'} At least one lowercase letter (a-z)
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.number ? '✓' : '○'} At least one number (0-9)
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.special ? '✓' : '○'} At least one special character (!@#$%^&* etc.)
                    </li>
                  </ul>
                </div>
                
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">{passwordError}</p>
                )}
              </div>
              
              {/* Confirm Password Field with Show/Hide */}
              <div>
                <div className="relative">
                  <input
                    key="global-register-confirm-password-field"
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={registerData.confirmPassword}
                    onChange={(e) => {
                      const confirmValue = e.target.value;
                      setRegisterData(prev => ({ ...prev, confirmPassword: confirmValue }));
                      if (confirmValue.trim() !== registerData.password.trim()) {
                        setConfirmPasswordError("Passwords do not match.");
                      } else {
                        setConfirmPasswordError("");
                      }
                    }}
                    className={`w-full px-4 py-3 pr-12 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600 ${confirmPasswordError ? 'border-red-500' : registerData.confirmPassword && registerData.confirmPassword === registerData.password ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">{confirmPasswordError}</p>
                )}
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Role</label>
                <select
                  key="global-register-role-field"
                  id="register-role"
                  name="role"
                  value={registerData.role}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                  required
                >
                  <option value="student">Student</option>
                  <option value="professor">Teacher / Professor</option>
                  <option value="dean">Dean</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              
              {/* Submit Button with Anti-Double Submission */}
              <button 
                type="submit" 
                disabled={isSubmitting || !registerData.name || !emailValid || !!confirmPasswordError || !Object.values(passwordRequirements).every(Boolean)}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}


          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            {!isRegisterMode ? (
              <button 
                onClick={() => setIsRegisterMode(true)}
                className="text-slate-800 dark:text-slate-200 font-semibold text-xs mt-6 text-center block"
              >
                Don't have an account? <span className="text-blue-700 dark:text-blue-400 font-extrabold hover:underline cursor-pointer ml-1 drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Register here</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsRegisterMode(false)}
                className="text-slate-800 dark:text-slate-200 font-semibold text-xs mt-6 text-center block"
              >
                Already have an account? <span className="text-blue-700 dark:text-blue-400 font-extrabold hover:underline cursor-pointer ml-1 drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Log in here</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CALENDAR VIEW COMPONENT (moved outside App to prevent remount) ---
const CalendarView = ({ setActiveNav, user }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = "May 2026";
  const isProfessor = user?.role === 'professor';
  const isAdmin = user?.role === 'admin';
  const isFaculty = isProfessor || isAdmin;

  // Faculty events for professors
  const facultyEvents = [
    { title: "Faculty Meeting - IT Department", date: "Friday, 2 PM", type: "meeting" },
    { title: "Deadline: Encoding of Midterm Grades", date: "Next Monday", type: "deadline" },
    { title: "Consultation Hours - BSIT 4A", date: "Wednesday, 10 AM", type: "consultation" }
  ];

  // Simple mock matrix for rendering days
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{ 
            background: 'var(--gradient-electric)', 
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>Academic Calendar</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          {isFaculty ? 'Track your faculty meetings and academic deadlines' : 'Track your class schedules and events'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-2 rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold m-0" style={{ color: 'var(--color-primary)' }}>{currentMonth}</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
            {daysOfWeek.map(day => <div key={day}>{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(day => (
              <motion.div 
                key={day} 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="p-3 border rounded-xl text-center text-sm font-medium relative min-h-[50px] flex flex-col justify-between cursor-pointer transition-all duration-200"
                style={{ borderColor: 'var(--border-light)', color: 'var(--color-primary)' }}
              >
                <span>{day}</span>
                {day === 19 && (
                  <div className="w-2 h-2 rounded-full mx-auto mt-1" title="Today" style={{ background: 'var(--gradient-electric)' }} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            whileHover={{ translateY: -2 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-4 shadow-sm hover:shadow-lg transition-all duration-200"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
              {isFaculty ? 'Upcoming Faculty Events' : 'Schedules Today'}
            </h3>
            {isFaculty ? (
              <div className="space-y-2">
                {facultyEvents.map((event, index) => (
                  <div key={index} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{event.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{event.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs m-0" style={{ color: 'var(--color-muted)' }}>No synchronous sessions recorded for today.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- DEAN TASK MONITORING VIEW COMPONENT (DFD Diagram 0) ---
const TaskMonitoringView = ({ setActiveNav, user, isDarkMode }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{
            background: 'var(--gradient-electric)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>Task Monitoring</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          High-level dashboard tracking faculty task completion, posted assignments across departments, and subject module progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            whileHover={{ translateY: -2 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold m-0 text-base" style={{ color: 'var(--color-primary)' }}>Faculty Task Completion</h3>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: 'var(--gradient-electric)', color: '#ffffff' }}>Active</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>IT Department</p>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">87% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div className="p-4 rounded-xl border transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>Business Department</p>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">72% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- DEAN REPORTS VIEW COMPONENT (DFD Diagram 0) ---
const ReportsView = ({ setActiveNav, user, isDarkMode }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{
            background: 'var(--gradient-electric)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>Reports Dashboard</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          Institutional analytics view: Student passing rates, Professor class engagement, attendance logs, and downloadable summary reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-electric)' }}>
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base m-0" style={{ color: 'var(--color-primary)' }}>Student Passing Rate</h3>
              <p className="text-xs m-0" style={{ color: 'var(--color-muted)' }}>Current Semester</p>
            </div>
          </div>
          <p className="text-3xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>92.5%</p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>+3.2% from last semester</p>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-electric)' }}>
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base m-0" style={{ color: 'var(--color-primary)' }}>Class Engagement</h3>
              <p className="text-xs m-0" style={{ color: 'var(--color-muted)' }}>Professor Average</p>
            </div>
          </div>
          <p className="text-3xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>88.7%</p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>+5.1% improvement</p>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-electric)' }}>
              <Download size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base m-0" style={{ color: 'var(--color-primary)' }}>Download Reports</h3>
              <p className="text-xs m-0" style={{ color: 'var(--color-muted)' }}>Export summary</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: 'var(--gradient-electric)' }}>
            Generate PDF Report
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// --- ADMIN USER MANAGEMENT VIEW COMPONENT (DFD Diagram 0) ---
const UserManagementView = ({ setActiveNav, user, isDarkMode }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{
            background: 'var(--gradient-electric)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>User Management</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          Create, edit, suspend, or delete user accounts (Students, Teachers, Deans). Assign exact role permissions.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base m-0" style={{ color: 'var(--color-primary)' }}>User Accounts</h3>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: 'var(--gradient-electric)' }}>
            <Plus size={16} className="inline mr-2" />
            Add User
          </button>
        </div>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-sm font-bold flex items-center justify-center">JS</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>John Smith</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>john.smith@ptc.edu.ph • Student</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Active</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white text-sm font-bold flex items-center justify-center">MS</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>Maria Santos</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>maria.santos@ptc.edu.ph • Professor</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN ACTIVITY LOGS VIEW COMPONENT (DFD Diagram 0) ---
const ActivityLogsView = ({ setActiveNav, user, isDarkMode }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{
            background: 'var(--gradient-electric)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>Activity Logs</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          Audit trail showing real-time system logins, data submissions, and security events.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border-l-4 border-emerald-500 transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>User Login</p>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>2 minutes ago</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>John Smith (Student) logged in from 192.168.1.100</p>
          </div>
          <div className="p-4 rounded-xl border-l-4 border-blue-500 transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>Assignment Submitted</p>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>15 minutes ago</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Jane Doe submitted "Chapter 5 Draft" for IT101</p>
          </div>
          <div className="p-4 rounded-xl border-l-4 border-amber-500 transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>Grade Posted</p>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>1 hour ago</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Prof. Santos posted grade 95/100 for Michael Brown</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN VERIFICATIONS VIEW COMPONENT (DFD Diagram 0) ---
const VerificationsView = ({ setActiveNav, user, isDarkMode }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{
            background: 'var(--gradient-electric)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>Account Verifications</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          Review submitted student and faculty registration requests and credentials.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border transition-all duration-200" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-sm font-bold flex items-center justify-center">RB</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>Robert Brown</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>robert.brown@ptc.edu.ph • Student</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Pending</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105" style={{ background: 'var(--gradient-electric)' }}>
                Approve
              </button>
              <button className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all hover:scale-105">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TASKS VIEW COMPONENT (moved outside App to prevent remount) ---
const TasksView = ({ setActiveNav, tasks, user, professorTasks, showSubmitModal, setShowSubmitModal, setSelectedTaskForSubmit, showGradingModal, setShowGradingModal, setSelectedTaskForGrading, submittedTasks, gradedTasks }) => {
  const isProfessor = user?.role === 'professor' || user?.role === 'teacher';
  const isAdmin = user?.role === 'admin' || user?.role === 'administrator';
  const isFaculty = isProfessor || isAdmin;
  const displayTasks = isFaculty ? professorTasks : tasks;

  const handleTaskClick = (task) => {
    if (isFaculty) {
      setSelectedTaskForGrading(task);
      setShowGradingModal(true);
    } else {
      setSelectedTaskForSubmit(task);
      setShowSubmitModal(true);
    }
  };

  const isTaskSubmitted = (taskId) => submittedTasks.includes(taskId);
  const isTaskGraded = (taskId) => gradedTasks.includes(taskId);

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{ 
            background: 'var(--gradient-electric)', 
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>
          {isFaculty ? 'Grading Queue' : 'Tasks & Assignments'}
        </h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>
          {isFaculty ? 'Manage pending submissions and grading tasks' : 'Manage your academic tasks and deadlines'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <motion.div 
            whileHover={{ translateY: -2 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold m-0 text-base" style={{ color: 'var(--color-primary)' }}>
                {isFaculty ? 'Pending Grading' : 'Pending Tasks'}
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: 'var(--gradient-electric)', color: '#ffffff' }}>Active</span>
            </div>

            <div className="space-y-3">
              {displayTasks && displayTasks.length > 0 ? (
                displayTasks.map(task => {
                  const isSubmitted = isTaskSubmitted(task.id);
                  const isGraded = isTaskGraded(task.id);
                  
                  return (
                    <motion.div 
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 border rounded-xl flex items-center justify-between transition-all duration-200 hover:shadow-md ${isSubmitted || isGraded ? 'opacity-60' : 'cursor-pointer'}`}
                      style={{ borderColor: 'var(--border-light)' }}
                    >
                      <div>
                        <h4 className="text-sm font-bold m-0" style={{ color: 'var(--color-primary)' }}>{task.title}</h4>
                        <p className="text-xs m-0 mt-1" style={{ color: 'var(--color-muted)' }}>Due: {task.dueDate}</p>
                        {isSubmitted && <p className="text-xs m-0 mt-1 text-green-600 font-semibold">✓ Submitted Successfully</p>}
                        {isGraded && <p className="text-xs m-0 mt-1 text-blue-600 font-semibold">✓ Graded</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-secondary)' }}>
                          {task.priority}
                        </span>
                        {!isSubmitted && !isGraded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                            style={{ background: 'var(--gradient-electric)' }}
                          >
                            {isFaculty ? 'Give Grades' : 'Submit'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-sm text-center py-6" style={{ color: 'var(--color-muted)' }}>
                  {isFaculty ? 'All grading tasks completed!' : 'Hooray! No pending tasks found.'}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- COURSES VIEW COMPONENT (moved outside App to prevent remount) ---
const CoursesView = ({ setActiveNav, filteredCourses, handleCourseClick, studentEnrollments, setStudentEnrollments, user, isDarkMode, setActiveMeeting, setSelectedCourseDetail }) => {
  // For students, show enrolled classes; for faculty, show all courses
  const coursesToShow = user?.role === 'student' && studentEnrollments.length > 0
    ? studentEnrollments
    : filteredCourses;

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [classToLeave, setClassToLeave] = useState(null);

  const handleLeaveClass = (e, classCode) => {
    e.stopPropagation();
    setClassToLeave(classCode);
    setShowLeaveConfirm(true);
  };

  const confirmLeaveClass = () => {
    if (classToLeave) {
      setStudentEnrollments(prev => prev.filter(enrollment => enrollment.classCode !== classToLeave));
      setShowLeaveConfirm(false);
      setClassToLeave(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="mb-6">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200 mb-4"
          style={{ 
            background: 'var(--gradient-electric)', 
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-family)' }}>
          {user?.role === 'student' ? 'My Classes' : 'All Courses'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'student' 
            ? studentEnrollments.length === 0 
              ? 'Join a class to see it here' 
              : 'Your enrolled classes'
            : 'Browse and manage your courses'
          }
        </p>
      </div>

      {coursesToShow.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No classes yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Click the + button to join or create a class</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coursesToShow.map((course, index) => (
            <motion.div
              key={course.id || course.classId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
              onClick={() => handleCourseClick(course)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm transition-colors overflow-hidden cursor-pointer hover:border-transparent transition-all relative"
            >
              {/* Three-dots menu for students to leave class */}
              {user?.role === 'student' && (
                <button
                  onClick={(e) => handleLeaveClass(e, course.classCode)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm z-10 transition-colors"
                  title="Leave class"
                >
                  <MoreVertical size={16} className="text-white" />
                </button>
              )}
              <div className={`h-auto min-h-[120px] ${course.color} p-5 relative flex flex-col justify-between`}>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10"></div>
                {/* Top row with badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white/20 text-white backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold" style={{ color: '#ffffff' }}>{course.code}</span>
                  <span className="bg-white/20 text-white backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold" style={{ color: '#ffffff' }}>{course.section}</span>
                </div>
                {/* Course title below badges */}
                <h3 className="text-white font-bold text-lg md:text-xl leading-snug tracking-wide my-2 block" style={{ color: '#FFFFFF', visibility: 'visible', opacity: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {course.title}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-100 mb-3" style={{ color: '#f1f5f9' }}>{course.professor}</p>
                <div className="flex items-center justify-between text-xs text-slate-100 mb-3">
                  {course.progress !== undefined && <span style={{ color: '#f1f5f9' }}>{course.progress}% complete</span>}
                </div>
                {/* Join Video Class Button - Host for professors, Join for students */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const classCode = course.classCode || course.code?.replace(/\s/g, '');
                    const isTeacher = user?.role === 'teacher' || user?.role === 'professor';
                    const ptcMeetBaseUrl = process.env.REACT_APP_PTC_MEET_URL || 'https://ptc-meet.app';
                    const persistentRoomLink = `${ptcMeetBaseUrl}/room/PTC-${classCode}`;

                    // Generate host link for professors, regular link for students
                    const meetingUrl = isTeacher
                      ? `${persistentRoomLink}?host=true&role=host`
                      : persistentRoomLink;

                    // Save meeting link to localStorage
                    try {
                      localStorage.setItem(`ptc_meet_link_${classCode}`, meetingUrl);
                    } catch (e) {}

                    setActiveMeeting({
                      isOpen: true,
                      roomUrl: meetingUrl,
                      title: `${course.code} - ${course.title}`,
                      role: user?.role || 'student'
                    });
                    setSelectedCourseDetail(course);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-semibold transition-all"
                >
                  <Video size={14} />
                  {user?.role === 'teacher' || user?.role === 'professor' ? 'Start Class' : 'Join Video Class'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Leave Class Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLeaveConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Leave Class?</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
                  Are you sure you want to leave this class? You will need to re-enter the class code to join again.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowLeaveConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLeaveClass}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    Leave Class
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- GEMINI VIEW COMPONENT ---
const GeminiView = ({ setActiveNav, subjectsList, user, isDarkMode }) => {
  const [activeGeminiModal, setActiveGeminiModal] = useState(null);
  const [selectedNotebookTab, setSelectedNotebookTab] = useState(null);
  const [geminiPromptInput, setGeminiPromptInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [aiPrompts, setAiPrompts] = useState({});

  // Load AI prompts from localStorage on mount
  useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem('ptc_lms_ai_prompts');
      if (savedPrompts) {
        setAiPrompts(JSON.parse(savedPrompts));
      }
    } catch (e) {}
  }, []);

  const saveAiPrompt = (toolId, prompt) => {
    try {
      const updatedPrompts = { ...aiPrompts, [toolId]: prompt };
      setAiPrompts(updatedPrompts);
      localStorage.setItem('ptc_lms_ai_prompts', JSON.stringify(updatedPrompts));
    } catch (e) {}
  };

  // Restrict access to Faculty roles only (teacher, professor, admin, dean)
  const isTeacher = user?.role === 'teacher' || user?.role === 'professor';
  const isAdmin = user?.role === 'admin' || user?.role === 'administrator';
  const isDean = user?.role === 'dean';
  const isFaculty = isTeacher || isAdmin || isDean;
  
  if (!isFaculty) {
    return (
      <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-slate-600 dark:text-slate-400">The AI Assistant is only available for Faculty accounts (Teachers, Professors, Deans, Administrators).</p>
          <button
            onClick={() => setActiveNav('Home')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toolkitCards = [
    { id: 'learn', icon: HelpCircle, label: 'Help me learn', bgClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'quiz', icon: BrainCircuit, label: 'Quiz Generator', bgClass: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-800', iconColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'lessonplan', icon: FileText, label: 'Lesson Plan', bgClass: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-800', iconColor: 'text-rose-600 dark:text-rose-400' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback Helper', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'flashcards', icon: Layers, label: 'Make flashcards', bgClass: 'bg-sky-50 dark:bg-sky-950/30 border-sky-100 dark:border-sky-800', iconColor: 'text-sky-600 dark:text-sky-400' },
    { id: 'studyguide', icon: BookOpen, label: 'Study guide', bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-800', iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'notebook', icon: BookOpen, label: 'Use Gemini Notebook', bgClass: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-800', iconColor: 'text-indigo-600 dark:text-indigo-400' }
  ];

  const handleCardClick = (card) => {
    setActiveGeminiModal({
      type: 'toolkit',
      tool: card.id,
      title: card.label,
      icon: card.icon,
      prefillPrompt: getPrefillPrompt(card.id)
    });
  };

  const getPrefillPrompt = (toolId) => {
    const prompts = {
      learn: "Explain complex concepts in simple terms with step-by-step breakdown.",
      quiz: "Generate a 5-question multiple-choice quiz for [TOPIC] with correct answers marked.",
      lessonplan: "Create a detailed lesson plan for [TOPIC] with objectives, activities, and assessment.",
      feedback: "Draft constructive feedback for student submission: [STUDENT WORK] with specific improvement suggestions.",
      flashcards: "Create interactive digital flashcards with questions on front and answers on back.",
      studyguide: "Generate a structured Markdown-style summary and formula/concept cheat sheet.",
      notebook: "Open dedicated Notebook workspace with synced subject notes, summaries, and key takeaways."
    };
    return prompts[toolId] || "";
  };

  const handleNotebookClick = (subject) => {
    setSelectedNotebookTab(subject?.id || subject?.code);
    setActiveGeminiModal({
      type: 'notebook',
      subject: subject,
      title: `${subject?.code || 'Class'} Notebook`,
      icon: BookOpen
    });
  };

  const handleCreateNotebook = () => {
    setActiveGeminiModal({
      type: 'createNotebook',
      title: 'Create Class Notebook',
      icon: Plus
    });
  };

  const handleExploreResources = () => {
    setActiveGeminiModal({
      type: 'resources',
      title: 'AI Learning Hub',
      icon: Sparkles
    });
  };

  const handleSendFeedback = () => {
    setActiveGeminiModal({
      type: 'feedback',
      title: 'Send Feedback',
      icon: MessageSquare
    });
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating > 0) {
      setShowFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackSuccess(false);
        setActiveGeminiModal(null);
        setFeedbackRating(0);
        setFeedbackText("");
      }, 2000);
    }
  };

  const handleCopyResponse = (content) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getModalContent = () => {
    if (!activeGeminiModal) return null;

    switch (activeGeminiModal.type) {
      case 'toolkit':
        return getToolkitContent(activeGeminiModal.tool);
      case 'notebook':
        return getNotebookContent(activeGeminiModal.subject);
      case 'createNotebook':
        return getCreateNotebookContent();
      case 'resources':
        return getResourcesContent();
      case 'feedback':
        return getFeedbackContent();
      default:
        return null;
    }
  };

  const getToolkitContent = (toolId) => {
    const contents = {
      learn: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Interactive Topic Explainer</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>I'll break down complex concepts into simple, easy-to-understand steps with real-world examples.</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-light)' }}>
              <h5 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-primary)' }}>Example Output:</h5>
              <div className="text-sm p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-secondary)' }}>
                <strong>Concept:</strong> Neural Networks<br/>
                <strong>Simple Explanation:</strong> Think of neural networks like a team of experts working together. Each expert specializes in one small part of the problem, and they pass information to each other to reach a final decision.
              </div>
            </div>
          </div>
        )
      },
      quiz: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Quiz Generator</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Generate 5-question multiple-choice quizzes for any topic with correct answers marked.</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-primary)' }}>Q1: What is the primary function of a router?</p>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--color-secondary)' }}>
                    <input type="radio" name="q1" className="accent-blue-600" /> A) Store data
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--color-secondary)' }}>
                    <input type="radio" name="q1" className="accent-blue-600" /> B) Route network traffic ✓
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--color-secondary)' }}>
                    <input type="radio" name="q1" className="accent-blue-600" /> C) Display graphics
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      },
      lessonplan: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Lesson Plan Generator</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Create detailed lesson plans with objectives, activities, and assessment methods.</p>
            </div>
            <div className="p-4 rounded-lg font-mono text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-secondary)' }}>
              <pre>{`# Lesson Plan: [TOPIC]

## Learning Objectives
- Students will understand [CONCEPT 1]
- Students will be able to [SKILL]

## Materials Needed
- Presentation slides
- Handouts
- Lab equipment

## Lesson Structure (60 min)
1. Introduction (10 min)
2. Direct Instruction (20 min)
3. Guided Practice (15 min)
4. Independent Practice (10 min)
5. Assessment (5 min)

## Assessment
- Exit ticket
- Homework assignment`}</pre>
            </div>
          </div>
        )
      },
      feedback: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Student Feedback Helper</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Draft constructive, specific feedback for student submissions with improvement suggestions.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--color-secondary)' }}>Example Feedback:</p>
              <div className="text-xs p-3 rounded border" style={{ borderColor: 'var(--border-light)', color: 'var(--color-secondary)' }}>
                <strong>Strengths:</strong> Clear understanding of core concepts, good code structure.<br/>
                <strong>Areas for Improvement:</strong> Consider adding error handling for edge cases. The algorithm could be optimized for larger datasets.<br/>
                <strong>Next Steps:</strong> Review the documentation on [TOPIC] and implement the suggested improvements.
              </div>
            </div>
          </div>
        )
      },
      flashcards: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Digital Flashcards</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Interactive flip cards for quick review. Click to reveal answers!</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all" style={{ borderColor: 'var(--border-light)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-primary)' }}>Front</p>
                <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>What is TCP/IP?</p>
              </div>
              <div className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all" style={{ borderColor: 'var(--border-light)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-primary)' }}>Back</p>
                <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>Transmission Control Protocol/Internet Protocol - the fundamental communication language of the Internet.</p>
              </div>
            </div>
          </div>
        )
      },
      studyguide: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Study Guide Generator</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Structured Markdown summaries and formula cheat sheets.</p>
            </div>
            <div className="p-4 rounded-lg font-mono text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-secondary)' }}>
              <pre>{`# Chapter Summary

## Key Concepts
- **Algorithm**: Step-by-step procedure
- **Data Structure**: Organization of data

## Formulas
- Time Complexity: O(n)
- Space Complexity: O(1)`}</pre>
            </div>
          </div>
        )
      },
      images: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Visual Concept Generator</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Generate flowcharts and diagram previews for visual learning.</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center justify-center h-32 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Flowchart Preview</p>
                </div>
              </div>
            </div>
          </div>
        )
      },
      notebook: {
        body: (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Gemini Notebook Workspace</h4>
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Dedicated workspace with synced subject notes and AI-generated summaries.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <h5 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-primary)' }}>Recent Notes</h5>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--color-secondary)' }}>
                <li>• Lecture 1: Introduction to Systems</li>
                <li>• Key formulas and definitions</li>
                <li>• Practice problems solved</li>
              </ul>
            </div>
          </div>
        )
      }
    };
    return contents[toolId]?.body || null;
  };

  const getNotebookContent = (subject) => {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{subject?.subjectName || subject?.code || 'Class'} Notebook</h4>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>AI-generated study notes and summaries for this subject.</p>
        </div>
        <div className="space-y-3">
          <div className={`p-3 rounded-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h5 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>📝 Lecture Notes</h5>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Comprehensive notes from all lectures with key concepts highlighted.</p>
          </div>
          <div className={`p-3 rounded-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h5 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>🎯 Key Takeaways</h5>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Important points and formulas to remember for exams.</p>
          </div>
          <div className={`p-3 rounded-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h5 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>📚 Practice Problems</h5>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Curated practice problems with solutions.</p>
          </div>
        </div>
      </div>
    );
  };

  const getCreateNotebookContent = () => {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Create Custom Notebook</h4>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Generate an AI-powered notebook for any topic or subject.</p>
        </div>
        <input
          type="text"
          placeholder="Enter topic or subject name..."
          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 text-sm ${
            isDarkMode
              ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
              : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
          }`}
        />
      </div>
    );
  };

  const getResourcesContent = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h4 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>AI Learning Hub</h4>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Master AI tools for academic success.</p>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all" style={{ borderColor: 'var(--border-light)' }}>
            <h5 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-primary)' }}>🎓 Effective AI Prompting for Students</h5>
            <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>Learn how to craft effective prompts for better AI responses.</p>
          </div>
          <div className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all" style={{ borderColor: 'var(--border-light)' }}>
            <h5 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-primary)' }}>⚖️ Ethics & AI in Academics</h5>
            <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>Understand ethical use of AI in academic work.</p>
          </div>
          <div className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all" style={{ borderColor: 'var(--border-light)' }}>
            <h5 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-primary)' }}>🔍 How to Use Gemini for Research</h5>
            <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>Tips and techniques for research assistance with AI.</p>
          </div>
        </div>
      </div>
    );
  };

  const getFeedbackContent = () => {
    return (
      <div className="space-y-4">
        {showFeedbackSuccess ? (
          <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Thank You!</h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Rate Your Experience</h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Help us improve AI in Google Classroom.</p>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className={`text-2xl transition-all ${star <= feedbackRating ? 'text-yellow-400' : isDarkMode ? 'text-slate-600' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              placeholder="Tell us more about your experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 text-sm resize-none ${
                isDarkMode
                  ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                  : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
              }`}
              rows={3}
            />
            <button
              onClick={handleFeedbackSubmit}
              disabled={feedbackRating === 0}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'var(--gradient-electric)' }}
            >
              Submit Feedback
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-6">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{ 
            background: 'var(--gradient-electric)', 
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>

      {/* Header Title & Banner */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
          Learn and study with Gemini AI
          <Sparkles className="w-5 h-5 text-indigo-500 inline ml-2" />
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
          Transform your learning experience with AI-powered study tools
        </p>
      </div>

      {/* Gemini Toolkit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto my-6">
        {toolkitCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(card)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg ${card.bgClass}`}
            >
              <Icon className={`w-8 h-8 mb-3 ${card.iconColor}`} />
              <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Notebooks Synced to Class Content Section */}
      <div className="max-w-5xl mx-auto my-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            Notebooks synced to your class content
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">New</span>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--color-secondary)' }}>
          Transform your class materials into personalized study tools, like flashcards, podcasts, and quizzes.
        </p>
        
        {/* Horizontal scroll list of class chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button 
            onClick={handleCreateNotebook}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              selectedNotebookTab === 'create'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            + Create class notebook
          </button>
          {(subjectsList || []).map((subject) => {
            const isSelected = selectedNotebookTab === (subject?.id || subject?.code);
            return (
              <button
                key={subject?.id || subject?.code}
                onClick={() => handleNotebookClick(subject)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isDarkMode
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {subject?.code || subject?.subjectName || 'Class'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Build AI Knowledge & Literacy Banner */}
      <div className="max-w-5xl mx-auto my-8">
        <div className="p-6 rounded-2xl border backdrop-blur-sm transition-all duration-200" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1" style={{ color: 'var(--color-primary)' }}>Build AI knowledge & literacy</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-secondary)' }}>
                Access trainings, resources, and guides to get the most out of AI tools to set you up for success.
              </p>
              <button 
                onClick={handleExploreResources}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold hover:bg-slate-100 transition-all" 
                style={{ color: 'var(--color-primary)' }}
              >
                Explore resources <ExternalLink className="w-3 h-3 inline ml-1"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Bottom Footer Card */}
      <div className="max-w-5xl mx-auto my-8">
        <div className="p-4 rounded-2xl flex items-center justify-between transition-all duration-200" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              What can we do to make AI in Google Classroom better?
            </span>
          </div>
          <button 
            onClick={handleSendFeedback}
            className="text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-all" 
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--bg-main)' }}
          >
            Send feedback
          </button>
        </div>
      </div>

      {/* Glassmorphism Modal Overlay */}
      <AnimatePresence>
        {activeGeminiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setActiveGeminiModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl ${
                isDarkMode
                  ? 'bg-[#0f172a] text-white border-slate-800'
                  : 'bg-white text-slate-800 border-slate-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  {activeGeminiModal.icon && (
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      {React.createElement(activeGeminiModal.icon, { className: `w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}` })}
                    </div>
                  )}
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{activeGeminiModal.title}</h3>
                </div>
                <button
                  onClick={() => setActiveGeminiModal(null)}
                  className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {getModalContent()}
              </div>

              {/* Modal Footer with Prompt Bar */}
              {activeGeminiModal.type !== 'feedback' && (
                <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask Gemini anything..."
                      value={geminiPromptInput}
                      onChange={(e) => setGeminiPromptInput(e.target.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 text-sm ${
                        isDarkMode
                          ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                      } focus:outline-none focus:border-blue-500`}
                    />
                    <button
                      onClick={() => {
                        if (geminiPromptInput.trim()) {
                          // Save prompt to localStorage
                          if (activeGeminiModal.tool) {
                            saveAiPrompt(activeGeminiModal.tool, geminiPromptInput);
                          }
                          handleCopyResponse(geminiPromptInput);
                          setGeminiPromptInput("");
                        }
                      }}
                      className="px-4 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 bg-blue-600 hover:bg-blue-500"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {activeGeminiModal.prefillPrompt && (
                    <button
                      onClick={() => setGeminiPromptInput(activeGeminiModal.prefillPrompt)}
                      className={`mt-2 text-xs font-semibold hover:underline transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Use suggested prompt: "{activeGeminiModal.prefillPrompt}"
                    </button>
                  )}
                </div>
              )}

              {/* Copy Response Button */}
              {activeGeminiModal.type === 'toolkit' && (
                <div className="p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    onClick={() => handleCopyResponse(activeGeminiModal.prefillPrompt || "")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Response
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUBJECT STREAM VIEW COMPONENT ---
function SubjectStreamView({ activeSubject, selectedCourseDetail, posts = [] }) {
  // 1. DYNAMICALLY RESOLVE PROFESSOR NAME FROM ACTIVE SUBJECT (MATCHES BANNER LOGIC EXACTLY)
  const professorName = 
    activeSubject?.instructorName || 
    activeSubject?.instructor || 
    activeSubject?.profName || 
    activeSubject?.teacher || 
    selectedCourseDetail?.professor || 
    "Instructor";

  // 2. DYNAMICALLY DERIVE AVATAR INITIAL (e.g., "Prof. Sheryl Ann Ricafort" -> "S")
  const avatarInitial = professorName
    .replace(/^Prof\.\s*/i, '')
    .trim()
    .charAt(0) || "P";

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards">
      {/* ANNOUNCEMENT INPUT CARD */}
      <div className="bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-none transition-all duration-300">
        <input 
          type="text" 
          placeholder="Announce something to your class..." 
          className="w-full text-slate-900 dark:text-white placeholder:!text-slate-400 dark:placeholder:!text-slate-500 bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:-translate-y-0.5 transition-transform duration-200"
        />
      </div>

      {/* ANNOUNCEMENTS POST FEED */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div 
            key={post.id || index} 
            className="bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-none transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* POST CARD HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* DYNAMIC AVATAR CIRCLE WITH GRADIENT RING */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center ring-2 ring-blue-500/30 shadow-md">
                  {avatarInitial}
                </div>

                {/* DYNAMIC PROFESSOR NAME & ROLE BADGE */}
                <div className="flex items-center gap-2">
                  <span className="!text-slate-900 dark:!text-white font-semibold text-sm">
                    {professorName}
                  </span>
                  <span className="!text-blue-700 dark:!text-blue-300 bg-blue-100 dark:bg-blue-950/80 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800/50">
                    Instructor
                  </span>
                </div>
              </div>

              {/* POST TIMESTAMP */}
              <span className="!text-slate-500 dark:!text-slate-400 text-xs font-semibold">
                {post.date || "May 19, 2026"}
              </span>
            </div>

            {/* POST BODY CONTENT */}
            <div className="mt-3 !text-slate-800 dark:!text-white text-sm font-medium leading-relaxed">
              {post.content || post.text || "I have already recorded your midterm grades and attendance. Please check your student portal for updates."}
            </div>

            {/* COMMENT INPUT BOX */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <input 
                type="text" 
                placeholder="Add class comment..." 
                className="w-full text-slate-900 dark:text-white placeholder:!text-slate-400 dark:placeholder:!text-slate-500 bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:-translate-y-0.5 transition-transform duration-200"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ARCHIVED VIEW COMPONENT ---
const ArchivedView = ({ setActiveNav, t, subjectsList = [] }) => {
  const archivedSubjects = subjectsList?.filter(subject => subject?.isArchived) || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{
            background: 'var(--gradient-electric)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>{t.archivedClasses}</h2>
        <p className="m-0 mt-1 text-sm" style={{ color: 'var(--color-secondary)' }}>View your past courses and completed semesters</p>
      </div>

      {archivedSubjects.length === 0 ? (
        <div className="rounded-2xl border p-8 shadow-sm text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--color-muted)' }} />
          <p className="text-base font-medium mb-2" style={{ color: 'var(--color-primary)' }}>No archived classes yet</p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Classes from previous semesters will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedSubjects.map((subject) => (
            <div
              key={subject?.id}
              className="rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600">
                  <Archive size={20} className="text-white" />
                </div>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg">
                  {subject?.code || 'N/A'}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2 line-clamp-2" style={{ color: 'var(--color-primary)' }}>
                {subject?.subjectName || 'Untitled Subject'}
              </h3>
              <div className="space-y-1">
                <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
                  <span className="font-medium">Section:</span> {subject?.section || 'N/A'}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
                  <span className="font-medium">Instructor:</span> {subject?.instructorName || 'N/A'}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  Class Code: {subject?.classCode || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- SETTINGS VIEW COMPONENT (moved outside App to prevent remount) ---
const SettingsView = ({
  setActiveNav,
  t,
  currentUser,
  allowEmail,
  setAllowEmail,
  commentsOnPosts,
  setCommentsOnPosts,
  classesEnrolled,
  setClassesEnrolled,
  inviteNotifications,
  setInviteNotifications,
  dueDateReminders,
  setDueDateReminders,
  currentLang,
  setCurrentLang,
  isDarkMode,
  toggleDarkMode,
  user,
  userProfile,
  setUserProfile,
  showChangeAvatarModal,
  setShowChangeAvatarModal,
  showAccountSettingsModal,
  setShowAccountSettingsModal,
  colorPresets,
  imageZoom,
  setImageZoom,
  imageOffset,
  setImageOffset,
  isDraggingImage,
  setIsDraggingImage,
  dragStart,
  setDragStart,
  toastMessage,
  setToastMessage
}) => {
  const isProfessor = user?.role === 'professor';
  const isAdmin = user?.role === 'admin';
  const isFaculty = isProfessor || isAdmin;
  
  // Avatar customization state
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(userProfile?.avatarColor || 'from-blue-600 to-indigo-600');
  const [avatarInitialInput, setAvatarInitialInput] = useState(userProfile?.avatarInitial || 'A');
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState(userProfile?.customAvatarUrl || null);
  
  // Account settings form state
  const [accountForm, setAccountForm] = useState({
    name: userProfile?.name || '',
    role: userProfile?.role || '',
    department: userProfile?.department || '',
    email: userProfile?.email || '',
    currentPassword: '',
    newPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  return (
  <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto">
    <div className="mb-6 text-center">
      <button
        onClick={() => setActiveNav('Home')}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200 mb-4 mx-auto"
        style={{ 
          background: 'var(--gradient-electric)', 
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
        }}
      >
        ← Return to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mx-auto" style={{ fontFamily: 'var(--font-family)' }}>
        {t.settings}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mx-auto">{t.customizeExperience}</p>
    </div>

    <div className="w-full max-w-6xl mx-auto px-8 py-4 space-y-6">
      {/* Profile Card */}
      <motion.div 
        whileHover={{ translateY: -2 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
      >
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{t.profile}</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg relative">
            {userProfile?.customAvatarUrl ? (
              <img
                src={userProfile.customAvatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${userProfile?.imageOffset?.x || 0}px, ${userProfile?.imageOffset?.y || 0}px) scale(${userProfile?.imageZoom || 1})`
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: `linear-gradient(to right, ${userProfile?.avatarColor?.replace('from-', '').replace(' to-', ', ')})` }}
              >
                {userProfile?.avatarInitial || userProfile?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-lg" style={{ color: 'var(--color-primary)' }}>{userProfile?.name || currentUser || 'Student'}</p>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {userProfile?.role || (isProfessor ? 'Instructor / Faculty Member' : 'BSIT 3J')} • {userProfile?.department || (isProfessor ? 'IT Department' : '3rd Year')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowChangeAvatarModal(true)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {t.change}
          </button>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <button 
            onClick={() => setShowAccountSettingsModal(true)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {t.accountSettings}
          </button>
        </div>
      </motion.div>

      {/* Global Notifications Grid */}
      <motion.div 
        whileHover={{ translateY: -2 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
      >
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{t.notifications}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{t.emailNotifications}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Receive email notifications for updates</p>
            </div>
            <button
              onClick={() => setAllowEmail(!allowEmail)}
              className={`relative w-14 h-7 rounded-full transition-colors ${allowEmail ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${allowEmail ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{t.commentsOnPosts}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Get notified when someone comments</p>
            </div>
            <button
              onClick={() => setCommentsOnPosts(!commentsOnPosts)}
              className={`relative w-14 h-7 rounded-full transition-colors ${commentsOnPosts ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${commentsOnPosts ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{t.classesEnrolled}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Updates for your enrolled classes</p>
            </div>
            <button
              onClick={() => setClassesEnrolled(!classesEnrolled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${classesEnrolled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${classesEnrolled ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{t.invitations}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Class invitations and requests</p>
            </div>
            <button
              onClick={() => setInviteNotifications(!inviteNotifications)}
              className={`relative w-14 h-7 rounded-full transition-colors ${inviteNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${inviteNotifications ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{t.dueDateReminders}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Reminders for upcoming due dates</p>
            </div>
            <button
              onClick={() => setDueDateReminders(!dueDateReminders)}
              className={`relative w-14 h-7 rounded-full transition-colors ${dueDateReminders ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${dueDateReminders ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Language Settings */}
      <motion.div 
        whileHover={{ translateY: -2 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
      >
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{t.languageSettings}</h3>
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{t.selectLanguage}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLang('tl')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentLang === 'tl' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Tagalog
            </button>
            <button
              onClick={() => setCurrentLang('es')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentLang === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Español
            </button>
            <button
              onClick={() => setCurrentLang('ja')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentLang === 'ja' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              日本語
            </button>
            <button
              onClick={() => setCurrentLang('ko')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentLang === 'ko' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              한국어
            </button>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div 
        whileHover={{ translateY: -2 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
      >
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: 'var(--color-primary)' }}>Dark Mode</p>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Toggle dark theme for better night viewing</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDarkMode ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </motion.div>

      {/* Avatar Customization Modal */}
      <AnimatePresence>
        {showChangeAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowChangeAvatarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border shadow-2xl"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
                <h3 className="font-bold" style={{ color: 'var(--color-primary)' }}>Change Profile Picture / Avatar</h3>
                <button onClick={() => setShowChangeAvatarModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" style={{ color: 'var(--color-secondary)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Avatar Preview with Interactive Cropper */}
                <div className="flex justify-center">
                  {uploadedAvatarUrl ? (
                    <div className="relative">
                      {/* Circular Mask & Overlay Framing Grid */}
                      <div 
                        className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-xl overflow-hidden relative cursor-grab active:cursor-grabbing mx-auto my-4 bg-slate-900"
                        onMouseDown={(e) => {
                          setIsDraggingImage(true);
                          setDragStart({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
                        }}
                        onMouseMove={(e) => {
                          if (isDraggingImage) {
                            setImageOffset({
                              x: e.clientX - dragStart.x,
                              y: e.clientY - dragStart.y
                            });
                          }
                        }}
                        onMouseUp={() => setIsDraggingImage(false)}
                        onMouseLeave={() => setIsDraggingImage(false)}
                      >
                        {/* Rule-of-Thirds Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40 border border-white/30">
                          <div className="border-r border-white/30"></div>
                          <div className="border-r border-white/30"></div>
                          <div className="border-b border-white/30 col-span-3"></div>
                          <div className="border-r border-white/30 border-b border-white/30"></div>
                          <div className="border-r border-white/30 border-b border-white/30"></div>
                          <div className="border-b border-white/30 col-span-3"></div>
                        </div>
                        
                        {/* Draggable Image */}
                        <img
                          src={uploadedAvatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          style={{
                            transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageZoom})`,
                            transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out'
                          }}
                          draggable={false}
                        />
                      </div>

                      {/* Zoom Slider & Reset Controls */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <ZoomOut className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={imageZoom}
                            onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                            className="flex-1 accent-blue-600"
                          />
                          <ZoomIn className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                        </div>
                        <button
                          onClick={() => {
                            setImageOffset({ x: 0, y: 0 });
                            setImageZoom(1);
                          }}
                          className="flex items-center justify-center gap-1 w-full px-3 py-2 rounded-lg border text-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                          style={{ borderColor: 'var(--border-light)', color: 'var(--color-secondary)' }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reset Center
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                      style={{ 
                        background: `linear-gradient(to right, ${selectedAvatarColor?.replace('from-', '').replace(' to-', ', ')})`
                      }}
                    >
                      {avatarInitialInput || 'A'}
                    </div>
                  )}
                </div>

                {/* Gradient Presets with Visible Swatches */}
                <div>
                  <p className="font-medium mb-3 text-sm" style={{ color: 'var(--color-primary)' }}>Avatar Color</p>
                  <div className="flex gap-3 flex-wrap">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedAvatarColor(preset.class)}
                        className={`w-10 h-10 rounded-full cursor-pointer shadow-md transition-all hover:scale-110 flex items-center justify-center relative ${
                          selectedAvatarColor === preset.class 
                            ? 'ring-4 ring-offset-2 ring-blue-500 scale-105' 
                            : 'hover:ring-2 hover:ring-offset-1 hover:ring-blue-300'
                        } ${preset.class}`}
                        title={preset.name}
                      >
                        {selectedAvatarColor === preset.class && (
                          <Check className="w-5 h-5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Initials */}
                <div>
                  <p className="font-medium mb-2 text-sm" style={{ color: 'var(--color-primary)' }}>Avatar Initial</p>
                  <input
                    type="text"
                    value={avatarInitialInput}
                    onChange={(e) => setAvatarInitialInput(e.target.value.slice(0, 1).toUpperCase())}
                    maxLength={1}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 text-center text-2xl font-bold"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--color-primary)' }}
                  />
                </div>

                {/* Upload Profile Photo */}
                <div>
                  <p className="font-medium mb-2 text-sm" style={{ color: 'var(--color-primary)' }}>Upload Profile Photo</p>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" style={{ borderColor: 'var(--border-light)' }}>
                    <Camera className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setUploadedAvatarUrl(url);
                          setImageOffset({ x: 0, y: 0 });
                          setImageZoom(1);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => {
                    setUserProfile({
                      ...userProfile,
                      avatarColor: selectedAvatarColor,
                      avatarInitial: avatarInitialInput,
                      customAvatarUrl: uploadedAvatarUrl,
                      imageZoom: imageZoom,
                      imageOffset: imageOffset
                    });
                    setShowChangeAvatarModal(false);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  Save Profile Avatar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Settings Modal */}
      <AnimatePresence>
        {showAccountSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAccountSettingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border shadow-2xl max-h-[85vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
                <h3 className="font-bold" style={{ color: 'var(--color-primary)' }}>Account Settings & Preferences</h3>
                <button onClick={() => setShowAccountSettingsModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" style={{ color: 'var(--color-secondary)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {showSaveSuccess && (
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Changes saved successfully!</p>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className={`block font-medium mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Full Name</label>
                  <input
                    type="text"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 ${
                      isDarkMode
                        ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                        : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                    }`}
                  />
                </div>

                {/* Role / Position */}
                <div>
                  <label className={`block font-medium mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Role / Position</label>
                  <input
                    type="text"
                    value={accountForm.role}
                    onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 ${
                      isDarkMode
                        ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                        : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                    }`}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className={`block font-medium mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Department</label>
                  <input
                    type="text"
                    value={accountForm.department}
                    onChange={(e) => setAccountForm({ ...accountForm, department: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 ${
                      isDarkMode
                        ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                        : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                    }`}
                  />
                </div>

                {/* Institutional Email */}
                <div>
                  <label className={`block font-medium mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Institutional Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 ${
                        isDarkMode
                          ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Change Password Section */}
                <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Change Password</h4>
                  </div>

                  {/* Current Password */}
                  <div className="mb-3">
                    <label className={`block font-medium mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Current Password</label>
                    <div className="relative">
                      <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={accountForm.currentPassword}
                        onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 ${
                          isDarkMode
                            ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                            : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                        }`}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={`block font-medium mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>New Password</label>
                    <div className="relative">
                      <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={accountForm.newPassword}
                        onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all focus:border-blue-500 ${
                          isDarkMode
                            ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700'
                            : 'bg-slate-100 text-slate-800 placeholder-slate-400 border-slate-300'
                        }`}
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => {
                    // Calculate avatar initials from name
                    const newName = accountForm.name || userProfile.name;
                    const initials = newName
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase())
                      .slice(0, 2)
                      .join('');

                    setUserProfile({
                      ...userProfile,
                      name: newName,
                      role: accountForm.role || userProfile.role,
                      department: accountForm.department || userProfile.department,
                      email: accountForm.email || userProfile.email,
                      avatarInitial: initials
                    });
                    setShowSaveSuccess(true);
                    setToastMessage('Profile updated successfully!');
                    setTimeout(() => {
                      setShowSaveSuccess(false);
                      setToastMessage('');
                    }, 3000);
                    setShowAccountSettingsModal(false);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
  );
};

// --- SUBJECT VIEW COMPONENT (moved outside App to prevent remount) ---
const SubjectView = ({
  selectedCourseDetail,
  setActiveNav,
  classroomTab,
  setClassroomTab,
  tasks,
  currentUser,
  isProfChatOpen,
  setIsProfChatOpen,
  getProfessorAvatar,
  isVideoCallActive,
  setIsVideoCallActive,
  chatMessages,
  setChatMessages,
  typedMessage,
  setTypedMessage,
  isDarkMode,
  DashboardHome,
  setActiveMeeting,
  user,
  assignments,
  setAssignments,
  handleSimulateSubmit,
  activeSubject,
  selectedAssignment,
  setSelectedAssignment,
  showAssignmentDetail,
  setShowAssignmentDetail,
  editingCommentId,
  setEditingCommentId,
  editCommentText,
  setEditCommentText,
  userProfile,
  submissionFilter,
  setSubmissionFilter,
  selectedStudentSubmission,
  setSelectedStudentSubmission,
  showFacultyGradingModal,
  setShowFacultyGradingModal,
  facultyGradingScore,
  setFacultyGradingScore,
  facultyGradingFeedback,
  setFacultyGradingFeedback,
  getSubmissionsForAssignment,
  getSubmissionCounts,
  showCreateClassworkModal,
  setShowCreateClassworkModal,
  submissions,
  showInviteModal,
  setShowInviteModal,
  invitations,
  setInvitations,
  selectedStudentsForInvite,
  setSelectedStudentsForInvite,
  studentSearchQuery,
  setStudentSearchQuery
}) => {
  if (!selectedCourseDetail) return <DashboardHome />;

  const tabs = ['Stream', 'Classwork', 'People', 'Grades'];
  
  // Role permission check for invite functionality
  const canInvite = ['admin', 'instructor', 'teacher', 'prof', 'professor', 'dean'].includes(user?.role?.toLowerCase());

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* RTD Row */}
      <div className="mb-4">
        <button
          onClick={() => setActiveNav('Home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold hover:scale-105 transition-all duration-200"
          style={{ 
            background: 'var(--gradient-electric)', 
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          ← Return to Dashboard
        </button>
      </div>

      {/* Premium Gradient Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-blue-900/30 mb-4"
        style={{ minHeight: '120px' }}
      >
        {/* Decorative background overlay */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col justify-between h-full relative z-10">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="text-white/90 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                {selectedCourseDetail.code}
              </span>
              <span className="text-white/60">•</span>
              <span className="text-white/80 text-xs sm:text-sm font-medium">
                {selectedCourseDetail.section}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-family)' }}>
              {selectedCourseDetail.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-white/90">
              Prof. {activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Invite Students Button - Faculty Only */}
      {canInvite && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md transition-all text-xs sm:text-sm mb-4 w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4"/>
          Invite Students
        </motion.button>
      )}

      {/* Classroom Nav Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-thin no-scrollbar border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          let icon = null;
          if (tab === 'Stream') icon = <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />;
          if (tab === 'Classwork') icon = <FileText className="w-4 h-4 mr-2 flex-shrink-0" />;
          if (tab === 'People') icon = <User className="w-4 h-4 mr-2 flex-shrink-0" />;
          if (tab === 'Grades') icon = <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />;

          return (
            <button
              key={tab}
              onClick={() => setClassroomTab(tab)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 hover:scale-105 border-none cursor-pointer flex items-center flex-shrink-0"
              style={{
                background: classroomTab === tab
                  ? 'var(--gradient-electric)'
                  : 'var(--bg-secondary)',
                color: classroomTab === tab
                  ? '#ffffff'
                  : 'var(--color-primary)',
                boxShadow: classroomTab === tab
                  ? '0 4px 12px rgba(79, 70, 229, 0.3)'
                  : 'none'
              }}
            >
              {icon}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Sidebar Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Meet Card */}
          <motion.div
            whileHover={{ translateY: -2 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-none hover:border-blue-500/40 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl" style={{ background: 'var(--gradient-electric)' }}>
                <Video size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Meet</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">Video integration</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMeeting({
                isOpen: true,
                roomUrl: selectedCourseDetail.meetLink,
                title: `${selectedCourseDetail.code} - ${selectedCourseDetail.title}`,
                role: user?.role || 'student'
              })}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl text-sm font-semibold hover:shadow-lg active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Camera size={16} />
              Join
            </button>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            whileHover={{ translateY: -2 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-none hover:border-blue-500/40 transition-all duration-300"
          >
            <h3 className="text-slate-900 dark:text-white font-extrabold text-base tracking-tight mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  className="bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 mb-2.5 transition-all duration-200 hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <CheckSquare size={14} className={task.completed ? 'text-slate-400' : 'text-blue-500 dark:text-blue-400'} />
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-semibold text-sm">{task.title}</p>
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-xs mt-1">Due: {task.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Conditional Content based on Tab */}
        <div className="lg:col-span-3 space-y-4">
          {classroomTab === 'Stream' && (
            <SubjectStreamView 
              activeSubject={activeSubject}
              selectedCourseDetail={selectedCourseDetail}
              posts={[
                { id: 1, date: 'May 19, 2026', content: 'I have already recorded your midterm grades and attendance. Please check your student portal for updates.' },
                { id: 2, date: 'May 18, 2026', content: 'Please submit your Chapter 5 drafts by Saturday. Make sure to include all required references.' },
                { id: 3, date: 'May 17, 2026', content: 'Prepare for the hands-on lab next week. We will be covering system integration patterns.' }
              ]}
            />
          )}

          {classroomTab === 'Classwork' && (
            <>
              {/* Faculty View - Submission Monitoring */}
              {user?.role === 'professor' || user?.role === 'instructor' || user?.role === 'admin' ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-blue-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Classwork Management</h3>
                      <button 
                        onClick={() => setShowCreateClassworkModal(true)}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 text-sm flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Create Assignment
                      </button>
                    </div>
                    
                    {/* Submission Status Bar */}
                    {assignments.length > 0 && (
                      <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Submissions:</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Turned In: {getSubmissionCounts(assignments[0]?.id).turnedIn}</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Assigned: {getSubmissionCounts(assignments[0]?.id).assigned}</span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Graded: {getSubmissionCounts(assignments[0]?.id).graded}</span>
                      </div>
                    )}
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-4">
                      {['all', 'turnedIn', 'missing', 'graded'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setSubmissionFilter(filter)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                            submissionFilter === filter
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {filter === 'all' ? 'All Students' : filter === 'turnedIn' ? 'Turned In' : filter === 'missing' ? 'Missing' : 'Graded'}
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      {assignments.map((assignment) => {
                        const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
                        const filteredSubmissions = assignmentSubmissions.filter(sub => {
                          if (submissionFilter === 'all') return true;
                          if (submissionFilter === 'turnedIn') return sub.status === 'Turned In';
                          if (submissionFilter === 'graded') return sub.status === 'Graded';
                          if (submissionFilter === 'missing') return sub.status !== 'Turned In' && sub.status !== 'Graded';
                          return true;
                        });
                        
                        return (
                          <div key={assignment.id} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                            <h4 className="font-bold text-sm mb-3 text-slate-900 dark:text-slate-100">{assignment.title}</h4>
                            {filteredSubmissions.length > 0 ? (
                              <div className="space-y-2">
                                {filteredSubmissions.map((submission) => (
                                  <div
                                    key={submission.id}
                                    onClick={() => {
                                      setSelectedStudentSubmission(submission);
                                      setShowFacultyGradingModal(true);
                                      setFacultyGradingScore(submission.grade || '');
                                      setFacultyGradingFeedback(submission.feedback || '');
                                    }}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{submission.studentName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                      </div>
                                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        submission.status === 'Graded' 
                                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' 
                                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                      }`}>
                                        {submission.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">No submissions found for this filter</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              ) : (
                /* Student View - Assignment List */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-blue-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards"
                >
                  <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Assignments</h3>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowAssignmentDetail(true);
                        }}
                        className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-slate-100">{assignment.title}</h4>
                            <p className="text-xs mb-2 text-slate-500 dark:text-slate-400">Posted by {activeSubject?.instructorName || "Instructor"}</p>
                            <div className="flex items-center gap-3 text-xs mb-2">
                              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                <Clock className="w-3 h-3" />
                                {assignment.dueDate}
                              </span>
                              <span className="font-medium text-slate-500 dark:text-slate-400">{assignment.points}</span>
                            </div>
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                              {assignment.status === 'Turned in' || assignment.status === 'Turned in late' ? (
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${assignment.status === 'Turned in late' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                  <CheckCircle2 className="w-3 h-3" />
                                  {assignment.status}
                                </span>
                              ) : assignment.status === 'Graded' ? (
                                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Graded: {assignment.grade || 'N/A'}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                                  Assigned
                                </span>
                              )}
                              {assignment.submittedFiles?.length > 0 && (
                                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{assignment.submittedFiles.length} file(s)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          {classroomTab === 'People' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-blue-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards"
              >
                {/* Faculty View - Roster Control */}
                {user?.role === 'professor' || user?.role === 'instructor' || user?.role === 'admin' ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Class Roster</h3>
                      <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 text-sm flex items-center gap-2">
                        <UserPlus size={16} />
                        Add Student
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'].map((studentName, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                            {studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{studentName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: {2024000 + idx} • student{idx + 1}@ptc.edu.ph</p>
                          </div>
                          <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Mail size={16} className="text-slate-500 dark:text-slate-400" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Student View - Teachers & Classmates */
                  <>
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Teachers / Instructors</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold bg-gradient-to-tr from-blue-600 to-indigo-600">
                          {(activeSubject?.instructor || activeSubject?.instructorName || activeSubject?.profName || "P").replace(/^Prof\.\s*/i, '').charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{activeSubject?.instructor || activeSubject?.instructorName || activeSubject?.profName || "Professor"}</h4>
                            <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800/50">Instructor</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Lead Faculty Member</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mt-6 mb-4 text-slate-900 dark:text-white">Classmates</h3>
                    <div className="space-y-3">
                      {['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'].map((studentName, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                            {studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{studentName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">student{idx + 1}@ptc.edu.ph</p>
                          </div>
                          <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Mail size={16} className="text-slate-500 dark:text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}

          {classroomTab === 'Grades' && (
            <>
              {/* Faculty View - Gradebook Matrix */}
              {user?.role === 'professor' || user?.role === 'teacher' || user?.role === 'instructor' || user?.role === 'admin' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-blue-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Gradebook</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Export gradebook as CSV
                          const students = ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'];
                          const csvContent = [
                            ['Student', 'ID', ...assignments.map(a => a.title), 'Average'],
                            ...students.map((studentName, idx) => {
                              const studentGrades = assignments.map(assignment => {
                                const submission = submissions.find(s =>
                                  s.assignmentId === assignment.id && s.studentName === studentName
                                );
                                return submission?.grade || '-';
                              });
                              const validGrades = studentGrades.filter(g => g > 0);
                              const average = validGrades.length === 0 ? '-' : Math.round(validGrades.reduce((a, b) => a + b, 0) / validGrades.length) + '%';
                              return [studentName, 2024000 + idx, ...studentGrades, average];
                            })
                          ].map(row => row.join(',')).join('\n');

                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `gradebook_${selectedCourseDetail?.classCode || 'class'}_${new Date().toISOString().split('T')[0]}.csv`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 text-sm flex items-center gap-2"
                      >
                        <Download size={16} />
                        Export CSV
                      </button>
                      <button
                        onClick={() => {
                          // Export gradebook as JSON
                          const students = ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'];
                          const jsonData = {
                            classCode: selectedCourseDetail?.classCode || 'General',
                            className: selectedCourseDetail?.title || 'Class',
                            exportDate: new Date().toISOString(),
                            students: students.map((studentName, idx) => ({
                              name: studentName,
                              id: 2024000 + idx,
                              grades: assignments.map(assignment => {
                                const submission = submissions.find(s =>
                                  s.assignmentId === assignment.id && s.studentName === studentName
                                );
                                return {
                                  assignment: assignment.title,
                                  grade: submission?.grade || null,
                                  feedback: submission?.feedback || null
                                };
                              })
                            }))
                          };

                          const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `gradebook_${selectedCourseDetail?.classCode || 'class'}_${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        }}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all duration-200 text-sm flex items-center gap-2"
                      >
                        <FileText size={16} />
                        Export JSON
                      </button>
                    </div>
                  </div>
                  
                  {/* Gradebook Table */}
                  <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Student</th>
                          {assignments.map((assignment) => (
                            <th key={assignment.id} className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 min-w-[100px]">
                              {assignment.title.split(' ').slice(0, 3).join(' ')}
                            </th>
                          ))}
                          <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Demo students */}
                        {['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'].map((studentName, studentIdx) => (
                          <tr key={studentIdx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                  {studentName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{studentName}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">ID: {2024000 + studentIdx}</p>
                                </div>
                              </div>
                            </td>
                            {assignments.map((assignment) => {
                              const submission = submissions.find(s => 
                                s.assignmentId === assignment.id && s.studentName === studentName
                              );
                              const grade = submission?.grade || '-';
                              return (
                                <td key={assignment.id} className="text-center py-3 px-4">
                                  <span className={`font-semibold ${
                                    grade === '-' 
                                      ? 'text-slate-400' 
                                      : parseInt(grade) >= 90 
                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                        : parseInt(grade) >= 70 
                                          ? 'text-blue-600 dark:text-blue-400' 
                                          : 'text-rose-600 dark:text-rose-400'
                                  }`}>
                                    {grade}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="text-center py-3 px-4">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {(() => {
                                  const studentGrades = assignments.map(assignment => {
                                    const submission = submissions.find(s => 
                                      s.assignmentId === assignment.id && s.studentName === studentName
                                    );
                                    return submission?.grade ? parseInt(submission.grade) : 0;
                                  });
                                  const validGrades = studentGrades.filter(g => g > 0);
                                  if (validGrades.length === 0) return '-';
                                  return Math.round(validGrades.reduce((a, b) => a + b, 0) / validGrades.length) + '%';
                                })()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                /* Student View - Overall Grade Card */
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Overall Grade</h3>
                        <div className="flex items-center gap-2">
                          <Award className="w-6 h-6" style={{ color: '#f59e0b' }} />
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">94.5%</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Grade Equivalent</span>
                          <span className="text-sm font-bold text-green-600">1.25 Excellent</span>
                        </div>
                      </div>

                      {/* Category Progress Bars */}
                      <div className="space-y-4 mt-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Quizzes (30%)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">92%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-2 rounded-full bg-blue-500" style={{ width: '92%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Exams (40%)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">95%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: '95%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Projects (30%)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">96%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-2 rounded-full bg-purple-500" style={{ width: '96%' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Grade Table */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
                    >
                      <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Grade Details</h3>
                      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Assignment</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Due Date</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Score</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Feedback</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(assignments || []).map((assignment) => (
                              <tr key={assignment.id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-slate-200 dark:border-slate-700">
                                <td className="py-3 px-4">
                                  <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{assignment.title}</div>
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{assignment.dueDate}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {assignment.grade ? `${assignment.grade}/${assignment.points}` : '-'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    assignment.grade ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {assignment.grade ? 'Graded' : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400">
                                  {assignment.feedback || 'No feedback yet'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  </motion.div>
                </>
                )}
              </>
          )}
        </div>
      </div>

      {/* Professor Chat Head (Only visible inside subject view) */}
      <div className="fixed bottom-28 right-6 z-50">
        {/* Chat Head Button */}
        <motion.button
          onClick={() => setIsProfChatOpen(!isProfChatOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all ring-2 ring-blue-500 animate-pulse"
          style={{ backgroundColor: 'var(--gradient-electric)' }}
        >
          <img
            src={getProfessorAvatar(activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor")}
            alt={activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor"}
            className="w-full h-full rounded-full object-cover"
          />
        </motion.button>

        {/* Messenger-Style Chat Box */}
        <AnimatePresence>
          {isProfChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: 'ease-out' }}
              className="absolute bottom-20 right-0 w-80 rounded-2xl shadow-2xl border overflow-hidden"
              style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e2e8f0' }}
            >
              {/* Chat Header */}
              <div className="p-3 flex items-center justify-between border-b" style={{ backgroundColor: 'var(--gradient-electric)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-3">
                  <img
                    src={getProfessorAvatar(activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor")}
                    alt={activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">Prof. {activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor"}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-white/80 text-xs">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVideoCallActive(true)}
                    className="text-white hover:text-white/80 transition-colors p-1"
                  >
                    <Video size={20} />
                  </button>
                  <button
                    onClick={() => setIsProfChatOpen(false)}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="h-64 overflow-y-auto p-3 space-y-3" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-sm" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                      Start a conversation with {activeSubject?.instructorName || selectedCourseDetail?.professor || "Instructor"}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => {
                    const isOwner = msg.isUser;
                    const isAdminOrProf = user?.role === 'professor' || user?.role === 'admin' || user?.role === 'instructor';
                    const canEdit = isOwner;
                    const canDelete = isOwner || isAdminOrProf;
                    const isEditing = editingCommentId === `chat-${index}`;

                    return (
                      <div
                        key={index}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-sm font-medium relative group shadow-md ${
                            msg.isUser
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-blue-500/20'
                              : isDarkMode
                              ? 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700'
                              : 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200'
                          }`}
                        >
                          {/* Action Menu */}
                          {(canEdit || canDelete) && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              {canEdit && !isEditing && (
                                <button
                                  onClick={() => {
                                    setEditingCommentId(`chat-${index}`);
                                    setEditCommentText(msg.text);
                                  }}
                                  className="p-1 rounded hover:bg-white/20 transition-all text-white/80"
                                  title="Edit"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => {
                                    setChatMessages(chatMessages.filter((_, i) => i !== index));
                                  }}
                                  className="p-1 rounded hover:bg-red-500/20 transition-all text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                              {isEditing && (
                                <button
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditCommentText("");
                                  }}
                                  className="p-1 rounded hover:bg-white/20 transition-all text-white/80"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}

                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full bg-white/20 rounded-xl p-2 text-sm border border-blue-400 outline-none resize-none text-white"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditCommentText("");
                                  }}
                                  className="px-2 py-1 text-xs rounded-lg border border-white/30 text-white transition-all hover:bg-white/10"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    setChatMessages(chatMessages.map((m, i) => 
                                      i === index 
                                        ? { ...m, text: editCommentText, isEdited: true }
                                        : m
                                    ));
                                    setEditingCommentId(null);
                                    setEditCommentText("");
                                  }}
                                  className="px-2 py-1 text-xs rounded-lg bg-white text-blue-600 transition-all hover:bg-white/90"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p>{msg.text}</p>
                              <p className="text-[10px] opacity-70 mt-1 block text-right">
                                {msg.time}
                                {msg.isEdited && <span className="ml-1">• Edited</span>}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Footer */}
              <div className="p-3 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (typedMessage.trim()) {
                      setChatMessages([
                        ...chatMessages,
                        {
                          text: typedMessage,
                          isUser: true,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      ]);
                      setTypedMessage('');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <input
                      key="global-chat-heads-input-field"
                      type="text"
                      placeholder="Type a message..."
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                      className="bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm flex-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!typedMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-transform active:scale-95 shadow-md shadow-blue-500/30 disabled:opacity-50 disabled:hover:bg-blue-600"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invite Students Modal */}
      <InviteStudentsModal
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        selectedCourseDetail={selectedCourseDetail}
        user={user}
        invitations={invitations}
        setInvitations={setInvitations}
        selectedStudentsForInvite={selectedStudentsForInvite}
        setSelectedStudentsForInvite={setSelectedStudentsForInvite}
        studentSearchQuery={studentSearchQuery}
        setStudentSearchQuery={setStudentSearchQuery}
      />

      {/* Assignment Detail Modal */}
      <AnimatePresence>
        {showAssignmentDetail && selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAssignmentDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Assignment Details</h3>
                <button onClick={() => setShowAssignmentDetail(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" style={{ color: 'var(--color-secondary)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Split Column Layout */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Column (2/3) - Assignment Details */}
                <div className="lg:w-2/3 p-6 border-r" style={{ borderColor: 'var(--border-light)' }}>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{selectedAssignment.title}</h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-secondary)' }}>Posted by {activeSubject?.instructorName || "Instructor"}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1" style={{ color: 'var(--color-secondary)' }}>
                      <Clock className="w-4 h-4" />
                      Due: {selectedAssignment.dueDate}
                    </span>
                    <span className="font-medium" style={{ color: 'var(--color-muted)' }}>{selectedAssignment.points}</span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Instructions</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>{selectedAssignment.description}</p>
                  </div>

                  {selectedAssignment.attachments?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>Attached Materials</h4>
                      <div className="space-y-2">
                        {selectedAssignment.attachments.map((attachment, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                            <FileText className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{attachment.name}</p>
                              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{attachment.size}</p>
                            </div>
                            <Download className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-all" style={{ color: 'var(--color-secondary)' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (1/3) - Your Work Card */}
                <div className="lg:w-1/3 p-6">
                  {/* Your Work Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold" style={{ color: 'var(--color-primary)' }}>Your work</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        selectedAssignment.status === 'Assigned' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        selectedAssignment.status === 'Turned in' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' :
                        selectedAssignment.status === 'Turned in late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                      }`}>
                        {selectedAssignment.status === 'Graded' ? `Graded: ${selectedAssignment.grade || 'N/A'}` : selectedAssignment.status}
                      </span>
                    </div>
                    
                    {/* Grade & Feedback Section (shown when Graded) */}
                    {selectedAssignment.status === 'Graded' && (
                      <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-bold text-sm text-indigo-900 dark:text-indigo-100">Grade: {selectedAssignment.grade || 'N/A'}/100</span>
                        </div>
                        {selectedAssignment.privateComments && selectedAssignment.privateComments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Instructor Feedback:</p>
                            {selectedAssignment.privateComments.map((comment, idx) => (
                              <div key={idx} className="text-xs text-indigo-800 dark:text-indigo-200 bg-white dark:bg-slate-800 p-2 rounded-lg mb-1">
                                {comment.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submitted Files List */}
                    {selectedAssignment.submittedFiles?.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {selectedAssignment.submittedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                            <FileText className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: 'var(--color-primary)' }}>{file.name}</p>
                              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{file.size}</p>
                            </div>
                            {selectedAssignment.status !== 'Turned in' && selectedAssignment.status !== 'Turned in late' && selectedAssignment.status !== 'Graded' && (
                              <button
                                onClick={() => {
                                  const updatedFiles = selectedAssignment.submittedFiles.filter((_, i) => i !== idx);
                                  setAssignments(assignments.map(a => 
                                    a.id === selectedAssignment.id 
                                      ? { ...a, submittedFiles: updatedFiles }
                                      : a
                                  ));
                                  setSelectedAssignment({ ...selectedAssignment, submittedFiles: updatedFiles });
                                }}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                              >
                                <X className="w-3 h-3 text-red-500" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add or Create Button */}
                    {selectedAssignment.status !== 'Turned in' && selectedAssignment.status !== 'Turned in late' && selectedAssignment.status !== 'Graded' && (
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '*/*';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const newFile = {
                                name: file.name,
                                size: (file.size / 1024).toFixed(1) + ' KB',
                                type: file.type,
                                url: URL.createObjectURL(file)
                              };
                              const updatedFiles = [...(selectedAssignment.submittedFiles || []), newFile];
                              setAssignments(assignments.map(a => 
                                a.id === selectedAssignment.id 
                                  ? { ...a, submittedFiles: updatedFiles }
                                  : a
                              ));
                              setSelectedAssignment({ ...selectedAssignment, submittedFiles: updatedFiles });
                            }
                          };
                          input.click();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed mb-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                        style={{ borderColor: 'var(--border-light)', color: 'var(--color-secondary)' }}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add or create</span>
                      </button>
                    )}

                    {/* Dynamic Action Button */}
                    {selectedAssignment.status === 'Assigned' && (
                      <button
                        onClick={() => {
                          const now = new Date();
                          const dueDate = new Date(selectedAssignment.dueDate);
                          const isLate = now > dueDate;
                          setAssignments(assignments.map(a => 
                            a.id === selectedAssignment.id 
                              ? { 
                                  ...a, 
                                  status: isLate ? 'Turned in late' : 'Turned in',
                                  turnedInDate: now.toISOString()
                                }
                              : a
                          ));
                          setSelectedAssignment({ 
                            ...selectedAssignment, 
                            status: isLate ? 'Turned in late' : 'Turned in',
                            turnedInDate: now.toISOString()
                          });
                        }}
                        className={`w-full font-semibold py-2.5 rounded-xl shadow transition-all ${
                          selectedAssignment.submittedFiles?.length > 0 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {selectedAssignment.submittedFiles?.length > 0 ? 'Turn in' : 'Mark as done'}
                      </button>
                    )}

                    {selectedAssignment.status === 'Turned in' || selectedAssignment.status === 'Turned in late' ? (
                      <button
                        onClick={() => {
                          setAssignments(assignments.map(a => 
                            a.id === selectedAssignment.id 
                              ? { ...a, status: 'Assigned', turnedInDate: null }
                              : a
                          ));
                          setSelectedAssignment({ ...selectedAssignment, status: 'Assigned', turnedInDate: null });
                        }}
                        className="w-full border border-slate-300 dark:border-slate-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 font-semibold py-2.5 rounded-xl transition-all"
                      >
                        Unsubmit
                      </button>
                    ) : null}

                    {selectedAssignment.status === 'Assigned' && selectedAssignment.turnedInDate && (
                      <button
                        onClick={() => {
                          const now = new Date();
                          const dueDate = new Date(selectedAssignment.dueDate);
                          const isLate = now > dueDate;
                          setAssignments(assignments.map(a => 
                            a.id === selectedAssignment.id 
                              ? { 
                                  ...a, 
                                  status: isLate ? 'Turned in late' : 'Turned in',
                                  turnedInDate: now.toISOString()
                                }
                              : a
                          ));
                          setSelectedAssignment({ 
                            ...selectedAssignment, 
                            status: isLate ? 'Turned in late' : 'Turned in',
                            turnedInDate: now.toISOString()
                          });
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow transition-all"
                      >
                        Resubmit
                      </button>
                    )}
                  </div>

                  {/* Private Comments Section */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
                      <h4 className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>Private comments</h4>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                      {selectedAssignment.privateComments?.length > 0 ? (
                        selectedAssignment.privateComments.map((comment, idx) => {
                          const isOwner = comment.sender === (user?.name || 'Student');
                          const isAdminOrProf = user?.role === 'professor' || user?.role === 'admin' || user?.role === 'instructor';
                          const canEdit = isOwner;
                          const canDelete = isOwner || isAdminOrProf;
                          const isEditing = editingCommentId === comment.id;

                          return (
                            <div key={idx} className="p-2 rounded-lg relative group" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                              {/* Action Menu */}
                              {(canEdit || canDelete) && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  {canEdit && !isEditing && (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditCommentText(comment.text);
                                      }}
                                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                      style={{ color: 'var(--color-muted)' }}
                                      title="Edit"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                  )}
                                  {canDelete && (
                                    <button
                                      onClick={() => {
                                        const updatedComments = selectedAssignment.privateComments.filter((_, i) => i !== idx);
                                        setAssignments(assignments.map(a => 
                                          a.id === selectedAssignment.id 
                                            ? { ...a, privateComments: updatedComments }
                                            : a
                                        ));
                                        setSelectedAssignment({ ...selectedAssignment, privateComments: updatedComments });
                                      }}
                                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all text-red-500"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                  {isEditing && (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditCommentText("");
                                      }}
                                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                      style={{ color: 'var(--color-muted)' }}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}

                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl p-2 text-sm border border-blue-500 outline-none resize-none"
                                    style={{ color: 'var(--color-primary)' }}
                                    rows={2}
                                    autoFocus
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditCommentText("");
                                      }}
                                      className="px-3 py-1 text-xs rounded-lg border transition-all"
                                      style={{ borderColor: 'var(--border-light)', color: 'var(--color-secondary)' }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        const updatedComments = selectedAssignment.privateComments.map((c, i) => 
                                          i === idx 
                                            ? { ...c, text: editCommentText, isEdited: true, editedAt: new Date().toLocaleString() }
                                            : c
                                        );
                                        setAssignments(assignments.map(a => 
                                          a.id === selectedAssignment.id 
                                            ? { ...a, privateComments: updatedComments }
                                            : a
                                        ));
                                        setSelectedAssignment({ ...selectedAssignment, privateComments: updatedComments });
                                        setEditingCommentId(null);
                                        setEditCommentText("");
                                      }}
                                      className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-primary)' }}>{comment.sender}</p>
                                  <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>{comment.text}</p>
                                  <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                    {comment.timestamp}
                                    {comment.isEdited && <span className="ml-1">• Edited</span>}
                                  </p>
                                </>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>No private comments yet</p>
                      )}
                    </div>

                    {/* Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add private comment..."
                        className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-all focus:border-blue-500"
                        style={{ borderColor: 'var(--border-light)', color: 'var(--color-primary)' }}
                        onKeyPress={( e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            const newComment = {
                              id: Date.now(),
                              sender: user?.name || 'Student',
                              text: e.target.value.trim(),
                              timestamp: new Date().toLocaleString()
                            };
                            const updatedComments = [...(selectedAssignment.privateComments || []), newComment];
                            setAssignments(assignments.map(a => 
                              a.id === selectedAssignment.id 
                                ? { ...a, privateComments: updatedComments }
                                : a
                            ));
                            setSelectedAssignment({ ...selectedAssignment, privateComments: updatedComments });
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add private comment..."]');
                          if (input && input.value.trim()) {
                            const newComment = {
                              id: Date.now(),
                              sender: user?.name || 'Student',
                              text: input.value.trim(),
                              timestamp: new Date().toLocaleString()
                            };
                            const updatedComments = [...(selectedAssignment.privateComments || []), newComment];
                            setAssignments(assignments.map(a => 
                              a.id === selectedAssignment.id 
                                ? { ...a, privateComments: updatedComments }
                                : a
                            ));
                            setSelectedAssignment({ ...selectedAssignment, privateComments: updatedComments });
                            input.value = '';
                          }
                        }}
                        className="p-2 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-slate-800"
                        style={{ color: 'var(--color-secondary)' }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- DASHBOARD HOME COMPONENT (moved outside App to prevent remount) ---
const DashboardHome = ({ t, currentUser, courses = [], tasks = [], filteredCourses = [], handleCourseClick, getProfessorAvatar, getUnreadCount, user, userProfile, setActiveMeeting, setSelectedCourseDetail, setShowAttendanceModal, setShowBadgesModal, subjectsList = [], showAddSubjectModal, setShowAddSubjectModal, newSubjectName, setNewSubjectName, newSection, setNewSection, newInstructorName, setNewInstructorName, newStudentEmails, setNewStudentEmails, handleAddSubject, editingSubject, setEditingSubject, editSubjectName, setEditSubjectName, editSection, setEditSection, editInstructorName, setEditInstructorName, editStudentEmails, setEditStudentEmails, handleOpenEditModal, handleSaveEditSubject, handleDeleteSubject, activeSubject, setActiveSubject, isDarkMode, invitations, setInvitations, pendingInvitations, setPendingInvitations }) => {
  const isAdminOrProf = user?.role === 'admin' || user?.role === 'professor' || user?.role === 'faculty' || user?.role === 'dean';
  const isProfessor = user?.role === 'professor';
  const isAdmin = user?.role === 'admin';
  const isDean = user?.role === 'dean';
  const isFaculty = isProfessor || isAdmin || isDean;
  const isStudent = user?.role === 'student';
  
  // Filter pending invitations for current student (mock - in production, filter by student ID)
  const studentPendingInvitations = invitations.filter(inv => 
    inv.status === 'pending' && 
    (inv.studentEmail === user?.email || inv.studentName === user?.name)
  );

  const handleAcceptInvitation = (invitation) => {
    setInvitations(prev => prev.map(inv =>
      inv.id === invitation.id ? { ...inv, status: 'accepted' } : inv
    ));
    alert(`You have successfully joined ${invitation.subjectName}!`);
    // Open Google Classroom link if available
    if (invitation.googleClassroomLink) {
      window.open(invitation.googleClassroomLink, '_blank');
    }
  };

  const handleDeclineInvitation = (invitation) => {
    setInvitations(prev => prev.map(inv => 
      inv.id === invitation.id ? { ...inv, status: 'declined' } : inv
    ));
  };

  return (
  <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto">
    {/* Top Glass Carousel - Metrics & Quick Actions */}
    <div className={`mb-6 p-3 sm:p-4 rounded-3xl border shadow-sm backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          className={`p-3 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{(courses?.length || 0)}</span>
          </div>
          <div className={`text-xs font-semibold badge-elegant ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Courses</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          whileHover={{ translateY: -2 }}
          className={`p-3 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{(tasks?.filter(t => t.completed).length || 0)}</span>
          </div>
          <div className={`text-xs font-semibold badge-elegant ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Completed Tasks</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          whileHover={{ translateY: -2 }}
          className={`p-3 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Activity size={16} className="text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {courses?.length ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) : 0}%
            </span>
          </div>
          <div className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Average Progress</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          whileHover={{ translateY: -2 }}
          className={`p-3 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%
            </span>
          </div>
          <div className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Average Progress</div>
        </motion.div>
      </div>

      {/* Pending Class Invitations Banner - Student Only */}
      {isStudent && studentPendingInvitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-2xl border shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Google Classroom & Subject Invitations</h3>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
              {studentPendingInvitations.length}
            </span>
          </div>
          <div className="space-y-3">
            {studentPendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {invitation.subjectCode}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        • Invited by {invitation.invitedBy} ({invitation.invitedByRole})
                      </span>
                    </div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {invitation.subjectName}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                      Invited Email: {invitation.studentEmail}
                    </p>
                    {/* Google Classroom Details */}
                    {invitation.googleClassroomCode && (
                      <div className={`mt-2 p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                          <ExternalLink size={14} className="text-blue-500" />
                          <span className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Google Classroom Code: {invitation.googleClassroomCode}
                          </span>
                        </div>
                        {invitation.googleClassroomLink && (
                          <a
                            href={invitation.googleClassroomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline mt-1 block"
                          >
                            {invitation.googleClassroomLink}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptInvitation(invitation)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
                    >
                      Accept & Join Class
                    </button>
                    <button
                      onClick={() => handleDeclineInvitation(invitation)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-sm font-medium rounded-xl transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAttendanceModal(true)}
          className={`p-3 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <ClipboardList size={16} className="text-white" />
          </div>
          <div className="text-left">
            <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>📊 View Attendance Sheet</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track your class attendance</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBadgesModal(true)}
          className={`p-3 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Award size={16} className="text-white" />
          </div>
          <div className="text-left">
            <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🏆 View Badges</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your achievements & milestones</div>
          </div>
        </motion.button>
      </div>
    </div>

    {/* Course Grid - Asymmetric Horizontal Hub Layout */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-family)' }}>
          {t.courses}
        </h2>
        <div className="flex items-center gap-3">
          {isAdminOrProf && (
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-4 py-2 rounded-xl flex items-center shadow-md shadow-blue-500/20 transition-all border border-blue-500/30 whitespace-nowrap cursor-pointer z-10"
            >
              <Plus className="w-5 h-5 mr-1.5 stroke-[2.5]"/>
              <span>Add Subject</span>
            </button>
          )}
          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{(filteredCourses?.length || 0)} enrolled</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Primary Featured Course Banner (Left 40%) */}
        {(filteredCourses?.[0]) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`lg:w-[40%] w-full rounded-3xl overflow-hidden cursor-pointer border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}
            style={{ minHeight: '280px' }}
            onClick={() => handleCourseClick(filteredCourses[0])}
          >
            {/* Gradient Banner */}
            <div 
              className={`relative h-auto min-h-[140px] ${filteredCourses[0]?.color || 'bg-gradient-to-br from-blue-500 to-purple-600'} p-5 flex flex-col justify-between`}
              style={{ 
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%)` 
              }}
            >
              {/* Top row with badges and icon */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-white backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase" style={{ color: '#ffffff' }}>
                    {filteredCourses[0]?.code || 'N/A'}
                  </span>
                  <span className="bg-white/20 text-white backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: '#ffffff' }}>
                    {filteredCourses[0]?.section || 'No Section'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <BookOpen size={18} className="text-white" style={{ color: '#ffffff' }} />
                </div>
              </div>

              {/* Course title below badges */}
              <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug tracking-wide my-2 block"
                  style={{ fontFamily: "'Arial', sans-serif", color: '#FFFFFF', visibility: 'visible', opacity: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {filteredCourses[0]?.title || 'Untitled Course'}
              </h3>

              {/* Class Code Display - Prominent for Faculty */}
              {filteredCourses[0]?.classCode && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-white text-xs font-semibold bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/20" style={{ color: '#ffffff !important' }}>
                    Class Code: {filteredCourses[0].classCode}
                  </span>
                  {isFaculty && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(filteredCourses[0].classCode);
                        alert('Class code copied to clipboard!');
                      }}
                      className="text-white text-xs bg-white/20 hover:bg-white/30 px-2 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
                      style={{ color: '#ffffff !important' }}
                      title="Copy class code"
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-4 border-white dark:border-slate-800 shadow-md object-cover overflow-hidden bg-white dark:bg-slate-800"
                >
                  <img
                    src={getProfessorAvatar(filteredCourses[0]?.professor)}
                    alt={filteredCourses[0]?.professor || 'Professor'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-family)' }}>
                    {isProfessor ? `${filteredCourses[0]?.students || 0} Students` : (filteredCourses[0]?.professor || 'Professor')}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{isProfessor ? (filteredCourses[0]?.year || 'N/A') : (filteredCourses[0]?.sched || 'No Schedule')}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.courseProgress}</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredCourses[0]?.progress || 0}%</span>
                </div>
                <div className={`w-full rounded-full h-2.5 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${filteredCourses[0]?.progress || 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              </div>
              
              <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start gap-2">
                  <MessageSquare size={16} className={`mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Latest Update</p>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {filteredCourses[0]?.announcement || 'No announcements yet'}
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // eslint-disable-next-line no-undef
                  setSelectedCourseDetail(filteredCourses[0]);
                  setActiveMeeting({
                    isOpen: true,
                    roomUrl: filteredCourses[0]?.meetLink || '',
                    title: `${filteredCourses[0]?.code || 'Course'} - ${filteredCourses[0]?.title || 'Untitled'}`,
                    role: user?.role || 'student'
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl text-sm font-semibold hover:shadow-lg active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Video size={18} />
                {isProfessor ? t.manageClassroom : t.joinMeet}
              </button>
            </div>
          </motion.div>
        )}

        {/* Courses List Grid (Right 60%) */}
        <div className="lg:w-[60%] space-y-3">
          {(filteredCourses?.slice(1) || []).map((course, index) => (
            <motion.div
              key={course?.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ translateX: 4, boxShadow: '0 4px 20px rgba(79, 70, 229, 0.1)' }}
              onClick={() => handleCourseClick(course)}
              className={`group rounded-2xl cursor-pointer border shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-4 flex items-center gap-4 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}
            >
              {/* Course Color Badge */}
              <div
                className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-500/20 dark:bg-slate-800 dark:text-blue-400 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-md"
              >
                <BookOpen size={20} />
              </div>
              
              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {course?.code || 'N/A'}
                  </span>
                  <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>•</span>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {course?.section || 'No Section'}
                  </span>
                </div>
                <h3 className={`font-semibold text-sm sm:text-base truncate mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-family)' }}>
                  {course?.title || 'Untitled Course'}
                </h3>
                <div className={`flex items-center gap-3 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-blue-600/10 text-blue-600 border border-blue-500/20 dark:bg-slate-800 dark:text-blue-400 dark:border-slate-700">
                      <span className="text-[10px] font-bold">
                        {isProfessor ? (course?.code?.charAt(0) || '?') : (course?.professor?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PR')}
                      </span>
                    </div>
                    {isProfessor ? `${course?.students || 0} Students` : (course?.professor || 'Professor')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity size={12} />
                    {course?.progress || 0}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar Mini */}
              <div className="hidden sm:block w-24 flex-shrink-0">
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course?.progress || 0}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="h-1.5 rounded-full"
                    style={{ background: 'var(--gradient-electric)' }}
                  />
                </div>
              </div>
              
              {/* Quick Action Icons */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMeeting({
                      isOpen: true,
                      roomUrl: course?.meetLink || '',
                      title: `${course?.code || 'Course'} - ${course?.title || 'Untitled'}`,
                      role: user?.role || 'student'
                    });
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Video size={16} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Add Subject Modal */}
    <AnimatePresence>
      {showAddSubjectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowAddSubjectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: 'var(--gradient-electric)' }}>
                  <FolderPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Create New Subject</h3>
              </div>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddSubject} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Web Development 101"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Section</label>
                <input
                  type="text"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  placeholder="e.g., BSIT 3-A"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Instructor Name</label>
                <input
                  type="text"
                  value={newInstructorName}
                  onChange={(e) => setNewInstructorName(e.target.value)}
                  placeholder="e.g., Prof. Juan Dela Cruz"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                  <Mail className="w-4 h-4 inline mr-1" />
                  Institutional Email Invites
                </label>
                <textarea
                  value={newStudentEmails}
                  onChange={(e) => setNewStudentEmails(e.target.value)}
                  placeholder="Enter email addresses separated by commas (e.g., student1@ptc.edu.ph, student2@ptc.edu.ph)"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2 resize-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)', minHeight: '80px' }}
                  rows="3"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Separate multiple emails with commas</p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  Create Subject
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Edit Subject Modal */}
    <AnimatePresence>
      {editingSubject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setEditingSubject(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: 'var(--gradient-electric)' }}>
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Edit Subject Details</h3>
              </div>
              <button
                onClick={() => setEditingSubject(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEditSubject} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Subject Name</label>
                <input
                  type="text"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                  placeholder="e.g., Web Development 101"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Section</label>
                <input
                  type="text"
                  value={editSection}
                  onChange={(e) => setEditSection(e.target.value)}
                  placeholder="e.g., BSIT 3-A"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Instructor Name</label>
                <input
                  type="text"
                  value={editInstructorName}
                  onChange={(e) => setEditInstructorName(e.target.value)}
                  placeholder="e.g., Prof. Juan Dela Cruz"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                  <Mail className="w-4 h-4 inline mr-1" />
                  Institutional Email Invites
                </label>
                <textarea
                  value={editStudentEmails}
                  onChange={(e) => setEditStudentEmails(e.target.value)}
                  placeholder="Enter email addresses separated by commas (e.g., student1@ptc.edu.ph, student2@ptc.edu.ph)"
                  className="w-full px-4 py-2 rounded-xl outline-none transition-all focus:ring-2 resize-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)', borderColor: 'var(--border-light)', minHeight: '80px' }}
                  rows="3"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Separate multiple emails with commas</p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="flex-1 px-4 py-2 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};

// --- FACULTY GRADING MODAL COMPONENT ---
const FacultyGradingModal = ({ 
  showFacultyGradingModal, 
  setShowFacultyGradingModal, 
  selectedStudentSubmission, 
  facultyGradingScore, 
  setFacultyGradingScore, 
  facultyGradingFeedback, 
  setFacultyGradingFeedback, 
  handleReturnWork,
  isDarkMode 
}) => {
  if (!showFacultyGradingModal || !selectedStudentSubmission) return null;

  return (
    <AnimatePresence>
      {showFacultyGradingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowFacultyGradingModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Grade & Return Work</h3>
            
            {/* Student Info */}
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-sm text-slate-900 dark:text-white">{selectedStudentSubmission.studentName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student ID: {selectedStudentSubmission.studentId}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Submitted: {new Date(selectedStudentSubmission.submittedAt).toLocaleString()}</p>
            </div>
            
            {/* Submitted Files */}
            {selectedStudentSubmission.files && selectedStudentSubmission.files.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Submitted Files:</p>
                {selectedStudentSubmission.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                    <FileText size={16} className="text-slate-500 dark:text-slate-400" />
                    <span className="text-xs text-slate-900 dark:text-white">{file.name || 'File'}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Score Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Score:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={facultyGradingScore}
                  onChange={(e) => setFacultyGradingScore(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 font-bold w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="0"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">/ 100</span>
              </div>
            </div>
            
            {/* Feedback Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Private Feedback:</label>
              <textarea
                value={facultyGradingFeedback}
                onChange={(e) => setFacultyGradingFeedback(e.target.value)}
                placeholder="Add your feedback for the student..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                rows="3"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFacultyGradingModal(false)}
                className="flex-1 px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleReturnWork(selectedStudentSubmission.id, facultyGradingScore, facultyGradingFeedback);
                  setShowFacultyGradingModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Return Work
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- FACULTY CREATE CLASSWORK/ANNOUNCEMENT MODAL COMPONENT ---
const FacultyCreateClassworkModal = ({ 
  showCreateClassworkModal, 
  setShowCreateClassworkModal, 
  newAssignmentTitle, 
  setNewAssignmentTitle, 
  newAssignmentDescription, 
  setNewAssignmentDescription, 
  newAssignmentPoints, 
  setNewAssignmentPoints, 
  newAssignmentDueDate, 
  setNewAssignmentDueDate, 
  isAnnouncement, 
  setIsAnnouncement, 
  handleCreateClasswork,
  isDarkMode 
}) => {
  if (!showCreateClassworkModal) return null;

  return (
    <AnimatePresence>
      {showCreateClassworkModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCreateClassworkModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Create {isAnnouncement ? 'Announcement' : 'Assignment'}</h3>
            
            {/* Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsAnnouncement(false)}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !isAnnouncement
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Assignment
              </button>
              <button
                onClick={() => setIsAnnouncement(true)}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isAnnouncement
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Announcement
              </button>
            </div>
            
            {/* Title Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">{isAnnouncement ? 'Announcement Title' : 'Assignment Title'}</label>
              <input
                type="text"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                placeholder={isAnnouncement ? 'Enter announcement title...' : 'Enter assignment title...'}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            {/* Description Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">{isAnnouncement ? 'Announcement Content' : 'Instructions'}</label>
              <textarea
                value={newAssignmentDescription}
                onChange={(e) => setNewAssignmentDescription(e.target.value)}
                placeholder={isAnnouncement ? 'Enter announcement content...' : 'Enter assignment instructions...'}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                rows="4"
              />
            </div>
            
            {/* Assignment-specific fields */}
            {!isAnnouncement && (
              <>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Total Points</label>
                  <input
                    type="number"
                    value={newAssignmentPoints}
                    onChange={(e) => setNewAssignmentPoints(e.target.value)}
                    placeholder="100"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Due Date</label>
                  <input
                    type="date"
                    value={newAssignmentDueDate}
                    onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateClassworkModal(false)}
                className="flex-1 px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClasswork}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                {isAnnouncement ? 'Publish' : 'Create'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- DASHBOARD COMPONENT (moved outside App to prevent remount) ---
const Dashboard = ({ isDarkMode, isMobileSidebarOpen, setIsMobileSidebarOpen, isSidebarOpen, toggleSidebar, searchQuery, handleSearch, showNotifications, setShowNotifications, showCalendarModal, setShowCalendarModal, showJoinClassModal, setShowJoinClassModal, showCreateClassModal, setShowCreateClassModal, getUnreadCount, toggleDarkMode, renderMainContent, user }) => {
  return (
  <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-100/50'}`}>
    {/* Header */}
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      {/* Ambient glow line */}
      <div className="bg-gradient-to-r from-transparent via-blue-500/20 to-transparent h-[1px] w-full"></div>
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} className={isDarkMode ? 'text-slate-100' : 'text-slate-900'} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            <h1 className={`hidden sm:block font-bold uppercase tracking-wide text-[10px] sm:text-xs md:text-sm drop-shadow-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
              PATEROS TECHNOLOGICAL COLLEGE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
            <Search size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
            <input
              key="global-search-input-field"
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`bg-transparent outline-none text-sm w-48 ${isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-500'}`}
              style={{ fontFamily: 'var(--font-family)' }}
            />
          </div>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          >
            <Bell size={18} className={isDarkMode ? 'text-slate-100' : 'text-slate-900'} />
            {getUnreadCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </button>

          {/* Plus Action Button */}
          <button
            onClick={() => {
              if (user?.role === 'student') {
                setShowJoinClassModal(true);
              } else {
                setShowCreateClassModal(true);
              }
            }}
            className={`relative p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
            title={user?.role === 'student' ? 'Join class' : 'Create class'}
          >
            <Plus size={18} className={isDarkMode ? 'text-slate-100' : 'text-slate-900'} />
          </button>

          {/* Calendar */}
          <button
            onClick={() => setShowCalendarModal(!showCalendarModal)}
            className={`hidden sm:block p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          >
            <Calendar size={18} className={isDarkMode ? 'text-slate-100' : 'text-slate-900'} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun size={18} className="text-slate-100" /> : <Moon size={18} className="text-slate-900" />}
          </button>
        </div>
      </div>
    </header>

    {/* Main Content - Render based on activeNav */}
    <main className="h-[calc(100vh-64px)] overflow-y-auto">
      {renderMainContent()}
    </main>
  </div>
  );
};

// --- NOTIFICATION DROPDOWN COMPONENT (moved outside App to prevent remount) ---
const NotificationDropdown = ({ showNotifications, setShowNotifications, isDarkMode, notifications, handleNotificationClick, courses, setSelectedCourseDetail, setActiveNav, markAllNotificationsRead }) => (
  <AnimatePresence>
    {showNotifications && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-4 top-16 w-80 sm:w-96 rounded-2xl shadow-2xl transition-all z-50 bg-white text-slate-900 border border-slate-200 dark:bg-[#0f172a] dark:text-white dark:border-slate-800 ring-1 ring-black/5 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#1e293b] rounded-t-2xl">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm" style={{ fontFamily: 'var(--font-family)' }}>Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.filter(n => !n.read).length > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setShowNotifications(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400">
                <X size={16} />
              </button>
            </div>
          </div>
          {notifications.filter(n => !n.read).length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notifications.filter(n => !n.read).length} unread notifications</p>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Bell size={32} className="mx-auto mb-2 opacity-20" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map(notification => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => {
                  handleNotificationClick(notification);
                  const targetCourse = courses.find(c => notification.message.includes(c.code));
                  if (targetCourse) {
                    setSelectedCourseDetail(targetCourse);
                    setActiveNav('Subject');
                    setShowNotifications(false);
                  }
                }}
                className="p-3.5 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-[#1e293b]/70 transition-colors cursor-pointer flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg shadow-md ${
                  notification.type === 'assignment' ? 'bg-blue-600 text-white' :
                  notification.type === 'grade' ? 'bg-green-600 text-white' :
                  'bg-slate-600 text-white'
                }`}>
                  {notification.type === 'assignment' ? <FileText size={16} /> :
                   notification.type === 'grade' ? <CheckSquare size={16} /> :
                   <Bell size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-family)' }}>{notification.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- COURSE MODAL COMPONENT (moved outside App to prevent remount) ---
const CourseModal = ({ showCourseModal, setShowCourseModal, selectedCourseDetail, user, logAttendance, isDarkMode }) => {
  if (!showCourseModal || !selectedCourseDetail) return null;
  
  const handleJoinMeet = () => {
    const room = selectedCourseDetail.code || "SP101-BSIT3J";
    const name = encodeURIComponent(user?.name || user?.username || "Admin User");
    const role = user?.role === 'professor' || user?.role === 'admin' ? 'professor' : 'student';
    
    // Log attendance
    if (logAttendance) {
      logAttendance(user?.name || user?.username || "Admin User", selectedCourseDetail.code);
    }
    
    window.open(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=${room}&name=${name}&role=${role}`, '_blank');
  };

  const handleInfoTileClick = (type, value) => {
    if (type === 'schedule') {
      navigator.clipboard.writeText(value);
      alert('Schedule copied to clipboard!');
    } else if (type === 'room') {
      alert(`Room location: ${value}`);
    } else if (type === 'instructor') {
      alert(`Instructor: ${value}`);
    } else if (type === 'progress') {
      alert(`Course Progress: ${value}%`);
    }
  };
  
  return (
    <AnimatePresence>
      {showCourseModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCourseModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      {selectedCourseDetail.code}
                    </span>
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      {selectedCourseDetail.section}
                    </span>
                  </div>
                  <h2 className={`text-2xl font-black tracking-tight my-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-family)' }}>{selectedCourseDetail.title}</h2>
                </div>
                <button
                  onClick={() => setShowCourseModal(false)}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${isDarkMode ? 'bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400' : 'bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-6">
                {/* Info Tiles Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInfoTileClick('instructor', selectedCourseDetail?.professor || "Instructor")}
                    className={`p-4 rounded-xl border hover:shadow-md cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500' : 'bg-blue-50 border-blue-100 hover:border-blue-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-electric)' }}>
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Instructor</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedCourseDetail?.professor || "Instructor"}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInfoTileClick('schedule', selectedCourseDetail.sched)}
                    className={`p-4 rounded-xl border hover:shadow-md cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500' : 'bg-purple-50 border-purple-100 hover:border-purple-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Schedule</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedCourseDetail.sched}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInfoTileClick('room', selectedCourseDetail.room)}
                    className={`p-4 rounded-xl border hover:shadow-md cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-600 rounded-lg">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Room</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedCourseDetail.room}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInfoTileClick('progress', selectedCourseDetail.progress)}
                    className={`p-4 rounded-xl border hover:shadow-md cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-amber-500' : 'bg-amber-50 border-amber-100 hover:border-amber-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-600 rounded-lg">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Progress</p>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedCourseDetail.progress}%</p>
                        </div>
                        <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedCourseDetail.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* PTC Meet Integration */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl border border-blue-500 shadow-lg my-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Video size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-family)' }}>PTC Meet Integration</h3>
                      <p className="text-sm text-blue-100">Join your virtual classroom instantly</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinMeet}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-100 transition-all duration-200 shadow-md hover:shadow-xl"
                  >
                    <Camera size={20} />
                    Join PTC Meet Class
                  </motion.button>
                </motion.div>
                
                {/* Announcement */}
                <div className="p-4 rounded-xl border my-3 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-family)' }}>
                    <Bell size={18} className="text-blue-600" />
                    Latest Announcement
                  </h4>
                  <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">{selectedCourseDetail.announcement}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- ATTENDANCE MODAL COMPONENT ---
const AttendanceModal = ({ showAttendanceModal, setShowAttendanceModal, attendanceLogs, attendanceFilter, setAttendanceFilter, exportAttendanceToCSV }) => {
  if (!showAttendanceModal) return null;

  const filteredLogs = attendanceFilter === 'All' 
    ? attendanceLogs 
    : attendanceLogs.filter(log => log.status === attendanceFilter);

  return (
    <AnimatePresence>
      {showAttendanceModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAttendanceModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-slate-200/50 dark:border-slate-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-family)' }}>
                    📊 Attendance Sheet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">Track your class attendance records</p>
                </div>
                <button 
                  onClick={() => setShowAttendanceModal(false)} 
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">
                {['All', 'Present', 'Late'].map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAttendanceFilter(filter)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      attendanceFilter === filter 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">No attendance records found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{log.studentName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{log.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{log.date}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{log.timestamp}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                            log.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportAttendanceToCSV}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                <Download size={20} />
                Export to CSV / Download Report
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- BADGES MODAL COMPONENT ---
const BadgesModal = ({ showBadgesModal, setShowBadgesModal, badges, claimedBadges, claimBadge }) => {
  if (!showBadgesModal) return null;

  return (
    <AnimatePresence>
      {showBadgesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBadgesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-slate-200/50 dark:border-slate-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-family)' }}>
                    🏆 Student Badges & Milestones
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">View your achievements and progress</p>
                </div>
                <button 
                  onClick={() => setShowBadgesModal(false)} 
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      badge.earned 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                        {badge.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{badge.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}/{badge.required}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(badge.progress / badge.required) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            badge.earned 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Claim Button */}
                    {badge.earned && !claimedBadges.includes(badge.id) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => claimBadge(badge.id)}
                        className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md"
                      >
                        🎉 Claim Badge
                      </motion.button>
                    )}

                    {claimedBadges.includes(badge.id) && (
                      <div className="w-full py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-xl font-bold text-sm text-center">
                        ✅ Claimed
                      </div>
                    )}

                    {!badge.earned && (
                      <div className="w-full py-2 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-sm text-center">
                        🔒 Locked
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- SUBMISSION MODAL COMPONENT ---
const SubmissionModal = ({ showSubmitModal, setShowSubmitModal, selectedTaskForSubmit, submittedTasks, setSubmittedTasks }) => {
  if (!showSubmitModal || !selectedTaskForSubmit) return null;

  const handleSubmit = () => {
    setSubmittedTasks([...submittedTasks, selectedTaskForSubmit.id]);
    setShowSubmitModal(false);
  };

  return (
    <AnimatePresence>
      {showSubmitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Submit Assignment</h3>
                <button onClick={() => setShowSubmitModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignment:</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedTaskForSubmit.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: {selectedTaskForSubmit.dueDate}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 rounded-xl text-white font-medium transition-all hover:scale-105"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- GRADING MODAL COMPONENT ---
const GradingModal = ({ showGradingModal, setShowGradingModal, selectedTaskForGrading, gradedTasks, setGradedTasks, gradeValue, setGradeValue, gradeComment, setGradeComment }) => {
  if (!showGradingModal || !selectedTaskForGrading) return null;

  const handleGradeSubmit = () => {
    setGradedTasks([...gradedTasks, selectedTaskForGrading.id]);
    setShowGradingModal(false);
    setGradeValue('');
    setGradeComment('');
  };

  return (
    <AnimatePresence>
      {showGradingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGradingModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Grade Submission</h3>
                <button onClick={() => setShowGradingModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task:</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedTaskForGrading.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: {selectedTaskForGrading.dueDate}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Value</label>
                <input
                  type="text"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  placeholder="e.g., 95/100"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments</label>
                <textarea
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  placeholder="Add feedback for the student..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGradeSubmit}
                  disabled={!gradeValue.trim()}
                  className="flex-1 px-4 py-2 rounded-xl text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  Save Grade
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- CREATE CLASS MODAL (Professor/Dean/Admin) ---
const CreateClassModal = ({ showCreateClassModal, setShowCreateClassModal, isDarkMode, user, courses, setCourses, showToastNotification }) => {
  const [classForm, setClassForm] = useState({
    subjectName: '',
    subjectCode: '',
    section: '',
    schedule: '',
    classCode: ''
  });

  const generateClassCode = () => {
    const prefix = 'PTC';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${suffix}`;
  };

  useEffect(() => {
    if (showCreateClassModal) {
      setClassForm(prev => ({ ...prev, classCode: generateClassCode() }));
    }
  }, [showCreateClassModal]);

  const handleCreateClass = () => {
    if (!classForm.subjectName || !classForm.subjectCode || !classForm.section || !classForm.schedule) {
      showToastNotification('Please fill in all fields');
      return;
    }

    const newClass = {
      id: courses.length + 1,
      code: classForm.subjectCode,
      title: classForm.subjectName,
      professor: user?.name || 'Instructor',
      professorEmail: user?.email || 'instructor@ptc.edu.ph',
      section: classForm.section,
      schedule: classForm.schedule,
      classCode: classForm.classCode,
      enrolledStudents: [],
      color: 'from-blue-600 to-indigo-600',
      description: `Welcome to ${classForm.subjectName}`,
      announcements: [],
      assignments: [],
      materials: []
    };

    setCourses([...courses, newClass]);
    showToastNotification(`Class created! Share code [${classForm.classCode}] with your students.`);
    setShowCreateClassModal(false);
    setClassForm({ subjectName: '', subjectCode: '', section: '', schedule: '', classCode: '' });
  };

  if (!showCreateClassModal) return null;

  return (
    <AnimatePresence>
      {showCreateClassModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateClassModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Create Class / Add Subject</h2>
                <button
                  onClick={() => setShowCreateClassModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Subject Name</label>
                <input
                  type="text"
                  value={classForm.subjectName}
                  onChange={(e) => setClassForm({ ...classForm, subjectName: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Data Structures and Algorithms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Subject Code</label>
                <input
                  type="text"
                  value={classForm.subjectCode}
                  onChange={(e) => setClassForm({ ...classForm, subjectCode: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., CS101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Section/Block</label>
                <input
                  type="text"
                  value={classForm.section}
                  onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., BSIT 3J"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Schedule</label>
                <input
                  type="text"
                  value={classForm.schedule}
                  onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., MWF 9:00 AM - 10:30 AM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Class Code (Auto-generated)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={classForm.classCode}
                    readOnly
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-500'} cursor-not-allowed`}
                  />
                  <button
                    onClick={() => setClassForm({ ...classForm, classCode: generateClassCode() })}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    title="Generate new code"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateClassModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClass}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Create Class
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- JOIN CLASS MODAL (Student - Google Classroom Style) ---
const JoinClassModal = ({ showJoinClassModal, setShowJoinClassModal, isDarkMode, user, userProfile, courses, studentEnrollments, setStudentEnrollments, showToastNotification }) => {
  const [classCodeInput, setClassCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinClass = () => {
    setErrorMessage('');
    
    // Clean/normalize input
    const cleanedCode = classCodeInput.trim().toUpperCase();
    
    if (!cleanedCode || cleanedCode.length < 5 || cleanedCode.length > 8) {
      setErrorMessage('Invalid class code. Please check with your professor.');
      return;
    }

    // Search for matching class code
    const targetClass = courses.find(c => c.classCode === cleanedCode);
    
    if (!targetClass) {
      setErrorMessage(`No class found with code '${classCodeInput}'. Check with your professor.`);
      return;
    }

    // Check if already enrolled
    if (studentEnrollments.some(enrollment => enrollment.classCode === cleanedCode)) {
      setErrorMessage('You are already enrolled in this class.');
      return;
    }

    // Add class to student's enrolled list
    setStudentEnrollments([...studentEnrollments, {
      classId: targetClass.id,
      classCode: targetClass.classCode,
      title: targetClass.title,
      code: targetClass.code,
      section: targetClass.section,
      professor: targetClass.professor,
      professorEmail: targetClass.professorEmail,
      color: targetClass.color,
      joinedAt: new Date().toISOString()
    }]);

    showToastNotification(`Successfully joined ${targetClass.title}!`);
    setShowJoinClassModal(false);
    setClassCodeInput('');
  };

  const isJoinDisabled = !classCodeInput || classCodeInput.length < 5 || classCodeInput.length > 8;

  if (!showJoinClassModal) return null;

  return (
    <AnimatePresence>
      {showJoinClassModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowJoinClassModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>Join class</h2>

              {/* Section 1: Current User Box */}
              <div className={`p-6 rounded-2xl mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>You're currently signed in as</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${userProfile?.avatarColor || 'from-blue-600 to-indigo-600'} text-white font-bold text-lg flex items-center justify-center`}>
                    {userProfile?.avatarInitial || userProfile?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>{userProfile?.name || 'Student'}</p>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{userProfile?.email || 'student@paterostechnologicalcollege.edu.ph'}</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                    Switch account
                  </button>
                </div>
              </div>

              {/* Section 2: Class Code Input */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Class code</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>Ask your teacher for the class code, then enter it here.</p>
                <input
                  type="text"
                  value={classCodeInput}
                  onChange={(e) => {
                    setClassCodeInput(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'} focus:outline-none transition-colors`}
                  placeholder="Class code"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
              </div>

              {/* Section 3: Instructions */}
              <div className={`p-6 rounded-2xl mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>To sign in with a class code</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Use an authorized account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Use a class code with 5-8 letters or numbers, and no spaces or symbols</span>
                  </li>
                </ul>
                <a href="#" className="text-blue-600 hover:underline text-sm mt-4 inline-block">
                  If you have trouble joining the class, go to the Help Center article
                </a>
              </div>

              {/* Section 4: Footer Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowJoinClassModal(false);
                    setClassCodeInput('');
                    setErrorMessage('');
                  }}
                  className="px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinClass}
                  disabled={isJoinDisabled}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${isJoinDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- ACADEMIC CALENDAR MODAL COMPONENT ---
const AcademicCalendarModal = ({ showCalendarModal, setShowCalendarModal, isDarkMode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const events = [
    { id: 1, date: 5, title: 'Data Structures Quiz', time: '10:00 AM', type: 'quiz', color: 'bg-blue-500', subject: 'CS101' },
    { id: 2, date: 8, title: 'Web Development Lab', time: '2:00 PM', type: 'lab', color: 'bg-green-500', subject: 'IT202' },
    { id: 3, date: 12, title: 'Project Presentation', time: '3:00 PM', type: 'presentation', color: 'bg-purple-500', subject: 'CS101' },
    { id: 4, date: 15, title: 'Midterm Exam', time: '9:00 AM', type: 'exam', color: 'bg-red-500', subject: 'MATH101' },
    { id: 5, date: 20, title: 'Assignment Due', time: '11:59 PM', type: 'assignment', color: 'bg-yellow-500', subject: 'IT202' },
    { id: 6, date: 25, title: 'Lecture: Advanced Topics', time: '1:00 PM', type: 'lecture', color: 'bg-indigo-500', subject: 'CS101' },
  ];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day) => {
    return events.filter(event => event.date === day);
  };

  if (!showCalendarModal) return null;

  return (
    <AnimatePresence>
      {showCalendarModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCalendarModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Academic Calendar</h2>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                  </button>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {monthYear}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>Quiz</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>Lab</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>Exam</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>Assignment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-semibold py-2" style={{ color: 'var(--color-secondary)' }}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day === new Date().getDate() && 
                                 currentMonth.getMonth() === new Date().getMonth() && 
                                 currentMonth.getFullYear() === new Date().getFullYear();

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: day ? 1.05 : 1 }}
                      className={`aspect-square border rounded-xl p-2 cursor-pointer transition-all ${
                        day 
                          ? `hover:border-blue-300 dark:hover:border-blue-600 ${
                              isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : ''
                            }`
                          : 'border-transparent'
                      }`}
                      style={{ 
                        backgroundColor: day ? 'var(--card-bg)' : 'transparent',
                        borderColor: day ? 'var(--border-light)' : 'transparent'
                      }}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day && (
                        <div className="h-full flex flex-col">
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-blue-600 dark:text-blue-400' : ''
                          }`} style={{ color: isToday ? '' : 'var(--color-primary)' }}>
                            {day}
                          </div>
                          <div className="flex-1 space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`h-1.5 ${event.color} rounded-full`}
                                title={`${event.subject}: ${event.title}`}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>+{dayEvents.length - 2}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>
                      Events for {selectedDate} {monthYear}
                    </h4>
                    
                    {getEventsForDay(selectedDate).length === 0 ? (
                      <p className="text-center py-4" style={{ color: 'var(--color-muted)' }}>No events scheduled</p>
                    ) : (
                      <div className="space-y-3">
                        {getEventsForDay(selectedDate).map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
                          >
                            <div className={`w-3 h-3 ${event.color} rounded-full`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ 
                                  backgroundColor: 'var(--highlight)',
                                  color: 'var(--color-primary)'
                                }}>
                                  {event.subject}
                                </span>
                                <h5 className="font-medium text-sm" style={{ color: 'var(--color-primary)' }}>{event.title}</h5>
                              </div>
                              <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- VIDEO MEETING MODAL COMPONENT (Role-Aware PTC Meet Integration) ---
const VideoMeetingModal = ({
  activeMeeting,
  setActiveMeeting,
  isEmbeddedStream,
  setIsEmbeddedStream,
  isDarkMode,
  user,
  activeMeetingUrl,
  setActiveMeetingUrl,
  selectedCourseDetail
}) => {
  const [sharedMeetUrl, setSharedMeetUrl] = useState('');
  const [showCustomMeeting, setShowCustomMeeting] = useState(false);
  const [aiPrompts, setAiPrompts] = useState({});

  useEffect(() => {
    // Load AI prompts from localStorage
    try {
      const savedPrompts = localStorage.getItem('ptc_lms_ai_prompts');
      if (savedPrompts) {
        setAiPrompts(JSON.parse(savedPrompts));
      }
    } catch (e) {}
  }, []);

  const saveAiPrompt = (toolId, prompt) => {
    try {
      const updatedPrompts = { ...aiPrompts, [toolId]: prompt };
      setAiPrompts(updatedPrompts);
      localStorage.setItem('ptc_lms_ai_prompts', JSON.stringify(updatedPrompts));
    } catch (e) {}
  };

  // Generate room name based on class code
  const classCode = selectedCourseDetail?.classCode || activeMeeting?.title?.replace(/[^a-zA-Z0-9]/g, '') || 'SP101-BSIT3J';
  const roomName = `meet_room_${classCode}`;
  const userName = user?.name || user?.username || 'User';
  const userRole = user?.role || 'student';

  // Generate persistent PTC Meet room link format
  const ptcMeetBaseUrl = process.env.REACT_APP_PTC_MEET_URL || 'https://ptc-meet.app';
  const persistentRoomLink = `${ptcMeetBaseUrl}/room/PTC-${classCode}`;

  // Load/save meeting link to localStorage (Called unconditionally at top level)
  const [savedMeetingLink, setSavedMeetingLink] = useState(() => {
    try {
      const saved = localStorage.getItem(`ptc_meet_link_${classCode}`);
      return saved || persistentRoomLink;
    } catch (e) {
      return persistentRoomLink;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`ptc_meet_link_${classCode}`, savedMeetingLink);
    } catch (e) {}
  }, [savedMeetingLink, classCode]);

  const isProfessor = user?.role === 'professor' || user?.role === 'teacher';
  const isAdmin = user?.role === 'admin' || user?.role === 'administrator';
  const isFaculty = isProfessor || isAdmin;
  const meetingTitle = isFaculty ? 'Hosting Live Classroom (Host Controls)' : 'Joined Live Class (Student Mode)';

  const handleGenerateGoogleMeet = () => {
    // Generate new persistent room link with host privileges
    const hostLink = `${persistentRoomLink}?host=true&role=host`;
    setSavedMeetingLink(hostLink);
    setActiveMeetingUrl(hostLink);
    window.open(hostLink, '_blank');
  };
  
  const handleShareLink = () => {
    if (sharedMeetUrl.trim()) {
      setActiveMeetingUrl(sharedMeetUrl.trim());
      alert('PTC Meet link shared with class successfully!');
      setSharedMeetUrl('');
    }
  };
  
  const handleJoinActiveMeet = () => {
    if (activeMeetingUrl) {
      window.open(activeMeetingUrl, '_blank');
    }
  };
  
  const handleOpenExternal = () => {
    if (activeMeeting.roomUrl) {
      window.open(activeMeeting.roomUrl, '_blank');
    }
  };
  
  const handleToggleStream = () => {
    setIsEmbeddedStream(!isEmbeddedStream);
  };
  
  const handleCloseMeeting = () => {
    setActiveMeeting({ isOpen: false, roomUrl: '', title: '', role: '' });
    setIsEmbeddedStream(true);
    setShowCustomMeeting(false);
  };
  
  const handleCopyLink = () => {
    if (activeMeeting.roomUrl) {
      navigator.clipboard.writeText(activeMeeting.roomUrl);
      alert('Meeting link copied to clipboard!');
    }
  };
  
  const handleJoinCustomMeeting = () => {
    setShowCustomMeeting(true);
  };
  
  // Generate PTC Meet room URL for embedded preview
  const room = activeMeeting.title?.replace(/[^a-zA-Z0-9]/g, '') || 'SP101-BSIT3J';
  const ptcMeetRoomUrl = `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=${room}&name=${encodeURIComponent(userName)}&role=${userRole}`;
  
  return (
    <AnimatePresence>
      {activeMeeting.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseMeeting();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-5xl mx-4 rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }}
          >
            {/* Meeting Header */}
            <div className="p-4 flex items-center justify-between border-b" style={{ backgroundColor: 'var(--gradient-electric)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Video size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{meetingTitle}</h3>
                  <p className="text-white/80 text-xs">{activeMeeting.title || 'Live Session'}</p>
                </div>
              </div>
              <button
                onClick={handleCloseMeeting}
                className="text-white hover:text-white/80 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Meeting Content */}
            <div className="p-4">
              {/* Professor PTC Meet Generation Controls */}
              {isProfessor && (
                <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9' }}>
                  <h4 className="font-bold mb-3 text-sm" style={{ color: 'var(--color-primary)' }}>PTC Meet Host Controls</h4>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <button
                      onClick={handleGenerateGoogleMeet}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'var(--gradient-electric)' }}
                    >
                      <Video size={16} />
                      Generate & Open PTC Meet (As Host)
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Paste PTC Meet URL (e.g., ${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=SP101)`}
                      value={sharedMeetUrl}
                      onChange={(e) => setSharedMeetUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
                      style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', borderColor: 'var(--border-light)' }}
                    />
                    <button
                      onClick={handleShareLink}
                      disabled={!sharedMeetUrl.trim()}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'var(--gradient-electric)' }}
                    >
                      Share Link with Class
                    </button>
                  </div>
                  {activeMeetingUrl && (
                    <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                      <p className="text-xs font-medium" style={{ color: '#22c55e' }}>✓ Active meeting link shared: {activeMeetingUrl}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Student PTC Meet Join Controls */}
              {!isProfessor && activeMeetingUrl && (
                <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <h4 className="font-bold mb-3 text-sm" style={{ color: 'var(--color-primary)' }}>Active PTC Meet Class</h4>
                  <button
                    onClick={handleJoinActiveMeet}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                  >
                    <Video size={16} />
                    Join Active PTC Meet Class
                  </button>
                  <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-muted)' }}>
                    Professor has shared: {activeMeetingUrl}
                  </p>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={handleJoinCustomMeeting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                  <Video size={16} />
                  Join In-App Video Meeting
                </button>
                <button
                  onClick={handleOpenExternal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'var(--gradient-electric)' }}
                >
                  <ExternalLink size={16} />
                  Open Course Meet Link (External Tab)
                </button>
                <button
                  onClick={handleToggleStream}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${isEmbeddedStream ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
                >
                  {isEmbeddedStream ? <Monitor size={16} /> : <MonitorOff size={16} />}
                  {isEmbeddedStream ? 'Toggle In-App Stream (Embedded PTC Meet)' : 'Toggle In-App Stream (Embedded PTC Meet)'}
                </button>
              </div>

              {/* Embedded Stream / External Placeholder */}
              {isEmbeddedStream ? (
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden border-2" style={{ borderColor: 'var(--border-light)' }}>
                  <iframe
                    src={ptcMeetRoomUrl}
                    allow="camera; microphone; display-capture; autoplay; clipboard-write"
                    className="w-full h-full"
                    style={{ backgroundColor: '#000' }}
                    title="PTC Meet Video Integration"
                  />
                </div>
              ) : (
                <div className="w-full h-[400px] rounded-xl flex items-center justify-center border-2" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', borderColor: 'var(--border-light)' }}>
                  <div className="text-center">
                    <ExternalLink size={48} className="mx-auto mb-4" style={{ color: 'var(--color-muted)' }} />
                    <p className="font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Meeting opened in external tab</p>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Use the buttons above to join PTC Meet or enable embedded PTC Meet preview</p>
                  </div>
                </div>
              )}

              {/* Role-Specific Controls */}
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9' }}>
                <h4 className="font-bold mb-3 text-sm" style={{ color: 'var(--color-primary)' }}>
                  {isProfessor ? 'Host Controls' : 'Student Controls'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {isProfessor ? (
                    <>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-sm font-medium">
                        <PhoneOff size={16} />
                        End Meeting for All
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-all text-sm font-medium">
                        <MicOff size={16} />
                        Mute All Participants
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all text-sm font-medium">
                        <Monitor size={16} />
                        Share Screen
                      </button>
                      <button 
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all text-sm font-medium"
                      >
                        <Copy size={16} />
                        Copy Meeting Link
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all text-sm font-medium">
                        <Hand size={16} />
                        Raise Hand
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all text-sm font-medium">
                        <Mic size={16} />
                        Toggle Microphone
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-all text-sm font-medium">
                        <Video size={16} />
                        Toggle Video
                      </button>
                      <button 
                        onClick={handleCloseMeeting}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-sm font-medium"
                      >
                        <LogOut size={16} />
                        Leave Meeting
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Custom Video Meeting Component */}
      <AnimatePresence>
        {showCustomMeeting && (
          <VideoMeeting
            roomName={roomName}
            userName={userName}
            userRole={userRole}
            onClose={() => setShowCustomMeeting(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

// --- PROFESSOR COURSES DATA (Global for Sidebar access) ---
const professorCourses = [
  { id: 1, code: 'SP 101', title: 'SOCIAL ISSUES AND PROFESSIONAL PRACTICES', section: 'BSIT 3-A', year: '3rd Year', students: 45, color: 'bg-[#2d1b33] text-white', textColor: '#ffffff', professor: 'Cynthia B. Dulagan', progress: 65, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=SP101-BSIT3A`, room: 'RM 401', sched: 'Tue/Thu 1:00-2:30PM', announcement: 'I have already recorded your midterm grades and attendance.' },
  { id: 2, code: 'CAPSTONE 1', title: 'CAPSTONE 1', section: 'BSIT 3-A', year: '3rd Year', students: 38, color: 'bg-[#1e1b4b] text-white', textColor: '#ffffff', professor: 'Sheryl Ann Ricafort', progress: 45, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=CAPSTONE1-BSIT3A`, room: 'Lab 302', sched: 'Mon/Wed 8:00-10:00AM', announcement: 'Please submit your Chapter 2 drafts by Saturday.' },
  { id: 3, code: 'SIA 101', title: 'SYSTEM INTEGRATION AND ARCHITECTURE', section: 'BSIT 3-A', year: '3rd Year', students: 42, color: 'bg-[#2d1b33] text-white', textColor: '#ffffff', professor: 'Toni D. Granado', progress: 30, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=SIA101-BSIT3A`, room: 'Lab 305', sched: 'Fri 9:00-12:00PM', announcement: 'Prepare for the hands-on lab next week.' },
  { id: 4, code: 'TECH 32', title: 'TECHNOPRENEURSHIP', section: 'BSIT 3-A', year: '3rd Year', students: 35, color: 'bg-[#064e3b] text-white', textColor: '#ffffff', professor: 'Katherine C. Baggay', progress: 85, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=TECH32-BSIT3A`, room: 'RM 202', sched: 'Mon 1:00-4:00PM', announcement: 'Pitch deck presentations start on Monday.' },
  { id: 5, code: 'MRC 22', title: 'METHODS OF RESEARCH IN COMPUTING', section: 'BSIT 3-A', year: '3rd Year', students: 40, color: 'bg-[#4c1d95] text-white', textColor: '#ffffff', professor: 'Toni D. Granado', progress: 10, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=MRC22-BSIT3A`, room: 'RM 405', sched: 'Wed 2:00-5:00PM', announcement: 'Finalize your research titles for approval.' },
  { id: 6, code: 'WS 102', title: 'WEB PROGRAMMING', section: 'BSIT 3-A', year: '3rd Year', students: 38, color: 'bg-[#1e293b] text-white', textColor: '#ffffff', professor: 'Roclyn Yamson', progress: 60, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=WS102-BSIT3A`, room: 'Lab 301', sched: 'Tue 8:00-11:00AM', announcement: "Don't forget to push your React projects to GitHub." },
  { id: 7, code: 'ED 101', title: 'EMBEDDED SYSTEMS/ROBOTICS', section: 'BSIT 3-A', year: '3rd Year', students: 36, color: 'bg-[#134e4a] text-white', textColor: '#ffffff', professor: 'Edmar Tan', progress: 50, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=ED101-BSIT3A`, room: 'Lab 402', sched: 'Thu 9:00-12:00PM', announcement: 'Bring your Arduino kits on our face-to-face class.' },
  { id: 8, code: 'NET 102', title: 'NETWORK ADMINISTRATION AND MAINTENANCE', section: 'BSIT 3-A', year: '3rd Year', students: 42, color: 'bg-[#2d1b33] text-white', textColor: '#ffffff', professor: 'Harvey Rey B. Del Rosario', progress: 20, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=NET102-BSIT3A`, room: 'Lab 306', sched: 'Sat 8:00-11:00AM', announcement: 'Server configuration quiz is scheduled for Tuesday.' }
];

// --- SIDEBAR COMPONENT (moved outside App to prevent remount) ---
const Sidebar = ({
  t,
  courses,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isSidebarOpen,
  toggleSidebar,
  activeNav,
  setActiveNav,
  isDarkMode,
  activeItem,
  handleSubjectSelect,
  handleLogout,
  user,
  userProfile
}) => {
  const isProfessor = user?.role === 'professor';
  const isAdmin = user?.role === 'admin';
  const isDean = user?.role === 'dean';
  const isFaculty = isProfessor || isAdmin || isDean;
  const isStudent = user?.role === 'student';
  const canAccessAI = isFaculty; // AI Assistance is for FACULTY only (professor, admin, dean)

  // Build role-specific navigation items (DFD Diagram 0 strict separation)
  let navigationItems = [
    { id: 'Home', name: t.home, icon: Home },
    { id: 'Calendar', name: t.calendar, icon: Calendar },
  ];

  // Faculty-only items
  if (isFaculty) {
    navigationItems.push(
      { id: 'Gemini', name: t.gemini, icon: Sparkles }
    );
  }

  // Student-only items
  if (isStudent) {
    navigationItems.push(
      { id: 'Tasks', name: t.todo, icon: CheckSquare }
    );
  }

  // Dean-only items: Faculty Management, Student Management, Verification, Task Monitoring, Reports
  if (isDean) {
    navigationItems.push(
      { id: 'FacultyManagement', name: 'Faculty Management', icon: Users },
      { id: 'StudentManagement', name: 'Student Management', icon: GraduationCap },
      { id: 'Verifications', name: 'Verification', icon: CheckCircle },
      { id: 'TaskMonitoring', name: 'Task Monitoring', icon: ClipboardList },
      { id: 'Reports', name: 'Reports', icon: TrendingUp }
    );
  }

  // Admin-only items: Admin Management, Dean Management, Faculty Management, Student Management, Verification, Activity Logs, Settings
  if (isAdmin) {
    navigationItems.push(
      { id: 'AdminManagement', name: 'Admin Management', icon: Shield },
      { id: 'DeanManagement', name: 'Dean Management', icon: Award },
      { id: 'FacultyManagement', name: 'Faculty Management', icon: Users },
      { id: 'StudentManagement', name: 'Student Management', icon: GraduationCap },
      { id: 'Verifications', name: 'Verification', icon: CheckCircle },
      { id: 'ActivityLogs', name: 'Activity Logs', icon: Activity },
      { id: 'Settings', name: 'Settings', icon: Settings }
    );
  }

  // Professor-only items: Student Management, Verification, Tasks
  if (isProfessor) {
    navigationItems.push(
      { id: 'StudentManagement', name: 'Student Management', icon: GraduationCap },
      { id: 'Verifications', name: 'Verification', icon: CheckCircle },
      { id: 'Tasks', name: t.todo, icon: CheckSquare }
    );
  }

  // Separate courses to list them under "Enrolled" or "Teaching Load"
  const activeEnrolledCourses = (isProfessor || isDean) ? professorCourses : courses;

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: isMobileSidebarOpen || isSidebarOpen ? 0 : '-100%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`h-full z-50 overflow-hidden flex-shrink-0 fixed inset-y-0 left-0 lg:relative lg:translate-x-0 w-72 bg-white dark:bg-[#0f172a] backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 ${!isMobileSidebarOpen && !isSidebarOpen ? 'lg:hidden' : ''}`}
      >
        <div className="flex flex-col h-full min-w-[288px] p-6">
          {/* PTC Logo and Branding */}
          <div className="mb-4 flex flex-col items-center">
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="w-14 h-14 object-contain mb-2" />
            <h1 className={`font-bold uppercase tracking-wide text-xs text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
              PATEROS TECHNOLOGICAL COLLEGE
            </h1>
          </div>

          {/* Current Logged-In Account Info Section */}
          <UserAccountInfo
            user={user}
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onProfileClick={() => {
              setActiveNav('Profile');
              setIsMobileSidebarOpen(false);
            }}
          />

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
                    setIsMobileSidebarOpen(false);
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
                        setIsMobileSidebarOpen(false);
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
      </motion.aside>
    </>
  );
};

// --- FLOATING CHAT COMPONENT (moved outside App to prevent remount) ---
const FloatingChat = ({ 
  isAiChatOpen, 
  setIsAiChatOpen, 
  aiMessage, 
  setAiMessage, 
  isAiLoading, 
  aiResponse, 
  systemCommandNotification, 
  sendAiMessage, 
  getUnreadCount,
  isDarkMode,
  user,
  setAiResponse,
  setSystemCommandNotification
}) => {
  // Render ONLY if user is faculty (professor, admin, dean)
  const isProfessor = user?.role === 'professor';
  const isAdmin = user?.role === 'admin';
  const isDean = user?.role === 'dean';
  const isFaculty = isProfessor || isAdmin || isDean;

  if (!isFaculty) return null; // Completely hidden for Student accounts

  const quickPrompts = isProfessor ? [
    { text: "Generate Quiz Outline", icon: "📝" },
    { text: "Optimize Capstone Code Structure", icon: "⚡" },
    { text: "Explain System Integration Patterns", icon: "🔗" },
    { text: "Review Assignment Requirements", icon: "✅" }
  ] : isAdmin || isDean ? [
    { text: "Generate Activity Report", icon: "📊" },
    { text: "Review Teacher Performance", icon: "👥" },
    { text: "System Status Overview", icon: "🔍" },
    { text: "Faculty Management Tasks", icon: "📋" }
  ] : [
    { text: "Generate Quiz Outline", icon: "📝" },
    { text: "Optimize Capstone Code Structure", icon: "⚡" },
    { text: "Explain System Integration Patterns", icon: "🔗" },
    { text: "Review Assignment Requirements", icon: "✅" }
  ];

  const handleQuickPrompt = (prompt) => {
    setAiMessage(prompt);
    setTimeout(() => sendAiMessage(), 100);
  };

  const handleClearChat = () => {
    setAiResponse('');
    setSystemCommandNotification('');
    setAiMessage('');
  };

  return (
  <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
    <AnimatePresence>
      {isAiChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="mb-4 w-[calc(100vw-2rem)] sm:w-96 h-[85vh] sm:h-[550px] rounded-t-2xl sm:rounded-2xl shadow-2xl border overflow-hidden bg-white dark:bg-[#0f172a] border-gray-200 dark:border-slate-800 flex flex-col text-slate-900 dark:text-white fixed bottom-0 left-0 sm:static sm:bottom-auto sm:left-auto"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-family)' }}>AI Assistant</h3>
                  <p className="text-xs text-white/80">{isProfessor || isDean ? 'Academic & Institutional Support' : 'Student Support'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleClearChat}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setIsAiChatOpen(false)} className="text-white/80 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <div className="max-w-[80%] bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <p className="text-slate-900 dark:text-white font-medium text-sm leading-relaxed" style={{ fontFamily: 'var(--font-family)' }}>
                    {isProfessor || isDean
                      ? "Hey! 👋 I'm your AI faculty assistant. How can I help with your teaching tasks today?"
                      : "Hey! 👋 I'm your AI student assistant. How can I help with your studies today?"}
                  </p>
                </div>
              </div>
              
              {systemCommandNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div className="max-w-[80%] bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-3 shadow-sm border border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family)' }}>{systemCommandNotification}</p>
                  </div>
                </motion.div>
              )}
              
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div className="max-w-[80%] bg-[#1e293b] text-white border border-slate-700/60 rounded-2xl p-3 shadow-md">
                    <p className="text-sm" style={{ fontFamily: 'var(--font-family)' }}>{aiResponse}</p>
                  </div>
                </motion.div>
              )}
              
              {isAiLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div className="max-w-[80%] bg-[#1e293b] text-white border border-slate-700/60 rounded-2xl p-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Quick Prompts */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/60 text-slate-600 dark:text-slate-300">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="bg-slate-100 dark:bg-[#0f172a] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                >
                  {prompt.icon} {prompt.text}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center gap-2">
            <div className="flex gap-2 w-full">
              <input
                key="global-ai-assistance-input-field"
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-100 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                style={{ fontFamily: 'var(--font-family)' }}
                onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
              />
              <button
                onClick={sendAiMessage}
                disabled={isAiLoading || !aiMessage.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-50 hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Floating Button with Pulsing Indicator */}
    <motion.button
      onClick={() => setIsAiChatOpen(!isAiChatOpen)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all relative"
    >
      <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-75"></div>
      <MessageSquare size={24} className="relative z-10" />
      {getUnreadCount() > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold z-20">
          {getUnreadCount()}
        </div>
      )}
    </motion.button>
  </div>
  );
};

// --- INVITE STUDENTS MODAL COMPONENT ---
const InviteStudentsModal = ({
  showInviteModal,
  setShowInviteModal,
  selectedCourseDetail,
  user,
  invitations,
  setInvitations,
  selectedStudentsForInvite,
  setSelectedStudentsForInvite,
  studentSearchQuery,
  setStudentSearchQuery
}) => {
  // Mock student database (in production, this would come from backend API)
  const allStudents = [
    { id: 1, name: 'John Doe', email: 'john.doe@ptc.edu.ph', studentId: 'STU-2026-001' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@ptc.edu.ph', studentId: 'STU-2026-002' },
    { id: 3, name: 'Michael Johnson', email: 'michael.j@ptc.edu.ph', studentId: 'STU-2026-003' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@ptc.edu.ph', studentId: 'STU-2026-004' },
    { id: 5, name: 'Robert Wilson', email: 'robert.w@ptc.edu.ph', studentId: 'STU-2026-005' },
  ];

  // Email input state
  const [emailInput, setEmailInput] = useState('');
  const [emailTags, setEmailTags] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [googleClassroomCode, setGoogleClassroomCode] = useState('');
  const [googleClassroomLink, setGoogleClassroomLink] = useState('');

  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    // Must end with @gmail.com or @ptc.edu.ph
    const lowerEmail = email.toLowerCase();
    return lowerEmail.endsWith('@gmail.com') || lowerEmail.endsWith('@ptc.edu.ph');
  };

  const handleAddEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (!validateEmail(trimmedEmail)) {
      setEmailError('Email must be a valid @gmail.com or @ptc.edu.ph address');
      return;
    }

    if (emailTags.includes(trimmedEmail)) {
      setEmailError('Email already added');
      return;
    }

    setEmailTags([...emailTags, trimmedEmail]);
    setEmailInput('');
    setEmailError('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmailTags(emailTags.filter(email => email !== emailToRemove));
  };

  const handleEmailInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddEmail(emailInput);
    }
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudentsForInvite(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendInvitations = () => {
    // Validate email tags
    if (emailTags.length === 0 && selectedStudentsForInvite.length === 0) {
      alert('Please add at least one email or select a student to invite.');
      return;
    }

    // Generate Google Classroom code if not provided
    const generatedClassCode = googleClassroomCode || `GC-${selectedCourseDetail?.code}-${Date.now().toString(36).toUpperCase()}`;
    const generatedClassLink = googleClassroomLink || `https://classroom.google.com/c/${generatedClassCode}`;

    const newInvitations = [];

    // Add invitations from email tags
    emailTags.forEach(email => {
      newInvitations.push({
        id: Date.now() + Math.random(),
        subjectId: selectedCourseDetail.id,
        subjectName: selectedCourseDetail.title,
        subjectCode: selectedCourseDetail.code,
        studentId: null,
        studentName: email.split('@')[0],
        studentEmail: email,
        invitedBy: user?.name || 'Instructor',
        invitedByRole: user?.role || 'professor',
        googleClassroomCode: generatedClassCode,
        googleClassroomLink: generatedClassLink,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    });

    // Add invitations from selected students
    selectedStudentsForInvite.forEach(studentId => {
      const student = allStudents.find(s => s.id === studentId);
      newInvitations.push({
        id: Date.now() + Math.random(),
        subjectId: selectedCourseDetail.id,
        subjectName: selectedCourseDetail.title,
        subjectCode: selectedCourseDetail.code,
        studentId: studentId,
        studentName: student.name,
        studentEmail: student.email,
        invitedBy: user?.name || 'Instructor',
        invitedByRole: user?.role || 'professor',
        googleClassroomCode: generatedClassCode,
        googleClassroomLink: generatedClassLink,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    });

    setInvitations(prev => [...prev, ...newInvitations]);
    setSelectedStudentsForInvite([]);
    setStudentSearchQuery('');
    setEmailTags([]);
    setEmailInput('');
    setGoogleClassroomCode('');
    setGoogleClassroomLink('');
    setShowInviteModal(false);

    // Show success notification
    alert(`Successfully sent ${newInvitations.length} invitation(s)!`);
  };

  if (!showInviteModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden bg-white text-slate-900 border border-slate-200 dark:bg-[#0f172a] dark:text-white dark:border-slate-800 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">Invite Students</h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 truncate">
                Invite students to join {selectedCourseDetail?.code} - {selectedCourseDetail?.title}
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-all flex-shrink-0 ml-2"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Email Input Section */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
            <Mail className="w-4 h-4 inline mr-1" />
            Institutional Email Invites (@gmail.com / @ptc.edu.ph)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type email and press Enter or comma to add..."
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setEmailError('');
              }}
              onKeyDown={handleEmailInputKeyDown}
              className="w-full px-4 py-3 rounded-xl border transition-all outline-none bg-slate-50 border-slate-300 text-slate-900 dark:bg-[#1e293b] dark:border-slate-700 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          {emailError && (
            <p className="text-xs text-red-500 mt-2">{emailError}</p>
          )}
          {/* Email Tags */}
          {emailTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {emailTags.map((email, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-300 dark:border-blue-700"
                >
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Classroom Section */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
            <ExternalLink className="w-4 h-4 inline mr-1" />
            Google Classroom Integration (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Class Code (optional)"
                value={googleClassroomCode}
                onChange={(e) => setGoogleClassroomCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border transition-all outline-none bg-slate-50 border-slate-300 text-slate-900 dark:bg-[#1e293b] dark:border-slate-700 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Class Link (optional)"
                value={googleClassroomLink}
                onChange={(e) => setGoogleClassroomLink(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border transition-all outline-none bg-slate-50 border-slate-300 text-slate-900 dark:bg-[#1e293b] dark:border-slate-700 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Leave blank to auto-generate Google Classroom code and link
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800"></div>

        {/* Search Box for Existing Students */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
            <Search className="w-4 h-4 inline mr-1" />
            Or Search from Existing Students
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search students by name, email, or ID..."
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:bg-[#1e293b] dark:border-slate-700 dark:text-white dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto min-h-0">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No students found matching your search.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStudentsForInvite.includes(student.id)
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100 dark:bg-[#1e293b] dark:border-slate-800 dark:text-white dark:hover:bg-slate-800/80'
                  }`}
                  onClick={() => handleToggleStudent(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedStudentsForInvite.includes(student.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-slate-400 dark:border-slate-500'
                    }`}>
                      {selectedStudentsForInvite.includes(student.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.studentId}</p>
                    </div>
                  </div>
                  <UserPlus size={18} className="text-slate-400 dark:text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-[#1e293b] flex-shrink-0">
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {emailTags.length} email(s) + {selectedStudentsForInvite.length} student(s) selected
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowInviteModal(false)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-medium transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSendInvitations}
              disabled={emailTags.length === 0 && selectedStudentsForInvite.length === 0}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 text-sm"
            >
              Send Invitations
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  // In-memory seed accounts for direct authentication
  const seedAccounts = [
    { username: 'student', email: 'student@paterostechnologicalcollege.edu.ph', password: 'student', role: 'student', name: 'Student User', route: '/student-dashboard' },
    { username: 'prof', email: 'prof@paterostechnologicalcollege.edu.ph', password: 'prof', role: 'teacher', name: 'Professor User', route: '/teacher-dashboard' },
    { username: 'dean', email: 'dean@paterostechnologicalcollege.edu.ph', password: 'dean', role: 'dean', name: 'Dean User', route: '/dean-dashboard' },
    { username: 'admin', email: 'admin@paterostechnologicalcollege.edu.ph', password: 'admin', role: 'admin', name: 'System Admin', route: '/admin-dashboard' }
  ];

  // Load users from localStorage or use seed accounts
  const loadUsersFromStorage = () => {
    try {
      const stored = localStorage.getItem('ptc_lms_users');
      if (stored) {
        return JSON.parse(stored);
      }
      return [...seedAccounts];
    } catch (error) {
      return [...seedAccounts];
    }
  };

  // In-memory user list (starts with seed accounts or localStorage)
  const [inMemoryUsers, setInMemoryUsers] = useState(loadUsersFromStorage());

  // Persist users to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ptc_lms_users', JSON.stringify(inMemoryUsers));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }, [inMemoryUsers]);

  // Load session from localStorage
  const loadSessionFromStorage = () => {
    try {
      const storedSession = localStorage.getItem('ptc_lms_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        return {
          isLoggedIn: session.isLoggedIn || false,
          user: session.user || null,
          currentUser: session.currentUser || ""
        };
      }
      return {
        isLoggedIn: false,
        user: null,
        currentUser: ""
      };
    } catch (error) {
      return {
        isLoggedIn: false,
        user: null,
        currentUser: ""
      };
    }
  };

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadSessionFromStorage().isLoggedIn);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(() => loadSessionFromStorage().currentUser);
  const [user, setUser] = useState(() => loadSessionFromStorage().user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

  // Persist session to localStorage whenever it changes
  useEffect(() => {
    try {
      const session = {
        isLoggedIn,
        user,
        currentUser
      };
      localStorage.setItem('ptc_lms_session', JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session to localStorage:', error);
    }
  }, [isLoggedIn, user, currentUser]);

  // Role-based default profiles
  const getDefaultProfile = (role) => {
    const defaults = {
      student: {
        name: "Student User",
        role: "Student",
        department: "Pateros Technological College",
        email: "student@ptc.edu.ph",
        avatarColor: "from-blue-500 to-indigo-600",
        avatarInitial: "S",
        customAvatarUrl: null,
        imageZoom: 1,
        imageOffset: { x: 0, y: 0 }
      },
      professor: {
        name: "Professor User",
        role: "Instructor / Faculty Member",
        department: "IT Department",
        email: "professor@ptc.edu.ph",
        avatarColor: "from-emerald-500 to-teal-600",
        avatarInitial: "P",
        customAvatarUrl: null,
        imageZoom: 1,
        imageOffset: { x: 0, y: 0 }
      },
      dean: {
        name: "Dean User",
        role: "College Dean",
        department: "Academic Affairs",
        email: "dean@ptc.edu.ph",
        avatarColor: "from-amber-500 to-orange-600",
        avatarInitial: "D",
        customAvatarUrl: null,
        imageZoom: 1,
        imageOffset: { x: 0, y: 0 }
      },
      admin: {
        name: "Admin User",
        role: "System Administrator",
        department: "IT Department",
        email: "admin@ptc.edu.ph",
        avatarColor: "from-violet-500 to-purple-600",
        avatarInitial: "A",
        customAvatarUrl: null,
        imageZoom: 1,
        imageOffset: { x: 0, y: 0 }
      }
    };
    return defaults[role] || defaults.student;
  };

  // Load profile from localStorage or use role-based default
  const loadProfileFromStorage = () => {
    try {
      const role = user?.role || 'student';
      const stored = localStorage.getItem(`ptc_lms_profile_${role}`);
      if (stored) {
        return JSON.parse(stored);
      }
      return getDefaultProfile(role);
    } catch (error) {
      return getDefaultProfile(user?.role || 'student');
    }
  };

  // User Profile State with localStorage persistence
  const [userProfile, setUserProfile] = useState(loadProfileFromStorage());

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      const role = user?.role || 'student';
      localStorage.setItem(`ptc_lms_profile_${role}`, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Failed to save profile to localStorage:', error);
    }
  }, [userProfile, user?.role]);
  
  // Profile Modal States
  const [showChangeAvatarModal, setShowChangeAvatarModal] = useState(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);
  
  // Avatar Color Presets
  const colorPresets = [
    { id: 'blue', name: 'Royal Blue', class: 'bg-gradient-to-tr from-blue-600 to-indigo-600' },
    { id: 'purple', name: 'Deep Purple', class: 'bg-gradient-to-tr from-purple-600 to-pink-600' },
    { id: 'emerald', name: 'Emerald Green', class: 'bg-gradient-to-tr from-emerald-500 to-teal-700' },
    { id: 'rose', name: 'Rose Red', class: 'bg-gradient-to-tr from-rose-500 to-red-600' },
    { id: 'amber', name: 'Warm Amber', class: 'bg-gradient-to-tr from-amber-500 to-orange-600' },
    { id: 'dark', name: 'Midnight Dark', class: 'bg-gradient-to-tr from-slate-700 to-slate-900' }
  ];
  
  // Image Adjustment States
  const [imageZoom, setImageZoom] = useState(userProfile?.imageZoom || 1);
  const [imageOffset, setImageOffset] = useState(userProfile?.imageOffset || { x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Registration State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  
  // Validation State
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Email Validation - accepts all valid email domains
  const validateEmail = (email) => {
    if (!email) {
      setEmailValid(false);
      return false;
    }
    
    // Standard email validation - accepts any valid email domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    const isValid = emailRegex.test(email);
    
    setEmailValid(isValid);
    return isValid;
  };
  
  // Password Requirements Checker
  const checkPasswordRequirements = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordRequirements(requirements);
    return requirements;
  };
  
  // Navigation State
  const [activeNav, setActiveNav] = useState('Home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  // Handle window resize to reset mobile sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation Guard: Prevent cross-role access (DFD Diagram 0 strict separation)
  const validateRoleAccess = (navItem, userRole) => {
    const isStudent = userRole === 'student';
    const isProfessor = userRole === 'professor';
    const isAdmin = userRole === 'admin';
    const isDean = userRole === 'dean';
    const isFaculty = isProfessor || isAdmin || isDean;

    // Faculty-only navigation items
    const facultyOnlyItems = ['Gemini']; // AI Assistant is for faculty only

    // Dean-only navigation items (DFD Diagram 0)
    const deanOnlyItems = ['TaskMonitoring', 'Reports'];

    // Admin-only navigation items (DFD Diagram 0)
    const adminOnlyItems = ['UserManagement', 'ActivityLogs', 'Settings', 'Verifications'];

    // Professor-only navigation items (DFD Diagram 0)
    const professorOnlyItems = []; // Currently no professor-specific nav items beyond faculty

    // If student tries to access faculty-only items, block and redirect
    if (isStudent && (facultyOnlyItems.includes(navItem) || deanOnlyItems.includes(navItem) || adminOnlyItems.includes(navItem) || professorOnlyItems.includes(navItem))) {
      console.warn('Access denied: Students cannot access faculty features');
      return false;
    }

    // If dean tries to access admin or professor-only items, block and redirect
    if (isDean && (adminOnlyItems.includes(navItem) || professorOnlyItems.includes(navItem))) {
      console.warn('Access denied: Dean cannot access admin or professor-only features');
      return false;
    }

    // If admin tries to access dean or professor-only items, block and redirect
    if (isAdmin && (deanOnlyItems.includes(navItem) || professorOnlyItems.includes(navItem))) {
      console.warn('Access denied: Admin cannot access dean or professor-only features');
      return false;
    }

    // If professor tries to access dean or admin-only items, block and redirect
    if (isProfessor && (deanOnlyItems.includes(navItem) || adminOnlyItems.includes(navItem))) {
      console.warn('Access denied: Professor cannot access dean or admin-only features');
      return false;
    }

    // If faculty tries to access student-only items, block and redirect
    const studentOnlyItems = ['Tasks']; // Students have task management
    if (isFaculty && studentOnlyItems.includes(navItem)) {
      console.warn('Access denied: Faculty cannot access student-only features');
      return false;
    }

    return true;
  };
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  // UI State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [classroomTab, setClassroomTab] = useState('Stream');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isProfChatOpen, setIsProfChatOpen] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [systemCommandNotification, setSystemCommandNotification] = useState('');
  const [typedMessage, setTypedMessage] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  
  // Attendance State
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  
  // Badges State
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [badges, setBadges] = useState([
    { id: 1, name: '100% Punctual', icon: '⏰', description: 'Attend 5 classes on time', progress: 3, required: 5, earned: false },
    { id: 2, name: 'Early Bird Submitter', icon: '🐦', description: 'Submit 3 assignments early', progress: 2, required: 3, earned: false },
    { id: 3, name: 'Meet Pioneer', icon: '📷', description: 'Join 10 PTC Meet sessions', progress: 1, required: 10, earned: false },
    { id: 4, name: 'Perfect Attendance', icon: '🏆', description: 'Never miss a class for a month', progress: 15, required: 20, earned: false },
    { id: 5, name: 'Quiz Master', icon: '📝', description: 'Score 90%+ on 5 quizzes', progress: 2, required: 5, earned: false },
    { id: 6, name: 'Team Player', icon: '🤝', description: 'Participate in 5 group activities', progress: 3, required: 5, earned: false },
  ]);
  const [claimedBadges, setClaimedBadges] = useState([]);
  
  // Active Meeting State for Role-Aware PTC Meet Integration
  const [activeMeeting, setActiveMeeting] = useState({ isOpen: false, roomUrl: '', title: '', role: '' });
  const [isEmbeddedStream, setIsEmbeddedStream] = useState(true);
  const [activeMeetingUrl, setActiveMeetingUrl] = useState(''); // Global shared PTC Meet URL from professor
  
  // Assignment & Grading Modal States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedTaskForGrading, setSelectedTaskForGrading] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [gradeComment, setGradeComment] = useState("");
  
  // Invitation System States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [selectedStudentsForInvite, setSelectedStudentsForInvite] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [gradedTasks, setGradedTasks] = useState([]);
  
  // --- LOCAL STORAGE PERSISTENCE FOR SUBMISSIONS & GRADES ---
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('ptc_submissions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('ptc_grades');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ptc_submissions', JSON.stringify(submissions));
  }, [submissions]);
  
  // Save grades to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ptc_grades', JSON.stringify(grades));
  }, [grades]);
  
  // --- FACULTY CLASSWORK FILTER STATE ---
  const [submissionFilter, setSubmissionFilter] = useState('all'); // 'all', 'turnedIn', 'missing', 'graded'
  const [selectedStudentSubmission, setSelectedStudentSubmission] = useState(null);
  const [showFacultyGradingModal, setShowFacultyGradingModal] = useState(false);
  const [facultyGradingScore, setFacultyGradingScore] = useState('');
  const [facultyGradingFeedback, setFacultyGradingFeedback] = useState('');
  
  // --- FACULTY CREATE CLASSWORK/ANNOUNCEMENT MODAL STATE ---
  const [showCreateClassworkModal, setShowCreateClassworkModal] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
  const [newAssignmentPoints, setNewAssignmentPoints] = useState('100');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  
  // --- SUBMISSION & GRADE MANAGEMENT HELPERS ---
  const handleStudentSubmit = (assignmentId, studentName, studentId, files) => {
    const newSubmission = {
      id: `${assignmentId}-${studentId}-${Date.now()}`,
      assignmentId,
      studentName,
      studentId,
      files,
      status: 'Turned In',
      submittedAt: new Date().toISOString(),
      grade: null,
      feedback: null
    };
    setSubmissions([...submissions, newSubmission]);
    
    // Update assignment status for student
    setAssignments(assignments.map(a => 
      a.id === assignmentId 
        ? { ...a, status: 'Turned In', turnedInDate: new Date().toLocaleString(), submittedFiles: files }
        : a
    ));
  };
  
  const handleReturnWork = (submissionId, score, feedback) => {
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'Graded', grade: score, feedback, returnedAt: new Date().toISOString() }
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    // Save to grades storage
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      const gradeKey = `${submission.assignmentId}-${submission.studentId}`;
      setGrades(prev => ({
        ...prev,
        [gradeKey]: {
          score,
          feedback,
          returnedAt: new Date().toISOString()
        }
      }));
      
      // Update assignment status for student
      setAssignments(assignments.map(a => 
        a.id === submission.assignmentId 
          ? { ...a, status: 'Graded', grade: score, privateComments: feedback ? [...(a.privateComments || []), { text: feedback, author: 'Instructor', timestamp: new Date().toLocaleString() }] : a.privateComments }
          : a
      ));
    }
    
    // Show toast notification
    setToastMessage(`Work returned to ${submission.studentName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions.filter(sub => sub.assignmentId === assignmentId);
  };
  
  const getSubmissionCounts = (assignmentId) => {
    const assignmentSubmissions = getSubmissionsForAssignment(assignmentId);
    return {
      turnedIn: assignmentSubmissions.filter(s => s.status === 'Turned In').length,
      graded: assignmentSubmissions.filter(s => s.status === 'Graded').length,
      assigned: 5 - assignmentSubmissions.length // Assuming 5 students per class for demo
    };
  };
  
  const handleCreateClasswork = () => {
    if (!newAssignmentTitle.trim()) return;

    if (isAnnouncement) {
      // Create announcement
      const newAnnouncement = {
        id: Date.now(),
        title: newAssignmentTitle,
        content: newAssignmentDescription,
        professor: `Posted by ${user?.name || 'Instructor'}`,
        postedAt: new Date().toISOString(),
        classCode: selectedCourseDetail?.classCode || activeSubject?.code || 'General',
        priority: 'high'
      };

      // Save to localStorage
      try {
        const savedAnnouncements = localStorage.getItem('ptc_lms_announcements');
        const announcements = savedAnnouncements ? JSON.parse(savedAnnouncements) : [];
        announcements.push(newAnnouncement);
        localStorage.setItem('ptc_lms_announcements', JSON.stringify(announcements));
      } catch (e) {}

      setToastMessage('Announcement published!');
    } else {
      // Create assignment
      const newAssignment = {
        id: Date.now(),
        title: newAssignmentTitle,
        description: newAssignmentDescription,
        professor: `Posted by ${activeSubject?.instructorName || user?.name || 'Instructor'}`,
        dueDate: newAssignmentDueDate || 'No due date',
        points: `${newAssignmentPoints} pts`,
        status: 'Assigned',
        submittedFiles: [],
        privateComments: [],
        turnedInDate: null,
        grade: null,
        attachments: [],
        classCode: selectedCourseDetail?.classCode || activeSubject?.code || 'General'
      };

      setAssignments([...assignments, newAssignment]);
      setToastMessage('Assignment created!');
    }

    // Reset form
    setNewAssignmentTitle('');
    setNewAssignmentDescription('');
    setNewAssignmentPoints('100');
    setNewAssignmentDueDate('');
    setIsAnnouncement(false);
    setShowCreateClassworkModal(false);

    setTimeout(() => setToastMessage(null), 3000);
  };
  
  // GClass Assignments State
  const [assignments, setAssignments] = useState([
    {
      id: 101,
      title: "Laboratory Exercise 1: React Components",
      description: "Create functional and class components using React hooks. Include proper state management and props passing.",
      professor: "Posted by {activeSubject?.instructor || 'Instructor'}",
      dueDate: "Tomorrow, 11:59 PM",
      points: "100 pts",
      status: "Assigned",
      submittedFiles: [],
      privateComments: [],
      turnedInDate: null,
      grade: null,
      attachments: [
        { name: "React_Components_Guide.pdf", type: "pdf", size: "2.4 MB" },
        { name: "Example_Code.zip", type: "zip", size: "1.1 MB" }
      ]
    }
  ]);
  
  // Assignment Detail Modal State
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentDetail, setShowAssignmentDetail] = useState(false);
  
  // Inline Editing State for Comments, Posts, and Chat
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  
  // GClass Admin Subject Creator State
  const [subjectsList, setSubjectsList] = useState([
    {
      id: 1,
      code: "SP 101",
      subjectName: "SOCIAL ISSUES AND PROFESSIONAL PRACTICES",
      section: "BSIT 3-A",
      instructorName: "Cynthia B. Dulagan",
      instructorInitial: "C",
      studentEmails: [],
      classCode: "PTC-SP101",
      isArchived: true
    },
    {
      id: 2,
      code: "CAPSTONE 1",
      subjectName: "CAPSTONE 1",
      section: "BSIT 3-A",
      instructorName: "Sheryl Ann Ricafort",
      instructorInitial: "S",
      studentEmails: [],
      classCode: "PTC-CAP101",
      isArchived: true
    },
    {
      id: 3,
      code: "SIA 101",
      subjectName: "SYSTEM INTEGRATION AND ARCHITECTURE",
      section: "BSIT 3-A",
      instructorName: "Prof. Toni D. Granado",
      instructorInitial: "T",
      studentEmails: [],
      classCode: "PTC-SIA101",
      isArchived: true
    },
    {
      id: 4,
      code: "TECH 32",
      subjectName: "TECHNOPRENEURSHIP",
      section: "BSIT 3-A",
      instructorName: "Katherine C. Baggay",
      instructorInitial: "K",
      studentEmails: [],
      classCode: "PTC-TECH32",
      isArchived: true
    },
    {
      id: 5,
      code: "MRC 22",
      subjectName: "METHODS OF RESEARCH IN COMPUTING",
      section: "BSIT 3-A",
      instructorName: "Toni D. Granado",
      instructorInitial: "T",
      studentEmails: [],
      classCode: "PTC-MRC22",
      isArchived: true
    },
    {
      id: 6,
      code: "WS 102",
      subjectName: "WEB PROGRAMMING",
      section: "BSIT 3-A",
      instructorName: "Roclyn Yamson",
      instructorInitial: "R",
      studentEmails: [],
      classCode: "PTC-WS102",
      isArchived: true
    },
    {
      id: 7,
      code: "ED 101",
      subjectName: "EMBEDDED SYSTEMS/ROBOTICS",
      section: "BSIT 3-A",
      instructorName: "Edmar Tan",
      instructorInitial: "E",
      studentEmails: [],
      classCode: "PTC-ED101",
      isArchived: true
    },
    {
      id: 8,
      code: "NET 102",
      subjectName: "NETWORK ADMINISTRATION AND MAINTENANCE",
      section: "BSIT 3-A",
      instructorName: "Harvey Rey B. Del Rosario",
      instructorInitial: "H",
      studentEmails: [],
      classCode: "PTC-NET102",
      isArchived: true
    }
  ]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newInstructorName, setNewInstructorName] = useState("");
  const [newStudentEmails, setNewStudentEmails] = useState("");
  
  // GClass Edit Subject State
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editInstructorName, setEditInstructorName] = useState("");
  const [editStudentEmails, setEditStudentEmails] = useState("");
  
  // Active Subject State for GClass View
  const [activeSubject, setActiveSubject] = useState(null);
  
  // Per-subject localStorage persistence for chat messages
  const activeChatKey = `ptc_chat_${activeSubject?.id || activeSubject?.code || 'general'}`;
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(activeChatKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Load chat messages when active subject changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(activeChatKey);
      setChatMessages(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setChatMessages([]);
    }
  }, [activeSubject]);
  
  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(activeChatKey, JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages, activeChatKey]);
  
  // GCR Notification Toggle States
  const [allowEmail, setAllowEmail] = useState(true);
  const [commentsOnPosts, setCommentsOnPosts] = useState(true);
  const [classesEnrolled, setClassesEnrolled] = useState(true);
  const [inviteNotifications, setInviteNotifications] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  
  // Language State
  const [currentLang, setCurrentLang] = useState('en');
  
 // Language Dictionary
 const languageDictionary = {
    en: {
      welcome: "Welcome back",
      courses: "Your Courses",
      settings: "Settings",
      profile: "Profile",
      notifications: "Notifications",
      languageSettings: "Language Settings",
      accountSettings: "Account Settings",
      change: "Change",
      emailNotifications: "Email notifications",
      commentsOnPosts: "Comments on posts",
      classesEnrolled: "Classes you're enrolled in",
      invitations: "Invitations to classes",
      dueDateReminders: "Due date reminders",
      customizeExperience: "Customize your experience",
      selectLanguage: "Select Language",
      home: "Home",
      calendar: "Calendar",
      gemini: "Gemini",
      todo: "To-do",
      teachingLoad: "Teaching Load",
      enrolled: "Enrolled",
      signIn: "Sign In",
      dashboard: "Dashboard",
      announcements: "Announcements",
      archivedClasses: "Archived classes",
      signOut: "Sign Out",
      activeCourses: "Active Courses",
      completedTasks: "Completed Tasks",
      unreadNotifications: "Unread Notifications",
      averageProgress: "Average Progress",
      courseProgress: "Course Progress",
      latestUpdate: "Latest Update",
      manageClassroom: "Manage Classroom",
      joinMeet: "Join Meet",
      academicCalendar: "Academic Calendar",
      upcomingFacultyEvents: "Upcoming Faculty Events",
      schedulesToday: "Schedules Today",
      gradingQueue: "Grading Queue",
      tasksAssignments: "Tasks & Assignments",
      pendingGrading: "Pendng Grading",
      pendingTasks: "Pending Tasks",
      giveGrades: "Give Grades",
      submit: "Submit",
      allCourses: "All Courses",
      browseCourses: "Browse and manage your enrolled courses"
    },
    tl: {
      welcome: "Mabuting pagbabalik",
      courses: "Iyong mga Kurso",
      settings: "Mga Setting",
      profile: "Profile",
      notifications: "Mga Notification",
      languageSettings: "Mga Setting ng Wika",
      accountSettings: "Mga Setting ng Account",
      change: "Baguhin",
      emailNotifications: "Mga notification sa email",
      commentsOnPosts: "Mga komento sa post",
      classesEnrolled: "Mga klase na iyong pinasok",
      invitations: "Mga imbitasyon sa klase",
      dueDateReminders: "Mga paalala sa due date",
      customizeExperience: "I-customize ang iyong karanasan",
      selectLanguage: "Pumili ng Wika",
      home: "Home",
      calendar: "Calendar",
      gemini: "Gemini",
      todo: "To-do",
      teachingLoad: "Teaching Load",
      enrolled: "Enrolled",
      signIn: "Mag-sign In",
      dashboard: "Dashboard",
      announcements: "Mga Anunsyo",
      archivedClasses: "Mga naka-archive na klase",
      signOut: "Mag-sign Out",
      activeCourses: "Mga Aktibong Kurso",
      completedTasks: "Mga Natapos na Gawain",
      unreadNotifications: "Mga Hindi Babasahing Notification",
      averageProgress: "Average na Progreso",
      courseProgress: "Progreso ng Kurso",
      latestUpdate: "Pinakabagong Update",
      manageClassroom: "Pamahalaan ang Classroom",
      joinMeet: "Sumali sa Meet",
      academicCalendar: "Akademikong Kalendaryo",
      upcomingFacultyEvents: "Mga Paparating na Faculty Events",
      schedulesToday: "Mga Iskedyul Ngayon",
      gradingQueue: "Pila sa Pag-grade",
      tasksAssignments: "Mga Gawain at Assignment",
      pendingGrading: "Nakabiting Pag-grade",
      pendingTasks: "Mga Nakabiting Gawain",
      giveGrades: "Bigyan ng Grade",
      submit: "Isumite",
      allCourses: "Lahat ng Kurso",
      browseCourses: "Tignan at pamahalaan ang iyong mga kurso"
    },
    es: {
      welcome: "Bienvenido de nuevo",
      courses: "Tus Cursos",
      settings: "Ajustes",
      profile: "Perfil",
      notifications: "Notificaciones",
      languageSettings: "Configuración de Idioma",
      accountSettings: "Configuración de Cuenta",
      change: "Cambiar",
      emailNotifications: "Notificaciones por correo",
      commentsOnPosts: "Comentarios en publicaciones",
      classesEnrolled: "Clases en las que estás inscrito",
      invitations: "Invitaciones a clases",
      dueDateReminders: "Recordatorios de fecha de entrega",
      customizeExperience: "Personaliza tu experiencia",
      selectLanguage: "Seleccionar Idioma",
      home: "Inicio",
      calendar: "Calendario",
      gemini: "Gemini",
      todo: "Tareas",
      teachingLoad: "Carga Docente",
      enrolled: "Inscrito",
      signIn: "Iniciar Sesión",
      dashboard: "Panel",
      announcements: "Anuncios",
      archivedClasses: "Clases archivadas",
      signOut: "Cerrar Sesión",
      activeCourses: "Cursos Activos",
      completedTasks: "Tareas Completadas",
      unreadNotifications: "Notificaciones No Leídas",
      averageProgress: "Progreso Promedio",
      courseProgress: "Progreso del Curso",
      latestUpdate: "Última Actualización",
      manageClassroom: "Gestionar Clase",
      joinMeet: "Unirse a Meet",
      academicCalendar: "Calendario Académico",
      upcomingFacultyEvents: "Próximos Eventos de Facultad",
      schedulesToday: "Horarios de Hoy",
      gradingQueue: "Cola de Calificación",
      tasksAssignments: "Tareas y Asignaciones",
      pendingGrading: "Calificación Pendiente",
      pendingTasks: "Tareas Pendientes",
      giveGrades: "Asignar Calificaciones",
      submit: "Enviar",
      allCourses: "Todos los Cursos",
      browseCourses: "Navega y gestiona tus cursos inscritos"
    },
    ja: {
      welcome: "おかえりなさい",
      courses: "あなたのコース",
      settings: "設定",
      profile: "プロフィール",
      notifications: "通知",
      languageSettings: "言語設定",
      accountSettings: "アカウント設定",
      change: "変更",
      emailNotifications: "メール通知",
      commentsOnPosts: "投稿へのコメント",
      classesEnrolled: "受講中のクラス",
      invitations: "クラスへの招待",
      dueDateReminders: "期限リマインダー",
      customizeExperience: "エクスペリエンスをカスタマイズ",
      selectLanguage: "言語を選択",
      home: "ホーム",
      calendar: "カレンダー",
      gemini: "Gemini",
      todo: "To-Do",
      teachingLoad: "担当授業",
      enrolled: "受講中",
      signIn: "サインイン",
      dashboard: "ダッシュボード",
      announcements: "お知らせ",
      archivedClasses: "アーカイブされたクラス",
      signOut: "サインアウト",
      activeCourses: "アクティブなコース",
      completedTasks: "完了したタスク",
      unreadNotifications: "未読通知",
      averageProgress: "平均進捗",
      courseProgress: "コース進捗",
      latestUpdate: "最新の更新",
      manageClassroom: "クラスを管理",
      joinMeet: "Meetに参加",
      academicCalendar: "学術カレンダー",
      upcomingFacultyEvents: "今後の教員イベント",
      schedulesToday: "今日のスケジュール",
      gradingQueue: "採点キュー",
      tasksAssignments: "タスクと課題",
      pendingGrading: "採点待ち",
      pendingTasks: "保留中のタスク",
      giveGrades: "成績を付ける",
      submit: "提出",
      allCourses: "すべてのコース",
      browseCourses: "受講中のコースを閲覧・管理"
    },
    ko: {
      welcome: "다시 오신 것을 환영합니다",
      courses: "귀하의 강좌",
      settings: "설정",
      profile: "프로필",
      notifications: "알림",
      languageSettings: "언어 설정",
      accountSettings: "계정 설정",
      change: "변경",
      emailNotifications: "이메일 알림",
      commentsOnPosts: "게시물 댓글",
      classesEnrolled: "수강 중인 클래스",
      invitations: "클래스 초대",
      dueDateReminders: "마감일 알림",
      customizeExperience: "경험 사용자 정의",
      selectLanguage: "언어 선택",
      home: "홈",
      calendar: "캘린더",
      gemini: "Gemini",
      todo: "할 일",
      teachingLoad: "담당 강의",
      enrolled: "수강 중",
      signIn: "로그인",
      dashboard: "대시보드",
      announcements: "공지사항",
      archivedClasses: "보관된 클래스",
      signOut: "로그아웃",
      activeCourses: "활성 강좌",
      completedTasks: "완료된 작업",
      unreadNotifications: "읽지 않은 알림",
      averageProgress: "평균 진행률",
      courseProgress: "강좌 진행률",
      latestUpdate: "최신 업데이트",
      manageClassroom: "클래스 관리",
      joinMeet: "Meet 참여",
      academicCalendar: "학술 캘린더",
      upcomingFacultyEvents: "예정된 교직원 이벤트",
      schedulesToday: "오늘 일정",
      gradingQueue: "성적 평가 대기열",
      tasksAssignments: "작업 및 과제",
      pendingGrading: "성적 평가 대기 중",
      pendingTasks: "보류 중인 작업",
      giveGrades: "성적 부여",
      submit: "제출",
      allCourses: "모든 강좌",
      browseCourses: "수강 중인 강좌 찾아보기 및 관리"
    }
  };
  
  const t = languageDictionary[currentLang];
  
  // Data States
  const tasks = [
    { id: 1, title: "Complete Chapter 5 Quiz", completed: false, dueDate: "2026-04-25", priority: 'high' },
    { id: 2, title: "Submit Lab Report", completed: true, dueDate: "2026-04-23", priority: 'medium' },
    { id: 3, title: "Review Lecture Notes", completed: false, dueDate: "2026-04-26", priority: 'low' }
  ];

  // Professor-specific tasks (Grading Queue)
  const professorTasks = [
    { id: 1, title: "Grade Midterm Lab - SIA 101 (BSIT 3J)", completed: false, dueDate: "Today", priority: 'high' },
    { id: 2, title: "Review Capstone Chapter 1 Proposals (BSIT 4A)", completed: false, dueDate: "5 Groups Pending", priority: 'high' },
    { id: 3, title: "Check Quiz 2 Auto-Graded Results (BSIT 2G)", completed: false, dueDate: "Needs Validation", priority: 'medium' }
  ];
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Assignment", message: "SP 101 - Chapter 5 Quiz posted", time: "2 min ago", read: false, type: "assignment" },
    { id: 2, title: "Grade Posted", message: "Your midterm grade is available", time: "1 hour ago", read: false, type: "grade" },
    { id: 3, title: "Class Update", message: "Schedule change for tomorrow", time: "3 hours ago", read: true, type: "update" }
  ]);

  // Enhanced Course data (FORCED WHITE TEXT AND PREMIUM MATTE DARK BACKGROUNDS)
  const seedCourses = [
    { id: 1, code: 'SP 101', title: 'SOCIAL ISSUES AND PROFESSIONAL PRACTICES', section: 'BSIT 3J', color: 'bg-[#134e4a] text-white', textColor: '#ffffff', professor: 'Cynthia B. Dulagan', progress: 70, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=SP101-BSIT3J`, room: 'RM 401', sched: 'Tue/Thu 1:00-2:30PM', announcement: 'I have already recorded your midterm grades and attendance.', classCode: 'PTC-AB12', enrolledStudents: [] },
    { id: 2, code: 'CAPSTONE 1', title: 'CAPSTONE 1', section: 'BSIT 3J', color: 'bg-[#1e1b4b] text-white', textColor: '#ffffff', professor: 'SHERYL ANN RICAFORT', progress: 45, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=CAPSTONE1-BSIT3J`, room: 'Lab 302', sched: 'Mon/Wed 8:00-10:00AM', announcement: 'Please submit your Chapter 2 drafts by Saturday.', classCode: 'PTC-CD34', enrolledStudents: [] },
    { id: 3, code: 'SIA 101', title: 'SYSTEM INTEGRATION AND ARCHITECTURE', section: 'BSIT 3J', color: 'bg-[#2d1b33] text-white', textColor: '#ffffff', professor: 'Toni D. Granado', progress: 30, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=SIA101-BSIT3J`, room: 'Lab 305', sched: 'Fri 9:00-12:00PM', announcement: 'Prepare for the hands-on lab next week.', classCode: 'PTC-EF56', enrolledStudents: [] },
    { id: 4, code: 'TECH 32', title: 'TECHNOPRENEURSHIP', section: 'BSIT 3J', color: 'bg-[#064e3b] text-white', textColor: '#ffffff', professor: 'Katherine C. Baggay', progress: 85, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=TECH32-BSIT3J`, room: 'RM 202', sched: 'Mon 1:00-4:00PM', announcement: 'Pitch deck presentations start on Monday.', classCode: 'PTC-GH78', enrolledStudents: [] },
    { id: 5, code: 'MRC 22', title: 'METHODS OF RESEARCH IN COMPUTING', section: 'BSIT 3J', color: 'bg-[#4c1d95] text-white', textColor: '#ffffff', professor: 'Toni D. Granado', progress: 10, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=MRC22-BSIT3J`, room: 'RM 405', sched: 'Wed 2:00-5:00PM', announcement: 'Finalize your research titles for approval.', classCode: 'PTC-IJ90', enrolledStudents: [] },
    { id: 6, code: 'WS 102', title: 'WEB PROGRAMMING', section: 'BSIT 3J', color: 'bg-[#1e293b] text-white', textColor: '#ffffff', professor: 'Roclyn Yamson', progress: 60, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=WS102-BSIT3J`, room: 'Lab 301', sched: 'Tue 8:00-11:00AM', announcement: "Don't forget to push your React projects to GitHub.", classCode: 'PTC-KL12', enrolledStudents: [] },
    { id: 7, code: 'ED 101', title: 'EMBEDDED SYSTEMS/ROBOTICS', section: 'BSIT 3J', color: 'bg-[#134e4a] text-white', textColor: '#ffffff', professor: 'Edmar Tan', progress: 50, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=ED101-BSIT3J`, room: 'Lab 402', sched: 'Thu 9:00-12:00PM', announcement: 'Bring your Arduino kits on our face-to-face class.', classCode: 'PTC-MN34', enrolledStudents: [] },
    { id: 8, code: 'NET 102', title: 'NETWORK ADMINISTRATION AND MAINTENANCE', section: 'BSIT 3J', color: 'bg-[#2d1b33] text-white', textColor: '#ffffff', professor: 'Harvey Rey B. Del Rosario', progress: 20, meetLink: `${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/?room=NET102-BSIT3J`, room: 'Lab 306', sched: 'Sat 8:00-11:00AM', announcement: 'Server configuration quiz is scheduled for Tuesday.', classCode: 'PTC-OP56', enrolledStudents: [] }
  ];

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('ptc_lms_classes');
    return saved ? JSON.parse(saved) : seedCourses;
  });

  const [studentEnrollments, setStudentEnrollments] = useState(() => {
    const saved = localStorage.getItem('ptc_lms_enrolled_classes');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ptc_lms_classes', JSON.stringify(courses));
  }, [courses]);

  // Persist student enrollments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ptc_lms_enrolled_classes', JSON.stringify(studentEnrollments));
  }, [studentEnrollments]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  // --- Theme Sync Effect Fix ---
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (isDarkMode) {
      root.classList.add('dark', 'dark-mode');
      body.classList.add('dark', 'dark-mode');
    } else {
      root.classList.remove('dark', 'dark-mode');
      body.classList.remove('dark', 'dark-mode');
    }
  }, [isDarkMode]);

  // Inject Styles on Mount
  useEffect(() => {
    injectProfessionalStyles();
  }, []);

  useEffect(() => {
    // Use professor courses if user is professor, otherwise use student courses
    if (user?.role === 'professor' || user?.role === 'admin') {
      setFilteredCourses(professorCourses);
    } else {
      setFilteredCourses(courses);
    }
  }, [user, courses]);

  // Essential Functions
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError("");

    try {
      // Normalize input (case-insensitive)
      const normalizedInput = username.trim().toLowerCase();
      const normalizedPassword = password.trim();

      // Find matching user from inMemoryUsers state (includes both seed and registered users)
      let matchedUser = inMemoryUsers.find(
        u => (u.username === normalizedInput || u.email === normalizedInput) && u.password === normalizedPassword
      );

      // If not found in state, also check localStorage directly for newly registered users
      if (!matchedUser) {
        try {
          const storedUsers = localStorage.getItem('ptc_lms_users');
          if (storedUsers) {
            const users = JSON.parse(storedUsers);
            matchedUser = users.find(
              u => (u.username === normalizedInput || u.email === normalizedInput) && u.password === normalizedPassword
            );
            // If found in localStorage, update state to sync
            if (matchedUser) {
              setInMemoryUsers(users);
            }
          }
        } catch (e) {
          console.error('Error reading from localStorage:', e);
        }
      }

      if (matchedUser) {
        // Direct authentication - no backend call
        const userRole = matchedUser.role;
        setUser({
          id: matchedUser.username,
          email: matchedUser.email,
          role: userRole,
          name: matchedUser.name,
          email_verified: true,
          account_status: 'active'
        });
        setIsLoggedIn(true);
        setCurrentUser(matchedUser.name);
        
        // Role-based automatic redirect
        if (userRole === 'student') {
          setActiveNav('Home');
        } else if (userRole === 'teacher' || userRole === 'professor') {
          setActiveNav('Home');
        } else if (userRole === 'dean') {
          setActiveNav('TaskMonitoring');
        } else if (userRole === 'admin' || userRole === 'administrator') {
          setActiveNav('UserManagement');
        } else {
          setActiveNav('Home');
        }
        
        setError("");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    // Validate email
    if (!validateEmail(registerData.email)) {
      return;
    }

    // Validate password requirements
    const reqs = checkPasswordRequirements(registerData.password);
    const allRequirementsMet = Object.values(reqs).every(Boolean);

    if (!allRequirementsMet) {
      setPasswordError("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    // Validate password match (trim spaces)
    if (registerData.password.trim() !== registerData.confirmPassword.trim()) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    // All validations passed - proceed with submission
    setIsSubmitting(true);

    try {
      // Check if email already exists in memory
      const emailExists = inMemoryUsers.some(u => u.email === registerData.email.toLowerCase());
      if (emailExists) {
        setEmailError("This email is already registered. Please log in.");
        setIsSubmitting(false);
        return;
      }

      // Create new user and add to in-memory list
      const newUser = {
        username: registerData.email.split('@')[0].toLowerCase(),
        email: registerData.email.toLowerCase(),
        password: registerData.password,
        role: registerData.role,
        name: registerData.name,
        route: registerData.role === 'student' ? '/student-dashboard' :
               registerData.role === 'professor' ? '/teacher-dashboard' :
               registerData.role === 'dean' ? '/dean-dashboard' : '/admin-dashboard'
      };

      setInMemoryUsers([...inMemoryUsers, newUser]);

      // Account created successfully - redirect to login
      setIsRegisterMode(false);
      setLoginSuccessMessage("Account created successfully! Please log in with your credentials.");
      
      // Auto-populate login email field with registered email for smooth UX
      setUsername(registerData.email);

      // Reset form
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
      });
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    } catch (err) {
      setEmailError("Something went wrong while creating your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setCurrentUser("");
    setUser(null);
    setActiveNav('Home');
    // Clear session from localStorage
    localStorage.removeItem('ptc_lms_session');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCourseClick = (course) => {
    setSelectedCourseDetail(course);
    setShowCourseModal(true);
  };

  const handleSubjectSelect = (course) => {
    setSelectedCourseDetail(course);
    setActiveItem(course.id);
    setActiveNav('Subject');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.code.toLowerCase().includes(query.toLowerCase()) ||
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.professor.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const logAttendance = (studentName, subjectCode) => {
    const newLog = {
      studentName,
      subject: subjectCode,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      status: 'Present'
    };
    setAttendanceLogs([...attendanceLogs, newLog]);
    
    // Update Meet Pioneer badge progress
    setBadges(prevBadges => prevBadges.map(badge => 
      badge.id === 3 ? { ...badge, progress: badge.progress + 1 } : badge
    ));
  };

  const exportAttendanceToCSV = () => {
    const headers = ['Student Name', 'Subject', 'Date', 'Time', 'Status'];
    const csvContent = [
      headers.join(','),
      ...attendanceLogs.map(log => `${log.studentName},${log.subject},${log.date},${log.timestamp},${log.status}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const claimBadge = (badgeId) => {
    if (!claimedBadges.includes(badgeId)) {
      setClaimedBadges([...claimedBadges, badgeId]);
      alert(`🎉 Badge claimed successfully!`);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSimulateSubmit = (assignmentId) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: "Submitted", submittedFile: "Lab1_Final_Submission.pdf" }
        : assignment
    ));
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    const emailArray = newStudentEmails 
      ? newStudentEmails.split(',').map(email => email.trim()).filter(email => email.length > 0)
      : [];
    const newSubject = {
      id: Date.now(),
      code: newSubjectName.substring(0, 10).toUpperCase() || "NEW",
      subjectName: newSubjectName,
      section: newSection,
      instructorName: newInstructorName || "Assigned Instructor",
      instructorInitial: (newInstructorName || "Assigned Instructor").charAt(0).toUpperCase(),
      studentEmails: emailArray,
      classCode: 'PTC-' + Math.floor(1000 + Math.random() * 9000)
    };
    setSubjectsList([...subjectsList, newSubject]);
    setNewSubjectName("");
    setNewSection("");
    setNewInstructorName("");
    setNewStudentEmails("");
    setShowAddSubjectModal(false);
  };

  const handleOpenEditModal = (subject) => {
    setEditingSubject(subject);
    setEditSubjectName(subject?.subjectName || "");
    setEditSection(subject?.section || "");
    setEditInstructorName(subject?.instructorName || "");
    setEditStudentEmails(subject?.studentEmails?.join(", ") || "");
  };

  const handleSaveEditSubject = (e) => {
    e.preventDefault();
    const emailArray = editStudentEmails 
      ? editStudentEmails.split(',').map(email => email.trim()).filter(email => email.length > 0)
      : [];
    setSubjectsList(subjectsList.map(subject => 
      subject?.id === editingSubject?.id 
        ? { ...subject, subjectName: editSubjectName, section: editSection, instructorName: editInstructorName || "Assigned Instructor", instructorInitial: (editInstructorName || "Assigned Instructor").charAt(0).toUpperCase(), studentEmails: emailArray, code: subject?.code || editSubjectName.substring(0, 10).toUpperCase() || "NEW", classCode: subject?.classCode || 'PTC-' + Math.floor(1000 + Math.random() * 9000) }
        : subject
    ));
    setEditingSubject(null);
    setEditSubjectName("");
    setEditSection("");
    setEditInstructorName("");
    setEditStudentEmails("");
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      setSubjectsList(subjectsList.filter(subject => subject?.id !== subjectId));
    }
  };

  // --- LOCAL COMMAND INTERCEPTOR ---
  const interceptSystemCommand = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Calendar navigation commands
    if (lowerMessage.includes('go to calendar') || 
        lowerMessage.includes('buksan ang calendar') || 
        lowerMessage.includes('calendar view')) {
      setActiveNav('Calendar');
      return '🔄 [System Command] Navigating you to the Calendar...';
    }
    
    // Settings navigation commands
    if (lowerMessage.includes('go to settings') || 
        lowerMessage.includes('buksan ang settings') || 
        lowerMessage.includes('settings')) {
      setActiveNav('Settings');
      return '🔄 [System Command] Navigating you to the Settings...';
    }
    
    // To-Do navigation commands
    if (lowerMessage.includes('go to to-do') || 
        lowerMessage.includes('to do list') || 
        lowerMessage.includes('mga gawain')) {
      setActiveNav('Tasks');
      return '🔄 [System Command] Navigating you to the To-Do List...';
    }
    
    // Home/Dashboard navigation commands
    if (lowerMessage.includes('go home') || 
        lowerMessage.includes('dashboard') || 
        lowerMessage.includes('homepage')) {
      setActiveNav('Home');
      return '🔄 [System Command] Navigating you to the Dashboard...';
    }
    
    return null; // No command detected
  };

  const sendAiMessage = () => {
    if (!aiMessage.trim()) return;
    
    // Step 1: Check for local system commands first
    const commandResult = interceptSystemCommand(aiMessage);
    if (commandResult) {
      // Display system command notification in chat
      setSystemCommandNotification(commandResult);
      setAiMessage('');
      
      // Auto-clear notification after 3 seconds
      setTimeout(() => {
        setSystemCommandNotification('');
      }, 3000);
      return;
    }
    
    // Step 2: If no command, proceed with normal AI processing
    setIsAiLoading(true);
    
    // In a real implementation, this would send to Gemini API with the system prompt
    // For now, we simulate the response with the enhanced context
    setTimeout(() => {
      setAiResponse("I understand you're asking about: " + aiMessage + ". I'm here to help you with your studies, assignments, and course navigation! As your PTC LMS AI Assistant, I can guide you through the system or help with development questions.");
      setIsAiLoading(false);
    }, 1500);
  };

  const getProfessorAvatar = (professorName) => {
    const femaleNames = ['Sheryl', 'Toni', 'Katherine', 'Cynthia'];
    const maleNames = ['Edmar', 'Harvey', 'Roclyn'];
    
    const firstName = professorName.split(' ')[0];
    
    if (femaleNames.some(name => professorName.includes(name))) {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${firstName}&gender=female`;
    } else if (maleNames.some(name => professorName.includes(name))) {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${firstName}&gender=male`;
    } else {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${firstName}`;
    }
  };






  // --- RBAC ROUTE GUARD ---
  const isNavAllowedForRole = (navItem, userRole) => {
    if (!userRole) return false;

    // Student-only navigation items
    const studentOnlyItems = [
      'Home', 'Calendar', 'Tasks', 'Profile', 'Subjects',
      'VideoConference', 'Materials', 'LearningMaterials', 'Assignments', 'Grades',
      'Announcements', 'Reports', 'Messages'
    ];

    // Teacher/Professor-only navigation items (academic faculty)
    const teacherOnlyItems = [
      'Tasks', 'Messages', 'Announcements', 'Courses', 'Gradebook', 'Submissions', 'AIAssistant'
    ];

    // Admin/Dean-only navigation items (administrative faculty)
    const adminOnlyItems = [
      'UserManagement', 'ActivityLogs', 'Verifications', 'TaskMonitoring', 'FacultyReports'
    ];

    // Student access
    if (userRole === 'student') {
      return studentOnlyItems.includes(navItem);
    }

    const normalized = userRole.toLowerCase();

    // Specific management and verification role guards
    if (navItem === 'AdminManagement' || navItem === 'DeanManagement') {
      return ['admin', 'administrator'].includes(normalized);
    }
    if (navItem === 'FacultyManagement') {
      return ['admin', 'administrator', 'dean'].includes(normalized);
    }
    if (['StudentManagement', 'UserManagement', 'Verifications', 'Verification'].includes(navItem)) {
      return ['admin', 'administrator', 'dean', 'professor', 'teacher', 'faculty'].includes(normalized);
    }

    // Teacher/Professor access (academic faculty only)
    if (['teacher', 'professor', 'faculty'].includes(normalized)) {
      return teacherOnlyItems.includes(navItem) || ['Home', 'Calendar', 'Settings', 'Subject'].includes(navItem);
    }

    // Admin/Dean access (administrative faculty)
    if (['dean', 'admin', 'administrator'].includes(normalized)) {
      return adminOnlyItems.includes(navItem) || teacherOnlyItems.includes(navItem) || ['Home', 'Calendar', 'Settings', 'Subject'].includes(navItem);
    }

    return false;
  };

  // --- MAIN CONTENT RENDERER ---
  const renderMainContent = () => {
    // RBAC Guard: Check if current nav is allowed for user's role
    if (user?.role && !isNavAllowedForRole(activeNav, user.role)) {
      // Redirect to appropriate default view based on role
      const defaultNav = user.role === 'student' ? 'Home' :
                         (['teacher', 'professor'].includes(user.role) ? 'Home' :
                         (user.role === 'dean' ? 'TaskMonitoring' :
                         (['admin', 'administrator'].includes(user.role) ? 'UserManagement' : 'Home')));
      setActiveNav(defaultNav);
      return null;
    }

    switch(activeNav) {
      case 'Home':
        return <DashboardHome
          t={t}
          currentUser={currentUser}
          courses={courses}
          tasks={tasks}
          filteredCourses={filteredCourses}
          userProfile={userProfile}
          handleCourseClick={handleCourseClick}
          getProfessorAvatar={getProfessorAvatar}
          getUnreadCount={getUnreadCount}
          user={user}
          setActiveMeeting={setActiveMeeting}
          setSelectedCourseDetail={setSelectedCourseDetail}
          setShowAttendanceModal={setShowAttendanceModal}
          setShowBadgesModal={setShowBadgesModal}
          subjectsList={subjectsList}
          showAddSubjectModal={showAddSubjectModal}
          setShowAddSubjectModal={setShowAddSubjectModal}
          newSubjectName={newSubjectName}
          setNewSubjectName={setNewSubjectName}
          newSection={newSection}
          setNewSection={setNewSection}
          newInstructorName={newInstructorName}
          setNewInstructorName={setNewInstructorName}
          newStudentEmails={newStudentEmails}
          setNewStudentEmails={setNewStudentEmails}
          handleAddSubject={handleAddSubject}
          editingSubject={editingSubject}
          setEditingSubject={setEditingSubject}
          editSubjectName={editSubjectName}
          setEditSubjectName={setEditSubjectName}
          editSection={editSection}
          setEditSection={setEditSection}
          editInstructorName={editInstructorName}
          setEditInstructorName={setEditInstructorName}
          editStudentEmails={editStudentEmails}
          setEditStudentEmails={setEditStudentEmails}
          handleOpenEditModal={handleOpenEditModal}
          handleSaveEditSubject={handleSaveEditSubject}
          handleDeleteSubject={handleDeleteSubject}
          activeSubject={activeSubject}
          setActiveSubject={setActiveSubject}
          isDarkMode={isDarkMode}
          invitations={invitations}
          setInvitations={setInvitations}
          pendingInvitations={pendingInvitations}
          setPendingInvitations={setPendingInvitations}
        />;
      case 'Courses':
        return <CoursesView setActiveNav={setActiveNav} filteredCourses={filteredCourses} handleCourseClick={handleCourseClick} studentEnrollments={studentEnrollments} setStudentEnrollments={setStudentEnrollments} user={user} isDarkMode={isDarkMode} setActiveMeeting={setActiveMeeting} setSelectedCourseDetail={setSelectedCourseDetail} />;
      case 'Calendar':
        return <CalendarView setActiveNav={setActiveNav} user={user} />;
      case 'Tasks':
        return <TasksView
          setActiveNav={setActiveNav}
          tasks={tasks}
          user={user}
          professorTasks={professorTasks}
          showSubmitModal={showSubmitModal}
          setShowSubmitModal={setShowSubmitModal}
          setSelectedTaskForSubmit={setSelectedTaskForSubmit}
          showGradingModal={showGradingModal}
          setShowGradingModal={setShowGradingModal}
          setSelectedTaskForGrading={setSelectedTaskForGrading}
          submittedTasks={submittedTasks}
          gradedTasks={gradedTasks}
        />;
      case 'Subjects':
        return <StudentSubjects courses={filteredCourses} isDarkMode={isDarkMode} onJoinSubject={handleCourseClick} />;
      case 'Assignments':
        return <StudentAssignments assignments={assignments} isDarkMode={isDarkMode} onUploadSubmission={handleSimulateSubmit} />;
      case 'Grades':
        return <StudentGrades grades={grades} isDarkMode={isDarkMode} />;
      case 'LearningMaterials':
        return <StudentLearningMaterials materials={[]} isDarkMode={isDarkMode} />;
      case 'VideoConference':
        return <StudentVideoConference isDarkMode={isDarkMode} />;
      case 'Messages':
        return <StudentMessages isDarkMode={isDarkMode} />;
      case 'Reports':
        return <StudentReports isDarkMode={isDarkMode} />;
      case 'Profile':
        return <StudentProfile userProfile={userProfile} setUserProfile={setUserProfile} isDarkMode={isDarkMode} />;
      case 'Announcements':
        return <StudentAnnouncements isDarkMode={isDarkMode} />;
      case 'Gradebook':
        return <TasksView setActiveNav={setActiveNav} tasks={tasks} user={user} professorTasks={professorTasks} showSubmitModal={showSubmitModal} setShowSubmitModal={setShowSubmitModal} setSelectedTaskForSubmit={setSelectedTaskForSubmit} showGradingModal={showGradingModal} setShowGradingModal={setShowGradingModal} setSelectedTaskForGrading={setSelectedTaskForGrading} submittedTasks={submittedTasks} gradedTasks={gradedTasks} />;
      case 'Submissions':
        return <TasksView setActiveNav={setActiveNav} tasks={tasks} user={user} professorTasks={professorTasks} showSubmitModal={showSubmitModal} setShowSubmitModal={setShowSubmitModal} setSelectedTaskForSubmit={setSelectedTaskForSubmit} showGradingModal={showGradingModal} setShowGradingModal={setShowGradingModal} setSelectedTaskForGrading={setSelectedTaskForGrading} submittedTasks={submittedTasks} gradedTasks={gradedTasks} />;
      case 'AIAssistant':
        return <GeminiView setActiveNav={setActiveNav} subjectsList={subjectsList} user={user} isDarkMode={isDarkMode} />;
      case 'TaskMonitoring':
        return <TaskMonitoringView setActiveNav={setActiveNav} user={user} isDarkMode={isDarkMode} />;
      case 'FacultyReports':
        return <ReportsView setActiveNav={setActiveNav} user={user} isDarkMode={isDarkMode} />;
      case 'AdminManagement':
        return <RoleManagementView moduleId="AdminManagement" moduleTitle="Admin Management" targetRole="administrator" icon={Shield} currentUser={user} isDarkMode={isDarkMode} />;
      case 'DeanManagement':
        return <RoleManagementView moduleId="DeanManagement" moduleTitle="Dean Management" targetRole="dean" icon={Award} currentUser={user} isDarkMode={isDarkMode} />;
      case 'FacultyManagement':
        return <RoleManagementView moduleId="FacultyManagement" moduleTitle="Faculty Management" targetRole="professor" icon={Users} currentUser={user} isDarkMode={isDarkMode} />;
      case 'UserManagement':
      case 'StudentManagement':
        return <RoleManagementView moduleId="StudentManagement" moduleTitle="Student Management" targetRole="student" icon={GraduationCap} currentUser={user} isDarkMode={isDarkMode} />;
      case 'ActivityLogs':
        return <ActivityLogsView setActiveNav={setActiveNav} user={user} isDarkMode={isDarkMode} />;
      case 'Verifications':
      case 'Verification':
        return <VerificationView user={user} isDarkMode={isDarkMode} setActiveNav={setActiveNav} />;
      case 'Settings':
        return <SettingsView
          setActiveNav={setActiveNav}
          t={t}
          currentUser={currentUser}
          allowEmail={allowEmail}
          setAllowEmail={setAllowEmail}
          commentsOnPosts={commentsOnPosts}
          setCommentsOnPosts={setCommentsOnPosts}
          classesEnrolled={classesEnrolled}
          setClassesEnrolled={setClassesEnrolled}
          inviteNotifications={inviteNotifications}
          setInviteNotifications={setInviteNotifications}
          dueDateReminders={dueDateReminders}
          setDueDateReminders={setDueDateReminders}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          user={user}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          showChangeAvatarModal={showChangeAvatarModal}
          setShowChangeAvatarModal={setShowChangeAvatarModal}
          showAccountSettingsModal={showAccountSettingsModal}
          setShowAccountSettingsModal={setShowAccountSettingsModal}
          colorPresets={colorPresets}
          imageZoom={imageZoom}
          setImageZoom={setImageZoom}
          imageOffset={imageOffset}
          setImageOffset={setImageOffset}
          isDraggingImage={isDraggingImage}
          setIsDraggingImage={setIsDraggingImage}
          dragStart={dragStart}
          setDragStart={setDragStart}
          toastMessage={toastMessage}
          setToastMessage={setToastMessage}
        />;
      case 'Archived':
        return <ArchivedView setActiveNav={setActiveNav} t={t} subjectsList={subjectsList} />;
      case 'Subject':
        return <SubjectView
          selectedCourseDetail={selectedCourseDetail}
          setActiveNav={setActiveNav}
          classroomTab={classroomTab}
          setClassroomTab={setClassroomTab}
          tasks={tasks}
          currentUser={currentUser}
          isProfChatOpen={isProfChatOpen}
          setIsProfChatOpen={setIsProfChatOpen}
          getProfessorAvatar={getProfessorAvatar}
          isVideoCallActive={isVideoCallActive}
          setIsVideoCallActive={setIsVideoCallActive}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          typedMessage={typedMessage}
          setTypedMessage={setTypedMessage}
          isDarkMode={isDarkMode}
          DashboardHome={DashboardHome}
          setActiveMeeting={setActiveMeeting}
          user={user}
          assignments={assignments}
          setAssignments={setAssignments}
          handleSimulateSubmit={handleSimulateSubmit}
          activeSubject={activeSubject}
          selectedAssignment={selectedAssignment}
          setSelectedAssignment={setSelectedAssignment}
          showAssignmentDetail={showAssignmentDetail}
          setShowAssignmentDetail={setShowAssignmentDetail}
          editingCommentId={editingCommentId}
          setEditingCommentId={setEditingCommentId}
          editCommentText={editCommentText}
          setEditCommentText={setEditCommentText}
          userProfile={userProfile}
          submissionFilter={submissionFilter}
          setSubmissionFilter={setSubmissionFilter}
          selectedStudentSubmission={selectedStudentSubmission}
          setSelectedStudentSubmission={setSelectedStudentSubmission}
          showFacultyGradingModal={showFacultyGradingModal}
          setShowFacultyGradingModal={setShowFacultyGradingModal}
          facultyGradingScore={facultyGradingScore}
          setFacultyGradingScore={setFacultyGradingScore}
          facultyGradingFeedback={facultyGradingFeedback}
          setFacultyGradingFeedback={setFacultyGradingFeedback}
          getSubmissionsForAssignment={getSubmissionsForAssignment}
          getSubmissionCounts={getSubmissionCounts}
          showCreateClassworkModal={showCreateClassworkModal}
          setShowCreateClassworkModal={setShowCreateClassworkModal}
          submissions={submissions}
          showInviteModal={showInviteModal}
          setShowInviteModal={setShowInviteModal}
          invitations={invitations}
          setInvitations={setInvitations}
          selectedStudentsForInvite={selectedStudentsForInvite}
          setSelectedStudentsForInvite={setSelectedStudentsForInvite}
          studentSearchQuery={studentSearchQuery}
          setStudentSearchQuery={setStudentSearchQuery}
        />;
      default:
        return <DashboardHome
          t={t}
          currentUser={currentUser}
          courses={courses}
          tasks={tasks}
          filteredCourses={filteredCourses}
          userProfile={userProfile}
          handleCourseClick={handleCourseClick}
          getProfessorAvatar={getProfessorAvatar}
          getUnreadCount={getUnreadCount}
          user={user}
          setActiveMeeting={setActiveMeeting}
          setSelectedCourseDetail={setSelectedCourseDetail}
          setShowAttendanceModal={setShowAttendanceModal}
          setShowBadgesModal={setShowBadgesModal}
          subjectsList={subjectsList}
          showAddSubjectModal={showAddSubjectModal}
          setShowAddSubjectModal={setShowAddSubjectModal}
          newSubjectName={newSubjectName}
          setNewSubjectName={setNewSubjectName}
          newSection={newSection}
          setNewSection={setNewSection}
          newInstructorName={newInstructorName}
          setNewInstructorName={setNewInstructorName}
          newStudentEmails={newStudentEmails}
          setNewStudentEmails={setNewStudentEmails}
          handleAddSubject={handleAddSubject}
          editingSubject={editingSubject}
          setEditingSubject={setEditingSubject}
          editSubjectName={editSubjectName}
          setEditSubjectName={setEditSubjectName}
          editSection={editSection}
          setEditSection={setEditSection}
          editInstructorName={editInstructorName}
          setEditInstructorName={setEditInstructorName}
          editStudentEmails={editStudentEmails}
          setEditStudentEmails={setEditStudentEmails}
          handleOpenEditModal={handleOpenEditModal}
          handleSaveEditSubject={handleSaveEditSubject}
          handleDeleteSubject={handleDeleteSubject}
          activeSubject={activeSubject}
          setActiveSubject={setActiveSubject}
          isDarkMode={isDarkMode}
          invitations={invitations}
          setInvitations={setInvitations}
          pendingInvitations={pendingInvitations}
          setPendingInvitations={setPendingInvitations}
        />;
    }
  };



  // --- MAIN RETURN ---
  if (!isLoggedIn) {
    return (
      <LoginScreen
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isRegisterMode={isRegisterMode}
        setIsRegisterMode={setIsRegisterMode}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        registerData={registerData}
        setRegisterData={setRegisterData}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
        setActiveNav={setActiveNav}
        t={t}
        emailError={emailError}
        setEmailError={setEmailError}
        emailValid={emailValid}
        setEmailValid={setEmailValid}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        confirmPasswordError={confirmPasswordError}
        setConfirmPasswordError={setConfirmPasswordError}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        passwordRequirements={passwordRequirements}
        setPasswordRequirements={setPasswordRequirements}
        validateEmail={validateEmail}
        checkPasswordRequirements={checkPasswordRequirements}
        loginSuccessMessage={loginSuccessMessage}
        error={error}
        setError={setError}
        loading={loading}
      />
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark dark-mode' : ''}`} style={{ backgroundColor: 'var(--bg-main)', color: 'var(--color-primary)', fontFamily: "'Arial', sans-serif" }}>
      <Sidebar
        t={t}
        courses={courses}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isDarkMode={isDarkMode}
        activeItem={activeItem}
        handleSubjectSelect={handleSubjectSelect}
        handleLogout={handleLogout}
        user={user}
        userProfile={userProfile}
      />
      <Dashboard
        isDarkMode={isDarkMode}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showCalendarModal={showCalendarModal}
        setShowCalendarModal={setShowCalendarModal}
        showJoinClassModal={showJoinClassModal}
        setShowJoinClassModal={setShowJoinClassModal}
        showCreateClassModal={showCreateClassModal}
        setShowCreateClassModal={setShowCreateClassModal}
        getUnreadCount={getUnreadCount}
        toggleDarkMode={toggleDarkMode}
        renderMainContent={renderMainContent}
        user={user}
      />
      <NotificationDropdown 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isDarkMode={isDarkMode}
        notifications={notifications}
        handleNotificationClick={handleNotificationClick}
        courses={courses}
        setSelectedCourseDetail={setSelectedCourseDetail}
        setActiveNav={setActiveNav}
        markAllNotificationsRead={markAllNotificationsRead}
      />
      <CourseModal
        showCourseModal={showCourseModal}
        setShowCourseModal={setShowCourseModal}
        selectedCourseDetail={selectedCourseDetail}
        user={user}
        logAttendance={logAttendance}
        isDarkMode={isDarkMode}
      />
      <AttendanceModal 
        showAttendanceModal={showAttendanceModal}
        setShowAttendanceModal={setShowAttendanceModal}
        attendanceLogs={attendanceLogs}
        attendanceFilter={attendanceFilter}
        setAttendanceFilter={setAttendanceFilter}
        exportAttendanceToCSV={exportAttendanceToCSV}
      />
      <BadgesModal
        showBadgesModal={showBadgesModal}
        setShowBadgesModal={setShowBadgesModal}
        badges={badges}
        claimedBadges={claimedBadges}
        claimBadge={claimBadge}
      />
      <AcademicCalendarModal
        showCalendarModal={showCalendarModal}
        setShowCalendarModal={setShowCalendarModal}
        isDarkMode={isDarkMode}
      />
      <CreateClassModal
        showCreateClassModal={showCreateClassModal}
        setShowCreateClassModal={setShowCreateClassModal}
        isDarkMode={isDarkMode}
        user={user}
        courses={courses}
        setCourses={setCourses}
        showToastNotification={showToastNotification}
      />
      <JoinClassModal
        showJoinClassModal={showJoinClassModal}
        setShowJoinClassModal={setShowJoinClassModal}
        isDarkMode={isDarkMode}
        user={user}
        userProfile={userProfile}
        courses={courses}
        studentEnrollments={studentEnrollments}
        setStudentEnrollments={setStudentEnrollments}
        showToastNotification={showToastNotification}
      />
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <SubmissionModal 
        showSubmitModal={showSubmitModal}
        setShowSubmitModal={setShowSubmitModal}
        selectedTaskForSubmit={selectedTaskForSubmit}
        submittedTasks={submittedTasks}
        setSubmittedTasks={setSubmittedTasks}
      />
      <FacultyGradingModal
        showFacultyGradingModal={showFacultyGradingModal}
        setShowFacultyGradingModal={setShowFacultyGradingModal}
        selectedStudentSubmission={selectedStudentSubmission}
        facultyGradingScore={facultyGradingScore}
        setFacultyGradingScore={setFacultyGradingScore}
        facultyGradingFeedback={facultyGradingFeedback}
        setFacultyGradingFeedback={setFacultyGradingFeedback}
        handleReturnWork={handleReturnWork}
        isDarkMode={isDarkMode}
      />
      <FacultyCreateClassworkModal
        showCreateClassworkModal={showCreateClassworkModal}
        setShowCreateClassworkModal={setShowCreateClassworkModal}
        newAssignmentTitle={newAssignmentTitle}
        setNewAssignmentTitle={setNewAssignmentTitle}
        newAssignmentDescription={newAssignmentDescription}
        setNewAssignmentDescription={setNewAssignmentDescription}
        newAssignmentPoints={newAssignmentPoints}
        setNewAssignmentPoints={setNewAssignmentPoints}
        newAssignmentDueDate={newAssignmentDueDate}
        setNewAssignmentDueDate={setNewAssignmentDueDate}
        isAnnouncement={isAnnouncement}
        setIsAnnouncement={setIsAnnouncement}
        handleCreateClasswork={handleCreateClasswork}
        isDarkMode={isDarkMode}
      />
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <GradingModal 
        showGradingModal={showGradingModal}
        setShowGradingModal={setShowGradingModal}
        selectedTaskForGrading={selectedTaskForGrading}
        gradedTasks={gradedTasks}
        setGradedTasks={setGradedTasks}
        gradeValue={gradeValue}
        setGradeValue={setGradeValue}
        gradeComment={gradeComment}
        setGradeComment={setGradeComment}
      />
      {activeMeeting?.isOpen && (
        <VideoMeetingModal
        activeMeeting={activeMeeting}
        setActiveMeeting={setActiveMeeting}
        isEmbeddedStream={isEmbeddedStream}
        setIsEmbeddedStream={setIsEmbeddedStream}
        isDarkMode={isDarkMode}
        user={user}
        activeMeetingUrl={activeMeetingUrl}
        setActiveMeetingUrl={setActiveMeetingUrl}
        selectedCourseDetail={selectedCourseDetail}
      />
      )}
      {user && (
        <FloatingChat 
          isAiChatOpen={isAiChatOpen}
          setIsAiChatOpen={setIsAiChatOpen}
          aiMessage={aiMessage}
          setAiMessage={setAiMessage}
          isAiLoading={isAiLoading}
          aiResponse={aiResponse}
          systemCommandNotification={systemCommandNotification}
          sendAiMessage={sendAiMessage}
          getUnreadCount={getUnreadCount}
          isDarkMode={isDarkMode}
          user={user}
          setAiResponse={setAiResponse}
          setSystemCommandNotification={setSystemCommandNotification}
        />
      )}
    </div>
  );
};

export default App;



