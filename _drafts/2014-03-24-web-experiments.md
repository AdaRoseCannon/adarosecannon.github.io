---
layout: post
title:  "Experiments in web tech"
categories: Blog
author: Ada Rose Edwards
---

This project has been cancelled. After some work I realised I was
reimplemeting ftlabs's fruitmachine.
The next post will be an introduction to fruitmachine and some useful helpers.
I will look into creating a web-component fruitmachine helper. 

This project explores progressive enhancement, web components, spdy and a few other bits and bobs.

[[LINK]](https://github.com/AdaRoseEdwards/spdyproject)

Key goals of this project:

 * Fast initial load, slow start -> low conversion - complete
 * Progressive enhancement - incomplete 80%?
 * Accessibilty (Aria support especially) - not begun
 * Dabble with moongoose and a few other bits and bobs.

### Progressive Enhancement

Initial load is just normal html and css. Images and fonts are pushed by spdy with the css so that their are fewer requests before the page can render.

At this point the website should work fully, using forms and normal html4.0

Javascript is then run to bind to buttons for a pleasant interface experience

The polymer platform and compiled hogan templates are used to generate web components.

### Use of web components and hogan

The Hogan templates are written such that is compiled with a usePolymer flag will generate neat and lovely dom using web components.

Using hulk these templates are compiled to a javascript file which is included in the client side javascript via commonjs. 

In [components](https://github.com/AdaRoseEdwards/spdyproject/tree/master/app/javascript/modules/components) these templates are turned into web components and javascript is bound to them.

From then on any dom recieved from the server can be requested as web components or they can be rendered straight from the hogan files with data from the servers rest api.

This has the nice result that all the components can be shared between the client and server with no template duplication and DOM can be rendered on client or server as either standard DOM or as WebComponents depending on the platform. 

### Spdy

There is not much to say about spdy, using the existing modules it is easy to use and the code should be pretty self explanitory. What is quite interesting though is the path the route takes in express.

[app.js](https://github.com/AdaRoseEdwards/spdyproject/tree/master/app.js)

 * Sets up server

[./lib/server](https://github.com/AdaRoseEdwards/spdyproject/tree/master/lib/server/index.js)

 * Route through the app
 * Set up static routes

[./lib/server/templateData.js](https://github.com/AdaRoseEdwards/spdyproject/tree/master/lib/server/templateData.js)

 * Set the render function to handle returning either html or json
 * Set cache control headers
 * Set the template variables and add the rendering functions
 * Handle spdy pushing
 * Handle forcing of JSON or webcomponents,
  * A cookie of JSON=1 will return all template data as JSON useful for debugging.
  * A cookie of polymer=1 will always render web component templates and will load the polymer platform and generate web components in a blocking fashion, useful for experimenting with polymer.

[./lib/rest](https://github.com/AdaRoseEdwards/spdyproject/tree/master/lib/rest/index.js)

 * rest api functionality these get loaded dynamically by parsing the requested url

[./lib/server/defaultHandler](https://github.com/AdaRoseEdwards/spdyproject/tree/master/lib/server/defaultHandler.js)

 * Handle dynamic routes, load pages from routes in a similar fashion to the way rest loads.

### Todo

 * A11y - Add aria to views - Enhance design
 * Service worker - use the polyfill for now. Have this as a progressive enhancement.
 * Clean up code finish writing components for basic functionality.