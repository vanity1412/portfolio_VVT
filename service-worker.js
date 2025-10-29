// ============================================
// Service Worker for PWA
// ============================================

const CACHE_NAME = 'portfolio-vvtr-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/blog.html',
    '/components/about.html',
    '/components/skills.html',
    '/components/projects.html',
    '/components/contact.html',
    '/assets/css/style.css',
    '/assets/css/blog.css',
    '/assets/js/script.js',
    '/assets/js/blog.js',
    '/assets/js/load-components.js',
    '/assets/js/global-audio.js',
    '/assets/js/audio-player.js',
    '/assets/js/animations.js',
    '/assets/js/dark-mode.js',
    '/assets/js/i18n.js',
    '/assets/js/blog-search.js',
    '/assets/js/comments.js',
    '/assets/js/related-posts.js',
    '/assets/js/rss-feed.js',
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
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Fallback for offline
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
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
        })
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

