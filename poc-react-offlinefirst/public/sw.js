// Importa Workbox con importScripts
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

// Controlla se Workbox è caricato correttamente
if (workbox) {
  console.log('Workbox is loaded.');

// Usa un array vuoto come fallback per `self.__WB_MANIFEST`
const manifest = self.__WB_MANIFEST || [];

workbox.precaching.precacheAndRoute(manifest);

  // Strategia NetworkFirst per le richieste HTML (pagine navigate)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
    })
  );

  // Strategia CacheFirst per CSS e JavaScript
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script',
    new workbox.strategies.CacheFirst({
      cacheName: 'static-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50, // Numero massimo di risorse salvate
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache valida per 30 giorni
        }),
      ],
    })
  );

  // Strategia CacheFirst per immagini
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100, // Numero massimo di immagini salvate
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache valida per 7 giorni
        }),
      ],
    })
  );

  // Strategia NetworkFirst per richieste API
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50, // Numero massimo di risposte API salvate
        }),
      ],
    })
  );
} else {
  console.error('Workbox failed to load.');
}

// Eventi del ciclo di vita del Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // Attiva subito il nuovo Service Worker
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(self.clients.claim()); // Reclama i client immediatamente
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching:', event.request.url);
});
