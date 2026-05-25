// ============================================
// Service Worker for PWA
// ============================================

const CACHE_NAME = 'portfolio-vvt-toc-layout-v4';
const ASSET_VERSION = '20260523-toc-layout';
const versioned = (url) => `${url}?v=${ASSET_VERSION}`;

const urlsToCache = [
    '/',
    '/index.html',
    '/blog.html',
    '/components/about.html',
    '/components/skills.html',
    '/components/projects.html',
    '/components/contact.html',
    versioned('/assets/css/style.css'),
    versioned('/assets/css/blog.css'),
    versioned('/assets/js/script.js'),
    versioned('/assets/js/blog.js'),
    versioned('/assets/js/load-components.js'),
    versioned('/assets/js/global-audio.js'),
    versioned('/assets/js/audio-player.js'),
    versioned('/assets/js/animations.js'),
    versioned('/assets/js/dark-mode.js'),
    versioned('/assets/js/i18n.js'),
    versioned('/assets/js/blog-search.js'),
    versioned('/assets/js/comments.js'),
    versioned('/assets/js/related-posts.js'),
    versioned('/assets/js/rss-feed.js'),
    '/assets/img/myface.jpg',
    '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Fetch event - keep documents fresh, cache static assets for repeat visits.
self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return response;
                })
                .catch(() => caches.match(request).then((response) => response || caches.match('/index.html')))
        );
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Push notification event (optional)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Portfolio Update';
    const options = {
        body: data.body || 'Có cập nhật mới trên portfolio',
        icon: '/assets/img/myface.jpg',
        badge: '/assets/img/myface.jpg',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

