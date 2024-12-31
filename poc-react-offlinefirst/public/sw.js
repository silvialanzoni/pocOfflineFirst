self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');
    event.waitUntil(
      caches.open('offline-cache').then((cache) => {
        return cache.addAll(['/index.html', '/']);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  