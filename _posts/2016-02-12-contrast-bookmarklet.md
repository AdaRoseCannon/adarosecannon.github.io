---
layout: post
title:  "Accessibility and Contrast Bookmarklet"
categories: Blog
author: Ada Rose Edwards
image: https://ada.is/images/post_resources/contrast.png
---

This is a bookmarklet to run on any page to analyse the contrast of the text on a page and highlight elements which may have readability issues.

This project was grew out of a piece of work I did for general page analysis but I thought this component was interesting enough to explore as a standalone tool as it doesn't need to use any 3rd party service to perform the analysis.

The project page is hosted on GitHub pages: <a href="https://ada.is/contrast-widget/">Contrast Widget</a>.

<span class="gallery-item" style="float: right;"><img src="/images/post_resources/contrast.png" alt="Screenshot of Contrast Widget" title="Screenshot of Contrast Widget" width="320px" /><br /><caption>Screenshot of Contrast Widget</caption></span>
<span id='a11y-contrast-replace'>The project page should be embedded here, <a href="https://ada.is/contrast-widget/">click here if it does not load automatically.</a></span>
<script src="https://cdn.rawgit.com/PM5544/scoped-polyfill/master/scoped.js"></script>

<script id="a11y-contrast-load-external-blogpost-script" type="text/javascript">
	fetch('https://ada.is/contrast-widget/')
	.then(response => response.text())
	.then(text => {
		const parent = document.getElementById('a11y-contrast-load-external-blogpost-script').parentNode;
		const importedDom = document.createRange().createContextualFragment(text);
		parent.appendChild(importedDom.querySelector('article'));
		const style = importedDom.querySelector('style');
		style.setAttribute('scoped', 'true');
		parent.appendChild(style);
		scopedPolyFill(style);
		const replace = document.getElementById('a11y-contrast-replace');
		replace.parentNode.removeChild(replace);
	});
</script>
