const CACHE_NAME = "notes-app-v1.6";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./register-sw.js",
  "./offline.html",
  "./manifest.json",
  "./dp.jpg",
  "./bg1.jpg",
  "./bg2.jpg",
  "./bg3.jpg",
  "./bg.png"
];


// ================= INSTALL =================
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});


// ================= ACTIVATE =================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});


// ================= FETCH =================
self.addEventListener("fetch", event => {

  // 🔹 HTML → Network First
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match("./offline.html"))
    );
    return;
  }

  // 🔹 JS & CSS → Network First (Update Safe)
  if (
    event.request.destination === "script" ||
    event.request.destination === "style"
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 🔹 Images & Other Assets → Cache First
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});