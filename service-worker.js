/**
 * Service Workers
 */

// fetch请求监听
this.addEventListener('fetch', function (event) {
    console.log(event.request);
    event.respondWith(caches.match(event.request));
});
