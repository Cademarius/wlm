if(!self.define){let e,a={};const s=(s,i)=>(s=new URL(s+".js",i).href,a[s]||new Promise(a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()}).then(()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e}));self.define=(i,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(a[t])return;let c={};const o=e=>s(e,t),r={module:{uri:t},exports:c,require:o};a[t]=Promise.all(i.map(e=>r[e]||o(e))).then(e=>(n(...e),c))}}define(["./workbox-4754cb34"],function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/136-8c3192fa3e062f3a.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/255-e32d7b7cbe319da1.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/274-fead21b2b7cb57d9.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/43-b3763ed917e1a9fe.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/4bd1b696-05ebaf277322eca1.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/684-f968adb3db7ff7b3.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/714-4780a70a9d37286b.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/766-3b6c73a921c4b64d.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/85-cdc408bea4781aed.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/872-3539cae8e77df399.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/874-7796283b97b3238f.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/8e1d74a4-d9f162af3f644779.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/968-1de295e1e6a6d6c8.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/addcrush/page-f65bbc5628911c5b.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/feed/page-da8cc08212a368a1.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/layout-d59ac9eb0ceab402.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/matchcrush/page-9068a5ac141d64cf.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/notifications/page-5d6d044ab2bd10ae.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/page-6e56ed087870cc65.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/profile/complete/page-8282f4c263cfd7da.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/profile/page-4e362564a0431544.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/profile/settings/page-731249d6b9cf88e0.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/%5Blang%5D/user/%5BuserId%5D/page-7d5391c88577c4e8.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/_not-found/page-e8509662a2cc195c.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/add-crush/route-c1680c3b962a02fb.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-ea57173670d3ae5e.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/get-admirers/route-6c0ac32b64a6986a.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/get-crushes/route-2f4e6f540a322679.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/get-notifications/route-dee488898a883a0a.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/get-user/route-51cd5c70538b0d66.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/mark-notification-read/route-e3a11ae253fb49c9.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/ping-online/route-951dfb8f0a518b61.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/save-push-subscription/route-b13c02a260033ebe.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/search-users/route-1313405c4b21a18f.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/send-push/route-a0ecce46e19882e4.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/set-online/route-0340d85d4532711a.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/skip-profile-completion/route-3ef268d32287dccc.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/sync-user/route-9fa6c07ad6408541.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/update-profile/route-ea3feb052bddd92a.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/api/upload-avatar/route-c00ee08c8bbc4cba.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/layout-53415ad3ad306462.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/app/not-found-30d1086a1af65362.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/fc2f6fa8-f66e1488fc192822.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/framework-2d12aff0ba6f0c95.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/main-7a14523316dc15c1.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/main-app-bfe1edef6935406e.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/pages/_app-da15c11dea942c36.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-9d684b17bdc8207c.js",revision:"w_12QSwfENe84aVAZvRmo"},{url:"/_next/static/css/64c3593ef35f2d00.css",revision:"64c3593ef35f2d00"},{url:"/_next/static/media/step1.89b1ba55.png",revision:"7403e48735cb176802becf2f7580ba28"},{url:"/_next/static/media/step2.9b3c8f71.png",revision:"8bde8052f8165733701622d41ecd19e0"},{url:"/_next/static/media/step3.c8d3fe9a.png",revision:"4f6f60cced04c09fca0cbd0a79d10d8e"},{url:"/_next/static/media/welcome.c045b05b.png",revision:"d44af77443bc4a129ac91223dbd41b5e"},{url:"/_next/static/w_12QSwfENe84aVAZvRmo/_buildManifest.js",revision:"56cadfb6da105435cdc581542584cfa6"},{url:"/_next/static/w_12QSwfENe84aVAZvRmo/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/favicon.png",revision:"3e6e20b99022626b9ea1e55dda77d6ca"},{url:"/icon512_maskable.png",revision:"b4c64820845752a5ab54654d8e32d908"},{url:"/icon512_rounded.png",revision:"b4c64820845752a5ab54654d8e32d908"},{url:"/images/branding/wholikeme-desktop-logo.webp",revision:"d44af77443bc4a129ac91223dbd41b5e"},{url:"/images/branding/wholikeme-mobile-logo.webp",revision:"a179978828aa389574b73f83ca95b333"},{url:"/images/icons/favicon.png",revision:"3e6e20b99022626b9ea1e55dda77d6ca"},{url:"/images/icons/icons.png",revision:"a179978828aa389574b73f83ca95b333"},{url:"/images/screenshots/a.webp",revision:"e5c7f72eb1e78a1367a22798ffd9c6ee"},{url:"/images/screenshots/b.webp",revision:"61783ef791d3bf5b631e7454e0180695"},{url:"/images/ui/background.webp",revision:"e5c7f72eb1e78a1367a22798ffd9c6ee"},{url:"/images/ui/bg-pattern.webp",revision:"61783ef791d3bf5b631e7454e0180695"},{url:"/images/ui/bg.jpg",revision:"0584853736e0a79be3a0eb142fe92926"},{url:"/images/ui/bottom-left-illustration.webp",revision:"30fe473cdaeced8a709d9e732b686fda"},{url:"/images/ui/bottom-right-illustration.webp",revision:"7f2f5fd4d5bf8192ac92f5461b318330"},{url:"/images/ui/illustration.svg",revision:"65e970badad442556c5685922b6502c3"},{url:"/images/ui/illustration.webp",revision:"70cacfb093a0c796f766a047cf097eb4"},{url:"/images/ui/legal-icon.svg",revision:"aaa603139eafea680202cf007fbb1443"},{url:"/images/ui/privacy-icon.svg",revision:"f264f3270dc542e890efb785ccc2724a"},{url:"/images/ui/step1.png",revision:"7403e48735cb176802becf2f7580ba28"},{url:"/images/ui/step2.png",revision:"8bde8052f8165733701622d41ecd19e0"},{url:"/images/ui/step3.png",revision:"4f6f60cced04c09fca0cbd0a79d10d8e"},{url:"/images/ui/terms-icon.svg",revision:"c3d56d42d88c68d3b74498efb5d33991"},{url:"/images/ui/top-left-illustration.webp",revision:"a4100779119d8dc0785e29a2840800cf"},{url:"/images/ui/top-right-illustration.webp",revision:"5c0b52e0fcc63ef73e3f79c929cc748c"},{url:"/images/ui/welcome.png",revision:"d44af77443bc4a129ac91223dbd41b5e"},{url:"/images/users/avatar.webp",revision:"796183e3c698b273f6120287eedfb213"},{url:"/manifest.json",revision:"486a2918ea816cf16206b53fe0eb508b"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:i})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")},new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")},new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>!(self.origin===e.origin),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")});

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
