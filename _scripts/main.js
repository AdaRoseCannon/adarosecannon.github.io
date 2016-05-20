/* global $ */

'use strict';
window.$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn.bind(this));
};

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem) {
    elem.on(name, fn);
  });
};

(function () {
	function sendSWMessage(message) {

		// This wraps the message posting/response in a promise, which will resolve if the response doesn't
		// contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
		// controller.postMessage() and set up the onmessage handler independently of a promise, but this is
		// a convenient wrapper.
		return new Promise(function(resolve, reject) {
			const messageChannel = new MessageChannel();
			messageChannel.port1.onmessage = function(event) {
				if (event.data.error) {
					reject(event.data.error);
				} else {
					resolve(event.data);
				}
			};

			// This sends the message data as well as transferring messageChannel.port2 to the service worker.
			// The service worker can then use the transferred port to reply via postMessage(), which
			// will in turn trigger the onmessage handler on messageChannel.port1.
			// See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
			navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
		});
	}

	if ('serviceWorker' in navigator && location.protocol === 'https:') {
		navigator.serviceWorker.register('/sw.js', { scope: '/' })
		.then(function(reg) {
			console.log('sw registered', reg);
		}).catch(function(error) {
			console.log('sw registration failed with ' + error);
		});
	}

	$('video')
	.forEach(function (video) {
		video.preload = 'none';
		video.autoplay = false;
		if (video.dataset.src) {
			video.src = video.dataset.src;
		}
	});

	function wrapHeader(node, i) {
		const name = i + '-' + node.textContent.toLowerCase().trim().replace(/[^a-z]/g, '-').replace(/-+$/, '');
		const a = document.createElement('a');
		a.name = name;
		a.id = name;
		a.href = '#' + name;
		a.style.color = "inherit";
		a.innerHTML = node.innerHTML;
		node.innerHTML = '';
		node.appendChild(a);
	}

	$('article h1,h2,h3,h4,h5,h6').forEach(wrapHeader);
}());
