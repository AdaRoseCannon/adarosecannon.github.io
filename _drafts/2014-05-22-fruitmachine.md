---
layout: post
title:  "Introduction to fruitmachine"
categories: Blog
author: Ada Rose Edwards
---

### Project Goals:

Implement fruitmachine on server and client using node.

 * Support server rendered pages.
 * Use as a basis for fruitmachine helper development.
 * Work on a web component helper

To get me started I am using yeoman's Gulp webapp generator to give me a whole bunch of scaffolding. (Lazy Ada)

    install -g generator-gulp-webapp
    yo

The first step is to set up fruitmachine. Fruitmachine can use many different templating engines, I went with hogan because it's the one I like.

For a fruitmachine module you are required to define a template and a define the module in the fruitmachine engine.

```javascript
    var fruitmachine = require('fruitmachine');
    var templates = require('../templates');

    fruitmachine.define({
	    name: 'banana',
	    template: templates.banana
    });
```

Fruitmachine is extremely flexible in that it's possible to have many different configurations depending on your needs. I went with a setup in which all of the components for the fruit were kept together.

My gulp configuration then parses this folder tree and generates 3 resources:

1. A commonjs precompiled hogan template.
1. A single include which requires all of the fruit definitions. i.e. require('./banana')
1. A scss file which @imports all of the stylesheets for each module. i.e. @import "melon/style";

This folder structure can be seen [[here]](https://github.com/AdaRoseEdwards/ft-ada/tree/master/app/fruit/melon)

> A note on scss imports an eagle eyed reader would notice that automatic import of entire folders in scss is bad practise due to import order. BUT each module is namespaced so that import order no longer matters.

I through together `gulp-import-gen.js` to be used as a gulp plugin to generate these import files. It's not neatest solution but it works. This was primarily so I could avoid having to update 3 files everythime I create a new fruit module.

I also added browserify and tweaked gulp watch to watch the new directory tree and gulp gh deploy to deploy github pages.

You can view the end result at [[http://adaroseedwards.github.io/ft-ada/]](http://adaroseedwards.github.io/ft-ada/)
