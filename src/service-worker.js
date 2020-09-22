console.log("My Service Worker loaded");

// Cache all content API calls
// 
// NetworkFirst strategy
// fetch latest from network
//  if successful: respond and cache it
//  if unsuccessful: respond with cached response if available
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/content'),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-content",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 14 * 86400, // 14d
      }),
    ],
  })
);

// Cache all assets API calls
// 
// StaleWhileRevalidate strategy
// respond with cached version asap if available
// fetch latest from network if it’s not cached yet
// network request is then used to update the cache
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/assets'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "api-assets",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 14 * 86400, // 14d
      }),
    ],
  }),
);

// Cache all scripts and stylesheets
//
// StaleWhileRevalidate strategy
// respond with cached version asap if available
// fetch latest from network if it’s not cached yet
// network request is then used to update the cache
workbox.routing.registerRoute(
  /\.(?:css|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 14 * 86400, // 14d
      }),
    ],
  })
);


// Cache all images
//
// StaleWhileRevalidate strategy
// respond with cached version asap if available
// fetch latest from network if it’s not cached yet
// network request is then used to update the cache
workbox.routing.registerRoute(
  /\.(?:png|jpg|gif|svg)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 1000,
        maxAgeSeconds: 14 * 86400, // 14d
      }),
    ],
  })
);

self.addEventListener('install', event => {
  console.log('My Service Worker installed')
  event.waitUntil(self.skipWaiting()) // forces the waiting service worker to become the active service right after installed
});

self.addEventListener('activate', event => {
  console.log('My Service Worker activated')
  event.waitUntil(self.clients.claim()) // allows an active service worker to set itself as the controller for all clients within its scope
});

self.addEventListener('notificationclick', (event) => {
  console.log('My Service Worker Notification click received. event ', event);
  event.notification.close();
  if (clients.openWindow) {
    event.waitUntil(clients.openWindow('https://frontendphsteinbprod.z6.web.core.windows.net/news')); //ENV -> process is not defined error
  }
});