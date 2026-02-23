const CACHE_NAME = "notes-app-v2"; // version change karna mat bhoolna

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./offline.html"
];


// ================= INSTALL =================
self.addEventListener("install", event => {
  self.skipWaiting(); // immediately activate hone ke liye
  
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});


// ================= ACTIVATE =================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // old cache delete
          }
        })
      );
    })
  );
  
  self.clients.claim(); // control immediately lelo
});


// ================= FETCH =================
self.addEventListener("fetch", event => {
  
  // HTML pages ke liye Network First
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match("./offline.html");
      })
    );
    return;
  }
  
  // Static files ke liye Cache First
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});