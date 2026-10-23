const CACHE_NAME = 'mazmorra-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js' // Cambia esto por el nombre real de tu archivo JS principal
  // Aquí también debes agregar las rutas de tus imágenes y sonidos (ej. './assets/player.png')
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});