/* global caches, Request, self, toolbox, importScripts */
/* jshint browser:true */
'use strict';

importScripts('/scripts/sw-toolbox.js');

const RESOURCES_CACHE_NAME = 'my-cache-v1';

function isLocal(url) {
	return (new URL(new Request(url).url).host === location.host);
}

var resources = [
	'/favicon.ico',
	'/images/pattern.svg',
	'/styles/main.css',
	'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap',
	'https://s.gravatar.com/avatar/e137ba0321f12ecb5340680815b42c26?s=400',
	'/'
];
toolbox.precache(resources);

// Send a signal to all connected windows.
function reply(event) {
	return event.currentTarget.clients.matchAll({type: 'window'})
		.then(function (windows) {
			windows.forEach(function (w) {
				w.postMessage(event.data);
			});
		});
}

// Recieve messages from the client and reply back onthe same port
self.addEventListener('message', function(event) {
		Promise.resolve()
		.then(function () {

			if (event.data.action === 'STORE_ALL') {
				return caches.open(RESOURCES_CACHE_NAME)
					.then(function(cache) {
						return JSON.parse(event.data.urls).map(function (url) {
							console.log('Caching: ' + url);
							return cache.add(new Request(url, isLocal(url) ? {mode: 'no-cors'} : {}));
						});
					})
					.then(function (urlPromises) {
						return Promise.all(urlPromises);
					});
			}

			throw Error('Invalid Action');
		})
		.then(function () {
			event.data.success = true;
		}, function (err) {
			console.log(err);
			event.data.success = false;
			if (err) {
				event.data.message = err.message ? err.message : err;
			}
		})
		.then(function () {
			event.ports[0].postMessage(event.data);
		});
});

// Recieve messages from the client and reply back onthe same port
self.addEventListener('fetch', function (event) {
	const request = event.request;
	let handler = toolbox.fastest;

	// network first if in development mode
	if (request.url.match(/^http:\/\/localhost/) && location.protocol === 'http:' || location.hostname === 'localhost') {
		 handler = toolbox.networkFirst
	}

	// Index page should be fresh i ncase of new stories
	if (request.url.match(/^https:\/\/ada.is\/?(index.html)?$/)) {
		handler = toolbox.networkFirst;
	}

	// Network first if it is a page navigation to try to get an up-to-date result
	if (request.mode === 'navigate') {
		handler = toolbox.networkFirst;
	}

	// Ignore videos
	if (
		request.url.match(/(\.mp4|\.webm|\.avi|\.wmv|\.m4v)$/i) ||
		request.url.match(/data:/i)
	) {
		return;
	}

	event.respondWith(handler(request, [], {
		networkTimeoutSeconds: 3
	}));
});
