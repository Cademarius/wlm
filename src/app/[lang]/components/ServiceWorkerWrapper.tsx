'use client';
import { useEffect } from 'react';

export default function ServiceWorkerWrapper() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // En développement, le Service Worker (PWA) casse le rechargement
    // (precache 404). On le désinscrit et on vide les caches.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }

    // En production uniquement : enregistrement normal du SW.
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ SW enregistré :', reg))
        .catch((err) => console.error('❌ Erreur enregistrement SW :', err));
    });
  }, []);

  return null;
}
