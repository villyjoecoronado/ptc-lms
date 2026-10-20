import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Siguraduhin na may index.css ka sa src folder

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
        
        // Request notification permission
        if ('Notification' in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted');
              // Subscribe to push notifications
              subscribeToPushNotifications(registration);
            } else {
              console.log('Notification permission denied');
            }
          });
        }
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Subscribe to push notifications
async function subscribeToPushNotifications(registration) {
  try {
    // Get VAPID public key from backend
    const response = await fetch('http://localhost:5000/api/notifications/vapid-public-key');
    const { publicKey } = await response.json();
    
    if (!publicKey) {
      console.error('VAPID public key not available');
      return;
    }
    
    // Convert base64 string to Uint8Array
    const convertedVapidKey = urlBase64ToUint8Array(publicKey);
    
    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
    
    console.log('Push subscription created:', subscription);
    
    // Send subscription to backend
    await saveSubscription(subscription);
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
}

// Save subscription to backend
async function saveSubscription(subscription) {
  try {
    const response = await fetch('http://localhost:5000/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    
    if (response.ok) {
      console.log('Subscription saved successfully');
    } else {
      console.error('Failed to save subscription');
    }
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
}

// Convert base64 string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);