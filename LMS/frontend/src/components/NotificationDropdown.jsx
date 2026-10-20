import React, { useState } from 'react';
import { Bell, CheckCircle, BookOpen, TrendingUp, MessageSquare, X } from 'lucide-react';

const NotificationDropdown = ({ isDarkMode, notifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications for students
  const studentNotifications = [
    { id: 1, type: 'grade', title: 'New Grade Posted', message: 'Your grade for IT101 has been posted: 95/100', time: '2 hours ago', icon: CheckCircle },
    { id: 2, type: 'assignment', title: 'Assignment Due Soon', message: 'IT102 Assignment 3 is due tomorrow', time: '5 hours ago', icon: BookOpen },
    { id: 3, type: 'report', title: 'Report Available', message: 'Your midterm report is now available for download', time: '1 day ago', icon: TrendingUp },
    { id: 4, type: 'message', title: 'New Message', message: 'Professor Edmar sent you a message', time: '2 days ago', icon: MessageSquare },
  ];

  const displayNotifications = notifications || studentNotifications;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 border ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} relative`}
      >
        <Bell size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />
        {displayNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {displayNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm" style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
                >
                  <X size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {displayNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className={isDarkMode ? 'text-slate-600 mx-auto mb-2' : 'text-slate-300 mx-auto mb-2'} />
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No notifications</p>
                </div>
              ) : (
                displayNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <Icon size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate" style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                            {notification.title}
                          </p>
                          <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {notification.message}
                          </p>
                          <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {displayNotifications.length > 0 && (
              <div className={`p-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <button
                  className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
