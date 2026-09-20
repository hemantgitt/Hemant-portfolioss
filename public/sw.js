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
//
// v5 fixed a real offline bug: APP_SHELL only listed '/', not the actual
// hashed JS/CSS bundle files Vite generates per build (their names aren't
// known ahead of time), and relying on the fetch handler to lazily cache
// them on first request turned out to be unreliable in practice — testing
// showed a page reloaded while offline could get index.html from cache but
// then fail to load its own bundle, producing a blank white screen instead
// of the app or the offline fallback. Fixed by having `install` fetch the
// current index.html and precache whatever JS/CSS it actually references,
// so the exact assets this build needs are always in the cache from the
// start, not dependent on them having been individually requested before.
//
// v7: the resume PDF is what this file's own top comment promises stays
// reachable offline, but it was never actually precached -- only cached
// opportunistically if a visitor had already clicked Download/Print while
// online. Added explicitly below. (This path is a plain string, not
// imported from src/data/site.json's resumeUrl, because this file is a
// static public/ asset with no build step of its own -- keep the two in
// sync by hand if the resume filename ever changes.)
//
// v8: a new SW used to call skipWaiting() unconditionally, so a deploy
// while a visitor had the site open in a background tab would silently
// swap the active SW under them mid-session -- if that tab later tried to
// lazy-load a section chunk, it could 404 (the old build's filename no
// longer exists once the new one's deployed). Fixed by no longer calling
// skipWaiting() automatically: a new SW now sits in the normal "waiting"
// state until the page (see useServiceWorkerUpdate.js) explicitly tells it
// to take over -- which it only does after showing an "Update available"
// banner and the visitor choosing to refresh.
//
// CACHE_NAME is bumped so `activate` deletes the old cache on every device
// that already had a previous version installed, AND so `install` runs
// again on the next deploy (a byte-identical sw.js is never re-fetched or
// re-installed by the browser) -- bump it whenever this file OR the set of
// files it needs to precache changes.
const CACHE_NAME = 'hjha-portfolio-v8';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/offline.html'];
// Cached separately from APP_SHELL (not with cache.addAll, which fails the
// *entire* install atomically if even one URL 404s) — the filename has a
// version suffix that's likely to change on a future re-upload, and a
// stale/missing resume link shouldn't be able to take down offline caching
// for the whole rest of the site.
const RESUME_PDF_URL = '/uploads/Hemant_Jha_Senior_Software_Engineer_Frontend_v19.pdf';

async function precacheBuildAssets(cache) {
  try {
    const html = await fetch('/index.html', { cache: 'no-store' }).then((r) => r.text());
    const urls = new Set();
    const attrPattern = /(?:src|href)="(\/assets\/[^"]+)"/g;
    let match;
    while ((match = attrPattern.exec(html))) urls.add(match[1]);
    await Promise.all(
      [...urls].map((url) => fetch(url).then((response) => (response.ok ? cache.put(url, response) : null)).catch(() => null))
    );
  } catch {
    // Offline during install (e.g. first-ever load with a flaky
    // connection) — APP_SHELL already covers the essentials, and the
    // regular fetch handler still opportunistically caches assets later.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      await precacheBuildAssets(cache);
      await fetch(RESUME_PDF_URL)
        .then((response) => (response.ok ? cache.put(RESUME_PDF_URL, response) : null))
        .catch(() => null);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Lets a page opt this waiting SW into taking over immediately (used by the
// "Update available" banner's Refresh button), instead of it sitting in the
// waiting state until every open tab of the old version is closed.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
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
        // Offline: serve this exact page from cache if it was visited
        // before (e.g. the SPA shell), otherwise fall back to the
        // dedicated offline page rather than the browser's default
        // "no internet" error screen.
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/offline.html')))
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
