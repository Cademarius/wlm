if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise(s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()}).then(()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e}));self.define=(a,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>i(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map(e=>o[e]||r(e))).then(e=>(n(...e),t))}}define(["./workbox-4754cb34"],function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/JEiydhbo9DCpX9cx3_3I9/_buildManifest.js",revision:"f3514761c286cf2fd972c7c17286016f"},{url:"/_next/static/JEiydhbo9DCpX9cx3_3I9/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1684-1e04a7ca3587b892.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/1753-aa0ef28c9d642afe.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/2200-8e9f93b839a00f68.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/3408-c3a2c24ab2b86985.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/3601-415dff9c7620eb32.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/4934-893da064ce175c0a.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/4bd1b696-4d24ca359cd50b76.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/5790-9b8f3ddf7c1b1f8d.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/5855-8e712230d5a17022.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/651-f6ca609aba31b8a0.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/6801-66661ad0552ec384.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/8025-6de7938c3f33d334.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/8073-a83c63c474efa178.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/8324-3f8bafeaf0037373.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/9039-3ed1fde2579cd8d7.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/addcrush/page-863883673be4e9d1.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/admin/crushes/page-6a2a00e98a1922dc.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/admin/layout-1be8f9684bfb2fe4.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/admin/matches/page-5081a0e12ec15149.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/admin/page-8b6d74b1aeb9a031.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/admin/users/page-864dc17e82c452d4.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/feed/page-4bda5e61ce224f3d.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/layout-b1508652f5ae517a.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/matchcrush/page-b2b5430207fb6931.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/notifications/page-345b196f2736462d.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/page-d6d5418086c175ce.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/profile/page-bb68fec8815f1f8c.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/%5Blang%5D/user/%5BuserId%5D/page-43aab40f76d5955c.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/_not-found/page-0f24314a7562cad5.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/add-crush/route-db589e6306043132.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/admin/crushes/route-85d2d2c939ef2dfa.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/admin/matches/route-21e21442ce986fd2.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/admin/stats/route-26a60c90ba482f95.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/admin/users/route-69f256032bc3c04d.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/auth/send-otp/route-2d8456fd962fe79b.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/get-admirers/route-59f5e083dd31b040.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/get-crushes/route-b1dad9bc4c29af0f.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/get-notifications/route-16c33b319bcfe620.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/get-user/route-361e20e0636b04f8.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/mark-notification-read/route-9e4fdf9a23762a8e.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/payments/confirm/route-29415b2500712784.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/ping-online/route-2d5bb42ab0f1bb0a.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/save-push-subscription/route-ec808283a5bb64e4.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/set-online/route-b2167140fcb5efee.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/update-profile/route-c21473f54952fe36.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/api/upload-avatar/route-298684c71661de18.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/layout-53dcf033262e49a6.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/app/not-found-7816d1652a3f8fc3.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/framework-744b75979ac08316.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/main-app-0429465e190d7b07.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/main-eaa0a05a88d52365.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/pages/_app-5d1abe03d322390c.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/pages/_error-3b2a1d523de49635.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-64f8dabbabd9df44.js",revision:"JEiydhbo9DCpX9cx3_3I9"},{url:"/_next/static/css/cb8544a4ef612ecd.css",revision:"cb8544a4ef612ecd"},{url:"/_next/static/css/cd9e11799d814c7f.css",revision:"cd9e11799d814c7f"},{url:"/_next/static/media/65d36c5f6dabca44-s.p.ttf",revision:"5416a925ffafb775c6bffd116d87deb0"},{url:"/_next/static/media/72be88ee8bbf1814-s.p.ttf",revision:"b7fa867b7522c7629eca3c4b9f31d3c8"},{url:"/_next/static/media/a426727dd8388b81-s.p.ttf",revision:"95fb28784ad39295fdd64be6662d81d7"},{url:"/_next/static/media/b868cc619730a645-s.p.ttf",revision:"a4e6f571273de05494ef24d6fb65c885"},{url:"/_next/static/media/db58dc67aab3a0ef-s.p.ttf",revision:"2000e3092f7d4527368cb41d357fe356"},{url:"/apple-icon.png",revision:"4376dd9b6f634414af6df18a3e598200"},{url:"/favicon-32.png",revision:"756563d4bac91f433aa878f734d3a2b8"},{url:"/favicon.png",revision:"8b860b0875dae763210629871f00300b"},{url:"/icon.svg",revision:"4866ec5616485703c803dedaafcd09e2"},{url:"/icon512_maskable.png",revision:"74894203f0d9bbc4bcef0e92ccce51b2"},{url:"/icon512_rounded.png",revision:"508df5afe495decbfd57bc4c91c2d013"},{url:"/images/icons/favicon.png",revision:"3e6e20b99022626b9ea1e55dda77d6ca"},{url:"/images/screenshots/a.webp",revision:"32e3eca0bf3394301fef33516c38e8ec"},{url:"/images/screenshots/b.webp",revision:"355705588bbb3a429b33c024339987d5"},{url:"/images/ui/background.webp",revision:"1fe80a55b0dcdeb4d08d55576244ff6b"},{url:"/images/ui/illustration.svg",revision:"65e970badad442556c5685922b6502c3"},{url:"/images/users/avatar-female.svg",revision:"b084e7e2f3e1e0bcd31606dca868c1d3"},{url:"/images/users/avatar-male.svg",revision:"48acdd014e5a305978793aee29730a67"},{url:"/images/users/avatar.svg",revision:"7e67618bae6371c86a78c2ea84bb8230"},{url:"/manifest.json",revision:"a60144e27a078b88fb21adead1d97a42"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")},new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")},new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>!(self.origin===e.origin),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")});

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
