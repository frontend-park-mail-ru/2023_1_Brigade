const CACHE_NAME = 'technogram-cache';
const URLS_TO_CACHE = ['/'];
const CACHE_WHITE_LIST = [CACHE_NAME];

const TIMEOUT = 1000;

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(URLS_TO_CACHE);
            })
            .catch((err) => {
                console.error('Failed install sw:', err);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (CACHE_WHITE_LIST.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fromNetwork(event.request, TIMEOUT).catch(() => {
            return fromCache(event.request);
        })
    );
});

function fromNetwork(request, TIMEOUT) {
    return new Promise((fulfill, reject) => {
        var timeoutId = setTimeout(reject, TIMEOUT);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            saveInCache(request, response.clone());
            fulfill(response.clone());
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then(
            (matching) =>
                matching ||
                fetch(request)
                    .then((response) => {
                        saveInCache(request, response.clone());
                        return response;
                    })
                    .catch(() => ({
                        //? возможно зедесь и нужно вызывать роутинг на страницу ошибки, мол плохое соединение
                        status: 0,
                        body: 'Плохое интернет соединение',
                    }))
        )
    );
}

const saveInCache = (request, response) => {
    caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, response);
    });
};
