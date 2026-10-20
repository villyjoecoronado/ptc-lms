import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, ExternalLink, Clock, Users, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const StudentVideoConference = ({ isDarkMode, user }) => {
  const [activeMeetings, setActiveMeetings] = useState([
    {
      id: 1,
      subject: 'IT101',
      subjectName: 'Introduction to Computing',
      instructor: 'Prof. Edmar',
      meetingTitle: 'Week 10 Lecture: React Hooks',
      scheduledTime: '2024-10-20 09:00',
      duration: '90 minutes',
      status: 'live',
      meetLink: 'https://ptc-meet.example.com/room/it101-week10',
      participants: 42
    },
    {
      id: 2,
      subject: 'IT104',
      subjectName: 'Database Systems',
      instructor: 'Prof. Sheryl',
      meetingTitle: 'SQL Workshop Session',
      scheduledTime: '2024-10-21 14:00',
      duration: '60 minutes',
      status: 'upcoming',
      meetLink: 'https://ptc-meet.example.com/room/it104-sql-workshop',
      participants: 0
    },
    {
      id: 3,
      subject: 'IT103',
      subjectName: 'Data Structures',
      instructor: 'Prof. Roclyn',
      meetingTitle: 'Algorithm Review',
      scheduledTime: '2024-10-19 10:00',
      duration: '75 minutes',
      status: 'ended',
      meetLink: 'https://ptc-meet.example.com/room/it103-algo-review',
      participants: 38
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: Video, label: 'Live Now', pulse: true },
      upcoming: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: Clock, label: 'Upcoming', pulse: false },
      ended: { color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', icon: CheckCircle, label: 'Ended', pulse: false }
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.pulse && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        <Icon size={12} />
        {config.label}
      </div>
    );
  };

  const handleJoinMeeting = (meeting) => {
    if (meeting.status === 'live' || meeting.status === 'upcoming') {
      const meetBase = process.env.REACT_APP_MEET_URL || 'http://localhost:5173';
      const userParam = encodeURIComponent(user?.name || user?.username || 'Student User');
      const roleParam = user?.role || 'student';
      const roomParam = meeting.roomCode || meeting.subject || 'SP101-BSIT3J';
      const targetUrl = `${meetBase}/?room=${roomParam}&name=${userParam}&role=${roleParam}`;
      window.open(targetUrl, '_blank');
    }
  };

  const liveMeetings = activeMeetings.filter(m => m.status === 'live');
  const upcomingMeetings = activeMeetings.filter(m => m.status === 'upcoming');
  const pastMeetings = activeMeetings.filter(m => m.status === 'ended');

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Video Conference</h2>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Join live class sessions via PTC Meet</p>
        </div>

        {/* Live Meetings Section */}
        {liveMeetings.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Now
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-2xl border p-6 shadow-lg border-red-200 dark:border-red-800"
                  style={{ backgroundColor: 'var(--card-bg)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary)' }}>
                        {meeting.meetingTitle}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        {meeting.subjectName} • {meeting.instructor}
                      </p>
                    </div>
                    {getStatusBadge(meeting.status)}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--color-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{meeting.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{meeting.participants} joined</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinMeeting(meeting)}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30"
                  >
                    <Video size={18} />
                    Join PTC Meet Class
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Meetings Section */}
        {upcomingMeetings.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              <Calendar size={20} />
              Upcoming Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary)' }}>
                        {meeting.meetingTitle}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        {meeting.subjectName} • {meeting.instructor}
                      </p>
                    </div>
                    {getStatusBadge(meeting.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-secondary)' }}>
                      <Calendar size={16} />
                      <span>{new Date(meeting.scheduledTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-secondary)' }}>
                      <Clock size={16} />
                      <span>{meeting.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinMeeting(meeting)}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                    style={{
                      background: 'var(--gradient-electric)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    <ExternalLink size={18} />
                    Set Reminder
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Past Meetings Section */}
        {pastMeetings.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              <CheckCircle size={20} />
              Past Sessions
            </h3>
            <div className="space-y-3">
              {pastMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-xl border p-4 flex items-center justify-between"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-light)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <Video size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
                        {meeting.meetingTitle}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {meeting.subjectName} • {new Date(meeting.scheduledTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      {meeting.participants} attended
                    </span>
                    {getStatusBadge(meeting.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Meetings State */}
        {liveMeetings.length === 0 && upcomingMeetings.length === 0 && pastMeetings.length === 0 && (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>No scheduled meetings</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Check back later for upcoming sessions</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentVideoConference;
