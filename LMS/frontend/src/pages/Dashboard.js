import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ClipboardList, Award, TrendingUp, Users, Clock } from 'lucide-react';

const Dashboard = ({ darkMode, tasks, notifications, getCompletedTasksCount, getPendingTasksCount, getUnreadCount }) => {
  const stats = [
    {
      title: 'Active Courses',
      value: '6',
      change: '+2 this month',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Pending Tasks',
      value: getPendingTasksCount(),
      change: `${getCompletedTasksCount()} completed`,
      icon: ClipboardList,
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Unread Messages',
      value: getUnreadCount(),
      change: '3 new today',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Average Grade',
      value: '92%',
      change: '+5% improvement',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const recentActivity = [
    { id: 1, type: 'assignment', title: 'Chapter 5 Quiz Submitted', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'grade', title: 'Midterm Exam Graded', time: '5 hours ago', status: 'excellent' },
    { id: 3, type: 'announcement', title: 'New Lab Schedule Posted', time: '1 day ago', status: 'info' },
    { id: 4, type: 'assignment', title: 'Project Proposal Due', time: '2 days ago', status: 'pending' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Data Structures Quiz', date: 'Tomorrow', time: '10:00 AM', type: 'quiz' },
    { id: 2, title: 'Lab Session - Web Development', date: 'Friday', time: '2:00 PM', type: 'lab' },
    { id: 3, title: 'Project Presentation', date: 'Next Monday', time: '3:00 PM', type: 'presentation' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your learning overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${stat.bgLight} border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'assignment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'grade' ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.type === 'announcement' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {activity.type === 'assignment' && <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'grade' && <Award className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    {activity.type === 'announcement' && <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{activity.title}</h4>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    activity.status === 'excellent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              View All Events
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors">
              <BookOpen className="w-6 h-6 mb-2" />
              <p className="text-sm">Browse Courses</p>
            </button>
            <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors">
              <ClipboardList className="w-6 h-6 mb-2" />
              <p className="text-sm">View Assignments</p>
            </button>
            <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors">
              <Calendar className="w-6 h-6 mb-2" />
              <p className="text-sm">Check Calendar</p>
            </button>
            <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors">
              <Award className="w-6 h-6 mb-2" />
              <p className="text-sm">View Grades</p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
