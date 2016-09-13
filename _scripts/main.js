/* global $ */

'use strict';
window.$ = document.querySelectorAll.bind(document);
NodeList.prototype.__proto__ = Array.prototype;

(function () {

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js', { scope: '/' })
		.then(function(reg) {
			console.log('sw registered', reg);
		}).catch(function(error) {
			console.log('sw registration failed with ' + error);
		});
	}

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
