// Define a name for your cache
const CACHE_NAME = 'jewelry-calc-cache-v2';
// List the files you want to cache — all relative to sw.js's own
// location (the repo root), matching where these files actually live.
// Cache.addAll() is all-or-nothing: if even one URL here 404s, NOTHING
// gets cached, not even index.html — which is exactly what was
// happening (images/icon-192.png doesn't exist; the real files sit at
// the root, and '/' was resolving to the domain root instead of this
// repo's folder on a GitHub Pages project site).
const FILES_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];
// 1. On install, cache the files
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
// Clean up old cache versions and take control immediately, so a fix
// like this one actually takes effect on next load instead of waiting
// for every open tab to close first.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
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
