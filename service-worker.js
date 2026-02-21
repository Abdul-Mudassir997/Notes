const CACHE_NAME = "notes-app-v1";

const urlsToCache = [
  "/",
  "index.html",
  "style.css",
  "app.js",
  "offline.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
        .then(response => response || caches.match("/offline.html"));
    })
  );
});