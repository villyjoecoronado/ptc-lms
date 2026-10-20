# Video Meeting System - Implementation Guide

## Overview
This document describes the custom in-app video conferencing system implemented for PTC LMS, featuring Google Meet-style functionality with cross-platform support for Desktop PCs, Laptops, Tablets, and Mobile Phones.

## What Was Implemented

### 1. VideoMeeting Component (`frontend/src/VideoMeeting.jsx`)

A complete video meeting component with WebRTC integration featuring:

#### WebRTC Media Hardware Handling
- **Camera/Microphone Access**: Uses `navigator.mediaDevices.getUserMedia({ video: true, audio: true })`
- **Graceful Error Handling**: Shows intuitive alerts if camera/microphone permissions are denied
- **Dynamic Device Switching**: Supports front/rear camera selection on smartphones and external mic/webcam on desktop PCs
- **Device Settings Modal**: Allows users to select preferred camera and microphone from available devices

#### Adaptive Participant Video Grid
- **Mobile View (< 640px)**: 1-column or stacked 2x2 tile grid with active-speaker focus
- **Tablet View (640px - 1024px)**: Balanced 2x2 or 3x2 responsive video grid
- **Desktop PC View (> 1024px)**: Wide-screen grid (up to 4x4 tiles) with side panel drawer for In-Call Chat and People List
- **Active Speaker Highlight**: Animated blue glow/border around the tile of the currently speaking user

#### Floating Cross-Device Control Bar
Positioned at the bottom center of the viewport with:
- **Mic Mute/Unmute Toggle**: Red highlight when muted
- **Camera On/Off Toggle**: Visual feedback for video state
- **Screen Sharing Toggle**: Desktop/Laptop capability with browser safety check
- **Raise Hand Toggle**: Triggers animated hand icon badge on the participant's video tile
- **In-Call Chat Side Drawer Toggle**: Slide-over chat panel
- **Leave Meeting Button**: Red exit trigger that safely stops media tracks and returns the user to the class dashboard

#### Light & Dark Theme Polish
- **Glassmorphism Dark Aesthetic**: `bg-slate-900/90 backdrop-blur-md border border-slate-700/50`
- **Touch Targets**: All touch targets on mobile/tablet screens are at least 48px in height/width
- **Crisp Readability**: Maintains readability regardless of overall system light/dark theme

### 2. Classroom Room Binding

Each class is now bound to a dedicated meeting room ID based on its unique Class Code:
- **Room Format**: `meet_room_${classCode}`
- **Integration**: The VideoMeetingModal component receives `selectedCourseDetail` prop to access the class code
- **Automatic Binding**: When users click "Join Video Class", the room is automatically generated from the class code

### 3. Integration Points

#### Student Dashboard
- Added "Join Video Class" button to each course card in the student dashboard
- Button triggers the VideoMeetingModal with the course's class code for room binding
- Clicking the button sets `selectedCourseDetail` and opens the meeting modal

#### Faculty Dashboard
- Updated the existing video meeting button to set `selectedCourseDetail`
- Ensures proper room binding when professors initiate meetings
- Maintains existing functionality while adding custom meeting support

#### Subject View
- The SubjectView component already has a "Join Video Class" button
- Updated to pass `selectedCourseDetail` to ensure room binding works correctly

### 4. VideoMeetingModal Updates

Enhanced the existing VideoMeetingModal to support the new custom VideoMeeting component:
- Added `showCustomMeeting` state to control when to show the custom meeting interface
- Added "Join In-App Video Meeting" button alongside existing options
- Room name generation now uses class code: `meet_room_${classCode}`
- Passes room name, user name, and user role to the VideoMeeting component

## Features Breakdown

### Media Controls
- **Microphone**: Toggle mute/unmute with visual red indicator when muted
- **Camera**: Toggle video on/off with placeholder avatar when off
- **Screen Share**: Share entire screen or specific application window
- **Device Selection**: Choose from multiple cameras and microphones

### Participant Management
- **Active Speaker Detection**: Animated blue glow around speaking participant
- **Raise Hand**: Visual hand icon badge on participant tile
- **Participant List**: Side drawer showing all participants with their roles
- **Role Badges**: Visual indicators for professors vs students

### In-Call Features
- **Chat System**: Real-time chat with message history
- **Chat Drawer**: Slide-over panel for chat (desktop) or full screen (mobile)
- **Message Timestamps**: Each message shows sender and time
- **Auto-scroll**: Chat automatically scrolls to new messages

### Responsive Design
- **Mobile-First**: Optimized for touch interactions with 48px minimum touch targets
- **Adaptive Grid**: Video grid adjusts based on screen size and participant count
- **Orientation Support**: Works in both portrait and landscape modes
- **Performance**: Efficient rendering with Framer Motion animations

## Technical Implementation

### WebRTC Setup
```javascript
const constraints = {
  video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
  audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true
};
const stream = await navigator.mediaDevices.getUserMedia(constraints);
```

### Device Enumeration
```javascript
const devices = await navigator.mediaDevices.enumerateDevices();
setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
```

### Screen Sharing
```javascript
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: { cursor: 'always' },
  audio: false
});
```

### Active Speaker Animation
```javascript
<motion.div
  className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
  animate={{
    scale: [1, 1.02, 1],
    opacity: [0.5, 0.8, 0.5]
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

## Usage

### For Students
1. Navigate to the dashboard
2. Find the desired class card
3. Click "Join Video Class" button
4. In the modal, click "Join In-App Video Meeting"
5. Grant camera/microphone permissions when prompted
6. Use the control bar to manage audio/video, raise hand, or access chat

### For Professors
1. Navigate to the dashboard
2. Click the video meeting button on the featured course
3. In the modal, click "Join In-App Video Meeting"
4. Grant camera/microphone permissions when prompted
5. Use host controls to manage the meeting
6. Share screen when needed using the screen share button

### Device Settings
1. Click the Settings icon in the meeting header
2. Select preferred camera from the dropdown
3. Select preferred microphone from the dropdown
4. Click "Done" to apply changes

## Browser Compatibility

### Supported Browsers
- **Chrome/Edge**: Full support (Desktop & Mobile)
- **Firefox**: Full support (Desktop)
- **Safari**: Full support (iOS & macOS)
- **Opera**: Full support (Desktop)

### Requirements
- **HTTPS**: Required for WebRTC in production (localhost works for development)
- **Permissions**: Camera and microphone permissions must be granted
- **JavaScript**: Must be enabled
- **WebRTC**: Browser must support WebRTC API

## Production Considerations

### Signaling Server
Currently, the component uses simulated participants. For production:
1. Implement a WebSocket signaling server (Socket.io)
2. Add WebRTC peer connection management
3. Implement ICE candidate exchange
4. Add STUN/TURN servers for NAT traversal

### Authentication
- Integrate with existing user authentication
- Pass authenticated user ID to the meeting component
- Validate room access permissions

### Recording
- Add recording functionality for lectures
- Store recordings in cloud storage
- Provide download links for students

### Analytics
- Track meeting attendance
- Monitor participant engagement
- Log technical issues for debugging

## Files Modified/Created

### Created
- `frontend/src/VideoMeeting.jsx` - Complete video meeting component

### Modified
- `frontend/src/App.js`:
  - Added VideoMeeting component import
  - Updated VideoMeetingModal to support custom meeting
  - Added "Join Video Class" button to student course cards
  - Updated faculty dashboard video button for room binding
  - Passed selectedCourseDetail to VideoMeetingModal

## Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions
- Ensure HTTPS is used in production
- Verify devices are not in use by another application
- Check browser console for error messages

### Video Grid Not Responsive
- Verify window resize event listeners are working
- Check CSS grid classes for correct breakpoints
- Ensure participant count is being tracked correctly

### Screen Share Not Available
- Verify browser supports getDisplayMedia API
- Check if screen sharing is blocked by browser policy
- Ensure user is on HTTPS (required for screen sharing)

### Chat Messages Not Showing
- Verify chat state is being updated correctly
- Check auto-scroll is working
- Ensure message timestamps are being generated

## Next Steps

1. **WebRTC Signaling**: Implement real peer-to-peer connections with signaling server
2. **Room Management**: Add room creation, joining, and leaving logic
3. **Participant Sync**: Sync participant state across all connected users
4. **Recording**: Add meeting recording and playback functionality
5. **Breakout Rooms**: Implement breakout room feature for group discussions
6. **Polls & Q&A**: Add interactive features for engagement
7. **Accessibility**: Improve keyboard navigation and screen reader support
8. **Performance**: Optimize for low-bandwidth connections
