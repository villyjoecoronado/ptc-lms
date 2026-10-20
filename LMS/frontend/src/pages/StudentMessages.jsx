import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, User, Clock, Check, CheckCheck, MoreVertical, Paperclip } from 'lucide-react';

const StudentMessages = ({ isDarkMode, user }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const mockConversations = [
    {
      id: 1,
      name: 'Prof. Edmar Tan',
      role: 'Instructor',
      subject: 'IT101 - Introduction to Computing',
      avatar: 'E',
      lastMessage: 'Please submit your lab exercise by Friday.',
      lastMessageTime: '2 hours ago',
      unread: 2,
      messages: [
        { id: 1, sender: 'instructor', text: 'Hello! I noticed you haven\'t submitted Lab Exercise 3 yet.', time: '3 hours ago' },
        { id: 2, sender: 'student', text: 'Sorry Prof, I\'ve been working on it. Will submit soon.', time: '2.5 hours ago' },
        { id: 3, sender: 'instructor', text: 'Please submit your lab exercise by Friday. Let me know if you need help.', time: '2 hours ago' }
      ]
    },
    {
      id: 2,
      name: 'Prof. Sheryl Ann Ricafort',
      role: 'Instructor',
      subject: 'IT104 - Database Systems',
      avatar: 'S',
      lastMessage: 'Great work on your database design!',
      lastMessageTime: '1 day ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'student', text: 'Prof, I submitted the database design project.', time: '1 day ago' },
        { id: 2, sender: 'instructor', text: 'Great work on your database design! Your ER diagram is well-structured.', time: '1 day ago' }
      ]
    },
    {
      id: 3,
      name: 'Class Group - BSIT 3-A',
      role: 'Group',
      subject: 'General',
      avatar: 'G',
      lastMessage: 'Juan: Does anyone have notes for the midterm?',
      lastMessageTime: '3 days ago',
      unread: 5,
      messages: [
        { id: 1, sender: 'classmate', text: 'Hey everyone, reminder about the midterm tomorrow.', time: '3 days ago' },
        { id: 2, sender: 'classmate', text: 'Does anyone have notes for the midterm?', time: '3 days ago' }
      ]
    }
  ];

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto h-full"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Messages</h2>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Communicate with instructors and classmates</p>
        </div>

        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className={`w-full md:w-80 rounded-2xl border overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
               style={{ borderColor: 'var(--border-light)' }}>
            {/* Search */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedConversation?.id === conv.id
                      ? isDarkMode ? 'bg-slate-700' : 'bg-blue-50'
                      : isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  }`}
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {conv.avatar}
                      </div>
                      {conv.unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--color-primary)' }}>
                          {conv.name}
                        </h4>
                        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{conv.subject}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--color-secondary)' }}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation ? (
            <div className={`hidden md:flex flex-1 rounded-2xl border overflow-hidden flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                 style={{ borderColor: 'var(--border-light)' }}>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
                      {selectedConversation.name}
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{selectedConversation.subject}</p>
                  </div>
                </div>
                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                  <MoreVertical size={18} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
                      message.sender === 'student'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-70">{message.time}</span>
                        {message.sender === 'student' && (
                          <CheckCheck size={12} className="opacity-70" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3">
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                    <Paperclip size={18} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`hidden md:flex flex-1 rounded-2xl border items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                 style={{ borderColor: 'var(--border-light)' }}>
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>Select a conversation</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Choose from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentMessages;
