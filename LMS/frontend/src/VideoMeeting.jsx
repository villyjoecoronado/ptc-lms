import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  PhoneOff, Hand, MessageSquare, Users, ChevronLeft,
  ChevronRight, Settings, Copy, Maximize2, Minimize2, Send
} from 'lucide-react';

const VideoMeeting = ({ 
  roomName, 
  userName, 
  userRole, 
  onClose,
  isDarkMode = true 
}) => {
  // Media streams
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  // Device management
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  
  // UI state
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Simulated participants (in production, this would come from WebRTC signaling)
  const [participants, setParticipants] = useState([
    { id: 1, name: userName, role: userRole, isLocal: true, isSpeaking: false, handRaised: false },
    { id: 2, name: 'Prof. Smith', role: 'professor', isLocal: false, isSpeaking: true, handRaised: false },
    { id: 3, name: 'Student A', role: 'student', isLocal: false, isSpeaking: false, handRaised: true },
  ]);
  
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
        setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
        
        // Select first devices by default
        const firstVideo = devices.find(d => d.kind === 'videoinput');
        const firstAudio = devices.find(d => d.kind === 'audioinput');
        if (firstVideo) setSelectedVideoDevice(firstVideo.deviceId);
        if (firstAudio) setSelectedAudioDevice(firstAudio.deviceId);
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };
    getDevices();
  }, []);

  // Initialize local stream
  useEffect(() => {
    const initStream = async () => {
      try {
        const constraints = {
          video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
          audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access camera or microphone. Please check permissions.');
      }
    };
    
    initStream();
    
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedVideoDevice, selectedAudioDevice]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream, isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [localStream, isVideoOff]);

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });
        
        setScreenStream(stream);
        setIsScreenSharing(true);
        
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
        
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
        alert('Could not share screen. Please check permissions.');
      }
    } else {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
        setIsScreenSharing(false);
      }
    }
  };

  // Toggle hand raise
  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    setParticipants(prev => prev.map(p => 
      p.isLocal ? { ...p, handRaised: !isHandRaised } : p
    ));
  };

  // Send chat message
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: userName,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  // Copy room link
  const copyRoomLink = () => {
    const link = `${window.location.origin}/meet/${roomName}`;
    navigator.clipboard.writeText(link);
    alert('Room link copied to clipboard!');
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Responsive grid classes
  const getGridClass = () => {
    const count = participants.length;
    if (window.innerWidth < 640) {
      // Mobile: 1 column or 2x2
      return count <= 2 ? 'grid-cols-1' : 'grid-cols-2';
    } else if (window.innerWidth < 1024) {
      // Tablet: 2x2 or 3x2
      return count <= 4 ? 'grid-cols-2' : 'grid-cols-3';
    } else {
      // Desktop: up to 4x4
      return count <= 4 ? 'grid-cols-2' : count <= 9 ? 'grid-cols-3' : 'grid-cols-4';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b ${
        isDarkMode ? 'bg-slate-900/90 backdrop-blur-md border-slate-700/50' : 'bg-white/90 backdrop-blur-md border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <h1 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {roomName}
          </h1>
          <button
            onClick={copyRoomLink}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            title="Copy room link"
          >
            <Copy size={18} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-3 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
              showParticipants 
                ? 'bg-blue-600 text-white' 
                : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
            }`}
          >
            <Users size={20} />
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center relative ${
              showChat 
                ? 'bg-blue-600 text-white' 
                : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
            }`}
          >
            <MessageSquare size={20} />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {chatMessages.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowDeviceSettings(!showDeviceSettings)}
            className={`p-3 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Screen Share View */}
          {isScreenSharing && (
            <div className="mb-4 rounded-2xl overflow-hidden bg-black">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-[40vh] object-contain"
              />
            </div>
          )}
          
          {/* Participant Grid */}
          <div className={`grid gap-3 ${getGridClass()}`}>
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative rounded-2xl overflow-hidden aspect-video bg-slate-900 ${
                  participant.isSpeaking ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-slate-950' : ''
                }`}
              >
                {/* Video or Placeholder */}
                {participant.isLocal ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Video Off Placeholder */}
                {isVideoOff && participant.isLocal && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Participant Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">
                        {participant.name}
                      </span>
                      {participant.role === 'professor' && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Prof
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.handRaised && (
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                          <Hand size={14} className="text-white" />
                        </div>
                      )}
                      {participant.isLocal && isMuted && (
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <MicOff size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Speaking Indicator Animation */}
                {participant.isSpeaking && (
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
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Side Drawer */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-80 border-l flex flex-col ${
                isDarkMode ? 'bg-slate-900/90 backdrop-blur-md border-slate-700/50' : 'bg-white/90 backdrop-blur-md border-gray-200'
              }`}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  In-Call Chat
                </h2>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <ChevronRight size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />
                </button>
              </div>
              
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {chatMessages.length === 0 ? (
                  <div className="text-center text-sm text-slate-500">
                    No messages yet
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl ${
                        msg.sender === userName
                          ? 'bg-blue-600 text-white ml-auto'
                          : isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-gray-100 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">{msg.sender}</span>
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                      isDarkMode 
                        ? 'bg-slate-800 text-white placeholder:text-slate-500 border-slate-700' 
                        : 'bg-gray-100 text-slate-900 placeholder:text-slate-500 border-gray-300'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants Side Drawer */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-80 border-l flex flex-col ${
                isDarkMode ? 'bg-slate-900/90 backdrop-blur-md border-slate-700/50' : 'bg-white/90 backdrop-blur-md border-gray-200'
              }`}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Participants ({participants.length})
                </h2>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <ChevronRight size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {participant.name}
                          {participant.isLocal && ' (You)'}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{participant.role}</p>
                      </div>
                    </div>
                    {participant.handRaised && (
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Hand size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Device Settings Modal */}
        <AnimatePresence>
          {showDeviceSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeviceSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-2xl p-6 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                } border`}
              >
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Device Settings
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Camera
                    </label>
                    <select
                      value={selectedVideoDevice}
                      onChange={(e) => setSelectedVideoDevice(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-gray-100 text-slate-900 border-gray-300'
                      } border`}
                    >
                      {videoDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Microphone
                    </label>
                    <select
                      value={selectedAudioDevice}
                      onChange={(e) => setSelectedAudioDevice(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-gray-100 text-slate-900 border-gray-300'
                      } border`}
                    >
                      {audioDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDeviceSettings(false)}
                  className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Control Bar */}
      <div className={`h-20 flex items-center justify-center gap-2 px-4 border-t ${
        isDarkMode ? 'bg-slate-900/90 backdrop-blur-md border-slate-700/50' : 'bg-white/90 backdrop-blur-md border-gray-200'
      }`}>
        <button
          onClick={toggleMic}
          className={`p-4 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
            isMuted 
              ? 'bg-red-600 text-white' 
              : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
            isVideoOff 
              ? 'bg-red-600 text-white' 
              : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
          }`}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        
        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
            isScreenSharing 
              ? 'bg-blue-600 text-white' 
              : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
          }`}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
        </button>
        
        <button
          onClick={toggleHandRaise}
          className={`p-4 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
            isHandRaised 
              ? 'bg-yellow-500 text-white' 
              : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
          }`}
          title={isHandRaised ? 'Lower hand' : 'Raise hand'}
        >
          <Hand size={24} />
        </button>
        
        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-4 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
            showChat 
              ? 'bg-blue-600 text-white' 
              : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-slate-600'
          }`}
          title="Chat"
        >
          <MessageSquare size={24} />
        </button>
        
        <div className="w-px h-8 bg-slate-700 mx-2" />
        
        <button
          onClick={leaveMeeting}
          className="p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
          title="Leave meeting"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoMeeting;
