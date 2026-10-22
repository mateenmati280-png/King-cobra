// King Cobra - Service Worker (Offline Support + PWA)

const CACHE_NAME = 'kingcobra-v1';
const urlsToCache = [
  './',
  './index.html',
  './dashboard.html',
  './support.html',
  './invest.html',
  './team.html',
  './profile.html',
  './manifest.json',
  './firebase-config.js',
  './install-pwa.js',
  './icon-192.png',
  './icon-512.png'
];

// Install - Files ko cache karo
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('✅ Cache opened');
      return cache.addAll(urlsToCache).catch(function(err) {
        console.log('⚠️ Some files failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate - Purana cache delete karo
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Pehle cache se try karo, phir network se
self.addEventListener('fetch', function(event) {
  // Sirf GET requests handle karo
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache mein mila toh wahi do
      if (response) return response;
      
      // Nahi mila toh network se fetch karo
      return fetch(event.request).then(function(response) {
        // Agar valid response hai toh cache mein save karo
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(function() {
        // Agar offline ho aur cache mein na mile toh
        return caches.match('./index.html');
      });
    })
  );
});