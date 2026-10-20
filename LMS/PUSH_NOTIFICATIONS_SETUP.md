# Push Notifications System - Implementation Guide

## Overview
This document describes the native push notifications system implemented for PTC LMS using Service Workers and the Web Push API.

## What Was Implemented

### 1. Backend Setup

#### VAPID Keys
- Generated VAPID (Voluntary Application Server Identification) keys for secure push authentication
- Keys stored in `backend/.env`:
  - `VAPID_PUBLIC_KEY`: Public key for frontend subscription
  - `VAPID_PRIVATE_KEY`: Private key for backend signing
  - `VAPID_SUBJECT`: Contact email for the application

#### Database Schema
Created `push_subscriptions` table in MySQL:
```sql
CREATE TABLE push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  endpoint VARCHAR(500) NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### API Endpoints

**GET /api/notifications/vapid-public-key**
- Returns the VAPID public key for frontend subscription

**POST /api/notifications/subscribe**
- Accepts push subscription data from frontend
- Stores subscription in database
- Request body: `{ endpoint, keys: { p256dh, auth }, user_id }`

**POST /api/notifications/unsubscribe**
- Removes a push subscription
- Request body: `{ endpoint }`

**POST /api/notifications/test**
- Test endpoint to send push notifications
- Request body: `{ title, body, userIds? }`

**POST /api/classwork/create** (Example)
- Demonstrates push notification integration
- Sends notifications when classwork is created
- Request body: `{ title, description, classId, professorId }`

**POST /api/announcements/create** (Example)
- Demonstrates push notification integration
- Sends notifications when announcements are created
- Request body: `{ title, content, targetRole }`

### 2. Frontend Setup

#### Service Worker (`frontend/public/sw.js`)
- Handles incoming push events
- Displays native notifications with:
  - Title, body, icon, badge
  - Deep-link URL for navigation
  - Vibration pattern
  - Action buttons
- Handles notification click events to open the app

#### Service Worker Registration (`frontend/src/index.js`)
- Registers Service Worker on app load
- Requests notification permissions
- Subscribes to push notifications using VAPID keys
- Sends subscription to backend

### 3. Push Notification Helper Functions

**sendPushNotification(userId, title, body, data)**
- Sends a push notification to a specific user
- Automatically handles invalid subscriptions (HTTP 410)

**sendPushNotificationToUsers(userIds, title, body, data)**
- Sends push notifications to multiple users
- Iterates through user IDs and calls sendPushNotification

## How to Test

### 1. Start the Backend Server
```bash
cd backend
node server.js
```

### 2. Start the Frontend
```bash
cd frontend
npm start
```

### 3. Enable Notifications
- Open the app in a browser (Chrome, Firefox, Edge)
- Allow notification permissions when prompted
- Check browser console for subscription success message

### 4. Test Push Notification
Send a test notification using curl or Postman:
```bash
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Notification","body":"This is a test push notification!"}'
```

### 5. Test Classwork/Announcement Endpoints
```bash
# Test classwork creation
curl -X POST http://localhost:5000/api/classwork/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Math Assignment","description":"Chapter 5 problems","classId":1,"professorId":2}'

# Test announcement creation
curl -X POST http://localhost:5000/api/announcements/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Campus Closure","content":"Campus will be closed on Monday.","targetRole":"student"}'
```

## Production Requirements

### 1. HTTPS Required
- Web Push API requires HTTPS (or localhost for development)
- Deploy with SSL certificate in production

### 2. User Authentication
- Currently, subscription defaults to `user_id = 1`
- Update frontend to send authenticated user_id:
  ```javascript
  // In frontend/src/index.js
  const response = await fetch('http://localhost:5000/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ ...subscription, user_id: loggedInUserId }),
  });
  ```

### 3. Database Tables for Classwork/Announcements
- Create actual tables for classwork, announcements, and enrollments
- Update the example endpoints to save data to database
- Implement proper enrollment queries to get student IDs

### 4. Error Handling
- Add retry logic for failed push notifications
- Implement queue system for large-scale notifications
- Add logging for monitoring push delivery

### 5. Mobile Support
- Service Workers work on mobile browsers (Chrome on Android, Safari on iOS)
- For native mobile apps, integrate with Firebase Cloud Messaging (FCM)
- Consider using a service like OneSignal for cross-platform support

## Security Considerations

1. **VAPID Keys**: Keep private key secure, never expose to frontend
2. **User Validation**: Verify user_id before saving subscriptions
3. **Rate Limiting**: Add rate limits to notification endpoints
4. **Content Security**: Validate notification content before sending

## Troubleshooting

### Notifications Not Showing
- Check browser notification permissions
- Verify Service Worker is registered (check DevTools > Application > Service Workers)
- Ensure backend is running and VAPID keys are configured
- Check browser console for errors

### Subscription Fails
- Verify VAPID public key is accessible from backend
- Check network tab for failed API calls
- Ensure user_id is being sent correctly

### Push Not Delivered
- Check backend logs for send errors
- Verify subscription is valid in database
- Test with the `/api/notifications/test` endpoint

## Files Modified/Created

### Backend
- `backend/package.json` - Added web-push dependency
- `backend/.env` - Added VAPID keys
- `backend/server.js` - Added push notification endpoints and helper functions
- `backend/generate-vapid-keys.js` - Script to generate VAPID keys

### Frontend
- `frontend/public/sw.js` - Service Worker for push notifications
- `frontend/src/index.js` - Service Worker registration and subscription logic

## Next Steps

1. Integrate with actual classwork/announcement database tables
2. Add user authentication to subscription endpoint
3. Implement enrollment system to get student IDs for class notifications
4. Add notification preferences in user settings
5. Create admin panel to manage and monitor push notifications
6. Add analytics for notification delivery rates
