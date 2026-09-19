// Minimal service worker: caches the app shell so the site (and the resume
// PDF) stay reachable offline / on a flaky connection.
//
// v1 served the HTML document cache-first, which meant a real device that
// had visited once kept getting the stale cached index.html on every later
// visit/refresh, silently updating the cache only in the background for a
// visit after that — a classic "site never updates" PWA bug. Fixed here:
// - Navigation requests (the HTML document) are network-first, so a normal
//   refresh always gets the latest deploy; the cache is only a fallback for
//   when the device is offline.
// - Everything else (JS/CSS/images) stays cache-first — safe because Vite
//   fingerprints those filenames per build, so a cached one is never stale.
// CACHE_NAME is bumped so `activate` deletes the old v1 cache (which held
// the stale index.html) on every device that already had it installed.
const CACHE_NAME = 'hjha-portfolio-v2';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
        return response;
      });
    })
  );
});
