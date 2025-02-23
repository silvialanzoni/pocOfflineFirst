importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

if (workbox) {
  console.log('✅ Workbox is loaded.');

  // 📄 Gestione delle richieste HTML per navigazione offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 giorni
        }),
      ],
    })
  );

  // 🎨 Gestione per CSS e JS
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // 🖼 Gestione per immagini
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 giorni
        }),
      ],
    })
  );

} else {
  console.error('❌ Workbox failed to load.');
}

// 🔄 Eventi ciclo di vita del Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(self.clients.claim());
});
