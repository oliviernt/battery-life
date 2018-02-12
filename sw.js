
const CACHE = 'battery-life-v1';
const FILES = [
    '/',
    '/?utm_source=start_url',
    'index.html',
    'index.html?utm_source=start_url',
    'battery-charging-x48.png',
    'battery-charging-x96.png',
    'battery-charging-x128.png',
    'battery-charging-x144.png',
    'battery-charging-x192.png',
    'battery-charging-x512.png',
    'battery-charging.png',
    'battery-charging.svg',
    'battery.svg',
    'main.js',
    'https://cdn.rawgit.com/twbs/bootstrap/master/dist/css/bootstrap.min.css'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches
            .open(CACHE)
            .then(cache => cache.addAll(FILES))
    );
});

self.addEventListener('fetch', function(evt) {

    if (evt.request.url.startsWith('data')) return;

    evt.respondWith(
        caches
            .open(CACHE)
            .then(cache => cache
                .match(evt.request)
                .then(matching => matching || Promise.reject()))
    );

    evt.waitUntil(
        caches
        .open(CACHE)
        .then(cache => fetch(evt.request)
            .then(response => cache.put(evt.request, response)))
    );
});