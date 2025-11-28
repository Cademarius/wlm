import { existsSync, appendFileSync } from 'fs';

const swPath = './public/sw.js';
const pushHandler = `
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: 'Notification', body: event.data.text() };
    }
  }
  const title = data.title || 'Notification';
  const options = {
    body: data.body || '',
    icon: '/icon512_rounded.png',
    badge: '/favicon.png',
    data: data.url ? { url: data.url } : undefined,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
`;

if (existsSync(swPath)) {
  appendFileSync(swPath, pushHandler);
  console.log('Push handler appended to public/sw.js');
} else {
  console.error('public/sw.js not found!');
}