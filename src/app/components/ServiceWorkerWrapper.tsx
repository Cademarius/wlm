'use client';
import { useEffect } from 'react';

export default function ServiceWorkerWrapper() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('✅ SW enregistré :', reg);
          })
          .catch((err) => {
            console.error('❌ Erreur lors de l’enregistrement SW :', err);
          });
      });
    }
  }, []);

  return null;
}
