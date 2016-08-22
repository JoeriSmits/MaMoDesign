/* global caches:false */
/* global self:false */
'use strict';
var CACHE_NAME = 'MaMo-cache-v1';

self.addEventListener('install', function(event) {
    var urlsToCache = [
      '/',
      '/css/styles.min.css',
      '/images/hero_bg.jpg',
      '/images/Coen.JPG',
      '/images/Joeri.JPG',
      '/images/img_1_mission.jpg',
      '/images/img_2_mission.jpg',
      '/images/img_3_mission.jpg',
      '/images/img_4_mission.jpg',
      '/images/logo_hero.png',
      '/images/Preloader_2.gif',
      '/js/main.min.js'
    ];

    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});