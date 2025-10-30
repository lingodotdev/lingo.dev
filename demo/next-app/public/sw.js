const CACHE_NAME = 'lingo-v2';
const RUNTIME_CACHE = 'lingo-runtime';
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => 
        Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map(name => caches.delete(name))
        )
      ),
      self.clients.claim()
    ])
  );
});

// Fetch event - advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests - network first with background sync
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithSync(request));
    return;
  }

  // Static assets - cache first
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages - stale while revalidate
  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default - network first
  event.respondWith(networkFirst(request));
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(replayFailedRequests());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: data.url,
    actions: [
      { action: 'open', title: 'Open', icon: '/icon-open.png' },
      { action: 'close', title: 'Close', icon: '/icon-close.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Caching strategies
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match('/offline.html');
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

async function networkFirstWithSync(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Store failed request for background sync
    await storeFailedRequest(request);
    throw error;
  }
}

async function storeFailedRequest(request) {
  const db = await openDB();
  const tx = db.transaction(['requests'], 'readwrite');
  await tx.objectStore('requests').add({
    url: request.url,
    method: request.method,
    headers: [...request.headers.entries()],
    body: await request.text(),
    timestamp: Date.now()
  });
}

async function replayFailedRequests() {
  const db = await openDB();
  const tx = db.transaction(['requests'], 'readwrite');
  const requests = await tx.objectStore('requests').getAll();
  
  for (const req of requests) {
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body
      });
      await tx.objectStore('requests').delete(req.id);
    } catch (error) {
      console.log('Retry failed:', error);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('lingo-sync', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
