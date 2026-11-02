/* AWS AI Quest — service worker
   Stratégie : pré-cache de tous les fichiers (cache-first) → fonctionne hors ligne.
   MISE À JOUR : incrémenter CACHE_VERSION à chaque déploiement (et VERSION dans js/app.js). */
var CACHE_VERSION = "aif-quest-v1.3.0";
var ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "css/app.css",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "data/meta.js",
  "data/objectives.js",
  "data/m1-course.js",
  "data/m1-questions.js",
  "data/m1-labs.js",
  "data/m2-course.js",
  "data/m2-questions.js",
  "data/m2-labs.js",
  "data/m3-course.js",
  "data/m3-questions.js",
  "data/m3-labs.js",
  "data/m4-course.js",
  "data/m4-questions.js",
  "data/m4-labs.js",
  "data/m5-course.js",
  "data/m5-questions.js",
  "data/m5-labs.js",
  "js/engine.js",
  "js/storage.js",
  "js/ui.js",
  "js/screens.js",
  "js/app.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(ASSETS.map(function (u) { return new Request(u, { cache: "reload" }); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === "navigate") return caches.match("index.html");
      });
    })
  );
});
