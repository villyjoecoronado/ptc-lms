# PTC Persistent Chat System Design

## Database Schema for Long-Term Chat Persistence

### Core Tables

```sql
-- Users table (extend existing)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('student', 'professor', 'admin') NOT NULL,
  avatar_url VARCHAR(255),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

-- Conversations table (chat threads between users)
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NULL, -- Optional: links to specific subject/class
  subject_code VARCHAR(20) NULL,
  section VARCHAR(20) NULL,
  conversation_type ENUM('direct', 'group', 'consultation') DEFAULT 'direct',
  created_by INT NOT NULL,
  is_archived BOOLEAN DEFAULT FALSE,
  archived_by INT NULL,
  archived_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (archived_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_subject (subject_id),
  INDEX idx_type (conversation_type),
  INDEX idx_created_by (created_by)
);

-- Conversation participants (many-to-many relationship)
CREATE TABLE conversation_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  role_in_conversation ENUM('owner', 'participant', 'moderator') DEFAULT 'participant',
  has_left BOOLEAN DEFAULT FALSE,
  left_at TIMESTAMP NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (conversation_id, user_id),
  INDEX idx_conversation (conversation_id),
  INDEX idx_user (user_id)
);

-- Messages table (core message storage)
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_type ENUM('text', 'image', 'file', 'audio', 'video', 'system') DEFAULT 'text',
  content TEXT NOT NULL,
  file_url VARCHAR(500) NULL,
  file_name VARCHAR(255) NULL,
  file_size INT NULL,
  file_mime_type VARCHAR(100) NULL,
  reply_to_message_id INT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL,
  FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created_at (created_at),
  INDEX idx_conversation_created (conversation_id, created_at DESC)
);

-- Message read receipts (seen status)
CREATE TABLE message_receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_receipt (message_id, user_id),
  INDEX idx_message (message_id),
  INDEX idx_user (user_id)
);

-- Typing indicators (ephemeral, can be Redis in production)
CREATE TABLE typing_indicators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  is_typing BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_typing (conversation_id, user_id),
  INDEX idx_conversation (conversation_id)
);

-- Message attachments (for files/images)
CREATE TABLE message_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  file_mime_type VARCHAR(100) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  INDEX idx_message (message_id)
);

-- Chat consultation logs (for professor grading/audit)
CREATE TABLE consultation_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  professor_id INT NOT NULL,
  student_id INT NOT NULL,
  subject_id INT NULL,
  consultation_date DATE NOT NULL,
  duration_minutes INT NULL,
  summary TEXT NULL,
  action_items TEXT NULL,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_professor (professor_id),
  INDEX idx_student (student_id),
  INDEX idx_date (consultation_date)
);
```

## Tech Stack Recommendations

### Backend
- **Node.js + Express** - Already in use, consistent with existing stack
- **Socket.io** - Real-time WebSocket communication (already in package.json)
- **MySQL/MariaDB** - Relational database for structured chat data
- **Redis** (Optional) - For caching typing indicators, online status, and pub/sub
- **Multer** - File upload handling for attachments
- **AWS S3 / Cloudflare R2** - Cloud storage for file attachments

### Frontend
- **React** - Already in use
- **Socket.io-client** - Already in package.json
- **Framer Motion** - Already in use for animations
- **Lucide React** - Already in use for icons
- **React Query / SWR** - For caching and syncing chat state
- **Zustand / Redux** - For global chat state management

### Real-time Architecture
```
Client (React) <---> Socket.io Client <---> Socket.io Server <---> Redis (Pub/Sub) <---> MySQL (Persistence)
```

## Implementation Guide

### Phase 1: Backend Setup

#### 1.1 Install Dependencies
```bash
npm install socket.io multer aws-sdk
npm install redis @redis/client
```

#### 1.2 Socket.io Server Setup
```javascript
// backend/server.js
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // User joins with their ID
  socket.on('user:join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Update user online status in DB
    db.query(
      'UPDATE users SET is_online = TRUE, last_seen = NOW() WHERE id = ?',
      [userId]
    );
    
    // Broadcast to other users
    socket.broadcast.emit('user:online', { userId });
  });
  
  // Join conversation room
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });
  
  // Send message
  socket.on('message:send', async (data) => {
    const { conversationId, senderId, content, type = 'text', attachments = [] } = data;
    
    // Save to database
    const [result] = await db.query(
      `INSERT INTO messages (conversation_id, sender_id, message_type, content) 
       VALUES (?, ?, ?, ?)`,
      [conversationId, senderId, type, content]
    );
    
    const messageId = result.insertId;
    
    // Save attachments if any
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        await db.query(
          `INSERT INTO message_attachments (message_id, file_url, file_name, file_size, file_mime_type)
           VALUES (?, ?, ?, ?, ?)`,
          [messageId, attachment.url, attachment.name, attachment.size, attachment.mime]
        );
      }
    }
    
    // Get message details
    const [message] = await db.query(
      `SELECT m.*, u.full_name, u.avatar_url 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
      [messageId]
    );
    
    // Emit to conversation room
    io.to(`conversation:${conversationId}`).emit('message:new', message[0]);
  });
  
  // Typing indicator
  socket.on('typing:start', ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit('typing:indicator', { userId, isTyping: true });
  });
  
  socket.on('typing:stop', ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit('typing:indicator', { userId, isTyping: false });
  });
  
  // Mark message as read
  socket.on('message:read', async ({ messageId, userId }) => {
    await db.query(
      `INSERT IGNORE INTO message_receipts (message_id, user_id) VALUES (?, ?)`,
      [messageId, userId]
    );
    
    // Notify sender
    const [receipt] = await db.query(
      `SELECT sender_id FROM messages WHERE id = ?`,
      [messageId]
    );
    
    if (receipt[0]) {
      const senderSocket = onlineUsers.get(receipt[0].sender_id);
      if (senderSocket) {
        io.to(senderSocket).emit('message:read', { messageId, userId });
      }
    }
  });
  
  // Disconnect
  socket.on('disconnect', async () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      // Update offline status
      await db.query(
        'UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = ?',
        [socket.userId]
      );
      
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    }
  });
});
```

### Phase 2: Frontend Chat Component

#### 2.1 Chat State Management (Zustand)
```javascript
// frontend/src/store/chatStore.js
import create from 'zustand';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:50000');

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  onlineUsers: new Set(),
  typingUsers: new Map(),
  
  // Actions
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  
  addMessage: (conversationId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: [...(state.messages[conversationId] || []), message]
    }
  })),
  
  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),
  
  setTyping: (conversationId, userId, isTyping) => set((state) => ({
    typingUsers: new Map(state.typingUsers).set(
      `${conversationId}:${userId}`,
      isTyping
    )
  })),
  
  // Socket actions
  joinConversation: (conversationId) => {
    socket.emit('conversation:join', conversationId);
  },
  
  sendMessage: (data) => {
    socket.emit('message:send', data);
  },
  
  markAsRead: (messageId) => {
    socket.emit('message:read', { messageId, userId: get().currentUser?.id });
  }
}));
```

#### 2.2 Chat Interface Component
```javascript
// frontend/src/components/ChatInterface.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { Send, Paperclip, MoreVertical } from 'lucide-react';

const ChatInterface = ({ conversation, currentUser }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, markAsRead, typingUsers } = useChatStore();
  
  const conversationMessages = messages[conversation.id] || [];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    sendMessage({
      conversationId: conversation.id,
      senderId: currentUser.id,
      content: message,
      type: attachments.length > 0 ? 'file' : 'text',
      attachments
    });
    
    setMessage('');
    setAttachments([]);
  };
  
  const isTyping = typingUsers.get(`${conversation.id}:${conversation.participant?.id}`);
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={conversation.participant?.avatar_url} 
                className="w-10 h-10 rounded-full"
              />
              {conversation.participant?.is_online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {conversation.participant?.full_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTyping ? 'Typing...' : conversation.participant?.is_online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <MoreVertical size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={msg.sender_id === currentUser.id}
            onRead={() => markAsRead(msg.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Paperclip size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
```

### Phase 3: API Endpoints

#### 3.1 Chat API Routes
```javascript
// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get user's conversations
router.get('/conversations', async (req, res) => {
  const userId = req.user.id;
  
  const [conversations] = await db.query(`
    SELECT 
      c.*,
      cp.user_id,
      u.full_name,
      u.avatar_url,
      u.is_online,
      m.content as last_message,
      m.created_at as last_message_at,
      COUNT(CASE WHEN mr.user_id != ? THEN 1 END) as unread_count
    FROM conversation_participants cp
    JOIN conversations c ON cp.conversation_id = c.id
    JOIN users u ON cp.user_id = u.id
    LEFT JOIN messages m ON c.id = m.conversation_id
    LEFT JOIN message_receipts mr ON m.id = mr.message_id
    WHERE cp.user_id = ? AND cp.has_left = FALSE
    GROUP BY c.id, cp.user_id
    ORDER BY c.updated_at DESC
  `, [userId, userId]);
  
  res.json(conversations);
});

// Get conversation messages
router.get('/conversations/:id/messages', async (req, res) => {
  const conversationId = req.params.id;
  const userId = req.user.id;
  
  // Verify user is participant
  const [participant] = await db.query(
    'SELECT * FROM conversation_participants WHERE conversation_id = ? AND user_id = ?',
    [conversationId, userId]
  );
  
  if (!participant.length) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  const [messages] = await db.query(`
    SELECT 
      m.*,
      u.full_name,
      u.avatar_url,
      GROUP_CONCAT(
        JSON_OBJECT(
          'url', ma.file_url,
          'name', ma.file_name,
          'size', ma.file_size,
          'mime', ma.file_mime_type
        )
      ) as attachments
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN message_attachments ma ON m.id = ma.message_id
    WHERE m.conversation_id = ? AND m.is_deleted = FALSE
    GROUP BY m.id
    ORDER BY m.created_at ASC
  `, [conversationId]);
  
  res.json(messages);
});

// Create new conversation
router.post('/conversations', async (req, res) => {
  const { participantId, subjectId, subjectCode, section } = req.body;
  const userId = req.user.id;
  
  // Check if conversation already exists
  const [existing] = await db.query(`
    SELECT c.id FROM conversations c
    JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
    JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
    WHERE cp1.user_id = ? AND cp2.user_id = ? AND c.conversation_type = 'direct'
  `, [userId, participantId]);
  
  if (existing.length > 0) {
    return res.json({ conversationId: existing[0].id });
  }
  
  // Create new conversation
  const [result] = await db.query(
    `INSERT INTO conversations (subject_id, subject_code, section, conversation_type, created_by)
     VALUES (?, ?, ?, 'direct', ?)`,
    [subjectId, subjectCode, section, userId]
  );
  
  const conversationId = result.insertId;
  
  // Add participants
  await db.query(
    `INSERT INTO conversation_participants (conversation_id, user_id, role_in_conversation) VALUES (?, ?, 'owner')`,
    [conversationId, userId]
  );
  await db.query(
    `INSERT INTO conversation_participants (conversation_id, user_id, role_in_conversation) VALUES (?, ?, 'participant')`,
    [conversationId, participantId]
  );
  
  res.json({ conversationId });
});

// Export chat history (for professors)
router.get('/conversations/:id/export', async (req, res) => {
  const conversationId = req.params.id;
  const userId = req.user.id;
  
  // Verify professor role
  if (req.user.role !== 'professor') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  const [messages] = await db.query(`
    SELECT 
      m.content,
      m.message_type,
      m.created_at,
      u.full_name as sender_name,
      u.role as sender_role
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
  `, [conversationId]);
  
  // Generate CSV
  const csv = [
    'Date,Sender Name,Sender Role,Message Type,Content',
    ...messages.map(m => 
      `${m.created_at},"${m.sender_name}","${m.sender_role}","${m.message_type}","${m.content}"`
    )
  ].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=chat_export_${conversationId}.csv`);
  res.send(csv);
});

module.exports = router;
```

### Phase 4: File Upload Handling

```javascript
// backend/middleware/upload.js
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadToS3 = async (file, key) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });
  
  await s3.send(command);
  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = { upload, uploadToS3 };
```

## Key Features Implementation

### 1. Message Persistence
- All messages stored in MySQL with full metadata
- Attachments stored in S3 with database references
- Edit/delete history tracked with timestamps

### 2. Real-time Sync
- Socket.io for instant message delivery
- Typing indicators broadcasted to conversation participants
- Read receipts via message_receipts table

### 3. Search & Filter
```sql
-- Search messages by content
SELECT * FROM messages 
WHERE content LIKE '%keyword%' 
AND conversation_id = ?;

-- Filter by date range
SELECT * FROM messages 
WHERE conversation_id = ? 
AND created_at BETWEEN ? AND ?;
```

### 4. Professor Export Features
- CSV export of entire conversation history
- Consultation logs for grading records
- Action items and follow-up tracking

## Security Considerations

1. **Authentication**: Verify user is conversation participant before access
2. **Authorization**: Role-based access for export features
3. **File Validation**: Validate file types and sizes before upload
4. **Rate Limiting**: Implement rate limits on Socket.io events
5. **Encryption**: Encrypt sensitive message content at rest

## Performance Optimization

1. **Pagination**: Load messages in chunks (e.g., 50 at a time)
2. **Caching**: Use Redis for online status and typing indicators
3. **Indexing**: Proper database indexes on frequently queried columns
4. **Lazy Loading**: Load conversation list on demand, not all at once
5. **CDN**: Serve static files via CDN for faster delivery
