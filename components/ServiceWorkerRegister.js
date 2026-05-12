'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return undefined;
    }

    let cancelled = false;

    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        if (!cancelled) {
          console.info('DriveLegal service worker registered');
        }
      })
      .catch((error) => {
        console.warn('Service worker registration failed', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
