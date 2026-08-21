/* Comando de Campo — cache relativo à pasta publicada para uso offline no GitHub Pages. */
const CACHE = "controle-demanda-v2";
const ROOT = new URL("./", self.registration.scope).pathname;
const CORE = [
  ROOT,
  `${ROOT}manifest.json`,
  `${ROOT}supabase-config.js`,
  `${ROOT}assets/controle-demanda-mark.png`,
  `${ROOT}assets/controle-demanda-readiness-banner.png`,
  `${ROOT}assets/controle-demanda-demand-map.png`,
  `${ROOT}assets/controle-demanda-history-strip.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response && response.status === 200 && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(ROOT))));
});
