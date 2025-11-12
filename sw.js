// Define a name for your cache
const CACHE_NAME = 'jewelry-calc-cache-v1';

// List the files you want to cache
const FILES_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'images/icon-192.png',
  'images/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// 1. On install, cache the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      // We are caching the external XLSX script as well
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 2. On fetch, serve from cache first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If found in cache, return it. Otherwise, fetch from network.
      return response || fetch(event.request);
    })
  );
});