---
layout: "post"
title: "The Web is not Fashionable."
description: 'or: How I Learned to Love the Web.<br />  On giving vanilla web tech a go and how there is more to the web than knowing JS frameworks. Encouraging a focus on <b>Progressive Enhancement</b>'
categories: Blog
author: Ada Rose Edwards
image: https://cdn-images-1.medium.com/max/800/0*kd1ljzl6j1GAJAOv.jpg
star: 1
---

## **or: How I Learned to Love the Web**

Note: This article is written outside of my role as Developer Advocate for Samsung Internet but that is where I come from.

[An article was recently published](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.bryjt5npk) and raised an interesting problem ‘how does a front end developer learn JavaScript today?’ It’s a nuanced problem and like many nuanced issues leads to many flame wars on twitter.

What do we mean by this question and why ‘today’, how has it changed?

When I began &lt;b&gt; &lt;i&gt; &lt;center&gt; and &lt;table&gt; ruled the roost. There wasn’t a huge amount to learn.

The web has grown in complexity over the years. The web faces pressures to grow for a number of reasons:

* Trying to compete with or replace existing media platforms such as scientific literature, newspapers, books, radio, tv, mobile apps, virtual reality.
* Trying to fix where existing users of the web are not being served optimally by our existing best practises.
* As we learn more about how the web is being used we change what we do to reflect how our users do it and push for new modes of communication to assist them.
* Discovery of best practises. E.g. For performance (network and animation), accessibility and new mediums such as mobile and VR has shaped the the goals for our tooling.

The flexibility of the web and the strong cross device compatibility between browsers allows us to shape the web as we see fit through tooling, frameworks and libraries.

The the state of the native web today reflects the community’s needs of yesterday. The state of the community’s development efforts reflects the needs of today, which the web as it is often falls short on.

## **The Web is unfashionable**

*"Oh my god no, no one uses … anymore. You should try learning …, it’s 2016"*

Usually by the time the browser manufacturers & standards bodies have implemented those needs the community has moved on to solving different problems. This is not a bad thing.

The Web cannot be in fashion as by it’s nature it reflects the needs of yesterday. The solutions chosen for the **world wide** web have to work for everyone.

Web standards are like the Definitions in the Oxford English dictionary; they are rarely pulled from thin air or on a whim. They usually arise to reflect what people are already doing in the web.

A lot of thought goes into them. Then very smart people (I have met some they are pretty fucking smart, and they stand their ground) argue about why they are a terrible idea due to security/privacy/accessibility/extensibility/implementability/performance issues. Discussions go back and forth for a long period of time but eventually you get a new standard (sometimes you don’t 😞 because those issues cannot be resolved.) In the meantime browsers will try out new APIs under flags to see if they work in the real world (sometimes they disappear.)

But even if these features are still in draft or haven’t yet been implemented you can still use them using Polyfills.

Polyfills are features backported to browsers from the future to allow them to experience future APIs now on a wide range of browsers. Some examples:

* This[ getUserMedia polyfill](https://github.com/mozdevs/mediaDevices-getUserMedia-polyfill) will remove the need for prefixes and standardise all browsers on a modern promise based syntax not even some current browser versions come with.
* The[ FT’s Polyfill Service](https://polyfill.io/v2/docs/) provides a wide range of newer JavaScript language methods and some browser apis to be supplied dynamically with support back to IE7.
* They can also be used to experiment with upcoming APIs which have limited availability such as the[ WebVR polyfill](https://github.com/borismus/webvr-polyfill)

Of course not all features can be polyfilled. Language syntax features such as fat arrows ‘=>’ the exponent operator ‘**’ or the rest operator ‘…’ are very difficult to polyfill. Lower level APIs are also difficult to polyfill such as HTTP2 support or GamePad API support.

I feel there is an implicit deal in the relationship between developers and standards bodies & browsers vendors. The APIs which will be developed will be extensible and general so that the needs of yesterday do not constrain the innovation of tomorrow. With the intent that these future standards get tried in the real world behind flags and developers feed back into the standards process.

Polyfills do have performance penalties in comparison to the native APIs but I think that is okay. Progressive enhancement means that it is okay to give an experience with fewer bells and whistles on less modern platforms as long as your content still works.

Because at the end of the day content will always be king in the web.

## **How does one work in a Webby mindset**

A good website in my mind has a number of features:

* Robust on the Network
* Progressive Enhancement
* Accessible
* Responsively Designed

Semantic HTML, markup which behaves how it is written, styled simply with CSS is all of the above by default. If the network fails partway through you will still get all the content. Increased complexity can cause one to move away from semantic HTML, forcing one to reimplement these features or lose them entirely.

The worst case of this is an entirely framework-based web page showing no content when the network fails.

This unfortunately is at odds with the extensible web. One of the goals of the extensible web is to provide lower level APIs which not every developer needs to learn how to use. The community can provide libraries to make the most of the newer web features.

Each additional library or framework is another potential asset which may fail to arrive and a risk that the user receives no content.

This is where the importance of progressive enhancement comes in. If the pure HTML document that comes down from the server can provide all the content on its own then any failed assets only results in a degraded experience instead of no content what so ever.

I fear many developers today are learning the web by learning frameworks or just JavaScript when HTML itself has lots of power and usefulness. By learning HTML as deeply as learning JavaScript and CSS one can take advantage of HTML’s power to gain built-in robustness/accessibility/progressive enhancement.

By having ‘progressive enhancing assets’, js/css, which can work independently of each other you can have some features fail and the user may not even notice as the other features are still there.

This may seem like it will cause network performance issues because historically the perceived wisdom has been to bundle assets together. By making use of HTTP2 as a progressive enhancement multiple files from the same origin becomes less of an issue. You can also take advantage of the increased granularity to perform smarter cache invalidation allowing a reduced total network load so cheaper and more reliable for your users.

It is okay to use libraries and frameworks, the point of the extensible web is to allow developers to make APIs more accessible to developers or provide sensible patterns. On the other hand don’t forget to checkout what the web has already. Instead of going straight to JQuery I like to use the Polyfill service to allow me to use fetch() and some of the new DOM APIs on all browsers. Such as node.before() and node.remove()

Polyfills are biodegradable; eventually you will stop needing them. The polyfill service doesn’t even ship polyfills to browsers which do not require them.

Transpiling and preprocessing:

Transpilers are when you write your code in one language and it is compiled into another, for example es2016+ to es5 JavaScript. Or even another language such as Python or c++!!

I personally have moved away from transpilers, I write es2016+ syntax where it is supported i.e. on the server and in Service Workers. I write ES5 in the web and will do for a few more years until support improves. I still use es2016+ methods everywhere by polyfilling them with the polyfill service.

Transpilers have a lot of use in allowing one to try out language features not yet present in the browser. I do not think transpilers will ever stop being part of popular workflows. They allow reuse of modules when writing JavaScript meant to be used on both frontend and backend.

I would never argue that JavaScript is perfect but it works and is pretty approachable with a wonderful enthusiastic community. It has gained lots of language features from other languages, especially the more recent versions of ECMAScript so if you are new to the language you may find some familiar patterns.

JavaScript’s inherent flexibility makes it a great compile target so if you like writing es2016+, typescript, coffeescript, perl, python, c#, rust, Ada, lua, brainfuck or piet. I am sure there is a transpiler out there for you but JavaScipt is pretty okay too and definitely worth learning.

## **Final points, aka tl;dr**

At the end of the day content is king, make sure your content is available as widely as possible.

Build something you will find easy to support for the duration you have to support it, using the tools you find useful and your team can learn. By going closer to basic HTML/css/JavaScript you will have an easier onboarding process and in hiring can focus on good development practises rather than number of buzzwords in the CV.

Be careful not to let yourself be restrained by your tools. Choosing a very prescriptive framework may leave you locked in until the product is retired even if the framework no longer meets all your needs or stops being supported.

Best practises evolve with the platform and as we learn about our users be careful about the assumptions your tools are making. E.g.

* With HTTP2, bundling no longer gives much benefit, but bundling still has downsides we are living with today. E.g. large single page websites which need to download 2MB before a single word is displayed.
* [Icon fonts have been shown to be terrible for accessibility.](https://speakerdeck.com/ninjanails/death-to-icon-fonts)
* I have seen &lt;b&gt; &lt;i&gt; &lt;center&gt; and &lt;table&gt; go from normal usage to anathema and back again.
* I have seen the web go from semantic by default to messes of divs and classes and I am hopeful now we are seeing a swing back to semantic again. I saw some[ great talks on this at the recent view source conf.](https://www.youtube.com/watch?v=FN3g39bnSRA&index=3&list=PLo3w8EB99pqJBRZU8kUrtoznwE-yyT2Yh)

HTML has a lot of power which I don’t think is being taken advantage of. Read through MDN to checkout out what is available. You will be surprised with how widely some of the newer features are supported. The new features tend to degrade nicely and be readily accessible.

The Web has history. If you build with web technology it will stick around. We try not to break the web even if it means the mistakes and bad decisions we have made in the past (and will make in the future) get set in stone.

Give vanilla web ago. It’s not fashionable but it works[.](http://www.warnerbros.com/archive/spacejam/movie/jam.htm)
