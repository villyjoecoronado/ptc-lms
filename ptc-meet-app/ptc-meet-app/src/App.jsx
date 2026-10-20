import { useState, useEffect, useRef } from 'react'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Copy,
  Lock,
  Unlock,
  Clock,
  Users,
  MessageCircle,
  Settings,
  MoreVertical,
  PhoneOff,
  Phone,
  PhoneCall,
  Hand,
  MonitorUp,
  Monitor,
  Captions,
  Info,
  Send,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  UserPlus,
  UserMinus,
  UserX,
  Volume2,
  VolumeX,
  LogOut,
  Video as VideoIcon,
  LogIn,
  Mail,
  Lock as LockIcon,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Smile,
  Heart,
  ThumbsUp,
  Laugh,
  PartyPopper,
  Clapperboard,
  PenTool,
  Pencil,
  Trash2,
  LayoutGrid,
  BarChart3,
  BarChart2,
  MessageSquare,
  DoorOpen,
  Calendar,
  Plus,
  Check,
  ChevronDown,
  Shield,
  Bell,
  User,
  ArrowRight,
  HelpCircle,
  Sun,
  Moon,
  Download,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  Paperclip,
  Keyboard,
  Grid,
  Sliders,
  ExternalLink,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Pin,
  Maximize,
  Subtitles,
  Sparkles,
  Share2,
  Compass,
  Layers,
  Radio,
  Zap,
  Award,
  Menu,
  Archive,
  BookOpen,
  ArrowUp,
  Upload,
  Link,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import './App.css'

function App() {
  // Force clear all localStorage to remove any cached mock data
  localStorage.clear();
  
  // App Navigation Step State
  const [step, setStep] = useState('login') // 'login', 'dashboard', 'classroom', 'subject', 'lobby', 'waiting', 'incall'
  
  // Theme State
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('ptc_theme') || 'dark'
  })
  
  // Authentication State
  const [user, setUser] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loginRole, setLoginRole] = useState('student')
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    studentId: '',
    password: '',
    role: 'student',
    section: ''
  })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  
  // Lobby State
  const [displayName, setDisplayName] = useState('')
  const [roomCode, setRoomCode] = useState('ptc-bsit3j-webdev')
  const [isHost, setIsHost] = useState(false)
  const [lobbyMicOn, setLobbyMicOn] = useState(true)
  const [lobbyCameraOn, setLobbyCameraOn] = useState(true)
  const [backgroundBlur, setBackgroundBlur] = useState(false)
  
  // URL Parameter Parsing
  useEffect(() => {
    // One-time localStorage clear to remove old mock data
    const hasClearedOldMockData = localStorage.getItem('ptc_mock_data_cleared')
    if (!hasClearedOldMockData) {
      // Clear all old mock data keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ptc_stream_posts') || 
            key.startsWith('ptc_classwork_items') ||
            key.startsWith('ptc_lms_posts') ||
            key.startsWith('ptc_stream_data') ||
            key.startsWith('ptc_posts_')) {
          localStorage.removeItem(key)
        }
      })
      localStorage.setItem('ptc_mock_data_cleared', 'true')
    }
    
    const urlParams = new URLSearchParams(window.location.search)
    const roleParam = urlParams.get('role')
    const userParam = urlParams.get('user')
    
    if (roleParam === 'teacher') {
      setIsHost(true)
    }
    
    if (userParam) {
      setDisplayName(userParam)
    }
  }, [])
  
  // Waiting Room State
  const [waitingForAdmission, setWaitingForAdmission] = useState(false)
  const [admissionRequests, setAdmissionRequests] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([]) // Track users denied twice
  
  // In-Call State
  const [inCall, setInCall] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [raisedHandsList, setRaisedHandsList] = useState([])
  const [showRaisedHandsQueue, setShowRaisedHandsQueue] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiReactions, setShowEmojiReactions] = useState(false)
  const [activeReaction, setActiveReaction] = useState(null)
  const [activeReactions, setActiveReactions] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [roomLocked, setRoomLocked] = useState(false)
  
  // Panel States
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showPolls, setShowPolls] = useState(false)
  const [showBreakoutRooms, setShowBreakoutRooms] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showEndCallDialog, setShowEndCallDialog] = useState(false)
  const [activePanelTab, setActivePanelTab] = useState('participants') // 'participants', 'chat', 'polls', 'breakout'
  
  // Chat State - FORCE EMPTY
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  
  // Registered Users State (localStorage persistence)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('ptc_registered_users')
    return saved ? JSON.parse(saved) : []
  })
  
  // Current User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ptc_current_user')
    return saved ? JSON.parse(saved) : null
  })
  
  // Participants State (Meeting participants only)
  const [participants, setParticipants] = useState([])
  
  // Polls State - FORCE EMPTY
  const [polls, setPolls] = useState([])
  const [newPollQuestion, setNewPollQuestion] = useState('')
  const [newPollOptions, setNewPollOptions] = useState(['', ''])
  
  // Q&A State
  const [qaQuestions, setQaQuestions] = useState([])
  const [newQaQuestion, setNewQaQuestion] = useState('')
  
  // Breakout Rooms State - FORCE EMPTY
  const [breakoutRooms, setBreakoutRooms] = useState([])
  const [showCreateBreakout, setShowCreateBreakout] = useState(false)
  const [breakoutTimer, setBreakoutTimer] = useState(10)
  const [breakoutRoomCount, setBreakoutRoomCount] = useState(2)
  
  // Clock State
  const [currentTime, setCurrentTime] = useState('')
  
  // Dashboard State
  const [dashboardTab, setDashboardTab] = useState('meetings') // 'meetings', 'calls', 'verification'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(true)
  const [joinCode, setJoinCode] = useState('')
  
  // Classroom LMS State
  const [classroomTab, setClassroomTab] = useState('stream') // 'stream', 'classwork', 'people', 'grades', 'gemini'
  const [activeSubject, setActiveSubject] = useState(null)
  
  // Archived Subjects State
  const [showArchivedClasses, setShowArchivedClasses] = useState(false)
  
  // Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Search Term State
  const [searchTerm, setSearchTerm] = useState('')
  
  // Messenger Chat State
  const [showMessenger, setShowMessenger] = useState(false)
  const [selectedChatContact, setSelectedChatContact] = useState(null)
  const [messengerMessages, setMessengerMessages] = useState(() => {
    const saved = localStorage.getItem('edupulse_messages')
    return saved ? JSON.parse(saved) : []
  })
  
  const [subjects, setSubjects] = useState([
    {
      id: 'SP101',
      code: 'SP 101',
      title: 'SOCIAL ISSUES AND PROFESSIONAL PRACTICES',
      section: 'BSIT 3J',
      badgeBg: 'bg-emerald-600 text-white',
      themeColor: '#059669',
      roomCode: 'ptc-sp101-3j',
      isArchived: false
    },
    {
      id: 'CAPSTONE1',
      code: 'CAPSTONE 1',
      title: 'CAPSTONE 1',
      section: 'BSIT 3J',
      badgeBg: 'bg-rose-800 text-white',
      themeColor: '#9f1239',
      roomCode: 'ptc-capstone1-3j',
      isArchived: false
    },
    {
      id: 'SIA101',
      code: 'SIA 101',
      title: 'System Integration and Architecture 1',
      section: 'BSIT 3J',
      badgeBg: 'bg-cyan-600 text-white',
      themeColor: '#0891b2',
      roomCode: 'ptc-sia101-3j',
      isArchived: false
    },
    {
      id: 'TECH32',
      code: 'TECH 32',
      title: 'Technopreneurship',
      professor: 'Prof. Katherine C. Baggay',
      section: 'BSIT 3J',
      badgeBg: 'bg-amber-600 text-white',
      themeColor: '#d97706',
      roomCode: 'ptc-tech32-3j',
      isArchived: false
    },
    {
      id: 'MRC22',
      code: 'MRC 22',
      title: 'Methods of Research in Computing',
      section: 'BSIT 3J',
      badgeBg: 'bg-purple-600 text-white',
      themeColor: '#9333ea',
      roomCode: 'ptc-mrc22-3j',
      isArchived: false
    },
    {
      id: 'WS102',
      code: 'WS 102',
      title: 'Web Programming',
      professor: 'Prof. Roclyn Yamson',
      section: 'BSIT 3J',
      badgeBg: 'bg-indigo-600 text-white',
      themeColor: '#4f46e5',
      roomCode: 'ptc-ws102-3j',
      isArchived: false
    },
    {
      id: 'EMBED101',
      code: 'EMBED 101',
      title: 'EMBEDDED SYSTEMS/ROBOTICS',
      section: 'BSIT 3J',
      badgeBg: 'bg-fuchsia-600 text-white',
      themeColor: '#c026d3',
      roomCode: 'ptc-embed101-3j',
      isArchived: false
    },
    {
      id: 'NET102',
      code: 'NET 102',
      title: 'NETWORK ADMINISTRATION AND MAINTENANCE',
      section: 'BSIT 3J',
      badgeBg: 'bg-slate-700 text-white',
      themeColor: '#334155',
      roomCode: 'ptc-net102-3j',
      isArchived: false
    }
  ])
  
  // Stream Announcements Data (dynamic per subject) - FORCE EMPTY
  const [streamPosts, setStreamPosts] = useState([])
  
  // Classwork Data (dynamic per subject) - FORCE EMPTY
  const [classworkItems, setClassworkItems] = useState([])
  
  // Grades Data - FORCE EMPTY
  const [gradesData, setGradesData] = useState([])
  
  // Real-time Event Engine - Listen for LMS updates
  useEffect(() => {
    // Listen for post deletions
    const handlePostDeleted = (event) => {
      const { postId } = event.detail
      setStreamPosts(prev => prev.filter(post => post?.id !== postId))
    }
    
    // Listen for comment deletions
    const handleCommentDeleted = (event) => {
      const { postId, commentId } = event.detail
      setStreamPosts(prev => prev.map(post =>
        post?.id === postId
          ? { ...post, comments: post?.comments?.filter(c => c?.id !== commentId) || [] }
          : post
      ))
    }
    
    // Listen for classwork deletions
    const handleClassworkDeleted = (event) => {
      const { itemId } = event.detail
      setClassworkItems(prev => prev.filter(item => item?.id !== itemId))
    }
    
    // Listen for comment-specific updates
    const handleCommentAdded = (event) => {
      const { postId, newComment, type } = event.detail
      if (selectedAssignment?.id === postId) {
        if (type === 'class') {
          setClassComments(prev => [...prev, newComment])
        } else if (type === 'private') {
          setPrivateComments(prev => [...prev, newComment])
        }
      }
    }
    
    window.addEventListener('lms-post-deleted', handlePostDeleted)
    window.addEventListener('lms-comment-deleted', handleCommentDeleted)
    window.addEventListener('lms-classwork-deleted', handleClassworkDeleted)
    window.addEventListener('lms-comment-added', handleCommentAdded)
    
    return () => {
      window.removeEventListener('lms-post-deleted', handlePostDeleted)
      window.removeEventListener('lms-comment-deleted', handleCommentDeleted)
      window.removeEventListener('lms-classwork-deleted', handleClassworkDeleted)
      window.removeEventListener('lms-comment-added', handleCommentAdded)
    }
  }, [selectedAssignment?.id])
  
  // Helper to dispatch LMS update event
  const dispatchLMSUpdate = () => {
    window.dispatchEvent(new Event('lms-update'))
  }
  
  // Assignment Detail State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [assignmentSubmissions, setAssignmentSubmissions] = useState(() => {
    const saved = localStorage.getItem('ptc_assignment_submissions')
    return saved ? JSON.parse(saved) : {}
  })
  const [attachedFiles, setAttachedFiles] = useState([])
  const [privateComments, setPrivateComments] = useState([])
  const [newPrivateComment, setNewPrivateComment] = useState('')
  const [classComments, setClassComments] = useState([])
  const [newClassComment, setNewClassComment] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showLinkInputModal, setShowLinkInputModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [newStreamPost, setNewStreamPost] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const fileInputRef = useRef(null)
  
  // Google Meet Direct Join State
  const [activeMeetingSubject, setActiveMeetingSubject] = useState(null)
  const [isInActiveMeeting, setIsInActiveMeeting] = useState(false)
  const [meetMicOn, setMeetMicOn] = useState(true)
  const [meetVideoOn, setMeetVideoOn] = useState(true)
  const [meetHandRaised, setMeetHandRaised] = useState(false)
  const [meetScreenSharing, setMeetScreenSharing] = useState(false)
  const [meetChatOpen, setMeetChatOpen] = useState(false)
  const [meetParticipantsOpen, setMeetParticipantsOpen] = useState(false)
  const [meetDuration, setMeetDuration] = useState(0)
  
  // Meet Feature States
  const [activeMeetSideDrawer, setActiveMeetSideDrawer] = useState(null) // 'chat', 'people', 'hostControls', null
  const [isCaptionsOn, setIsCaptionsOn] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showScreenShareModal, setShowScreenShareModal] = useState(false)
  const [showLayoutModal, setShowLayoutModal] = useState(false)
  const [showVirtualBackgroundModal, setShowVirtualBackgroundModal] = useState(false)
  const [showMeetHardwareSettings, setShowMeetHardwareSettings] = useState(false)
  const [showMoreOptionsDropdown, setShowMoreOptionsDropdown] = useState(false)
  const [showEndCallConfirmModal, setShowEndCallConfirmModal] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState('tiled') // 'tiled', 'spotlight', 'sidebar', 'auto'
  const [selectedVirtualBackground, setSelectedVirtualBackground] = useState('none') // 'none', 'blur', 'classroom', 'office', 'ai'
  const [shareAudio, setShareAudio] = useState(false) // Audio share toggle for screen sharing
  
  // Live Captions State
  const [liveCaptions, setLiveCaptions] = useState([])
  const [captionLanguage, setCaptionLanguage] = useState('en-US')
  const recognitionRef = useRef(null)
  
  // Host Control States
  const [hostMuteAll, setHostMuteAll] = useState(false)
  const [hostTurnOffCameras, setHostTurnOffCameras] = useState(false)
  const [hostRestrictScreenShare, setHostRestrictScreenShare] = useState(false)
  const [hostLockChat, setHostLockChat] = useState(false)
  const [hostMeetingLock, setHostMeetingLock] = useState(false)
  
  // Hardware Settings States
  const [selectedCamera, setSelectedCamera] = useState('Default - FaceTime HD Camera')
  const [selectedVideoResolution, setSelectedVideoResolution] = useState('720p')
  const [noiseSuppressionEnabled, setNoiseSuppressionEnabled] = useState(false)
  
  // Profile Settings State
  const [avatarColor, setAvatarColor] = useState('#3b82f6')
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'Student User',
    role: user?.role || 'student',
    department: user?.department || 'Computer Science',
    email: user?.email || 'student@ptc.edu.ph'
  })
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [cropZoom, setCropZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  
  // Edit/Delete State for Posts and Comments
  const [editingPostId, setEditingPostId] = useState(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editPostContent, setEditPostContent] = useState('')
  const [editCommentContent, setEditCommentContent] = useState('')
  const [editChatContent, setEditChatContent] = useState('')
  
  // Modal States
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  
  // Meet Module Utilities Toolbar States
  const [showMeetSupportMenu, setShowMeetSupportMenu] = useState(false)
  const [showMeetSettingsModal, setShowMeetSettingsModal] = useState(false)
  const [showAppsGridPopover, setShowAppsGridPopover] = useState(false)
  const [meetSettingsTab, setMeetSettingsTab] = useState('audio') // 'audio', 'video', 'callhistory', 'general'
  const [selectedMicrophone, setSelectedMicrophone] = useState('Default - Internal Mic')
  const [selectedSpeaker, setSelectedSpeaker] = useState('Speakers (Realtek(R) Audio)')
  
  // Video Ref
  const videoRef = useRef(null)
  const whiteboardRef = useRef(null)
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Theme Effect
  useEffect(() => {
    const root = document.documentElement
    if (themeMode === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('ptc_theme', themeMode)
  }, [themeMode])
  
  // Theme Toggle Handler
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')
  }
  
  // Messenger Messages Persistence Effect
  useEffect(() => {
    localStorage.setItem('edupulse_messages', JSON.stringify(messengerMessages))
  }, [messengerMessages])
  
  // Send Messenger Message Handler
  const handleSendMessengerMessage = (message) => {
    if (!message.trim() || !selectedChatContact) return
    
    const newMessage = {
      id: Date.now(),
      sender: user?.name || 'You',
      senderId: user?.id || 'user-1',
      recipient: selectedChatContact.name,
      recipientId: selectedChatContact.id,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    }
    
    setMessengerMessages(prev => [...prev, newMessage])
    dispatchLMSUpdate()
  }
  
  // Delete Messenger Message Handler
  const handleDeleteMessengerMessage = (messageId) => {
    setMessengerMessages(prev => prev.filter(msg => msg.id !== messageId))
  }
  
  // Archive Subject Handler
  const handleArchiveSubject = (subjectId) => {
    setSubjects(prev => prev.map(subj => 
      subj?.id === subjectId ? { ...subj, isArchived: true } : subj
    ))
    showToastMessage('Subject archived successfully')
  }
  
  // Restore Subject Handler
  const handleRestoreSubject = (subjectId) => {
    setSubjects(prev => prev.map(subj => 
      subj?.id === subjectId ? { ...subj, isArchived: false } : subj
    ))
    showToastMessage('Subject restored successfully')
  }
  
  // Role-based Permission Check Helper
  const isAdminOrProfessor = () => {
    return user?.role === 'admin' || user?.role === 'professor' || loginRole === 'professor'
  }
  
  const isStudent = () => {
    return user?.role === 'student' || loginRole === 'student'
  }
  
  // Toast Handler
  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }
  
  // Forgot Password Handler
  const handleForgotPassword = () => {
    if (forgotPasswordEmail.trim()) {
      showToastMessage('Password reset link sent to ' + forgotPasswordEmail)
      setShowForgotPassword(false)
      setForgotPasswordEmail('')
    } else {
      showToastMessage('Please enter your email address')
    }
  }
  
  // Quick Login Handlers
  const handleQuickLogin = (role) => {
    if (role === 'student') {
      setLoginEmail('student@ptc.edu.ph')
      setLoginPassword('student')
      setLoginRole('student')
    } else if (role === 'admin') {
      setLoginEmail('admin@ptc.edu.ph')
      setLoginPassword('admin')
      setLoginRole('professor')
    }
  }
  
  // Google/PTC Account Quick Fill
  const handleGoogleLogin = () => {
    setLoginEmail('student@ptc.edu.ph')
    setLoginPassword('student')
    setLoginRole('student')
    setTimeout(() => handleLogin(), 500)
  }

  // URL Parameter Parsing for LMS Integration
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomFromLMS = queryParams.get('room');
    const nameFromLMS = queryParams.get('name');
    const roleFromLMS = queryParams.get('role');

    if (roomFromLMS) {
      setRoomCode(roomFromLMS);
    }
    if (nameFromLMS) {
      setDisplayName(decodeURIComponent(nameFromLMS));
    }
    if (roleFromLMS) {
      setLoginRole(roleFromLMS);
    }

    // Auto-skip login screen if authenticated credentials exist from LMS
    if (roomFromLMS && nameFromLMS) {
      const decodedName = decodeURIComponent(nameFromLMS);
      const userRole = roleFromLMS || 'student';
      setUser({
        id: 'lms-' + Math.floor(Math.random() * 10000),
        name: decodedName,
        email: `${decodedName.toLowerCase().replace(/\s+/g, '.')}@ptc.edu.ph`,
        role: userRole,
        section: 'BSIT 3-A',
        avatar: decodedName.charAt(0).toUpperCase()
      });
      setStep('lobby'); // Directly enter pre-meeting Lobby with credentials pre-filled
    }
  }, [])
  
  // Authentication Handlers
  const handleLogin = () => {
    // Find user in registered users
    const foundUser = registeredUsers.find(
      u => u.email === loginEmail && u.password === loginPassword
    )
    
    if (!foundUser) {
      showToastMessage('Account not found. Please create an account first.')
      return
    }
    
    if (foundUser.status === 'PENDING_VERIFICATION') {
      showToastMessage('Your account is still pending verification by school administrators.')
      return
    }
    
    if (foundUser.status !== 'APPROVED') {
      showToastMessage('Your account has been rejected. Please contact administration.')
      return
    }
    
    // Login successful
    const newUser = {
      id: foundUser.id,
      name: foundUser.fullName,
      email: foundUser.email,
      studentId: foundUser.studentId,
      role: foundUser.role,
      section: foundUser.section,
      avatar: foundUser.fullName.charAt(0).toUpperCase()
    }
    setUser(newUser)
    setDisplayName(newUser.name)
    setIsHost(newUser.role === 'professor' || newUser.role === 'admin' || newUser.role === 'dean')
    localStorage.setItem('ptc_current_user', JSON.stringify(newUser))
    setStep('dashboard')
  }
  
  const handleRegister = (formData) => {
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      studentId: formData.studentId,
      role: formData.role,
      section: formData.section,
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString()
    }
    
    const updatedUsers = [...registeredUsers, newUser]
    setRegisteredUsers(updatedUsers)
    localStorage.setItem('ptc_registered_users', JSON.stringify(updatedUsers))
    
    // Show pending verification screen
    setStep('pending_verification')
  }
  
  const handleLogout = () => {
    setUser(null)
    setStep('login')
    setLoginEmail('')
    setLoginPassword('')
  }
  
  // Dashboard Handlers
  const handleJoinFromDashboard = () => {
    if (joinCode.trim()) {
      setRoomCode(joinCode)
      setStep('lobby')
    }
  }
  
  const handleNewMeeting = () => {
    setStep('lobby')
  }
  
  // Classroom Handlers
  const handleNavigateToClassroom = () => {
    setStep('classroom')
  }
  
  const handleSelectSubject = (subject) => {
    setActiveSubject(subject)
    setClassroomTab('stream')
    setStep('subject')
  }
  
  const handleJoinClassMeeting = () => {
    if (activeSubject?.roomCode) {
      setRoomCode(activeSubject.roomCode)
      setStep('lobby')
    }
  }
  
  const handleReturnToClassroom = () => {
    setStep('subject')
  }
  
  const handleReturnToDashboard = () => {
    setStep('classroom')
    setActiveSubject(null)
  }
  
  // Dynamic Initials Avatar Generator
  const getInstructorInitials = (name) => {
    if (!name) return 'I'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }
  
  // Dynamic Instructor Name Getter
  const getInstructorName = () => {
    return activeSubject?.instructor || 'Instructor'
  }
  
  // Assignment Detail Handlers
  const handleOpenAssignment = (assignment) => {
    setSelectedAssignment(assignment)
    const submission = assignmentSubmissions[assignment?.id] || { status: 'assigned', files: [], comments: [], classComments: [] }
    setAttachedFiles(submission?.files || [])
    setPrivateComments(submission?.comments || [])
    setClassComments(submission?.classComments || [])
    setShowAssignmentModal(true)
  }
  
  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false)
    setSelectedAssignment(null)
    setAttachedFiles([])
    setPrivateComments([])
    setClassComments([])
    setNewPrivateComment('')
    setNewClassComment('')
  }
  
  const handleAttachFile = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type
      }
      setAttachedFiles(prev => [...prev, newFile])
    })
  }
  
  const handleDeleteFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(f => f?.id !== fileId))
  }
  
  const handleAddLink = () => {
    if (linkUrl.trim()) {
      const newFile = {
        id: Date.now(),
        name: linkUrl,
        size: 'Link',
        type: 'link'
      }
      setAttachedFiles(prev => [...prev, newFile])
      setLinkUrl('')
      setShowLinkInputModal(false)
    }
  }
  
  const handleSendClassComment = () => {
    if (newClassComment.trim()) {
      const comment = {
        id: Date.now(),
        author: user?.name || displayName || 'You',
        authorAvatar: (user?.name || displayName || 'You').charAt(0),
        timestamp: new Date().toLocaleString(),
        text: newClassComment
      }
      const updatedComments = [...classComments, comment]
      setClassComments(updatedComments)
      
      // Save to localStorage
      const submission = assignmentSubmissions[selectedAssignment?.id] || { status: 'assigned', files: [], comments: [], classComments: [] }
      submission.classComments = updatedComments
      setAssignmentSubmissions({
        ...assignmentSubmissions,
        [selectedAssignment?.id]: submission
      })
      localStorage.setItem('ptc_assignment_submissions', JSON.stringify({
        ...assignmentSubmissions,
        [selectedAssignment?.id]: submission
      }))
      
      // Dispatch custom event for real-time sync
      window.dispatchEvent(new CustomEvent('lms-comment-added', {
        detail: { postId: selectedAssignment?.id, newComment: comment, type: 'class' }
      }))
      
      setNewClassComment('')
    }
  }
  
  const handleDeleteFile = (fileId) => {
    setAttachedFiles(attachedFiles?.filter(file => file?.id !== fileId) || [])
  }
  
  const handleTurnIn = () => {
    const submission = {
      status: 'turned_in',
      files: attachedFiles || [],
      comments: privateComments || [],
      classComments: classComments || [],
      turnedInAt: new Date().toISOString()
    }
    setAssignmentSubmissions({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    })
    localStorage.setItem('ptc_assignment_submissions', JSON.stringify({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    }))
    dispatchLMSUpdate()
    showToastMessage('Assignment turned in successfully')
  }
  
  const handleMarkAsDone = () => {
    const submission = {
      status: 'turned_in',
      files: [],
      comments: privateComments || [],
      classComments: classComments || [],
      turnedInAt: new Date().toISOString()
    }
    setAssignmentSubmissions({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    })
    localStorage.setItem('ptc_assignment_submissions', JSON.stringify({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    }))
    dispatchLMSUpdate()
    showToastMessage('Assignment marked as done')
  }
  
  const handleUnsubmit = () => {
    const submission = {
      status: 'assigned',
      files: attachedFiles || [],
      comments: privateComments || [],
      classComments: classComments || []
    }
    setAssignmentSubmissions({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    })
    localStorage.setItem('ptc_assignment_submissions', JSON.stringify({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    }))
    dispatchLMSUpdate()
    showToastMessage('Assignment unsubmitted - you can now edit your work')
  }
  
  const handleResubmit = () => {
    const submission = {
      status: 'turned_in',
      files: attachedFiles || [],
      comments: privateComments || [],
      classComments: classComments || [],
      turnedInAt: new Date().toISOString()
    }
    setAssignmentSubmissions({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    })
    localStorage.setItem('ptc_assignment_submissions', JSON.stringify({
      ...assignmentSubmissions,
      [selectedAssignment?.id]: submission
    }))
    dispatchLMSUpdate()
    showToastMessage('Assignment resubmitted successfully')
  }
  
  const handleSendPrivateComment = () => {
    if (newPrivateComment?.trim()) {
      const comment = {
        id: Date.now(),
        author: user?.name || 'You',
        authorAvatar: (user?.name || 'You').charAt(0),
        message: newPrivateComment,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      const updatedComments = [...privateComments, comment]
      setPrivateComments(updatedComments)
      
      // Save to localStorage
      const submission = assignmentSubmissions[selectedAssignment?.id] || { status: 'assigned', files: [], comments: [], classComments: [] }
      submission.comments = updatedComments
      setAssignmentSubmissions({
        ...assignmentSubmissions,
        [selectedAssignment?.id]: submission
      })
      localStorage.setItem('ptc_assignment_submissions', JSON.stringify({
        ...assignmentSubmissions,
        [selectedAssignment?.id]: submission
      }))
      
      // Dispatch custom event for real-time sync
      window.dispatchEvent(new CustomEvent('lms-comment-added', {
        detail: { postId: selectedAssignment?.id, newComment: comment, type: 'private' }
      }))
      
      setNewPrivateComment('')
    }
  }
  
  const getAssignmentStatus = () => {
    const submission = assignmentSubmissions[selectedAssignment?.id]
    return submission?.status || 'assigned'
  }
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
      case 'turned_in': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'turned_in_late': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      case 'graded': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    }
  }
  
  // Google Meet Direct Join Handlers
  const handleDirectJoinMeeting = () => {
    setActiveMeetingSubject(activeSubject)
    setIsInActiveMeeting(true)
    setMeetDuration(0)
  }
  
  const handleLeaveMeeting = () => {
    setIsInActiveMeeting(false)
    setActiveMeetingSubject(null)
    setMeetMicOn(true)
    setMeetVideoOn(true)
    setMeetHandRaised(false)
    setMeetScreenSharing(false)
    setMeetChatOpen(false)
    setMeetParticipantsOpen(false)
  }
  
  const handleToggleMic = () => {
    setMeetMicOn(!meetMicOn)
  }
  
  const handleToggleVideo = () => {
    setMeetVideoOn(!meetVideoOn)
  }
  
  const handleToggleHand = () => {
    setMeetHandRaised(!meetHandRaised)
  }
  
  const handleToggleScreenShare = async (shareType = 'screen') => {
    if (meetScreenSharing) {
      // Stop sharing and restore camera quality
      setMeetScreenSharing(false)
      showToastMessage('Screen sharing stopped')
      return
    }
    
    try {
      let mediaStream
      const constraints = {
        video: true,
        audio: shareAudio
      }
      
      if (shareType === 'screen') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: shareAudio })
      } else if (shareType === 'window') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: shareAudio })
      } else if (shareType === 'tab') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: shareAudio })
      }
      
      if (mediaStream) {
        // Presenter performance optimization: reduce camera framerate when sharing
        if (meetVideoOn) {
          // In a real implementation, this would adjust the video track constraints
          // For now, we'll simulate the optimization by updating state
          console.log('Optimizing camera performance for screen sharing')
        }
        
        setMeetScreenSharing(true)
        setShowScreenShareModal(false)
        showToastMessage(`Sharing ${shareType}${shareAudio ? ' with audio' : ''}`)
        
        // Handle stream stop
        mediaStream.getVideoTracks()[0].onended = () => {
          setMeetScreenSharing(false)
          showToastMessage('Screen sharing stopped')
        }
      }
    } catch (error) {
      console.error('Error sharing screen:', error)
      showToastMessage('Failed to share screen')
    }
  }
  
  const handleToggleChat = () => {
    setMeetChatOpen(!meetChatOpen)
    if (meetChatOpen) {
      setMeetParticipantsOpen(false)
    }
  }
  
  const handleToggleParticipants = () => {
    setMeetParticipantsOpen(!meetParticipantsOpen)
    if (meetParticipantsOpen) {
      setMeetChatOpen(false)
    }
  }
  
  // Format meeting duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Live Captions Handlers
  useEffect(() => {
    if (isCaptionsOn) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = captionLanguage
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')
          
          if (event.results[event.results.length - 1].isFinal) {
            const newCaption = {
              id: Date.now(),
              speaker: user?.name || displayName || 'You',
              text: transcript,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setLiveCaptions(prev => [...prev.slice(-9), newCaption]) // Keep last 10 captions
          }
        }
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
        }
        
        recognition.start()
        recognitionRef.current = recognition
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isCaptionsOn, captionLanguage, user, displayName])
  
  // Meeting duration timer effect
  useEffect(() => {
    let interval
    if (isInActiveMeeting) {
      interval = setInterval(() => {
        setMeetDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInActiveMeeting])
  
  // Profile Settings Handlers
  const handleAvatarColorChange = (color) => {
    setAvatarColor(color)
  }
  
  const handleCropMouseDown = (e) => {
    setIsDragging(true)
    setCropPosition({ x: e.clientX, y: e.clientY })
  }
  
  const handleCropMouseMove = (e) => {
    if (isDragging) {
      setCropPosition({
        x: e.clientX - cropPosition.x,
        y: e.clientY - cropPosition.y
      })
    }
  }
  
  const handleCropMouseUp = () => {
    setIsDragging(false)
  }
  
  const handleCropZoomChange = (e) => {
    setCropZoom(parseFloat(e.target.value))
  }
  
  const handleSaveAccountSettings = () => {
    setUserProfile(prev => ({ ...prev }))
    setShowAccountSettingsModal(false)
    // Show toast notification
    setToastMessage('Account settings saved successfully')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }
  
  const handleUpdateUserProfile = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }))
  }
  
  // Edit/Delete Handlers for Posts and Comments
  const isOwner = (itemAuthor) => {
    return itemAuthor === user?.name || itemAuthor === userProfile?.name
  }
  
  const canModerate = () => {
    const role = userProfile?.role || user?.role || registeredUsers.find(u => u.email === user?.email)?.role
    return role === 'admin' || role === 'dean' || role === 'instructor' || role === 'prof' || role === 'professor'
  }
  
  const isAdminOrProf = () => {
    return userProfile?.role === 'instructor' || userProfile?.role === 'admin' || userProfile?.role === 'prof'
  }
  
  const handleEditPost = (postId, content) => {
    setEditingPostId(postId)
    setEditPostContent(content)
  }
  
  const handleSavePostEdit = (postId) => {
    const updatedPosts = streamPosts.map(post => 
      post?.id === postId 
        ? { ...post, content: editPostContent, edited: true }
        : post
    )
    setStreamPosts(updatedPosts)
    const subjectKey = activeSubject?.roomCode || 'default'
    localStorage.setItem(`ptc_stream_posts_${subjectKey}`, JSON.stringify(updatedPosts))
    dispatchLMSUpdate()
  }
  
  const handleCancelPostEdit = () => {
    setEditingPostId(null)
    setEditPostContent('')
  }
  
  const handleDeletePost = (postId) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    
    const updatedPosts = streamPosts.filter(post => post?.id !== postId)
    setStreamPosts(updatedPosts)
    const subjectKey = activeSubject?.roomCode || 'default'
    localStorage.setItem(`ptc_stream_posts_${subjectKey}`, JSON.stringify(updatedPosts))
    window.dispatchEvent(new CustomEvent('lms-post-deleted', { detail: { postId } }))
    showToastMessage('Post deleted successfully')
  }
  
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId)
    setEditCommentContent(content)
  }
  
  const handleSaveCommentEdit = (commentId) => {
    const updatedPosts = streamPosts.map(post => ({
      ...post,
      comments: post?.comments?.map(comment =>
        comment?.id === commentId
          ? { ...comment, message: editCommentContent, edited: true }
          : comment
      ) || []
    }))
    setStreamPosts(updatedPosts)
    const subjectKey = activeSubject?.roomCode || 'default'
    localStorage.setItem(`ptc_stream_posts_${subjectKey}`, JSON.stringify(updatedPosts))
    dispatchLMSUpdate()
    setEditingCommentId(null)
    setEditCommentContent('')
  }
  
  const handleCancelCommentEdit = () => {
    setEditingCommentId(null)
    setEditCommentContent('')
  }
  
  const handleDeleteComment = (postId, commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    const updatedPosts = streamPosts.map(post =>
      post?.id === postId
        ? { ...post, comments: post?.comments?.filter(c => c?.id !== commentId) || [] }
        : post
    )
    setStreamPosts(updatedPosts)
    const subjectKey = activeSubject?.roomCode || 'default'
    localStorage.setItem(`ptc_stream_posts_${subjectKey}`, JSON.stringify(updatedPosts))
    window.dispatchEvent(new CustomEvent('lms-comment-deleted', { detail: { postId, commentId } }))
    showToastMessage('Comment deleted successfully')
  }
  
  const handleDeleteClassworkItem = (itemId) => {
    const updatedItems = classworkItems.filter(item => item?.id !== itemId)
    setClassworkItems(updatedItems)
    const subjectKey = activeSubject?.roomCode || 'default'
    localStorage.setItem(`ptc_classwork_items_${subjectKey}`, JSON.stringify(updatedItems))
    window.dispatchEvent(new CustomEvent('lms-classwork-deleted', { detail: { itemId } }))
    showToastMessage('Assignment deleted successfully')
  }
  
  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }
  
  const handleCreateStreamPost = () => {
    if (!newStreamPost?.trim()) return
    
    const newPost = {
      id: Date.now(),
      type: 'announcement',
      author: user?.name || displayName || 'You',
      content: newStreamPost,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      comments: []
    }
    
    const updatedPosts = [...streamPosts, newPost]
    setStreamPosts(updatedPosts)
    const subjectKey = activeSubject?.roomCode || 'default'
    localStorage.setItem(`ptc_stream_posts_${subjectKey}`, JSON.stringify(updatedPosts))
    dispatchLMSUpdate()
    setNewStreamPost('')
  }
  
  const handleEditChat = (chatId, content) => {
    setEditingChatId(chatId)
    setEditChatContent(content)
  }
  
  const handleSaveChatEdit = (chatId) => {
    setChatMessages(prev => prev.map(msg =>
      msg?.id === chatId
        ? { ...msg, message: editChatContent, edited: true }
        : msg
    ))
    setEditingChatId(null)
    setEditChatContent('')
  }
  
  const handleCancelChatEdit = () => {
    setEditingChatId(null)
    setEditChatContent('')
  }
  
  const handleDeleteChat = (chatId) => {
    setChatMessages(prev => prev.filter(msg => msg?.id !== chatId))
  }
  
  // Role-based Google Meet Features
  const isMeetingHost = () => {
    return userProfile?.role === 'instructor' || userProfile?.role === 'admin' || userProfile?.role === 'prof'
  }
  
  const canMuteAll = () => {
    return isMeetingHost()
  }
  
  const canLockMeeting = () => {
    return isMeetingHost()
  }
  
  const canRecordMeeting = () => {
    return isMeetingHost()
  }
  
  const handleDateChange = (daysOffset) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + daysOffset)
    setSelectedDate(newDate)
  }
  
  const handleAllowNotifications = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setShowNotificationPrompt(false)
      }
    })
  }
  
  // Lobby Handlers
  const handleJoin = () => {
    if (isHost) {
      setStep('incall')
      setInCall(true)
      setMicOn(lobbyMicOn)
      setCameraOn(lobbyCameraOn)
    } else {
      setStep('waiting')
      setWaitingForAdmission(true)
      // Simulate admission request
      const request = {
        id: Date.now(),
        name: user?.name || displayName,
        email: user?.email,
        timestamp: currentTime
      }
      setAdmissionRequests([...admissionRequests, request])
    }
  }
  
  const handleCreateMeeting = () => {
    const newRoomCode = 'ptc-' + Math.random().toString(36).substring(2, 10)
    setRoomCode(newRoomCode)
    setIsHost(true)
    setStep('incall')
    setInCall(true)
    setMicOn(lobbyMicOn)
    setCameraOn(lobbyCameraOn)
  }
  
  // Waiting Room Handlers
  const handleAdmitRequest = (requestId) => {
    setAdmissionRequests(admissionRequests.filter(req => req.id !== requestId))
    setStep('incall')
    setInCall(true)
    setWaitingForAdmission(false)
  }
  
  const handleDenyRequest = (requestId) => {
    const request = admissionRequests.find(req => req.id === requestId)
    if ( request) {
      // Track deny count for this user
      const existingBlocks = blockedUsers.filter(b => b.email === request.email)
      if (existingBlocks.length >= 1) {
        // Second deny - block user
        setBlockedUsers([...blockedUsers, { email: request.email, name: request.name, timestamp: Date.now() }])
        setAdmissionRequests(admissionRequests.filter(req => req.id !== requestId))
        if (waitingForAdmission) {
          setStep('lobby')
          setWaitingForAdmission(false)
        }
        showToastMessage(`${request.name} has been blocked from joining`)
      } else {
        // First deny - just remove request
        setBlockedUsers([...blockedUsers, { email: request.email, name: request.name, denyCount: 1, timestamp: Date.now() }])
        setAdmissionRequests(admissionRequests.filter(req => req.id !== requestId))
        if (waitingForAdmission) {
          setStep('lobby')
          setWaitingForAdmission(false)
        }
        showToastMessage('Request denied')
      }
    }
  }
  
  // In-Call Handlers
  const handleLeave = () => {
    setInCall(false)
    setStep('lobby')
    setShowEndCallDialog(false)
    setShowParticipants(false)
    setShowChat(false)
  }
  
  const handleEndCallForEveryone = () => {
    setInCall(false)
    setShowEndCallDialog(false)
  }
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: displayName || 'You',
        message: newMessage,
        time: currentTime
      }
      setChatMessages([...chatMessages, message])
      setNewMessage('')
    }
  }
  
  const toggleParticipantMic = (id) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, micOn: !p.micOn } : p
    ))
  }
  
  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id))
  }
  
  const muteAll = () => {
    setParticipants(participants.map(p => 
      p.role === 'student' ? { ...p, micOn: false } : p
    ))
  }
  
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
  }
  
  // Emoji Reactions Handler
  const handleReaction = (emoji) => {
    setActiveReaction(emoji)
    setShowEmojiReactions(true)
    setTimeout(() => {
      setActiveReaction(null)
      setShowEmojiReactions(false)
    }, 3000)
  }
  
  // Floating Emoji Reactions Handler
  const triggerEmoji = (emojiSymbol) => {
    const id = Date.now()
    const leftPosition = Math.random() * 60 + 20 // Random position between 20% and 80%
    
    setActiveReactions(prev => [...prev, { id, emojiSymbol, leftPosition }])
    
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(reaction => reaction.id !== id))
    }, 2000)
  }
  
  // Hand Raise Queue Handler
  const toggleHandRaise = () => {
    if (!isHandRaised) {
      setIsHandRaised(true)
      setRaisedHandsList(prev => [...prev, { id: 'user-1', name: 'You', timestamp: Date.now() }])
    } else {
      setIsHandRaised(false)
      setRaisedHandsList(prev => prev.filter(item => item.id !== 'user-1'))
    }
  }
  
  // Attendance CSV Export Handler
  const exportAttendanceCSV = () => {
    try {
      const csvContent = [
        ['Name', 'Role', 'Status', 'Join Time'],
        ...participants.map(p => [
          p.name,
          p.role,
          p.micOn ? 'Active' : 'Muted',
          currentTime
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      const date = new Date().toISOString().split('T')[0]
      link.setAttribute('href', url)
      link.setAttribute('download', `PTC_Meet_Attendance_${date}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      showToastMessage('Attendance exported successfully')
    } catch (error) {
      console.error('Error exporting attendance:', error)
      showToastMessage('Failed to export attendance')
    }
  }
  
  // Poll Handlers
  const handleCreatePoll = () => {
    if (newPollQuestion.trim() && newPollOptions.filter(opt => opt.trim()).length >= 2) {
      const newPoll = {
        id: polls.length + 1,
        question: newPollQuestion,
        options: newPollOptions.filter(opt => opt.trim()),
        active: true,
        responses: {}
      }
      setPolls([...polls, newPoll])
      setNewPollQuestion('')
      setNewPollOptions(['', ''])
    }
  }
  
  const handleAddPollOption = () => {
    setNewPollOptions([...newPollOptions, ''])
  }
  
  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...newPollOptions]
    updatedOptions[index] = value
    setNewPollOptions(updatedOptions)
  }
  
  const handleRespondToPoll = (pollId, optionIndex) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const responses = { ...poll.responses }
        responses[user?.name || displayName] = optionIndex
        return { ...poll, responses }
      }
      return poll
    }))
  }
  
  // Q&A Handlers
  const handleAskQuestion = () => {
    if (newQaQuestion.trim()) {
      const question = {
        id: Date.now(),
        author: user?.name || displayName || 'You',
        question: newQaQuestion,
        upvotes: 0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setQaQuestions([...qaQuestions, question])
      setNewQaQuestion('')
      showToastMessage('Question posted')
    }
  }
  
  const handleUpvoteQuestion = (questionId) => {
    setQaQuestions(qaQuestions.map(q => 
      q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
    ))
  }
  
  // Breakout Room Handlers
  const handleCreateBreakoutRoom = () => {
    const newRoom = {
      id: breakoutRooms.length + 1,
      name: `Group ${breakoutRooms.length + 1}`,
      participants: []
    }
    setBreakoutRooms([...breakoutRooms, newRoom])
    setShowCreateBreakout(false)
    showToastMessage(`Created ${newRoom.name}`)
  }
  
  const handleRandomAssignBreakout = () => {
    const studentParticipants = participants.filter(p => p.role === 'student')
    const rooms = Array.from({ length: breakoutRoomCount }, (_, i) => ({
      id: i + 1,
      name: `Group ${i + 1}`,
      participants: []
    }))
    
    studentParticipants.forEach((participant, index) => {
      const roomIndex = index % breakoutRoomCount
      rooms[roomIndex].participants.push(participant.id)
    })
    
    setBreakoutRooms(rooms)
    showToastMessage(`Randomly assigned ${studentParticipants.length} participants to ${breakoutRoomCount} rooms`)
  }
  
  const handleAutoSplitBreakout = () => {
    handleRandomAssignBreakout()
  }
  
  const handleAssignToBreakout = (participantId, roomId) => {
    setBreakoutRooms(breakoutRooms.map(room => {
      if (room.id === roomId) {
        return { ...room, participants: [...room.participants, participantId] }
      }
      return { ...room, participants: room.participants.filter(id => id !== participantId) }
    }))
  }
  
  // Panel Tab Handler
  const handlePanelTabChange = (tab) => {
    setActivePanelTab(tab)
    setShowParticipants(tab === 'participants')
    setShowChat(tab === 'chat')
    setShowPolls(tab === 'polls')
    setShowBreakoutRooms(tab === 'breakout')
  }
  
  // ==================== LOGIN PAGE ====================
  if (step === 'login') {
    return (
      <div className="login-container">
        <button className="theme-toggle-login" onClick={toggleTheme} title="Toggle theme">
          {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="login-card">
          <div className="login-header">
            <div className="app-logo">
              <img 
                src="/ptclogo.png" 
                alt="PTC Logo" 
                className="login-logo-image"
              />
              <h1>PTC Meet</h1>
            </div>
            <p className="login-subtitle">{showRegisterForm ? 'Create your PTC Portal Account' : 'Sign in with your PTC Portal Account'}</p>
          </div>
          
          {!showRegisterForm ? (
            <div className="login-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Email</label>
                
                <div 
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '8px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    height: '42px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', marginRight: '10px', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>

                  <input
                    type="email"
                    placeholder="your.email@ptc.edu.ph"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="text-slate-900 dark:text-white placeholder:text-slate-400"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      padding: '0'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Password</label>
                
                <div 
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '8px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    height: '42px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', marginRight: '10px', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="text-slate-900 dark:text-white placeholder:text-slate-400"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      padding: '0'
                    }}
                  />
                </div>
              </div>
              
              <div className="login-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button className="forgot-link" onClick={() => setShowForgotPassword(true)}>Forgot password?</button>
              </div>
              
              <button className="btn-primary btn-full" onClick={handleLogin}>
                <LogIn size={20} />
                Sign In
              </button>
              
              <div className="register-link">
                <span>Don't have an account? </span>
                <button onClick={() => setShowRegisterForm(true)}>Create Account</button>
              </div>
            </div>
          ) : (
            <div className="login-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  placeholder="your.email@ptc.edu.ph"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Student/Employee ID</label>
                <input
                  type="text"
                  placeholder="2023-12345"
                  value={registerForm.studentId}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Role</label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }} className="text-slate-700 dark:text-slate-300">Course & Section</label>
                <input
                  type="text"
                  placeholder="BSIT 3J"
                  value={registerForm.section}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, section: e.target.value }))}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <button className="btn-primary btn-full" onClick={() => handleRegister(registerForm)}>
                <UserPlus size={20} />
                Register Account
              </button>
              
              <div className="register-link">
                <span>Already have an account? </span>
                <button onClick={() => setShowRegisterForm(false)}>Sign In</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Reset Password</h3>
                <button className="modal-close" onClick={() => setShowForgotPassword(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p className="modal-description">Enter your email address and we'll send you a link to reset your password.</p>
                <div className="input-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input 
                      type="email" 
                      placeholder="your.email@ptc.edu.ph"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowForgotPassword(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleForgotPassword}>
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Toast Notification */}
        {showToast && (
          <div className="toast-notification">
            <CheckCircle size={20} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    )
  }
  
  // ==================== PENDING VERIFICATION SCREEN ====================
  if (step === 'pending_verification') {
    return (
      <div className="login-container">
        <button className="theme-toggle-login" onClick={toggleTheme} title="Toggle theme">
          {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="login-card">
          <div className="login-header">
            <div className="app-logo">
              <img 
                src="/ptclogo.png" 
                alt="PTC Logo" 
                className="login-logo-image"
              />
              <h1>PTC Meet</h1>
            </div>
          </div>
          
          <div className="login-form" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#fef3c7', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Clock size={40} style={{ color: '#f59e0b' }} />
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: themeMode === 'dark' ? '#fff' : '#1e293b' }}>
              Registration Submitted
            </h2>
            
            <p style={{ 
              fontSize: '16px', 
              color: themeMode === 'dark' ? '#94a3b8' : '#64748b', 
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Your account registration has been submitted! Please wait for a Professor, Dean, or Admin to verify your account before logging in.
            </p>
            
            <button className="btn-primary btn-full" onClick={() => setStep('login')}>
              <LogIn size={20} />
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // ==================== DASHBOARD ====================
  if (step === 'dashboard') {
    const formatDate = (date) => {
      const options = { weekday: 'short', day: 'numeric', month: 'short' }
      return date.toLocaleDateString('en-US', options)
    }
    
    const getWeekDates = () => {
      const dates = []
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        dates.push({
          date,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dateNum: date.getDate(),
          isToday: date.toDateString() === selectedDate.toDateString(),
          isSelected: date.toDateString() === selectedDate.toDateString()
        })
      }
      return dates
    }
    
    const weekDates = getWeekDates()
    
    return (
      <div className="dashboard-container">
        {/* Top Navigation Bar */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="ptc-logo">
              <img 
                src="/ptclogo.png" 
                alt="PTC Meet Logo" 
                className="ptc-logo-image"
              />
            </div>
          </div>
          
          <div className="header-center">
            <div className="join-input-container">
              <input 
                type="text" 
                className="join-input"
                placeholder="Enter a code or link"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button className="join-btn" onClick={handleJoinFromDashboard}>
                Join
              </button>
            </div>
          </div>
          
          <div className="header-right">
            <button className="classroom-btn" onClick={handleNavigateToClassroom}>
              <GraduationCap size={20} />
              <span>Classroom</span>
            </button>
            <button className="new-meeting-btn" onClick={handleNewMeeting}>
              <Plus size={20} />
              <span>New</span>
            </button>
            <button className="icon-btn header-icon" title="Help" onClick={() => setShowHelpModal(true)}>
              <HelpCircle size={20} />
            </button>
            <button className="icon-btn header-icon" title="Settings" onClick={() => setShowSettingsModal(true)}>
              <Settings size={20} />
            </button>
            <button className="icon-btn header-icon theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="user-avatar-circle" title={user?.name || 'User'}>
              {user?.avatar || user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="dashboard-content">
          {/* Left Sidebar */}
          <div className="dashboard-sidebar">
            <button 
              className={`sidebar-tab ${dashboardTab === 'meetings' ? 'active' : ''}`}
              onClick={() => setDashboardTab('meetings')}
            >
              <Calendar size={20} />
              <span>Meetings</span>
            </button>
            <button 
              className={`sidebar-tab ${dashboardTab === 'calls' ? 'active' : ''}`}
              onClick={() => setDashboardTab('calls')}
            >
              <Phone size={20} />
              <span>Calls</span>
            </button>
            {(user?.role === 'professor' || user?.role === 'admin' || user?.role === 'dean') && (
              <button 
                className={`sidebar-tab ${dashboardTab === 'verification' ? 'active' : ''}`}
                onClick={() => setDashboardTab('verification')}
              >
                <ShieldCheck size={20} />
                <span>Verification</span>
                {registeredUsers.filter(u => u.status === 'PENDING_VERIFICATION').length > 0 && (
                  <span className="badge">
                    {registeredUsers.filter(u => u.status === 'PENDING_VERIFICATION').length}
                  </span>
                )}
              </button>
            )}
            <button 
              className={`sidebar-tab ${showArchivedClasses ? 'active' : ''}`}
              onClick={() => setShowArchivedClasses(!showArchivedClasses)}
            >
              <Archive size={20} />
              <span>Archived Classes</span>
            </button>
            <button 
              className={`sidebar-tab ${showMessenger ? 'active' : ''}`}
              onClick={() => setShowMessenger(!showMessenger)}
            >
              <MessageSquare size={20} />
              <span>Messenger</span>
            </button>
          </div>
          
          {/* Main Area */}
          <div className="dashboard-main">
            {showArchivedClasses ? (
              <>
                {/* Archived Classes View */}
                <div className="calls-header">
                  <h2>Archived Classes</h2>
                  <button className="btn-secondary" onClick={() => setShowArchivedClasses(false)}>
                    <X size={16} />
                    <span>Close</span>
                  </button>
                </div>
                <div className="subjects-grid">
                  {subjects?.filter(s => s.isArchived).map((subject) => (
                    <div 
                      key={subject.id}
                      className="subject-card archived-card"
                      style={{ opacity: 0.8 }}
                    >
                      <div 
                        className="subject-header"
                        style={{ backgroundColor: subject.color + '20' }}
                      >
 <div className="subject-avatar" style={{ backgroundColor: subject.color }}>
                          {subject.code.charAt(0)}
                        </div>
                        <div className="subject-title">
                          <h3>{subject.code}</h3>
                          <p>{subject.section}</p>
                        </div>
                      </div>
                      <div className="subject-body">
                        <p className="subject-instructor">{subject.instructor}</p>
                        <p className="subject-description">{subject.description}</p>
                      </div>
                      {isAdminOrProfessor() && (
                        <div className="subject-footer">
                          <button 
                            className="btn-secondary"
                            onClick={() => handleRestoreSubject(subject.id)}
                          >
                            <Archive size={16} />
                            <span>Restore Class</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : showMessenger ? (
              <>
                {/* Messenger View */}
                <div className="messenger-container">
                  <div className="messenger-sidebar">
                    <div className="messenger-header">
                      <h2>Messages</h2>
                    </div>
                    <div className="contact-list">
                      {isAdminOrProfessor() ? (
                        // Professors see enrolled students
                        subjects?.filter(s => !s.isArchived).map((subject) => (
                          <div key={subject.id} className="contact-item">
                            <div className="contact-avatar" style={{ backgroundColor: subject.color }}>
                              {subject.code.charAt(0)}
                            </div>
                            <div className="contact-info">
                              <p className="contact-name">{subject.code} Students</p>
                              <p className="contact-preview">{subject.section}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Students see professors
                        subjects?.filter(s => !s.isArchived).map((subject) => (
                          <div 
                            key={subject.id}
                            className="contact-item"
                            onClick={() => setSelectedChatContact({ id: subject.id, name: subject.instructor })}
                          >
                            <div className="contact-avatar" style={{ backgroundColor: subject.color }}>
                              {subject.instructor.charAt(0)}
                            </div>
                            <div className="contact-info">
                              <p className="contact-name">{subject.instructor}</p>
                              <p className="contact-preview">{subject.code}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="messenger-chat">
                    {selectedChatContact ? (
                      <>
                        <div className="chat-header">
                          <div className="chat-contact-info">
                            <div className="contact-avatar" style={{ backgroundColor: '#4285F4' }}>
                              {selectedChatContact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="chat-contact-name">{selectedChatContact.name}</p>
                              <p className="chat-contact-status">Online</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedChatContact(null)}>
                            <X size={20} />
                          </button>
                        </div>
                        <div className="chat-messages">
                          {messengerMessages
                            ?.filter(msg => 
                              (msg.sender === selectedChatContact.name && msg.recipient === user?.name) ||
                              (msg.sender === user?.name && msg.recipient === selectedChatContact.name)
                            )
                            .map((msg) => (
                              <div 
                                key={msg.id} 
                                className={`message-bubble ${msg.sender === user?.name ? 'sent' : 'received'}`}
                              >
                                <p>{msg.message}</p>
                                <div className="message-meta">
                                  <span className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <button 
                                    className="message-delete"
                                    onClick={() => handleDeleteMessengerMessage(msg.id)}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="chat-input-area">
                          <input 
                            type="text"
                            placeholder="Type a message..."
                            className="chat-input"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendMessengerMessage(e.target.value)
                                e.target.value = ''
                              }
                            }}
                          />
                          <button 
                            className="send-btn"
                            onClick={(e) => {
                              const input = e.target.parentElement.querySelector('input')
                              handleSendMessengerMessage(input.value)
                              input.value = ''
                            }}
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="chat-placeholder">
                        <MessageSquare size={48} className="placeholder-icon" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : dashboardTab === 'verification' ? (
              <>
                <div className="verification-header">
                  <h2>Account Verification</h2>
                  <p>Review and approve pending registration requests</p>
                </div>
                
                <div className="verification-list">
                  {registeredUsers.filter(u => u.status === 'PENDING_VERIFICATION').length === 0 ? (
                    <div className="empty-state">
                      <ShieldCheck size={48} className="text-slate-400" />
                      <p>No pending verification requests</p>
                    </div>
                  ) : (
                    registeredUsers.filter(u => u.status === 'PENDING_VERIFICATION').map((pendingUser) => (
                      <div key={pendingUser.id} className="verification-item">
                        <div className="verification-user-info">
                          <div className="user-avatar">
                            {pendingUser.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="user-details">
                            <h4>{pendingUser.fullName}</h4>
                            <p className="user-email">{pendingUser.email}</p>
                            <div className="user-meta">
                              <span className="meta-tag">ID: {pendingUser.studentId}</span>
                              <span className="meta-tag">{pendingUser.role}</span>
                              <span className="meta-tag">{pendingUser.section}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="verification-actions">
                          <button 
                            className="btn-approve"
                            onClick={() => {
                              const updatedUsers = registeredUsers.map(u => 
                                u.id === pendingUser.id ? { ...u, status: 'APPROVED' } : u
                              )
                              setRegisteredUsers(updatedUsers)
                              localStorage.setItem('ptc_registered_users', JSON.stringify(updatedUsers))
                              showToastMessage(`${pendingUser.fullName} has been approved`)
                            }}
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => {
                              const updatedUsers = registeredUsers.filter(u => u.id !== pendingUser.id)
                              setRegisteredUsers(updatedUsers)
                              localStorage.setItem('ptc_registered_users', JSON.stringify(updatedUsers))
                              showToastMessage(`${pendingUser.fullName} has been rejected`)
                            }}
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Approved Users List with Edit Controls */}
                <div className="approved-users-section">
                  <h3>Approved Users</h3>
                  <div className="approved-users-list">
                    {registeredUsers.filter(u => u.status === 'APPROVED').map((approvedUser) => (
                      <div key={approvedUser.id} className="approved-user-item">
                        <div className="approved-user-info">
                          <div className="user-avatar">
                            {approvedUser.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="user-details">
                            <h4>{approvedUser.fullName}</h4>
                            <p className="user-email">{approvedUser.email}</p>
                            <div className="user-meta">
                              <span className="meta-tag">ID: {approvedUser.studentId}</span>
                              <span className="meta-tag">{approvedUser.role}</span>
                              <span className="meta-tag">{approvedUser.section}</span>
                            </div>
                          </div>
                        </div>
                        
                        {(user?.role === 'admin' || user?.role === 'dean') && (
                          <button 
                            className="btn-edit"
                            onClick={() => {
                              const newFullName = prompt('Edit Full Name:', approvedUser.fullName)
                              const newStudentId = prompt('Edit Student ID:', approvedUser.studentId)
                              const newSection = prompt('Edit Section:', approvedUser.section)
                              const newRole = prompt('Edit Role (student/professor):', approvedUser.role)
                              
                              if (newFullName || newStudentId || newSection || newRole) {
                                const updatedUsers = registeredUsers.map(u => 
                                  u.id === approvedUser.id ? { 
                                    ...u, 
                                    fullName: newFullName || u.fullName,
                                    studentId: newStudentId || u.studentId,
                                    section: newSection || u.section,
                                    role: newRole || u.role
                                  } : u
                                )
                                setRegisteredUsers(updatedUsers)
                                localStorage.setItem('ptc_registered_users', JSON.stringify(updatedUsers))
                                showToastMessage('User details updated')
                              }
                            }}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : dashboardTab === 'meetings' ? (
              <>
                {/* Calendar Header */}
                <div className="calendar-header">
                  <div className="calendar-date-display">
                    <Calendar size={20} />
                    <span className="current-date">{formatDate(selectedDate)}</span>
                  </div>
                  
                  <div className="date-selector">
                    <button className="date-nav-btn" onClick={() => handleDateChange(-7)}>
                      <ChevronLeft size={20} />
                    </button>
                    <div className="date-pills">
                      {weekDates.map((date, index) => (
                        <button 
                          key={index}
                          className={`date-pill ${date.isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedDate(date.date)}
                        >
                          <span className="date-day">{date.day}</span>
                          <span className="date-number">{date.dateNum}</span>
                        </button>
                      ))}
                    </div>
                    <button className="date-nav-btn" onClick={() => handleDateChange(7)}>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Safety Banner */}
                <div className="safety-banner">
                  <div className="safety-banner-content">
                    <Shield size={24} className="safety-icon" />
                    <div className="safety-text">
                      <span className="safety-title">Your meeting is safe</span>
                      <span className="safety-description">No one can join a meeting unless invited or admitted by the host</span>
                    </div>
                  </div>
                  <button className="learn-more-btn" onClick={() => showToastMessage('Security features enabled')}>Learn more</button>
                </div>
                
                {/* Empty State Hero */}
                <div className="empty-state-hero">
                  <div className="hero-illustration">
                    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Coffee Cup */}
                      <ellipse cx="80" cy="160" rx="30" ry="8" fill="#E8EAED"/>
                      <path d="M50 100 Q50 160 80 160 Q110 160 110 100 L110 80 L50 80 Z" fill="#DADCE0"/>
                      <path d="M110 90 Q130 90 130 110 Q130 130 110 130" stroke="#DADCE0" strokeWidth="6" fill="none"/>
                      {/* Steam */}
                      <path d="M70 70 Q65 50 75 40" stroke="#9AA0A6" strokeWidth="2" fill="none" opacity="0.5"/>
                      <path d="M80 65 Q75 45 85 35" stroke="#9AA0A6" strokeWidth="2" fill="none" opacity="0.5"/>
                      <path d="M90 70 Q85 50 95 40" stroke="#9AA0A6" strokeWidth="2" fill="none" opacity="0.5"/>
                      
                      {/* Pencil */}
                      <rect x="160" y="100" width="8" height="60" transform="rotate(45 160 100)" fill="#F4B400"/>
                      <polygon points="200,140 210,150 190,160" fill="#F4B400"/>
                      <rect x="155" y="95" width="8" height="10" transform="rotate(45 155 95)" fill="#F1C40F"/>
                      
                      {/* Video Frame */}
                      <rect x="180" y="30" width="80" height="50" rx="4" fill="#E8F0FE" stroke="#8AB4F8" strokeWidth="2"/>
                      <circle cx="220" cy="55" r="12" fill="#D2E3FC"/>
                      <path d="M215 55 L218 58 L225 51" stroke="#1967D2" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                  <h2 className="empty-state-title">No meetings scheduled for today</h2>
                  <p className="empty-state-description">Schedule a meeting or enjoy the free time</p>
                  <button className="new-meeting-hero-btn" onClick={handleNewMeeting}>
                    <Plus size={20} />
                    <span>New</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Calls View */}
                <div className="calls-header">
                  <h2>Recent Calls</h2>
                  <button className="btn-secondary" onClick={() => showToastMessage('Call history cleared')}>
                    Clear History
                  </button>
                </div>
                <div className="calls-list">
                  <div className="call-item">
                    <div className="call-avatar">JS</div>
                    <div className="call-info">
                      <span className="call-name">John Smith</span>
                      <span className="call-time">Today, 2:30 PM</span>
                    </div>
                    <div className="call-status missed">Missed</div>
                  </div>
                  <div className="call-item">
                    <div className="call-avatar">MJ</div>
                    <div className="call-info">
                      <span className="call-name">Mary Johnson</span>
                      <span className="call-time">Yesterday, 4:15 PM</span>
                    </div>
                    <div className="call-status completed">Completed</div>
                  </div>
                  <div className="call-item">
                    <div className="call-avatar">RB</div>
                    <div className="call-info">
                      <span className="call-name">Robert Brown</span>
                      <span className="call-time">Aug 24, 10:00 AM</span>
                    </div>
                    <div className="call-status completed">Completed</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Notification Prompt */}
        {showNotificationPrompt && (
          <div className="notification-prompt">
            <button className="notification-close" onClick={() => setShowNotificationPrompt(false)}>
              <X size={16} />
            </button>
            <div className="notification-content">
              <Bell size={24} className="notification-icon" />
              <div className="notification-text">
                <span className="notification-title">Receive desktop notifications from Meet</span>
                <span className="notification-description">Get notified about upcoming meetings and messages</span>
              </div>
            </div>
            <div className="notification-actions">
              <button className="notification-btn secondary" onClick={() => setShowNotificationPrompt(false)}>
                Not now
              </button>
              <button className="notification-btn primary" onClick={handleAllowNotifications}>
                Allow notifications
              </button>
            </div>
          </div>
        )}
        
        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Settings</h3>
                <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="settings-section">
                  <h4>Profile</h4>
                  <div className="settings-item">
                    <span>Account Settings</span>
                    <button className="btn-secondary" onClick={() => setShowAccountSettingsModal(true)}>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="settings-section">
                  <h4>Avatar Color</h4>
                  <div className="color-swatches">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleAvatarColorChange(color)}
                        className={`color-swatch ${avatarColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                      >
                        {avatarColor === color && <Check size={20} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="settings-section">
                  <h4>Appearance</h4>
                  <div className="settings-item">
                    <span>Dark Mode</span>
                    <button className="toggle-switch" onClick={toggleTheme}>
                      {themeMode === 'dark' ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
                <div className="settings-section">
                  <h4>Notifications</h4>
                  <div className="settings-item">
                    <span>Meeting Reminders</span>
                    <button className="toggle-switch" onClick={() => showToastMessage('Meeting reminders enabled')}>
                      On
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowSettingsModal(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Account Settings Modal */}
        {showAccountSettingsModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Account Settings</h3>
                <button className="modal-close" onClick={() => setShowAccountSettingsModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="settings-section">
                  <h4>Profile Picture</h4>
                  <div className="profile-cropper-container">
                    <div 
                      className="profile-cropper-frame"
                      onMouseDown={handleCropMouseDown}
                      onMouseMove={handleCropMouseMove}
                      onMouseUp={handleCropMouseUp}
                      onMouseLeave={handleCropMouseUp}
                    >
                      <div 
                        className="profile-cropper-image"
                        style={{
                          backgroundColor: avatarColor,
                          transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom})`
                        }}
                      >
                        <span className="profile-cropper-initial">{userProfile?.name?.charAt(0) || 'U'}</span>
                      </div>
                      <div className="profile-cropper-grid">
                        <div className="grid-line grid-line-v-1"></div>
                        <div className="grid-line grid-line-v-2"></div>
                        <div className="grid-line grid-line-h-1"></div>
                        <div className="grid-line grid-line-h-2"></div>
                      </div>
                    </div>
                    <div className="profile-cropper-controls">
                      <div className="zoom-control">
                        <ZoomOut size={16} />
                        <input 
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={cropZoom}
                          onChange={handleCropZoomChange}
                          className="zoom-slider"
                        />
                        <ZoomIn size={16} />
                      </div>
                      <button className="btn-secondary" onClick={() => setCropPosition({ x: 0, y: 0 })}>
                        <RotateCcw size={16} />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                <div className="settings-section">
                  <h4>Personal Information</h4>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text"
                      value={userProfile?.name || ''}
                      onChange={(e) => handleUpdateUserProfile('name', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role / Position</label>
                    <input 
                      type="text"
                      value={userProfile?.role || ''}
                      onChange={(e) => handleUpdateUserProfile('role', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input 
                      type="text"
                      value={userProfile?.department || ''}
                      onChange={(e) => handleUpdateUserProfile('department', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email"
                      value={userProfile?.email || ''}
                      onChange={(e) => handleUpdateUserProfile('email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowAccountSettingsModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveAccountSettings}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Modal */}
        {showHelpModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Help Center</h3>
                <button className="modal-close" onClick={() => setShowHelpModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="help-section">
                  <h4>Quick Links</h4>
                  <button className="help-link" onClick={() => showToastMessage('Opening getting started guide...')}>
                    Getting Started
                  </button>
                  <button className="help-link" onClick={() => showToastMessage('Opening troubleshooting guide...')}>
                    Troubleshooting
                  </button>
                  <button className="help-link" onClick={() => showToastMessage('Opening contact support...')}>
                    Contact Support
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowHelpModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // ==================== CLASSROOM DASHBOARD ====================
  if (step === 'classroom') {
    // Filter subjects based on search term
    const filteredSubjects = subjects?.filter(subj => 
      !subj?.isArchived && (
        subj?.code?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
        subj?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
        subj?.instructor?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
      )
    ) || []
    
    return (
      <div className="dashboard-container">
        {/* Top Navigation Bar */}
        <div className="dashboard-header">
          <div className="header-left">
            <button 
              className="icon-btn header-icon hamburger-menu"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Toggle sidebar"
            >
              <Menu className="w-6 h-6 cursor-pointer" />
            </button>
            <div className="ptc-logo">
              <img 
                src="/ptclogo.png" 
                alt="PTC Meet Logo" 
                className="ptc-logo-image"
              />
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-bar-container">
              <Search size={18} className="search-icon" />
              <input 
                type="text"
                placeholder="Search subjects..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="header-right">
            <button className="icon-btn header-icon" title="Help" onClick={() => setShowHelpModal(true)}>
              <HelpCircle size={20} />
            </button>
            <button className="icon-btn header-icon" title="Settings" onClick={() => setShowSettingsModal(true)}>
              <Settings size={20} />
            </button>
            <button className="icon-btn header-icon theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="user-avatar-circle" title={user?.name || 'User'}>
              {user?.avatar || user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
        
        {/* Main Content with Sidebar */}
        <div className="dashboard-content">
          {/* Collapsible Sidebar */}
          <div className={`sidebar ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className="sidebar-content">
              <div className="sidebar-section">
                <h3 className="sidebar-section-title">Navigation</h3>
                <button className={`sidebar-nav-item ${!showArchivedClasses ? 'active' : ''}`} onClick={() => setShowArchivedClasses(false)}>
                  <BookOpen size={18} />
                  {isSidebarOpen && <span>Active Classes</span>}
                </button>
                <button className={`sidebar-nav-item ${showArchivedClasses ? 'active' : ''}`} onClick={() => setShowArchivedClasses(true)}>
                  <Archive size={18} />
                  {isSidebarOpen && <span>Archived Classes</span>}
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className={`dashboard-main ${isSidebarOpen ? 'main-with-sidebar' : 'main-full-width'}`}>
            <h2 className="section-title">
              {showArchivedClasses ? 'Archived Classes' : 'Your Classes'}
            </h2>
            
            {/* Subject Cards Grid */}
            {showArchivedClasses ? (
              <div className="subjects-grid">
                {subjects?.filter(s => s.isArchived).map((subject) => (
                  <div 
                    key={subject?.id}
                    className="subject-card archived"
                    onClick={() => handleSelectSubject(subject)}
                    style={{ borderTop: `4px solid ${subject?.color || '#4285F4'}` }}
                  >
                    <div className="subject-card-header">
                      <span className="subject-code">{subject?.code || ''}</span>
                      <span className="subject-section">{subject?.section || ''}</span>
                    </div>
                    <h3 className="subject-title">{subject?.title || ''}</h3>
                    <p className="subject-instructor">{subject?.instructor || 'Instructor'}</p>
                    <p className="subject-description">{subject?.description || ''}</p>
                    <div className="subject-card-footer">
                      <button 
                        className="restore-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestoreSubject(subject.id)
                        }}
                      >
                        <Archive size={14} />
                        Restore
                      </button>
                    </div>
                  </div>
                )) || []}
                {subjects?.filter(s => s.isArchived).length === 0 && (
                  <div className="empty-state">
                    <Archive size={48} />
                    <p>No archived classes</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="subjects-grid">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <div 
                      key={subject?.id}
                      className="subject-card"
                      onClick={() => handleSelectSubject(subject)}
                      style={{ borderTop: `4px solid ${subject?.color || '#4285F4'}` }}
                    >
                      <div className="subject-card-header">
                        <span className="subject-code">{subject?.code || ''}</span>
                        <span className="subject-section">{subject?.section || ''}</span>
                      </div>
                      <h3 className="subject-title">{subject?.title || ''}</h3>
                      <p className="subject-instructor">{subject?.instructor || 'Instructor'}</p>
                      <p className="subject-description">{subject?.description || ''}</p>
                      <div className="subject-card-footer">
                        <button className="join-class-btn">
                          <Video size={16} />
                          Join Video Meeting
                        </button>
                        {isAdminOrProfessor() && (
                          <button 
                            className="archive-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleArchiveSubject(subject.id)
                            }}
                          >
                            <Archive size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Search size={48} />
                    <p>No subjects found matching '{searchTerm}'</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Settings</h3>
                <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="settings-section">
                  <h4>Appearance</h4>
                  <div className="settings-item">
                    <span>Dark Mode</span>
                    <button className="toggle-switch" onClick={toggleTheme}>
                      {themeMode === 'dark' ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowSettingsModal(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Modal */}
        {showHelpModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Help Center</h3>
                <button className="modal-close" onClick={() => setShowHelpModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="help-section">
                  <h4>Quick Links</h4>
                  <button className="help-link" onClick={() => showToastMessage('Opening getting started guide...')}>
                    Getting Started
                  </button>
                  <button className="help-link" onClick={() => showToastMessage('Opening troubleshooting guide...')}>
                    Troubleshooting
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowHelpModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // ==================== SUBJECT VIEW ====================
  if (step === 'subject' && activeSubject) {
    const instructorName = getInstructorName()
    const instructorInitials = getInstructorInitials(instructorName)
    
    return (
      <div className="subject-view-container">
        {/* Subject Header Banner */}
        <div className="subject-header-banner" style={{ backgroundColor: activeSubject?.color || '#4285F4' }}>
          <div className="subject-banner-content">
            <div className="subject-banner-left">
              <button className="back-btn" onClick={handleReturnToDashboard}>
                <ArrowLeft size={20} />
                Back to Classes
              </button>
              <h1 className="subject-banner-title">{activeSubject?.title || ''}</h1>
              <p className="subject-banner-code">{activeSubject?.code || ''} • {activeSubject?.section || ''}</p>
              <p className="subject-banner-instructor">
                <UserCheck size={16} />
                {instructorName}
              </p>
            </div>
            <div className="subject-banner-right">
              <button 
                onClick={handleDirectJoinMeeting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition-all"
              >
                <Video size={16} />
                Join Video Meeting
              </button>
            </div>
          </div>
        </div>
        
        {/* Subject Navigation Tabs */}
        <div className="subject-nav-tabs">
          <button 
            className={`subject-tab ${classroomTab === 'stream' ? 'active' : ''}`}
            onClick={() => setClassroomTab('stream')}
          >
            <MessageSquare size={18} />
            Stream
          </button>
          <button 
            className={`subject-tab ${classroomTab === 'classwork' ? 'active' : ''}`}
            onClick={() => setClassroomTab('classwork')}
          >
            <LayoutGrid size={18} />
            Classwork
          </button>
          <button 
            className={`subject-tab ${classroomTab === 'people' ? 'active' : ''}`}
            onClick={() => setClassroomTab('people')}
          >
            <Users size={18} />
            People
          </button>
          <button 
            className={`subject-tab ${classroomTab === 'grades' ? 'active' : ''}`}
            onClick={() => setClassroomTab('grades')}
          >
            <BarChart3 size={18} />
            Grades
          </button>
          <button 
            className={`subject-tab ${classroomTab === 'gemini' ? 'active' : ''}`}
            onClick={() => setClassroomTab('gemini')}
          >
            <Smile size={18} />
            Gemini AI
          </button>
        </div>
        
        {/* Subject Content Area */}
        <div className="subject-content">
          {/* Stream Tab */}
          {classroomTab === 'stream' && (
            <div className="stream-container">
              {isAdminOrProf() && (
                <div className="stream-create-post">
                  <div className="stream-avatar">
                    {user?.avatar || user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="stream-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Announce something to your class"
                      className="stream-post-input"
                      value={newStreamPost}
                      onChange={(e) => setNewStreamPost(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateStreamPost()}
                    />
                    <button 
                      className="stream-post-btn"
                      onClick={handleCreateStreamPost}
                      disabled={!newStreamPost?.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
              
              <div className="stream-posts">
                {streamPosts?.length === 0 ? (
                  <div className="empty-stream-state">
                    <div className="empty-state-icon">
                      <MessageSquare size={64} className="text-slate-400" />
                    </div>
                    <h3 className="empty-state-title">
                      {isAdminOrProf() ? 'Announce something to your class' : 'This is where you can talk to your class'}
                    </h3>
                    <p className="empty-state-subtitle">
                      Use the stream to share announcements, post assignments, and respond to student questions.
                    </p>
                  </div>
                ) : (
                  streamPosts?.map((post) => (
                    <div 
                      key={post?.id} 
                      className="stream-post cursor-pointer hover:shadow-md transition-all"
                      onClick={() => post?.type !== 'announcement' && handleOpenAssignment({
                        id: post?.id,
                        title: post?.type === 'grade' ? 'Grade Announcement' : 'Material Post',
                        dueDate: 'N/A',
                        points: 0,
                        type: post?.type,
                        description: post?.content
                      })}
                    >
                      <div className="post-avatar">
                        {instructorInitials}
                      </div>
                      <div className="post-content">
                        <div className="post-header">
                          <span className="post-author">{instructorName}</span>
                          <span className="post-timestamp">{post?.timestamp || ''}</span>
                          {canModerate() && (
                            <div className="post-menu">
                              <button className="post-menu-btn">
                                <MoreVertical size={14} />
                              </button>
                              <div className="post-menu-dropdown">
                                <button 
                                  className="post-menu-item"
                                  onClick={() => handleEditPost(post?.id, post?.content)}
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>
                                <button 
                                  className="post-menu-item delete"
                                  onClick={() => handleDeletePost(post?.id)}
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {editingPostId === post?.id ? (
                          <div className="post-edit-mode">
                            <textarea
                              value={editPostContent}
                              onChange={(e) => setEditPostContent(e.target.value)}
                              className="post-edit-input"
                              autoFocus
                            />
                            <div className="post-edit-actions">
                              <button 
                                className="btn-secondary"
                                onClick={handleCancelPostEdit}
                              >
                                Cancel
                              </button>
                              <button 
                                className="btn-primary"
                                onClick={() => handleSavePostEdit(post?.id)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="post-text">{post?.content || ''}</p>
                            {post?.edited && <span className="post-edited">(edited)</span>}
                          </>
                        )}
                        <div className="post-actions">
                          <button className="post-action-btn">
                            <ThumbsUp size={16} />
                            {post?.likes || 0}
                          </button>
                          <button className="post-action-btn">
                            <MessageCircle size={16} />
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Classwork Tab */}
          {classroomTab === 'classwork' && (
            <div className="classwork-container">
              <h2 className="classwork-title">Classwork</h2>
              <div className="classwork-list">
                {classworkItems?.map((item) => (
                  <div 
                    key={item?.id} 
                    className="classwork-item"
                    onClick={() => handleOpenAssignment(item)}
                    style={{ cursor: item?.type !== 'material' ? 'pointer' : 'default' }}
                  >
                    <div className="classwork-icon">
                      {item?.type === 'quiz' && <CheckCircle size={24} />}
                      {item?.type === 'assignment' && <PenTool size={24} />}
                      {item?.type === 'project' && <Clapperboard size={24} />}
                      {item?.type === 'material' && <FileSpreadsheet size={24} />}
                    </div>
                    <div className="classwork-info">
                      <h3 className="classwork-item-title">{item?.title || ''}</h3>
                      <p className="classwork-due">Due: {item?.dueDate || ''}</p>
                      <p className="classwork-points">{item?.points || 0} points</p>
                    </div>
                    {canModerate() && (
                      <div className="classwork-menu">
                        <button 
                          className="classwork-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Deleting this assignment will also remove student submission entries. Continue?')) {
                              handleDeleteClassworkItem(item?.id)
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                    <div className="classwork-status">
                      <span className={`status-badge ${item?.status || 'pending'}`}>
                        {item?.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          )}
          
          {/* People Tab */}
          {classroomTab === 'people' && (
            <div className="people-container">
              <h2 className="people-title">People</h2>
              
              <div className="people-section">
                <h3 className="people-section-title">Teachers</h3>
                <div 
                  className="teacher-card cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    setSelectedChatContact({ id: 'teacher-1', name: instructorName })
                    setShowMessenger(true)
                  }}
                >
                  <div className="teacher-avatar">
                    {instructorInitials}
                  </div>
                  <div className="teacher-info">
                    <span className="teacher-name">{instructorName}</span>
                    <span className="teacher-badge">
                      <ShieldCheck size={14} />
                      Official Instructor
                    </span>
                  </div>
                  <MessageSquare size={16} className="text-slate-400" />
                </div>
              </div>
              
              <div className="people-section">
                <h3 className="people-section-title">Classmates</h3>
                <div className="classmates-list">
                  {registeredUsers
                    .filter(u => u.status === 'APPROVED' && u.role === 'student' && u.section === activeSubject?.section)
                    .map((classmate) => (
                      <div 
                        key={classmate.id}
                        className="classmate-item cursor-pointer hover:shadow-md transition-all"
                        onClick={() => {
                          setSelectedChatContact({ id: classmate.id, name: classmate.fullName })
                          setShowMessenger(true)
                        }}
                      >
                        <div className="classmate-avatar">{classmate.fullName?.charAt(0) || 'C'}</div>
                        <span className="classmate-name">{classmate.fullName}</span>
                        <MessageSquare size={16} className="text-slate-400 ml-auto" />
                      </div>
                    ))}
                  {registeredUsers.filter(u => u.status === 'APPROVED' && u.role === 'student' && u.section === activeSubject?.section).length === 0 && (
                    <div className="empty-state">
                      <Users size={48} className="text-slate-400" />
                      <p>No classmates enrolled yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Grades Tab */}
          {classroomTab === 'grades' && (
            <div className="grades-container">
              <h2 className="grades-title">Gradebook</h2>
              <div className="grades-summary">
                <div className="grade-summary-card">
                  <h3>Overall Grade</h3>
                  <div className="grade-percentage">89.5%</div>
                  <span className="grade-letter">B+</span>
                </div>
              </div>
              <div className="grades-list">
                {gradesData?.map((grade) => (
                  <div key={grade?.assignment} className="grade-item">
                    <div className="grade-info">
                      <h4 className="grade-assignment">{grade?.assignment || ''}</h4>
                      <span className="grade-weight">Weight: {grade?.weight || ''}</span>
                    </div>
                    <div className="grade-score">
                      <span className="grade-points">{grade?.score || 0}/{grade?.total || 0}</span>
                      <span className="grade-percent">{grade?.percentage || 0}%</span>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          )}
          
          {/* Gemini AI Tab */}
          {classroomTab === 'gemini' && (
            <div className="gemini-container">
              <h2 className="gemini-title">Gemini AI Study Hub</h2>
              <div className="gemini-welcome">
                <div className="gemini-icon">
                  <Smile size={48} />
                </div>
                <h3>Ask anything about this course</h3>
                <p>Get help with assignments, concepts, or study materials powered by Gemini AI</p>
              </div>
              <div className="gemini-input-area">
                <input 
                  type="text" 
                  placeholder="Ask a question about {activeSubject?.title || 'this course'}..."
                  className="gemini-input"
                />
                <button className="gemini-send-btn">
                  <Send size={20} />
                </button>
              </div>
              <div className="gemini-suggestions">
                <button className="suggestion-btn">
                  Explain the key concepts of {activeSubject?.title || 'this course'}
                </button>
                <button className="suggestion-btn">
                  Help me with the upcoming assignment
                </button>
                <button className="suggestion-btn">
                  Summarize the lecture notes
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Assignment Detail Modal */}
        {showAssignmentModal && selectedAssignment && (
          <div className="modal-overlay">
            <div className="assignment-modal">
              <div className="assignment-modal-header">
                <h2>{selectedAssignment?.title || 'Assignment'}</h2>
                <button className="modal-close" onClick={handleCloseAssignmentModal}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="assignment-modal-content">
                {/* Professor/Dean/Admin View - Student Work */}
                {(isAdminOrProf() || user?.role === 'dean') ? (
                  <div className="professor-view">
                    <div className="student-work-header">
                      <h3>Student Work</h3>
                      <span className="student-count">{participants.length} students</span>
                    </div>
                    
                    <div className="student-submissions-list">
                      {participants.map((student) => {
                        const submission = assignmentSubmissions[selectedAssignment?.id]?.[student.id] || { status: 'assigned' }
                        return (
                          <div key={student.id} className="student-submission-item">
                            <div className="student-info">
                              <div className="student-avatar">
                                {student.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <p className="student-name">{student.name}</p>
                                <p className="student-status">
                                  {submission.status === 'assigned' && 'Assigned'}
                                  {submission.status === 'turned_in' && 'Turned in'}
                                  {submission.status === 'graded' && 'Graded'}
                                </p>
                              </div>
                            </div>
                            
                            {submission.status === 'turned_in' || submission.status === 'graded' ? (
                              <div className="submission-actions">
                                <button className="view-files-btn">
                                  <FileText size={16} />
                                  View files
                                </button>
                                {submission.status !== 'graded' && (
                                  <div className="grade-input-group">
                                    <input 
                                      type="number"
                                      placeholder="Grade"
                                      max={selectedAssignment?.points || 100}
                                      className="grade-input"
                                    />
                                    <button className="return-btn">
                                      Return
                                    </button>
                                  </div>
                                )}
                                {submission.status === 'graded' && (
                                  <span className="graded-badge">
                                    {submission.grade}/{selectedAssignment?.points || 100}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="pending-badge">Pending</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                {/* Left Column - Assignment Details & Class Comments */}
                <div className="assignment-details-column">
                  {/* Header with Blue Badge */}
                  <div className="assignment-header">
                    <div className="assignment-icon-badge bg-blue-600 p-3 rounded-full text-white">
                      <FileText size={24} />
                    </div>
                    <div className="assignment-title-section">
                      <h3 className="assignment-title">{selectedAssignment?.title || 'Assignment'}</h3>
                      <p className="assignment-author-date">
                        {instructorName} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <span className="assignment-points-badge">{selectedAssignment?.points || 0} points</span>
                    </div>
                  </div>
                  
                  <div className="border-b border-slate-200 dark:border-slate-700 my-4"></div>
                  
                  {/* Description */}
                  <div className="assignment-description">
                    <p className="whitespace-pre-wrap">
                      {selectedAssignment?.description || 'Complete this assignment by following the guidelines provided. Make sure to submit your work before the due date.'}
                    </p>
                  </div>
                  
                  {/* Class Comments Section */}
                  <div className="class-comments-section mt-6">
                    <div className="class-comments-header">
                      <Users size={16} />
                      <span>Class comments</span>
                    </div>
                    
                    <div className="class-comments-list">
                      {classComments?.map((comment) => (
                        <div key={comment?.id} className="class-comment">
                          <div className="comment-avatar">
                            {comment?.author?.charAt(0) || 'U'}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">{comment?.author || ''}</span>
                              <span className="comment-timestamp">{comment?.timestamp || ''}</span>
                              {canModerate() && (
                                <button 
                                  className="comment-delete-btn"
                                  onClick={() => handleDeleteComment(selectedAssignment?.id, comment?.id)}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                            <p className="comment-message">{comment?.text || comment?.message || ''}</p>
                          </div>
                        </div>
                      )) || []}
                    </div>
                    
                    <div className="class-comment-input">
                      <input 
                        type="text"
                        placeholder="Add class comment..."
                        value={newClassComment}
                        onChange={(e) => setNewClassComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendClassComment()}
                        className="comment-input-field"
                      />
                      <button 
                        onClick={handleSendClassComment}
                        className="comment-send-btn"
                        disabled={!newClassComment.trim()}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Your Work Card */}
                <div className="your-work-column">
                  <div className="your-work-card">
                    <div className="your-work-header">
                      <h3>Your work</h3>
                      <span className={`status-badge ${getStatusBadgeColor(getAssignmentStatus())}`}>
                        {getAssignmentStatus() === 'assigned' && 'Assigned'}
                        {getAssignmentStatus() === 'turned_in' && 'Turned in'}
                        {getAssignmentStatus() === 'turned_in_late' && 'Turned in late'}
                        {getAssignmentStatus() === 'graded' && 'Graded'}
                      </span>
                    </div>
                    
                    {/* Submitted Files */}
                    <div className="submitted-files">
                      {attachedFiles?.map((file) => (
                        <div key={file?.id} className="file-item">
                          <FileText size={20} />
                          <div className="file-info">
                            <span className="file-name">{file?.name || ''}</span>
                            <span className="file-size">{file?.size || ''}</span>
                          </div>
                          {getAssignmentStatus() === 'assigned' && (
                            <button 
                              className="file-delete-btn"
                              onClick={() => handleDeleteFile(file?.id)}
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      )) || []}
                    </div>
                    
                    {/* Add or Create Button with Popover */}
                    {getAssignmentStatus() === 'assigned' && (
                      <div className="add-files-container relative">
                        <button 
                          className="add-files-btn" 
                          onClick={() => setShowLinkModal(!showLinkModal)}
                        >
                          <Plus size={20} />
                          Add or create
                        </button>
                        
                        {/* Dropdown Options */}
                        {showLinkModal && (
                          <div className="add-files-dropdown">
                            <button 
                              onClick={() => {
                                fileInputRef.current?.click()
                                setShowLinkModal(false)
                              }}
                              className="dropdown-option"
                            >
                              <Upload size={16} />
                              Upload file
                            </button>
                            <button 
                              onClick={() => {
                                setShowLinkModal(false)
                                setShowLinkInputModal(true)
                                setLinkUrl('')
                              }}
                              className="dropdown-option"
                            >
                              <Link size={16} />
                              Add link
                            </button>
                          </div>
                        )}
                        
                        {/* Link Input Modal */}
                        {showLinkInputModal && (
                          <div className="link-modal-overlay">
                            <div className="link-modal">
                              <h4>Attach link</h4>
                              <input 
                                type="url"
                                placeholder="Paste link (Google Drive, GitHub, etc.)"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className="link-input"
                              />
                              <div className="link-modal-actions">
                                <button 
                                  onClick={() => {
                                    setShowLinkInputModal(false)
                                    setLinkUrl('')
                                  }}
                                  className="btn-secondary"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={handleAddLink}
                                  className="btn-primary"
                                  disabled={!linkUrl.trim()}
                                >
                                  Add link
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Hidden File Input */}
                        <input 
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    )}
                    
                    {/* Dynamic Action Button */}
                    {getAssignmentStatus() === 'assigned' && attachedFiles?.length > 0 && (
                      <button className="turn-in-btn" onClick={handleTurnIn}>
                        Turn in
                      </button>
                    )}
                    
                    {getAssignmentStatus() === 'assigned' && (!attachedFiles || attachedFiles?.length === 0) && (
                      <button className="turn-in-btn" onClick={handleMarkAsDone}>
                        Mark as done
                      </button>
                    )}
                    
                    {getAssignmentStatus() === 'turned_in' && (
                      <button className="unsubmit-btn" onClick={handleUnsubmit}>
                        Unsubmit
                      </button>
                    )}
                  </div>
                  
                  {/* Private Comments Section */}
                  <div className="private-comments-section">
                    <div className="private-comments-header">
                      <MessageSquare size={16} />
                      <span>Private comments</span>
                    </div>
                    
                    <div className="private-comments-list">
                      {privateComments?.map((comment) => (
                        <div key={comment?.id} className="private-comment">
                          <div className="comment-avatar">
                            {comment?.author?.charAt(0) || 'U'}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">{comment?.author || ''}</span>
                              <span className="comment-timestamp">{comment?.timestamp || ''}</span>
                              {canModerate() && (
                                <div className="comment-menu">
                                  <button className="comment-menu-btn">
                                    <MoreVertical size={12} />
                                  </button>
                                  <div className="comment-menu-dropdown">
                                    <button 
                                      className="comment-menu-item"
                                      onClick={() => handleEditComment(comment?.id, comment?.message)}
                                    >
                                      <Pencil size={12} />
                                      Edit
                                    </button>
                                    <button 
                                      className="comment-menu-item delete"
                                      onClick={() => handleDeleteComment(null, comment?.id)}
                                    >
                                      <Trash2 size={12} />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            {editingCommentId === comment?.id ? (
                              <div className="comment-edit-mode">
                                <textarea
                                  value={editCommentContent}
                                  onChange={(e) => setEditCommentContent(e.target.value)}
                                  className="comment-edit-input"
                                  autoFocus
                                />
                                <div className="comment-edit-actions">
                                  <button 
                                    className="btn-secondary"
                                    onClick={handleCancelCommentEdit}
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    className="btn-primary"
                                    onClick={() => handleSaveCommentEdit(comment?.id)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="comment-message">{comment?.message || ''}</p>
                                {comment?.edited && <span className="comment-edited">(edited)</span>}
                              </>
                            )}
                          </div>
                        </div>
                      )) || []}
                    </div>
                    
                    <div className="private-comment-input">
                      <input 
                        type="text"
                        placeholder="Add a private comment..."
                        value={newPrivateComment}
                        onChange={(e) => setNewPrivateComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendPrivateComment()}
                        className="comment-input-field"
                      />
                      <button 
                        className="comment-send-btn"
                        onClick={handleSendPrivateComment}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Google Meet Direct Join Overlay - STUDIO UI REDESIGN */}
        {isInActiveMeeting && activeMeetingSubject && (
          <div className="fixed inset-0 z-50 bg-[#0a0c10] text-white relative overflow-hidden">
            {/* Vibrant Ambient Background with Animated Gradient Blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-ambient-pulse"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-ambient-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-ambient-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Top Floating Glass Command Banner */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-40">
              {/* Left: Return Button */}
              <button 
                onClick={() => setIsInActiveMeeting(false)}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to {activeMeetingSubject?.code || "Classroom"}
              </button>
              
              {/* Center: Subject Info & Timer */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{activeMeetingSubject?.code || 'SIA 101'}</span>
                  <span className="text-slate-400 text-sm">| {activeMeetingSubject?.title || 'System Integration'}</span>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  PTC LIVE STUDIO
                </div>
                <span className="text-slate-300 text-sm font-mono">
                  {Math.floor(meetDuration / 3600).toString().padStart(2, '0')}:{Math.floor((meetDuration % 3600) / 60).toString().padStart(2, '0')}:{(meetDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              
              {/* Right: Utilities */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsCaptionsOn(!isCaptionsOn)
                    showToastMessage(isCaptionsOn ? 'Live captions turned off' : 'Live captions turned on')
                  }}
                  className={`p-2 rounded-full hover:bg-slate-700/50 transition-all ${isCaptionsOn ? 'text-blue-400' : 'text-slate-400'}`}
                  title="Live Subtitles"
                >
                  <Subtitles size={18} />
                </button>
                <button 
                  onClick={() => {
                    setSelectedLayout(selectedLayout === 'tiled' ? 'spotlight' : 'tiled')
                    showToastMessage(`Layout changed to ${selectedLayout === 'tiled' ? 'Spotlight' : 'Tiled'}`)
                  }}
                  className="p-2 rounded-full hover:bg-slate-700/50 text-slate-400 transition-all"
                  title="Layout Switcher"
                >
                  <LayoutGrid size={18} />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
            
            {/* Left Vertical Dock Toolbar */}
            <div className="fixed left-5 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 p-3.5 rounded-3xl shadow-2xl flex flex-col items-center gap-3.5 z-50">
              {/* Microphone Toggle */}
              <button 
                onClick={() => setMeetMicOn(!meetMicOn)}
                className={`p-3 rounded-2xl transition-all relative ${meetMicOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                title={meetMicOn ? 'Turn off microphone' : 'Turn on microphone'}
              >
                {meetMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                {meetMicOn && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <div className="w-0.5 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                    <div className="w-0.5 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                    <div className="w-0.5 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                    <div className="w-0.5 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                  </div>
                )}
              </button>
              
              {/* Camera Toggle */}
              <button 
                onClick={() => setMeetVideoOn(!meetVideoOn)}
                className={`p-3 rounded-2xl transition-all ${meetVideoOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                title={meetVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {meetVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              
              {/* Raise Hand Queue */}
              <button 
                onClick={() => {
                  setMeetHandRaised(!meetHandRaised)
                  if (!meetHandRaised) {
                    setRaisedHandsList(prev => [...prev, { id: 'user-1', name: user?.name || 'You', timestamp: Date.now() }])
                    showToastMessage('Hand raised')
                  } else {
                    setRaisedHandsList(prev => prev.filter(item => item.id !== 'user-1'))
                    showToastMessage('Hand lowered')
                  }
                }}
                className={`p-3 rounded-2xl transition-all relative ${meetHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title={meetHandRaised ? 'Lower hand' : 'Raise hand'}
              >
                <Hand size={20} />
                {meetHandRaised && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
                )}
              </button>
              
              {/* Screen Share Presenter */}
              <button 
                onClick={() => setShowScreenShareModal(true)}
                className={`p-3 rounded-2xl transition-all relative ${meetScreenSharing ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title={meetScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                <Monitor size={20} />
              </button>
              
              {/* Reactions Picker */}
              <div className="relative">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 rounded-2xl transition-all bg-slate-700/80 hover:bg-slate-600"
                  title="Reactions"
                >
                  <Smile size={20} />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute left-16 top-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl">
                    {['💖', '👍', '👏', '😂', '😮', '🎉', '🔥', '💯'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          triggerEmoji(emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="w-10 h-10 rounded-xl hover:bg-slate-700/50 transition-all text-2xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* In-Call Chat Drawer */}
              <button 
                onClick={() => {
                  setActiveMeetSideDrawer(activeMeetSideDrawer === 'chat' ? null : 'chat')
                }}
                className={`p-3 rounded-2xl transition-all relative ${activeMeetSideDrawer === 'chat' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title="Chat"
              >
                <MessageSquare size={20} />
                {chatMessages.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {chatMessages.length}
                  </span>
                )}
              </button>
              
              {/* Participants & Attendance */}
              <button 
                onClick={() => {
                  setActiveMeetSideDrawer(activeMeetSideDrawer === 'people' ? null : 'people')
                }}
                className={`p-3 rounded-2xl transition-all relative ${activeMeetSideDrawer === 'people' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title="Participants"
              >
                <Users size={20} />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {participants.length}
                </span>
                {raisedHandsList.length > 0 && (
                  <span className="absolute -top-1 -right-4 bg-yellow-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {raisedHandsList.length}
                  </span>
                )}
              </button>
              
              {/* Host Management Shield (Host Only) */}
              {isMeetingHost() && (
                <button 
                  onClick={() => {
                    setActiveMeetSideDrawer(activeMeetSideDrawer === 'hostControls' ? null : 'hostControls')
                  }}
                  className={`p-3 rounded-2xl transition-all ${activeMeetSideDrawer === 'hostControls' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                  title="Host controls"
                >
                  <Shield size={20} />
                </button>
              )}
              
              {/* Studio Hardware Settings */}
              <button 
                onClick={() => setShowMeetHardwareSettings(true)}
                className="p-3 rounded-2xl transition-all bg-slate-700/80 hover:bg-slate-600"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              
              <div className="w-8 h-px bg-slate-700 my-1"></div>
              
              {/* Leave / End Call Action */}
              <button 
                onClick={() => {
                  if (isMeetingHost()) {
                    setShowEndCallConfirmModal(true)
                  } else {
                    handleLeaveMeeting()
                  }
                }}
                className="p-3 rounded-2xl transition-all bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30"
                title={isMeetingHost() ? 'End call for everyone' : 'Leave call'}
              >
                <PhoneOff size={20} />
              </button>
            </div>
            
            {/* Main Content Area - Spotlight & Carousel Stage */}
            <div className="flex h-full pl-24 pr-0">
              {/* Video Stage */}
              <div className="flex-1 p-4 pt-20 pb-4">
                {/* Top Participant Carousel */}
                <div className="flex gap-3 overflow-x-auto pb-3 px-2 mb-4">
                  {participants.map((participant) => (
                    <div 
                      key={participant.id}
                      className={`flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden relative cursor-pointer transition-all ${
                        participant.isSpeaking ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'border border-slate-700/60'
                      }`}
                    >
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <span className="text-2xl font-bold">{participant.name?.charAt(0) || 'U'}</span>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-xs">
                        {participant.name}
                      </div>
                      {participant.isSpeaking && (
                        <div className="absolute top-2 right-2 flex gap-0.5">
                          <div className="w-1 h-2 bg-green-500 rounded-full audio-wave-bar"></div>
                          <div className="w-1 h-2 bg-green-500 rounded-full audio-wave-bar"></div>
                          <div className="w-1 h-2 bg-green-500 rounded-full audio-wave-bar"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Main Spotlight Area */}
                <div className="flex-1 rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden relative bg-slate-950">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {meetVideoOn ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <span className="text-6xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                  
                  {/* Active Speaker Info */}
                  <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name || 'You'}</p>
                      {meetMicOn && (
                        <div className="flex gap-0.5 mt-1">
                          <div className="w-1 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                          <div className="w-1 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                          <div className="w-1 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                          <div className="w-1 h-3 bg-green-500 rounded-full audio-wave-bar"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!meetMicOn && (
                    <div className="absolute top-6 right-6 bg-red-600 p-3 rounded-full shadow-lg shadow-red-500/30">
                      <MicOff size={20} />
                    </div>
                  )}
                  
                  {/* Floating Animated Emoji Stream */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
                    {activeReactions?.map((reaction) => (
                      <div
                        key={reaction.id}
                        className="absolute bottom-12 left-8 text-3xl filter drop-shadow-lg animate-float-up"
                        style={{ left: `${reaction.leftPosition}%` }}
                      >
                        {reaction.emojiSymbol}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Live Captions Display */}
                {isCaptionsOn && liveCaptions.length > 0 && (
                  <div className="mt-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/60 shadow-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Subtitles size={16} className="text-blue-400" />
                      <span className="text-sm font-semibold text-slate-300">Live Captions</span>
                      <select 
                        value={captionLanguage}
                        onChange={(e) => setCaptionLanguage(e.target.value)}
                        className="ml-auto bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="en-US">English</option>
                        <option value="tl-PH">Tagalog</option>
                        <option value="en-PH">Taglish</option>
                      </select>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {liveCaptions.map((caption) => (
                        <div key={caption.id} className="text-sm">
                          <span className="font-semibold text-blue-400">[{caption.speaker}]:</span>
                          <span className="text-white ml-2">{caption.text}</span>
                          <span className="text-slate-500 text-xs ml-2">{caption.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Collapsible Side Drawer - Glassmorphism Design */}
              {activeMeetSideDrawer && (
                <div className="w-96 bg-[#0f172a] backdrop-blur-2xl border-l border-slate-700/60 p-5 flex flex-col h-full z-40 shadow-2xl">
                  {/* PEOPLE PANEL */}
                  {activeMeetSideDrawer === 'people' && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-base">People in call ({participants.length})</h3>
                        <button 
                          onClick={() => setActiveMeetSideDrawer(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="mb-4">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text"
                            placeholder="Search people..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all"
                          />
                        </div>
                      </div>
                      
                      {/* Host Attendance Export */}
                      {isMeetingHost() && (
                        <div className="mb-4 space-y-2">
                          <button 
                            onClick={exportAttendanceCSV}
                            className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                          >
                            <Download size={14} />
                            Export Attendance (.csv)
                          </button>
                          {raisedHandsList.length > 0 && (
                            <button 
                              onClick={() => {
                                setRaisedHandsList([])
                                setMeetHandRaised(false)
                                setIsHandRaised(false)
                                showToastMessage('All hands lowered')
                              }}
                              className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                            >
                              <Hand size={14} />
                              Lower All Hands ({raisedHandsList.length})
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Participant List */}
                      <div className="flex-1 overflow-y-auto space-y-2">
                        {participants.map((participant) => (
                          <div 
                            key={participant.id}
                            className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-2xl group relative transition-all border border-transparent hover:border-slate-700/50"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium">
                              {participant.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{participant.name}</p>
                              <p className="text-xs text-slate-400">{participant.role}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {participant.handRaised && <Hand size={14} className="text-yellow-500" />}
                              {participant.micOn ? <Mic size={14} className="text-green-500" /> : <MicOff size={14} className="text-red-500" />}
                            </div>
                            
                            {/* Hover Actions (Host Only) */}
                            {isMeetingHost() && participant.role === 'student' && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xl rounded-xl p-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-slate-700/60">
                                <button 
                                  onClick={() => showToastMessage(`Pinned ${participant.name}`)}
                                  className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                                  title="Pin tile"
                                >
                                  <Pin size={12} />
                                </button>
                                <button 
                                  onClick={() => toggleParticipantMic(participant.id)}
                                  className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                                  title="Mute"
                                >
                                  <VolumeX size={12} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setParticipants(participants.filter(p => p.id !== participant.id))
                                    showToastMessage(`Removed ${participant.name}`)
                                  }}
                                  className="p-1.5 hover:bg-slate-700/50 rounded-lg text-red-400 transition-colors"
                                  title="Kick"
                                >
                                  <UserX size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* IN-CALL CHAT PANEL */}
                  {activeMeetSideDrawer === 'chat' && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-base">In-call messages</h3>
                        <button 
                          onClick={() => setActiveMeetSideDrawer(null)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      {/* Host Chat Toggle */}
                      {isMeetingHost() && (
                        <div className="mb-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={!hostLockChat}
                              onChange={() => setHostLockChat(!hostLockChat)}
                              className="rounded"
                            />
                            <span>Allow students to send messages</span>
                          </label>
                        </div>
                      )}
                      
                      {/* Message Feed */}
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                              {msg.sender?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{msg.sender}</p>
                                <p className="text-xs text-slate-400">{msg.time}</p>
                              </div>
                              <p className="text-sm text-slate-300 break-words bg-slate-800/30 rounded-xl p-2.5 mt-1 border border-slate-700/30">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Message Input */}
                      <div className="pt-3 border-t border-slate-700/50">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-colors text-slate-400 hover:text-white"
                          >
                            <Smile size={18} />
                          </button>
                          <input 
                            type="text"
                            placeholder="Send a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all"
                            disabled={hostLockChat && !isMeetingHost()}
                          />
                          <button 
                            onClick={handleSendMessage}
                            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!newMessage.trim()}
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* HOST CONTROLS PANEL */}
                  {activeMeetSideDrawer === 'hostControls' && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-base">Host controls</h3>
                        <button 
                          onClick={() => setActiveMeetSideDrawer(null)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-3">
                        {/* Mute All Participants */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                              <VolumeX size={18} className="text-red-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Mute All Participants</p>
                              <p className="text-xs text-slate-400">Silence all non-host audio</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setHostMuteAll(!hostMuteAll)
                              showToastMessage(hostMuteAll ? 'Participants unmuted' : 'All participants muted')
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              hostMuteAll ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {hostMuteAll ? 'On' : 'Off'}
                          </button>
                        </div>
                        
                        {/* Turn Off Student Cameras */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                              <VideoOff size={18} className="text-orange-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Turn Off Student Cameras</p>
                              <p className="text-xs text-slate-400">Lock student video permissions</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setHostTurnOffCameras(!hostTurnOffCameras)
                              showToastMessage(hostTurnOffCameras ? 'Student cameras enabled' : 'Student cameras disabled')
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              hostTurnOffCameras ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {hostTurnOffCameras ? 'On' : 'Off'}
                          </button>
                        </div>
                        
                        {/* Restrict Screen Share */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                              <Monitor size={18} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Restrict Screen Share</p>
                              <p className="text-xs text-slate-400">Host-only presentations</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setHostRestrictScreenShare(!hostRestrictScreenShare)
                              showToastMessage(hostRestrictScreenShare ? 'Screen share enabled for all' : 'Screen share restricted to host')
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              hostRestrictScreenShare ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {hostRestrictScreenShare ? 'On' : 'Off'}
                          </button>
                        </div>
                        
                        {/* Lock In-Call Chat */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                              <MessageSquare size={18} className="text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Lock In-Call Chat</p>
                              <p className="text-xs text-slate-400">Disable student chat messages</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setHostLockChat(!hostLockChat)
                              showToastMessage(hostLockChat ? 'Chat unlocked' : 'Chat locked')
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              hostLockChat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {hostLockChat ? 'On' : 'Off'}
                          </button>
                        </div>
                        
                        {/* Meeting Lock */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                              <Lock size={18} className="text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Meeting Lock</p>
                              <p className="text-xs text-slate-400">Block new student entries</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setHostMeetingLock(!hostMeetingLock)
                              showToastMessage(hostMeetingLock ? 'Meeting unlocked' : 'Meeting locked')
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              hostMeetingLock ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {hostMeetingLock ? 'On' : 'Off'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Single Unified Bottom Floating Control Bar */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#0f172a] backdrop-blur-xl px-6 py-3 rounded-full border border-slate-700/70 shadow-2xl flex items-center gap-3 z-50">
              {/* 1. Microphone Toggle */}
              <button 
                onClick={() => setMeetMicOn(!meetMicOn)}
                className={`p-3 rounded-full transition-all ${meetMicOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                title={meetMicOn ? 'Turn off microphone' : 'Turn on microphone'}
              >
                {meetMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              
              {/* 2. Camera Toggle */}
              <button 
                onClick={() => setMeetVideoOn(!meetVideoOn)}
                className={`p-3 rounded-full transition-all ${meetVideoOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                title={meetVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {meetVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              
              {/* 3. Raise Hand Queue */}
              <button 
                onClick={() => {
                  setMeetHandRaised(!meetHandRaised)
                  if (!meetHandRaised) {
                    setRaisedHandsList(prev => [...prev, { id: 'user-1', name: user?.name || 'You', timestamp: Date.now() }])
                    showToastMessage('Hand raised')
                  } else {
                    setRaisedHandsList(prev => prev.filter(item => item.id !== 'user-1'))
                    showToastMessage('Hand lowered')
                  }
                }}
                className={`p-3 rounded-full transition-all ${meetHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title={meetHandRaised ? 'Lower hand' : 'Raise hand'}
              >
                <Hand size={20} />
              </button>
              
              {/* 4. Screen Share Presenter */}
              <button 
                onClick={() => setShowScreenShareModal(true)}
                className={`p-3 rounded-full transition-all ${meetScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title={meetScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                <Monitor size={20} />
              </button>
              
              {/* 5. Extended Emoji Reactions */}
              <div className="relative">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 rounded-full transition-all bg-slate-700/80 hover:bg-slate-600"
                  title="Reactions"
                >
                  <Smile size={20} />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#2d2e30] rounded-xl p-2 flex gap-2 shadow-xl border border-slate-700 z-50">
                    {['💖', '👍', '👏', '😂', '😮', '🎉', '🔥', '💯'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          triggerEmoji(emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="w-10 h-10 rounded-lg hover:bg-slate-600 transition-all text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 6. In-Call Chat Panel Toggle */}
              <button 
                onClick={() => {
                  setActiveMeetSideDrawer(activeMeetSideDrawer === 'chat' ? null : 'chat')
                }}
                className={`p-3 rounded-full transition-all relative ${activeMeetSideDrawer === 'chat' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title="Chat"
              >
                <MessageSquare size={20} />
                {chatMessages.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {chatMessages.length}
                  </span>
                )}
              </button>
              
              {/* 7. Participants & Attendance Roster Toggle */}
              <button 
                onClick={() => {
                  setActiveMeetSideDrawer(activeMeetSideDrawer === 'people' ? null : 'people')
                }}
                className={`p-3 rounded-full transition-all relative ${activeMeetSideDrawer === 'people' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                title="Participants"
              >
                <Users size={20} />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {participants.length}
                </span>
              </button>
              
              {/* 8. Host Controls Shield (Host Only) */}
              {isMeetingHost() && (
                <button 
                  onClick={() => {
                    setActiveMeetSideDrawer(activeMeetSideDrawer === 'hostControls' ? null : 'hostControls')
                  }}
                  className={`p-3 rounded-full transition-all ${activeMeetSideDrawer === 'hostControls' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
                  title="Host controls"
                >
                  <Shield size={20} />
                </button>
              )}
              
              {/* 9. More Options Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowMoreOptionsDropdown(!showMoreOptionsDropdown)}
                  className="p-3 rounded-full transition-all bg-slate-700/80 hover:bg-slate-600"
                  title="More options"
                >
                  <MoreVertical size={20} />
                </button>
                
                {showMoreOptionsDropdown && (
                  <div className="absolute bottom-16 right-0 bg-[#2d2e30] rounded-xl shadow-xl border border-slate-700 z-50 min-w-[200px] overflow-hidden">
                    <button 
                      onClick={() => {
                        setShowLayoutModal(true)
                        setShowMoreOptionsDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm"
                    >
                      <LayoutGrid size={16} />
                      Change Layout
                    </button>
                    <button 
                      onClick={() => {
                        if (!isFullScreen) {
                          document.documentElement.requestFullscreen()
                          setIsFullScreen(true)
                        } else {
                          document.exitFullscreen()
                          setIsFullScreen(false)
                        }
                        setShowMoreOptionsDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm"
                    >
                      <Maximize size={16} />
                      Full Screen
                    </button>
                    <button 
                      onClick={() => {
                        setShowVirtualBackgroundModal(true)
                        setShowMoreOptionsDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm"
                    >
                      <Sparkles size={16} />
                      Visual Effects
                    </button>
                    <button 
                      onClick={() => {
                        setIsCaptionsOn(!isCaptionsOn)
                        setShowMoreOptionsDropdown(false)
                        showToastMessage(isCaptionsOn ? 'Live captions turned off' : 'Live captions turned on')
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm"
                    >
                      <Subtitles size={16} />
                      Turn on Live Captions
                    </button>
                    <button 
                      onClick={() => {
                        setShowMeetHardwareSettings(true)
                        setShowMoreOptionsDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-px h-8 bg-slate-600 mx-2" />
              
              {/* 10. End / Leave Call Button */}
              <button 
                onClick={() => {
                  if (isMeetingHost()) {
                    setShowEndCallConfirmModal(true)
                  } else {
                    handleLeaveMeeting()
                  }
                }}
                className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-full transition-all flex items-center gap-2"
                title={isMeetingHost() ? 'End call for everyone' : 'Leave call'}
              >
                <PhoneOff size={20} />
              </button>
            </div>
            
            {/* Screen Share Selection Modal */}
            {showScreenShareModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-[#2d2e30] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Share your screen</h3>
                    <button 
                      onClick={() => setShowScreenShareModal(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  {/* Audio Share Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Volume2 size={18} className="text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Share Audio</p>
                        <p className="text-xs text-slate-400">Share system audio</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShareAudio(!shareAudio)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        shareAudio ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {shareAudio ? 'On' : 'Off'}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleToggleScreenShare('screen')}
                      disabled={hostRestrictScreenShare && !isMeetingHost()}
                      className={`w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center gap-4 ${hostRestrictScreenShare && !isMeetingHost() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Monitor size={24} className="text-blue-400" />
                      <div>
                        <p className="font-medium">Entire Screen</p>
                        <p className="text-sm text-slate-400">Share everything on your screen</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleToggleScreenShare('window')}
                      disabled={hostRestrictScreenShare && !isMeetingHost()}
                      className={`w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center gap-4 ${hostRestrictScreenShare && !isMeetingHost() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <LayoutGrid size={24} className="text-green-400" />
                      <div>
                        <p className="font-medium">Window</p>
                        <p className="text-sm text-slate-400">Share a specific application window</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleToggleScreenShare('tab')}
                      disabled={hostRestrictScreenShare && !isMeetingHost()}
                      className={`w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center gap-4 ${hostRestrictScreenShare && !isMeetingHost() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Grid size={24} className="text-purple-400" />
                      <div>
                        <p className="font-medium">Chrome Tab</p>
                        <p className="text-sm text-slate-400">Share a browser tab</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Stop Presenting Banner */}
            {meetScreenSharing && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-600/95 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-40 border border-blue-400/50">
                <div className="flex items-center gap-2">
                  <Monitor size={18} className="text-white" />
                  <span className="text-white font-medium text-sm">You are presenting your screen to everyone</span>
                </div>
                <button 
                  onClick={() => handleToggleScreenShare()}
                  className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-all"
                >
                  Stop Presenting
                </button>
              </div>
            )}
            
            {/* Layout Selection Modal */}
            {showLayoutModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-[#2d2e30] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Change layout</h3>
                    <button 
                      onClick={() => setShowLayoutModal(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'tiled', icon: LayoutGrid, label: 'Tiled', desc: 'Equal-sized tiles' },
                      { id: 'spotlight', icon: Monitor, label: 'Spotlight', desc: 'Focus on speaker' },
                      { id: 'sidebar', icon: LayoutGrid, label: 'Sidebar', desc: 'Content + video' },
                      { id: 'auto', icon: Sparkles, label: 'Auto', desc: 'Automatic layout' }
                    ].map((layout) => (
                      <button
                        key={layout.id}
                        onClick={() => {
                          setSelectedLayout(layout.id)
                          setShowLayoutModal(false)
                          showToastMessage(`Layout changed to ${layout.label}`)
                        }}
                        className={`p-4 rounded-xl text-left transition-all flex flex-col items-center gap-2 ${
                          selectedLayout === layout.id 
                            ? 'bg-blue-600 border-2 border-blue-400' 
                            : 'bg-slate-800 hover:bg-slate-700 border-2 border-transparent'
                        }`}
                      >
                        <layout.icon size={32} />
                        <p className="font-medium text-sm">{layout.label}</p>
                        <p className="text-xs text-slate-400">{layout.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Virtual Backgrounds Modal */}
            {showVirtualBackgroundModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-[#2d2e30] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Visual effects</h3>
                    <button 
                      onClick={() => setShowVirtualBackgroundModal(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'none', label: 'None', desc: 'No effect', color: 'bg-slate-700' },
                      { id: 'blur', label: 'Blur', desc: 'Background blur', color: 'bg-blue-600' },
                      { id: 'classroom', label: 'Classroom', desc: 'Virtual classroom', color: 'bg-green-600' },
                      { id: 'office', label: 'Office', desc: 'Professional office', color: 'bg-purple-600' },
                      { id: 'ai', label: 'AI Generated', desc: 'AI background', color: 'bg-pink-600' }
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => {
                          setSelectedVirtualBackground(bg.id)
                          setShowVirtualBackgroundModal(false)
                          showToastMessage(`Background set to ${bg.label}`)
                        }}
                        className={`p-4 rounded-xl text-left transition-all ${
                          selectedVirtualBackground === bg.id 
                            ? 'ring-2 ring-blue-400' 
                            : 'hover:bg-slate-700'
                        }`}
                      >
                        <div className={`w-full h-20 ${bg.color} rounded-lg mb-2 flex items-center justify-center`}>
                          {bg.id === 'none' && <User size={32} />}
                          {bg.id === 'blur' && <Sparkles size={32} />}
                          {bg.id === 'classroom' && <GraduationCap size={32} />}
                          {bg.id === 'office' && <Monitor size={32} />}
                          {bg.id === 'ai' && <Sparkles size={32} />}
                        </div>
                        <p className="font-medium text-sm">{bg.label}</p>
                        <p className="text-xs text-slate-400">{bg.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Audio/Video Hardware Settings Modal */}
            {showMeetHardwareSettings && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-[#2d2e30] rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Settings</h3>
                    <button 
                      onClick={() => setShowMeetHardwareSettings(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Microphone */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Mic size={16} />
                        Microphone
                      </label>
                      <select 
                        value={selectedMicrophone}
                        onChange={(e) => setSelectedMicrophone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option>Default - Internal Mic</option>
                        <option>External Microphone</option>
                        <option>Headset Microphone</option>
                      </select>
                    </div>
                    
                    {/* Speaker */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Volume2 size={16} />
                        Speaker
                      </label>
                      <select 
                        value={selectedSpeaker}
                        onChange={(e) => setSelectedSpeaker(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option>Speakers (Realtek(R) Audio)</option>
                        <option>Headphones</option>
                        <option>External Speakers</option>
                      </select>
                    </div>
                    
                    {/* AI Noise Suppression */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Sparkles size={18} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">AI Noise Suppression</p>
                          <p className="text-xs text-slate-400">Reduce background noise</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setNoiseSuppressionEnabled(!noiseSuppressionEnabled)
                          showToastMessage(noiseSuppressionEnabled ? 'Noise suppression disabled' : 'Noise suppression enabled')
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          noiseSuppressionEnabled ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {noiseSuppressionEnabled ? 'On' : 'Off'}
                      </button>
                    </div>
                    
                    {/* Camera */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Camera size={16} />
                        Camera
                      </label>
                      <select 
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option>Default - FaceTime HD Camera</option>
                        <option>External Webcam</option>
                        <option>HD Pro Webcam</option>
                      </select>
                    </div>
                    
                    {/* Video Resolution */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Video size={16} />
                        Video Resolution
                      </label>
                      <select 
                        value={selectedVideoResolution}
                        onChange={(e) => setSelectedVideoResolution(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option>720p (HD)</option>
                        <option>1080p (Full HD)</option>
                        <option>360p (SD)</option>
                        <option>Audio Only</option>
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowMeetHardwareSettings(false)
                      showToastMessage('Settings saved')
                    }}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
            
            {/* End Call Confirmation Modal (Host Only) */}
            {showEndCallConfirmModal && isMeetingHost() && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-[#2d2e30] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">End call?</h3>
                    <button 
                      onClick={() => setShowEndCallConfirmModal(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <p className="text-slate-300 mb-6">
                    You're the host. Would you like to end the call for everyone or just leave?
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        handleLeaveMeeting()
                        setShowEndCallConfirmModal(false)
                        showToastMessage('Call ended for everyone')
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneOff size={20} />
                      End call for everyone
                    </button>
                    
                    <button 
                      onClick={() => {
                        handleLeaveMeeting()
                        setShowEndCallConfirmModal(false)
                        showToastMessage('You left the call')
                      }}
                      className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-medium transition-all"
                    >
                      Just leave call
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  
  // ==================== PRE-JOIN LOBBY ====================
  if (step === 'lobby') {
    return (
      <div className="lobby-container">
        <div className="lobby-top-bar">
          <div className="user-profile">
            <div className="user-avatar">{user?.avatar || displayName?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || displayName || 'User'}</span>
              <span className="user-email">{user?.email || 'user@ptc.edu.ph'}</span>
            </div>
          </div>
          
          {/* Meet Module Utilities Toolbar */}
          <div className="flex items-center gap-2 z-40">
            <button 
              className="icon-btn header-icon" 
              title="Support"
              onClick={() => setShowMeetSupportMenu(!showMeetSupportMenu)}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              className="icon-btn header-icon" 
              title="Settings"
              onClick={() => setShowMeetSettingsModal(true)}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              className="icon-btn header-icon" 
              title="Google Apps"
              onClick={() => setShowAppsGridPopover(!showAppsGridPopover)}
            >
              <Grid className="w-5 h-5" />
            </button>
            <div className="user-avatar-circle" title={user?.name || 'User'}>
              {user?.avatar || user?.name?.charAt(0) || 'U'}
            </div>
            {activeSubject && (
              <button className="return-classroom-btn" onClick={handleReturnToClassroom}>
                <GraduationCap size={18} />
                Return to Classroom
              </button>
            )}
            <button className="sign-out-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
        
        <div className="lobby-content">
          <div className="lobby-left">
            <div className="video-preview">
              <div className="video-placeholder">
                {lobbyCameraOn ? (
                  <div className="camera-active">
                    <Video size={48} />
                    <p>Camera Preview</p>
                  </div>
                ) : (
                  <div className="camera-off">
                    <VideoOff size={48} />
                    <p>Camera Off</p>
                  </div>
                )}
              </div>
              
              <div className="preview-controls">
                <button 
                  className={`control-btn ${!lobbyMicOn ? 'muted' : ''}`}
                  onClick={() => setLobbyMicOn(!lobbyMicOn)}
                >
                  {lobbyMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button 
                  className={`control-btn ${!lobbyCameraOn ? 'muted' : ''}`}
                  onClick={() => setLobbyCameraOn(!lobbyCameraOn)}
                >
                  {lobbyCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                <button 
                  className={`control-btn ${backgroundBlur ? 'active' : ''}`}
                  onClick={() => setBackgroundBlur(!backgroundBlur)}
                  title="Background blur"
                >
                  <Smile size={24} />
                </button>
              </div>
              
              <div className="status-pills">
                <div className="status-pill">
                  <span className="pill-name">{displayName || 'Your Name'}</span>
                </div>
                {lobbyMicOn && (
                  <div className="status-pill audio-level">
                    <Volume2 size={16} />
                    <div className="audio-bars">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lobby-right">
            <div className="action-card">
              <h2>Ready to join?</h2>
              <p className="subtitle">PTC Meet Live Classroom</p>
              
              <div className="input-group">
                <label>Enter Meeting Code or Link</label>
                <input 
                  type="text" 
                  placeholder="e.g., ptc-bsit3j-webdev"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </div>
              
              <div className="guest-status">
                <Bell size={16} />
                <span>Guest check-in: {isHost ? 'Host - No approval needed' : 'Waiting for host approval'}</span>
              </div>
              
              <div className="action-buttons">
                <button className="btn-primary" onClick={handleJoin}>
                  <ArrowRight size={20} />
                  Join Now
                </button>
                <button className="btn-secondary" onClick={handleCreateMeeting}>
                  <Plus size={20} />
                  Create New Meeting
                </button>
              </div>
              
              <div className="schedule-option">
                <Calendar size={16} />
                <a href="#">Schedule a meeting for later</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Support & Help Dropdown Menu */}
        {showMeetSupportMenu && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-2 w-56 text-sm absolute top-16 right-4 z-50">
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                setShowHelpModal(true)
              }}
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening feedback form...')
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Report a problem
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                setShowShortcutsModal(true)
              }}
            >
              <Keyboard className="w-4 h-4" />
              Training
            </button>
            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening Terms of Service...')
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Terms of Service
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening Privacy Policy...')
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Privacy Policy
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening Terms summary...')
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Terms summary
            </button>
          </div>
        )}
        
        {/* Google Meet Settings Modal */}
        {showMeetSettingsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h2>
                <button 
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setShowMeetSettingsModal(false)}
                >
                  <X size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              
              <div className="flex h-[60vh]">
                {/* Left Navigation Sidebar */}
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-4">
                  <nav className="space-y-1">
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'audio' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('audio')}
                    >
                      <Mic className="w-5 h-5" />
                      Audio
                    </button>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'video' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('video')}
                    >
                      <Video className="w-5 h-5" />
                      Video
                    </button>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'callhistory' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('callhistory')}
                    >
                      <PhoneCall className="w-5 h-5" />
                      Call history
                    </button>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'general' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('general')}
                    >
                      <Sliders className="w-5 h-5" />
                      General
                    </button>
                  </nav>
                </div>
                
                {/* Right Content Panel */}
                <div className="w-2/3 p-6 overflow-y-auto">
                  {meetSettingsTab === 'audio' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Microphone</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedMicrophone}
                          onChange={(e) => setSelectedMicrophone(e.target.value)}
                        >
                          <option value="Default - Internal Mic">Default - Internal Mic</option>
                          <option value="Microphone (Realtek(R) Audio)">Microphone (Realtek(R) Audio)</option>
                          <option value="Headset Microphone">Headset Microphone</option>
                        </select>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4"></div>
                          </div>
                          <Volume2 className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Speakers</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedSpeaker}
                          onChange={(e) => setSelectedSpeaker(e.target.value)}
                        >
                          <option value="Speakers (Realtek(R) Audio)">Speakers (Realtek(R) Audio)</option>
                          <option value="Headphones">Headphones</option>
                          <option value="Default Output">Default Output</option>
                        </select>
                      </div>
                      
                      {/* AI Noise Suppression Toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                            <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-white">AI Noise Suppression</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Reduce background noise</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setNoiseSuppressionEnabled(!noiseSuppressionEnabled)
                            showToastMessage(noiseSuppressionEnabled ? 'Noise suppression disabled' : 'Noise suppression enabled')
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            noiseSuppressionEnabled ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {noiseSuppressionEnabled ? 'On' : 'Off'}
                        </button>
                      </div>
                      
                      <button 
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        onClick={() => {
                          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleV0kP4W0pJmKc0I/hK+kmYpxQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M=')
                          audio.play()
                          showToastMessage('Playing test sound...')
                        }}
                      >
                        <Volume2 className="w-5 h-5" />
                        Test
                      </button>
                    </div>
                  )}
                  
                  {meetSettingsTab === 'video' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Camera</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="default">Default Camera</option>
                          <option value="front">Front Camera</option>
                          <option value="back">Back Camera</option>
                          <option value="external">External Webcam</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resolution</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="720p">720p (HD)</option>
                          <option value="1080p">1080p (Full HD)</option>
                          <option value="360p">360p (SD)</option>
                          <option value="audio">Audio Only</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {meetSettingsTab === 'callhistory' && (
                    <div className="space-y-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Recent calls</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">JS</div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">John Smith</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Today, 2:30 PM</div>
                          </div>
                          <div className="text-sm text-green-600">Completed</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">MJ</div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">Mary Johnson</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Yesterday, 4:15 PM</div>
                          </div>
                          <div className="text-sm text-green-600">Completed</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">RB</div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">Robert Brown</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Aug 24, 10:00 AM</div>
                          </div>
                          <div className="text-sm text-red-600">Missed</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {meetSettingsTab === 'general' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Noise cancellation</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Reduce background noise</div>
                        </div>
                        <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Low light mode</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Brighten video in low light</div>
                        </div>
                        <button className="w-12 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative transition-colors">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                      
                      <div>
                        <button 
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                          onClick={() => showToastMessage('Running diagnostics...')}
                        >
                          <Sliders className="w-4 h-4" />
                          Run diagnostics
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Google / PTC Apps Waffle Grid Popover */}
        {showAppsGridPopover && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 w-80 z-50 absolute top-16 right-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Your favorites</h3>
              <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-medium">
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  setShowSettingsModal(true)
                }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Account</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Gmail...')
                }}
              >
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Mail</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Drive...')
                }}
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Drive</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Docs...')
                }}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Docs</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Sheets...')
                }}
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Sheets</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Slides...')
                }}
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Slides</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Calendar...')
                }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Calendar</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Chat...')
                }}
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Chat</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Already in Meet')
                }}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Meet</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Classroom...')
                }}
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Classroom</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Gemini AI...')
                }}
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                  <Smile className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Gemini</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Vids...')
                }}
              >
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Vids</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // ==================== WAITING ROOM ====================
  if (step === 'waiting') {
    return (
      <div className="waiting-room">
        <div className="waiting-content">
          <div className="waiting-animation">
            <div className="pulse-ring"></div>
            <Clock size={64} />
          </div>
          <h2>Asking to join...</h2>
          <p>Please wait until the host lets you in.</p>
          <div className="waiting-info">
            <p>Room: <strong>{roomCode}</strong></p>
            <p>As: <strong>{user?.name || displayName}</strong></p>
          </div>
          <button className="btn-secondary" onClick={() => setStep('lobby')}>
            Cancel
          </button>
        </div>
        
        {/* Admission Request Toast (for host) */}
        {isHost && admissionRequests.length > 0 && (
          <div className="admission-toast">
            <div className="toast-header">
              <Bell size={20} />
              <span>Admission Request</span>
            </div>
            {admissionRequests.map(request => (
              <div key={request.id} className="admission-request">
                <div className="request-info">
                  <div className="request-avatar">{request.name.charAt(0)}</div>
                  <div>
                    <p className="request-name">{request.name}</p>
                    <p className="request-email">{request.email}</p>
                  </div>
                </div>
                <div className="request-actions">
                  <button className="btn-deny" onClick={() => handleDenyRequest(request.id)}>
                    <XCircle size={20} />
                    Deny
                  </button>
                  <button className="btn-admit" onClick={() => handleAdmitRequest(request.id)}>
                    <CheckCircle size={20} />
                    Admit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  // In-Call Screen
  if (step === 'incall') {
    return (
      <div className="incall-container">
        {/* Top Navigation Bar */}
        <div className="top-nav">
          <div className="nav-left">
            <h3>BSIT 3J - Web Development</h3>
            <button className="icon-btn" onClick={copyRoomCode}>
              <Copy size={18} />
            </button>
            {isRecording && (
              <div className="recording-status">
                <div className="rec-dot"></div>
                <span>REC - Recording Meeting</span>
              </div>
            )}
          </div>
          <div className="nav-right">
            <div className="clock">
              <Clock size={18} />
              <span>{currentTime}</span>
            </div>
            <div className="room-code-badge">
              <span>{roomCode}</span>
            </div>
            {roomLocked && (
              <div className="security-badge locked">
                <Lock size={16} />
                <span>Locked</span>
              </div>
            )}
            {!roomLocked && (
              <div className="security-badge">
                <Lock size={16} />
              </div>
            )}
            
            {/* Meet Module Utilities Toolbar */}
            <div className="flex items-center gap-2 z-40">
              <button 
                className="icon-btn header-icon" 
                title="Support"
                onClick={() => setShowMeetSupportMenu(!showMeetSupportMenu)}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button 
                className="icon-btn header-icon" 
                title="Settings"
                onClick={() => setShowMeetSettingsModal(true)}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                className="icon-btn header-icon" 
                title="Google Apps"
                onClick={() => setShowAppsGridPopover(!showAppsGridPopover)}
              >
                <Grid className="w-5 h-5" />
              </button>
              <div className="user-avatar-circle" title={user?.name || 'User'}>
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-btn" onClick={() => setShowShortcutsModal(true)} title="Keyboard shortcuts">
              <Keyboard className="w-5 h-5" size={18} />
            </button>
            {activeSubject && (
              <button className="return-classroom-btn" onClick={handleReturnToClassroom}>
                <GraduationCap size={16} />
                Return to Classroom
              </button>
            )}
          </div>
        </div>
        
        {/* Main Video Grid */}
        <div className="video-grid">
          <iframe
            src={`https://meet.jit.si/PTC_MEET_${roomCode}`}
            className="jitsi-frame"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            title="Jitsi Meet"
          />
          
          {/* Emoji Reactions Overlay */}
          {showEmojiReactions && activeReaction && (
            <div className="emoji-reaction-overlay">
              <div className="emoji-bubble">{activeReaction}</div>
            </div>
          )}
          
          {/* Floating Emoji Reactions Overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
            {activeReactions.map((reaction) => (
              <div
                key={reaction.id}
                className="absolute text-4xl animate-bounce"
                style={{
                  left: `${reaction.leftPosition}%`,
                  bottom: '0',
                  animation: 'floatUp 2s ease-out forwards'
                }}
              >
                {reaction.emojiSymbol}
              </div>
            ))}
          </div>
          
          {/* Hand Raise Badge Overlay */}
          {isHandRaised && (
            <div className="absolute top-4 left-4 z-40 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg">
              <Hand size={20} />
              <span className="text-sm font-medium">Hand Raised</span>
            </div>
          )}
          
          {/* Whiteboard Overlay */}
          {showWhiteboard && (
            <div className="whiteboard-overlay">
              <div className="whiteboard-header">
                <h3>Interactive Whiteboard</h3>
                <button className="close-btn" onClick={() => setShowWhiteboard(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="whiteboard-canvas" ref={whiteboardRef}>
                <div className="canvas-placeholder">
                  <PenTool size={48} />
                  <p>Whiteboard Canvas</p>
                  <p className="canvas-hint">Draw, annotate, and collaborate</p>
                </div>
              </div>
              <div className="whiteboard-tools">
                <button className="tool-btn active">✏️ Pen</button>
                <button className="tool-btn">🎨 Color</button>
                <button className="tool-btn">📐 Shapes</button>
                <button className="tool-btn">📝 Text</button>
                <button className="tool-btn">🗑️ Clear</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Floating Bottom Control Bar */}
        <div className="control-bar">
          <div className="control-bar-inner">
            <div className="control-group-left">
              <button 
                className={`control-btn ${!micOn ? 'muted' : ''}`}
                onClick={() => setMicOn(!micOn)}
                title={micOn ? 'Turn off microphone' : 'Turn on microphone'}
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              
              <button 
                className={`control-btn ${!cameraOn ? 'muted' : ''}`}
                onClick={() => setCameraOn(!cameraOn)}
                title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
              
              <button 
                className={`control-btn ${captionsOn ? 'active' : ''}`}
                onClick={() => setCaptionsOn(!captionsOn)}
                title="Closed captions"
              >
                <Captions size={24} />
              </button>
              
              <button 
                className={`control-btn ${handRaised ? 'raised' : ''}`}
                onClick={() => setHandRaised(!handRaised)}
                title={handRaised ? 'Lower hand' : 'Raise hand'}
              >
                <Hand size={24} />
              </button>
              
              <button 
                className={`control-btn ${isHandRaised ? 'bg-blue-600 text-white' : ''}`}
                onClick={toggleHandRaise}
                title={isHandRaised ? 'Lower hand (Queue)' : 'Raise hand (Queue)'}
              >
                <Hand className="w-5 h-5" size={24} />
              </button>
              
              <button 
                className={`control-btn ${screenSharing ? 'active' : ''}`}
                onClick={() => setScreenSharing(!screenSharing)}
                title="Present screen"
              >
                <MonitorUp size={24} />
              </button>
              
              {/* Emoji Reactions */}
              <div className="emoji-reactions-container">
                <button 
                  className="control-btn"
                  onClick={() => setShowEmojiReactions(!showEmojiReactions)}
                  title="Reactions"
                >
                  <Smile size={24} />
                </button>
                {showEmojiReactions && (
                  <div className="emoji-picker">
                    <button onClick={() => handleReaction('❤️')}><Heart size={20} /></button>
                    <button onClick={() => handleReaction('👏')}><Clapperboard size={20} /></button>
                    <button onClick={() => handleReaction('👍')}><ThumbsUp size={20} /></button>
                    <button onClick={() => handleReaction('😂')}><Laugh size={20} /></button>
                    <button onClick={() => handleReaction('🎉')}><PartyPopper size={20} /></button>
                  </div>
                )}
              </div>
              
              {/* Floating Emoji Reactions */}
              <div className="emoji-reactions-container">
                <button 
                  className="control-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Floating Reactions"
                >
                  <Smile className="w-5 h-5" size={24} />
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <button onClick={() => triggerEmoji('❤️')}>❤️</button>
                    <button onClick={() => triggerEmoji('👏')}>👏</button>
                    <button onClick={() => triggerEmoji('😂')}>😂</button>
                    <button onClick={() => triggerEmoji('🔥')}>🔥</button>
                    <button onClick={() => triggerEmoji('🎉')}>🎉</button>
                  </div>
                )}
              </div>
              
              <button 
                className={`control-btn ${showWhiteboard ? 'active' : ''}`}
                onClick={() => setShowWhiteboard(!showWhiteboard)}
                title="Whiteboard"
              >
                <PenTool size={24} />
              </button>
              
              {isHost && (
                <button 
                  className="control-btn"
                  onClick={() => setRoomLocked(!roomLocked)}
                  title={roomLocked ? 'Unlock room' : 'Lock room'}
                >
                  <Lock size={24} />
                </button>
              )}
              
              <button 
                className="control-btn"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                title="More options"
              >
                <MoreVertical size={24} />
              </button>
              
              {showMoreOptions && (
                <div className="more-options-menu">
                  <button>Change layout</button>
                  <button>Settings</button>
                  <button>Full screen</button>
                  {isHost && (
                    <>
                      <button onClick={() => setIsRecording(!isRecording)}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </button>
                      <button onClick={muteAll}>Mute All Participants</button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="control-group-right">
              <button 
                className={`icon-btn ${activePanelTab === 'participants' ? 'active' : ''}`}
                onClick={() => handlePanelTabChange('participants')}
                title="Participants"
              >
                <Users size={20} />
                <span className="badge">{participants.length}</span>
              </button>
              
              {/* Raised Hands Queue Counter */}
              {isHost && (
                <div className="raised-hands-container">
                  <button 
                    className="icon-btn"
                    onClick={() => setShowRaisedHandsQueue(!showRaisedHandsQueue)}
                    title="Raised Hands Queue"
                  >
                    <Hand size={20} />
                    {raisedHandsList.length > 0 && (
                      <span className="badge">{raisedHandsList.length}</span>
                    )}
                  </button>
                  {showRaisedHandsQueue && (
                    <div className="raised-hands-popover">
                      <h4>Raised Hands ({raisedHandsList.length})</h4>
                      {raisedHandsList.length === 0 ? (
                        <p className="text-sm text-gray-500">No hands raised</p>
                      ) : (
                        <div className="raised-hands-list">
                          {raisedHandsList.map((item, index) => (
                            <div key={item.id} className="raised-hand-item">
                              <span className="queue-number">{index + 1}</span>
                              <span className="participant-name">{item.name}</span>
                              <span className="raise-time">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <button 
                className={`icon-btn ${activePanelTab === 'chat' ? 'active' : ''}`}
                onClick={() => handlePanelTabChange('chat')}
                title="Chat"
              >
                <MessageCircle size={20} />
                {chatMessages.length > 0 && <span className="dot"></span>}
              </button>
              
              <button 
                className={`icon-btn ${activePanelTab === 'polls' ? 'active' : ''}`}
                onClick={() => handlePanelTabChange('polls')}
                title="Activities & Polls"
              >
                <BarChart3 size={20} />
              </button>
              
              <button 
                className={`icon-btn ${activePanelTab === 'breakout' ? 'active' : ''}`}
                onClick={() => handlePanelTabChange('breakout')}
                title="Breakout Rooms"
              >
                <DoorOpen size={20} />
              </button>
              
              <button 
                className="icon-btn"
                title="Meeting info"
              >
                <Info size={20} />
              </button>
              
              {isHost && (
                <button 
                  className="icon-btn"
                  title="Host controls"
                >
                  <Settings size={20} />
                </button>
              )}
              
              <button 
                className="end-call-btn"
                onClick={() => setShowEndCallDialog(true)}
                title="Leave call"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Participants Panel */}
        {showParticipants && (
          <div className="side-panel participants-panel">
            <div className="panel-header">
              <h3>Participants ({participants.length})</h3>
              <button className="close-btn" onClick={() => setShowParticipants(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="panel-search">
              <Search size={18} />
              <input type="text" placeholder="Search participants" />
            </div>
            
            <div className="participants-list">
              <div className="participant-section">
                <h4>Host</h4>
                {participants.filter(p => p.role === 'host').map(p => (
                  <div key={p.id} className="participant-item">
                    <div className="participant-info">
                      <div className="avatar">{p.name.charAt(0)}</div>
                      <span>{p.name}</span>
                    </div>
                    <div className="participant-actions">
                      {p.micOn ? <Mic size={16} /> : <MicOff size={16} />}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="participant-section">
                <h4>Contributors / Students</h4>
                {participants.filter(p => p.role === 'student').map(p => (
                  <div key={p.id} className="participant-item">
                    <div className="participant-info">
                      <div className="avatar">{p.name.charAt(0)}</div>
                      <span>{p.name}</span>
                      {p.handRaised && <Hand size={14} className="hand-raised" />}
                    </div>
                    <div className="participant-actions">
                      <button onClick={() => toggleParticipantMic(p.id)}>
                        {p.micOn ? <Mic size={16} /> : <MicOff size={16} />}
                      </button>
                      {isHost && (
                        <button onClick={() => removeParticipant(p.id)}>
                          <UserMinus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isHost && (
              <div className="panel-footer">
                <button className="mute-all-btn" onClick={muteAll}>
                  Mute All
                </button>
                <button 
                  className="export-attendance-btn bg-green-600 hover:bg-green-700 text-white"
                  onClick={exportAttendanceCSV}
                >
                  <Download className="w-4 h-4 mr-2" size={16} />
                  Export Attendance
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Chat Panel */}
        {showChat && (
          <div className="side-panel chat-panel">
            <div className="panel-header">
              <h3>In-call messages</h3>
              <button className="close-btn" onClick={() => setShowChat(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className="chat-message">
                  <div className="message-header">
                    <span className="sender">{msg.sender}</span>
                    <span className="time">{msg.time}</span>
                    {(isOwner(msg.sender) || isAdminOrProf()) && (
                      <div className="comment-menu">
                        <button className="comment-menu-btn">
                          <MoreVertical size={12} />
                        </button>
                        <div className="comment-menu-dropdown">
                          <button 
                            className="comment-menu-item"
                            onClick={() => handleEditChat(msg.id, msg.message)}
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <button 
                            className="comment-menu-item delete"
                            onClick={() => handleDeleteChat(msg.id)}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {editingChatId === msg.id ? (
                    <div className="comment-edit-mode">
                      <textarea
                        value={editChatContent}
                        onChange={(e) => setEditChatContent(e.target.value)}
                        className="comment-edit-input"
                        autoFocus
                      />
                      <div className="comment-edit-actions">
                        <button 
                          className="btn-secondary"
                          onClick={handleCancelChatEdit}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn-primary"
                          onClick={() => handleSaveChatEdit(msg.id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="message-content">{msg.message}</div>
                      {msg.edited && <span className="comment-edited">(edited)</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="chat-input">
              <input 
                type="text" 
                placeholder="Send message to everyone"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="send-btn" onClick={handleSendMessage}>
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
        
        {/* Polls Panel */}
        {showPolls && (
          <div className="side-panel polls-panel">
            <div className="panel-header">
              <h3>Activities & Polls</h3>
              <button className="close-btn" onClick={() => setShowPolls(false)}>
                <X size={20} />
              </button>
            </div>
            
            {isHost && (
              <div className="create-poll-section">
                <h4>Create New Poll</h4>
                <input 
                  type="text" 
                  placeholder="Ask a question..."
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  className="poll-question-input"
                />
                {newPollOptions.map((option, index) => (
                  <input 
                    key={index}
                    type="text" 
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    className="poll-option-input"
                  />
                ))}
                <button className="btn-secondary btn-sm" onClick={handleAddPollOption}>
                  <Plus size={16} />
                  Add Option
                </button>
                <button className="btn-primary btn-sm" onClick={handleCreatePoll}>
                  Launch Poll
                </button>
              </div>
            )}
            
            <div className="polls-list">
              <h4>Active Polls</h4>
              {polls.filter(p => p.active).map(poll => (
                <div key={poll.id} className="poll-item">
                  <p className="poll-question">{poll.question}</p>
                  <div className="poll-options">
                    {poll.options.map((option, index) => {
                      const responseCount = Object.values(poll.responses).filter(r => r === index).length
                      const totalResponses = Object.keys(poll.responses).length
                      const percentage = totalResponses > 0 ? Math.round((responseCount / totalResponses) * 100) : 0
                      
                      return (
                        <div key={index} className="poll-option">
                          <button 
                            className={`poll-option-btn ${poll.responses[user?.name || displayName] === index ? 'selected' : ''}`}
                            onClick={() => handleRespondToPoll(poll.id, index)}
                          >
                            <span>{option}</span>
                            <span className="poll-percentage">{percentage}%</span>
                          </button>
                          <div className="poll-bar" style={{ width: `${percentage}%` }}></div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="poll-responses">{Object.keys(poll.responses).length} responses</p>
                </div>
              ))}
            </div>
            
            <div className="qa-section">
              <h4>Q&A</h4>
              <div className="qa-input">
                <input 
                  type="text"
                  placeholder="Ask a question..."
                  value={newQaQuestion}
                  onChange={(e) => setNewQaQuestion(e.target.value)}
                  className="poll-question-input"
                />
                <button 
                  onClick={handleAskQuestion}
                  className="btn-primary btn-sm"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="qa-list">
                {qaQuestions.length === 0 ? (
                  <p className="text-slate-400 text-sm">No questions yet</p>
                ) : (
                  qaQuestions
                    .sort((a, b) => b.upvotes - a.upvotes)
                    .map((qa) => (
                    <div key={qa.id} className="qa-item">
                      <div className="qa-question">
                        <button 
                          onClick={() => handleUpvoteQuestion(qa.id)}
                          className="qa-vote-btn"
                        >
                          <ArrowUp size={14} />
                          <span>{qa.upvotes}</span>
                        </button>
                        <p>{qa.question}</p>
                      </div>
                      <div className="qa-meta">
                        <span className="qa-author">{qa.author}</span>
                        <span className="qa-time">{qa.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Breakout Rooms Panel */}
        {showBreakoutRooms && (
          <div className="side-panel breakout-panel">
            <div className="panel-header">
              <h3>Breakout Rooms</h3>
              <button className="close-btn" onClick={() => setShowBreakoutRooms(false)}>
                <X size={20} />
              </button>
            </div>
            
            {isHost && (
              <div className="breakout-controls">
                <button className="btn-primary btn-sm" onClick={() => setShowCreateBreakout(true)}>
                  <Plus size={16} />
                  Create Breakout Room
                </button>
                <button className="btn-secondary btn-sm" onClick={handleAutoSplitBreakout}>
                  Auto-split Participants
                </button>
              </div>
            )}
            
            {isHost && (
              <div className="breakout-settings">
                <div className="breakout-setting">
                  <label>Number of Rooms</label>
                  <select 
                    value={breakoutRoomCount} 
                    onChange={(e) => setBreakoutRoomCount(parseInt(e.target.value))}
                    className="breakout-select"
                  >
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                    <option value={4}>4 Rooms</option>
                    <option value={5}>5 Rooms</option>
                  </select>
                </div>
                <div className="breakout-setting">
                  <label>Timer (minutes)</label>
                  <select 
                    value={breakoutTimer} 
                    onChange={(e) => setBreakoutTimer(parseInt(e.target.value))}
                    className="breakout-select"
                  >
                    <option value={5}>5 min</option>
                    <option value={10}>10 min</option>
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="breakout-rooms-list">
              {breakoutRooms.map(room => (
                <div key={room.id} className="breakout-room-item">
                  <div className="room-header">
                    <h4>{room.name}</h4>
                    <span className="room-count">{room.participants.length} participants</span>
                  </div>
                  <div className="room-participants">
                    {room.participants.map(participantId => {
                      const participant = participants.find(p => p.id === participantId)
                      return participant ? (
                        <div key={participantId} className="room-participant">
                          <div className="avatar">{participant.name.charAt(0)}</div>
                          <span>{participant.name}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                  {isHost && (
                    <button className="btn-secondary btn-sm">Assign Participants</button>
                  )}
                </div>
              ))}
            </div>
            
            {isHost && (
              <div className="panel-footer">
                <button className="btn-primary">Open All Rooms</button>
                <button className="btn-secondary">Close All Rooms</button>
              </div>
            )}
          </div>
        )}
        
        {/* Keyboard Shortcuts Modal */}
        {showShortcutsModal && (
          <div className="modal-overlay" onClick={() => setShowShortcutsModal(false)}>
            <div className="modal-card shortcuts-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Keyboard Shortcuts</h3>
                <button className="modal-close" onClick={() => setShowShortcutsModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <div className="shortcut-key">
                      <kbd>Spacebar</kbd>
                      <span className="shortcut-hint">(Hold)</span>
                    </div>
                    <span className="shortcut-action">Temporary Push-to-Talk</span>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-key">
                      <kbd>Ctrl</kbd> + <kbd>D</kbd>
                    </div>
                    <span className="shortcut-action">Mute / Unmute Mic</span>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-key">
                      <kbd>Ctrl</kbd> + <kbd>E</kbd>
                    </div>
                    <span className="shortcut-action">Camera On / Off</span>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-key">
                      <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>H</kbd>
                    </div>
                    <span className="shortcut-action">Raise / Lower Hand</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowShortcutsModal(false)}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* End Call Dialog */}
        {showEndCallDialog && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h3>Leave the call?</h3>
              {isHost && (
                <p className="dialog-subtitle">You're the host. Leaving will end the call for everyone.</p>
              )}
              <div className="dialog-actions">
                {isHost ? (
                  <>
                    <button className="btn-secondary" onClick={handleLeave}>
                      Just leave
                    </button>
                    <button className="btn-danger" onClick={handleEndCallForEveryone}>
                      End call for everyone
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-secondary" onClick={() => setShowEndCallDialog(false)}>
                      Cancel
                    </button>
                    <button className="btn-danger" onClick={handleLeave}>
                      Leave
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Support & Help Dropdown Menu (In-Call) */}
        {showMeetSupportMenu && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-2 w-56 text-sm absolute top-16 right-4 z-50">
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                setShowHelpModal(true)
              }}
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening feedback form...')
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Report a problem
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                setShowShortcutsModal(true)
              }}
            >
              <Keyboard className="w-4 h-4" />
              Training
            </button>
            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening Terms of Service...')
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Terms of Service
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening Privacy Policy...')
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Privacy Policy
            </button>
            <button 
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              onClick={() => {
                setShowMeetSupportMenu(false)
                showToastMessage('Opening Terms summary...')
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Terms summary
            </button>
          </div>
        )}
        
        {/* Google Meet Settings Modal (In-Call) */}
        {showMeetSettingsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h2>
                <button 
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setShowMeetSettingsModal(false)}
                >
                  <X size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              
              <div className="flex h-[60vh]">
                {/* Left Navigation Sidebar */}
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-4">
                  <nav className="space-y-1">
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'audio' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('audio')}
                    >
                      <Mic className="w-5 h-5" />
                      Audio
                    </button>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'video' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('video')}
                    >
                      <Video className="w-5 h-5" />
                      Video
                    </button>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'callhistory' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('callhistory')}
                    >
                      <PhoneCall className="w-5 h-5" />
                      Call history
                    </button>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text font-medium transition-colors ${
                        meetSettingsTab === 'general' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMeetSettingsTab('general')}
                    >
                      <Sliders className="w-5 h-5" />
                      General
                    </button>
                  </nav>
                </div>
                
                {/* Right Content Panel */}
                <div className="w-2/3 p-6 overflow-y-auto">
                  {meetSettingsTab === 'audio' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Microphone</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedMicrophone}
                          onChange={(e) => setSelectedMicrophone(e.target.value)}
                        >
                          <option value="Default - Internal Mic">Default - Internal Mic</option>
                          <option value="Microphone (Realtek(R) Audio)">Microphone (Realtek(R) Audio)</option>
                          <option value="Headset Microphone">Headset Microphone</option>
                        </select>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4"></div>
                          </div>
                          <Volume2 className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Speakers</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedSpeaker}
                          onChange={(e) => setSelectedSpeaker(e.target.value)}
                        >
                          <option value="Speakers (Realtek(R) Audio)">Speakers (Realtek(R) Audio)</option>
                          <option value="Headphones">Headphones</option>
                          <option value="Default Output">Default Output</option>
                        </select>
                      </div>
                      
                      {/* AI Noise Suppression Toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                            <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-white">AI Noise Suppression</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Reduce background noise</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setNoiseSuppressionEnabled(!noiseSuppressionEnabled)
                            showToastMessage(noiseSuppressionEnabled ? 'Noise suppression disabled' : 'Noise suppression enabled')
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            noiseSuppressionEnabled ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {noiseSuppressionEnabled ? 'On' : 'Off'}
                        </button>
                      </div>
                      
                      <button 
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        onClick={() => {
                          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleV0kP4W0pJmKc0I/hK+kmYpxQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M/hK+kmYpyQz+Er6SZinJDP4SvpJmKc0M=')
                          audio.play()
                          showToastMessage('Playing test sound...')
                        }}
                      >
                        <Volume2 className="w-5 h-5" />
                        Test
                      </button>
                    </div>
                  )}
                  
                  {meetSettingsTab === 'video' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Camera</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="default">Default Camera</option>
                          <option value="front">Front Camera</option>
                          <option value="back">Back Camera</option>
                          <option value="external">External Webcam</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resolution</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="720p">720p (HD)</option>
                          <option value="1080p">1080p (Full HD)</option>
                          <option value="360p">360p (SD)</option>
                          <option value="audio">Audio Only</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {meetSettingsTab === 'callhistory' && (
                    <div className="space-y-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Recent calls</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">JS</div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">John Smith</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Today, 2:30 PM</div>
                          </div>
                          <div className="text-sm text-green-600">Completed</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">MJ</div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">Mary Johnson</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Yesterday, 4:15 PM</div>
                          </div>
                          <div className="text-sm text-green-600">Completed</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">RB</div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white">Robert Brown</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Aug 24, 10:00 AM</div>
                          </div>
                          <div className="text-sm text-red-600">Missed</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {meetSettingsTab === 'general' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Noise cancellation</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Reduce background noise</div>
                        </div>
                        <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Low light mode</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Brighten video in low light</div>
                        </div>
                        <button className="w-12 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative transition-colors">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                      
                      <div>
                        <button 
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                          onClick={() => showToastMessage('Running diagnostics...')}
                        >
                          <Sliders className="w-4 h-4" />
                          Run diagnostics
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Google / PTC Apps Waffle Grid Popover (In-Call) */}
        {showAppsGridPopover && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 w-80 z-50 absolute top-16 right-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Your favorites</h3>
              <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-medium">
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  setShowSettingsModal(true)
                }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Account</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Gmail...')
                }}
              >
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Mail</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Drive...')
                }}
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Drive</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Docs...')
                }}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Docs</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Sheets...')
                }}
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Sheets</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Slides...')
                }}
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Slides</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Calendar...')
                }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Calendar</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Chat...')
                }}
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Chat</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Already in Meet')
                }}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Meet</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Classroom...')
                }}
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Classroom</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Gemini AI...')
                }}
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                  <Smile className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Gemini</span>
              </button>
              
              <button 
                className="flex flex-col items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => {
                  setShowAppsGridPopover(false)
                  showToastMessage('Opening Vids...')
                }}
              >
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Vids</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            {toastMessage}
          </div>
        )}
      </div>
    )
  }
}

export default App
