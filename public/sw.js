const CACHE_NAME = 'nima-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { id, title, body, icon, scheduledTime } = event.data;
    
    const now = Date.now();
    const delay = new Date(scheduledTime).getTime() - now;
    
    if (delay > 0) {
      // Schedule the notification
      setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: icon || '/placeholder.svg',
          badge: '/placeholder.svg',
          tag: id,
          requireInteraction: false,
          vibrate: [200, 100, 200],
        });
      }, delay);
    }
  }
  
  if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
    // Handle cancellation if needed
    console.log('Notification cancelled:', event.data.id);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
