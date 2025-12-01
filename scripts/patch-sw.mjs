import { existsSync, readFileSync, writeFileSync } from 'fs';

const swPath = './public/sw.js';

// Push handlers + precaching error fix
const pushHandler = `
// === Fix for Next.js 15 Precaching Errors ===
// Catch and ignore bad-precaching-response errors
self.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('bad-precaching-response')) {
    console.warn('[SW] Ignoring precaching error:', event.error.message);
    event.preventDefault();
  }
});

self.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('bad-precaching-response')) {
    console.warn('[SW] Ignoring precaching rejection:', event.reason.message);
    event.preventDefault();
  }
});

// === Push Notification Handlers ===

self.addEventListener('push', event => {
  console.log('[SW] Push event received');
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
      console.log('[SW] Push data:', data);
    } catch {
      console.log('[SW] Push data parse failed, using text');
      data = { title: 'Notification', body: event.data.text() };
    }
  }
  const title = data.title || 'Notification';
  const options = {
    body: data.body || '',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: 'notification',
    requireInteraction: false,
  };
  if (data.url) {
    options.data = { url: data.url };
  }
  event.waitUntil(
    self.registration.showNotification(title, options)
      .catch(err => console.error('[SW] Error showing notification:', err))
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Find existing window
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch(err => console.error('[SW] Error handling notification click:', err))
  );
});
`;

if (existsSync(swPath)) {
  let swContent = readFileSync(swPath, 'utf8');
  
  // Check if already patched
  if (swContent.includes('Push Notification Handlers')) {
    console.log('✓ SW already patched');
  } else {
    // Remove problematic app-build-manifest from precache list if present
    swContent = swContent.replace(
      /{url:"\/_next\/app-build-manifest\.json",revision:"[^"]*"},?/g,
      ''
    );
    
    // Clean up any trailing commas in arrays
    swContent = swContent.replace(/,(\s*)\]/g, '$1]');
    
    // Append handlers
    swContent += pushHandler;
    
    writeFileSync(swPath, swContent, 'utf8');
    console.log('✓ SW patched: removed app-build-manifest + added push handlers');
  }
} else {
  console.error('✗ public/sw.js not found!');
}