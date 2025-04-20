/// <reference lib="webworker" />

import { manifest, version } from '@parcel/service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `calendar-app-cache-v${version}`;

// Add list of files to cache here
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/icons/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add all static assets to cache
      return cache.addAll(STATIC_ASSETS.concat(manifest as string[]));
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old caches except the current one
            return cacheName.startsWith('calendar-app-cache-') && cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
  // Take control of clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache or fetch from network and cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API requests (to avoid caching dynamic data)
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response - one to cache, one to return
          const responseToCache = response.clone();

          // Cache the new resource
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If both cache and network fail, return fallback
          if (event.request.headers.get('Accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return new Response('Network error occurred', { status: 408 });
        });
    })
  );
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Calendar notification',
      icon: '/icons/notification-icon.png',
      badge: '/icons/badge-icon.png',
      data: { url: data.url || '/' },
      actions: [
        {
          action: 'view',
          title: 'View',
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        // If a window client is available, navigate to the event page
        const url = event.notification.data?.url || '/';
        
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
});

// Handle background sync for pending actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-events') {
    event.waitUntil(syncEvents());
  }
});

// Sync events with the server when online
async function syncEvents() {
  try {
    // Implementation depends on your API structure
    console.log('Syncing events in background');
    // Add sync implementation here
  } catch (error) {
    console.error('Error syncing events:', error);
  }
} 