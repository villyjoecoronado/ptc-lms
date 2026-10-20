import { useState, useEffect } from 'react';

export const useAppState = () => {
  // Basic Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [securityLevel, setSecurityLevel] = useState("Standard");
  const [isKeyRotating, setIsKeyRotating] = useState(false);
  const [showSessionLogs, setShowSessionLogs] = useState(false);
  
  // Navigation State
  const [activeNav, setActiveNav] = useState('Home');
  const [view, setView] = useState("dashboard");
  const [calendarMonth, setCalendarMonth] = useState("April 2026");
  
  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Chat & Messaging States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState("messages");
  
  // Calendar & Todo States
  const [todoTab, setTodoTab] = useState("assigned");
  const [selectedDate, setSelectedDate] = useState(6);
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Settings & Interactive States
  const [settingsTab, setSettingsTab] = useState("profile");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [activeCCTab, setActiveCCTab] = useState('identity');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showKillSessionsModal, setShowKillSessionsModal] = useState(false);
  const [storageUsage, setStorageUsage] = useState(65);
  const [isSyncing, setIsSyncing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  
  // Premium Features State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [courseTab, setCourseTab] = useState('overview');
  const [chatTab, setChatTab_] = useState('messages');
  
  // AI & Task States
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTaskDate, setSelectedTaskDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Data States
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Chapter 5 Quiz", completed: false, dueDate: "2026-04-25", priority: 'high' },
    { id: 2, title: "Submit Lab Report", completed: true, dueDate: "2026-04-23", priority: 'medium' },
    { id: 3, title: "Review Lecture Notes", completed: false, dueDate: "2026-04-26", priority: 'low' }
  ]);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Assignment", message: "SP 101 - Chapter 5 Quiz posted", time: "2 min ago", read: false, type: "assignment" },
    { id: 2, title: "Grade Posted", message: "Your midterm grade is available", time: "1 hour ago", read: false, type: "grade" },
    { id: 3, title: "Class Update", message: "Schedule change for tomorrow", time: "3 hours ago", read: true, type: "update" }
  ]);

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Utility functions
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        dueDate: selectedTaskDate,
        priority: 'medium'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getPendingTasksCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  return {
    // Auth & Navigation
    isLoggedIn, setIsLoggedIn,
    activeSubject, setActiveSubject,
    isSidebarOpen, setSidebarOpen,
    securityLevel, setSecurityLevel,
    isKeyRotating, setIsKeyRotating,
    showSessionLogs, setShowSessionLogs,
    activeNav, setActiveNav,
    view, setView,
    calendarMonth, setCalendarMonth,
    darkMode, setDarkMode,
    
    // Chat & Messaging
    isChatOpen, setIsChatOpen,
    message, setMessage,
    chatLog, setChatLog,
    isTyping, setIsTyping,
    activeChatTab, setActiveChatTab,
    
    // Calendar & Todo
    todoTab, setTodoTab,
    selectedDate, setSelectedDate,
    isAddingTask, setIsAddingTask,
    
    // Settings
    settingsTab, setSettingsTab,
    showLanguageModal, setShowLanguageModal,
    showProfileDropdown, setShowProfileDropdown,
    selectedLanguage, setSelectedLanguage,
    activeCCTab, setActiveCCTab,
    notificationsEnabled, setNotificationsEnabled,
    twoFactorEnabled, setTwoFactorEnabled,
    showKillSessionsModal, setShowKillSessionsModal,
    storageUsage, setStorageUsage,
    isSyncing, setIsSyncing,
    profilePic, setProfilePic,
    
    // Premium Features
    showNotifications, setShowNotifications,
    showChat, setShowChat,
    showEventModal, setShowEventModal,
    showCourseModal, setShowCourseModal,
    selectedCourseDetail, setSelectedCourseDetail,
    courseTab, setCourseTab,
    chatTab: chatTab_, setChatTab: setChatTab_,
    
    // AI & Tasks
    aiMessage, setAiMessage,
    aiResponse, setAiResponse,
    isAiLoading, setIsAiLoading,
    newTaskTitle, setNewTaskTitle,
    selectedTaskDate, setSelectedTaskDate,
    
    // Data
    tasks, setTasks,
    notifications, setNotifications,
    
    // Utility functions
    addTask,
    deleteTask,
    toggleTask,
    markAllNotificationsRead,
    handleNotificationClick,
    getUnreadCount,
    getCompletedTasksCount,
    getPendingTasksCount
  };
};
