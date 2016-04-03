---
layout: post
title:  "Sci-Fi swords and Progressive Web Apps"
categories: Blog
author: Ada Rose Edwards
image: https://ada.is/images/post_resources/photo.jpg
---

A major Science Fiction blockbuster, in a Franchise I am a big fan of, hit cinemas a short while ago.
In a furore of brand fan-girl-ism and being unable to afford to buy a Force-Effect lightsabre of my own, I did what any reasonable developer would do and I built my own.
This was a quick one afternoon project and I wanted to break down what went into it.

><img src="/images/post_resources/photo.jpg" alt="Photo of the app on my phone" style="float: right;" title="Photo of the app on my phone" width="270px" />
>
> End result: [https://gh.ada.is/starsword/](https://gh.ada.is/starsword/) - Open on your phone, put up the volume, turn it on, wave it around.
>
> Source code: [https://github.com/AdaRoseEdwards/starsword](https://github.com/AdaRoseEdwards/starsword)
>
> <span class="clearfix"></span>

This post has two main parts depending on what you are most interested in: ['Building the Sound Effect Demo'](#demo) or ['Building a progressive webapp'](#webapp)

## APIs used in the project

* Motion Events API - to detect the user waving the device around.
* Web Audio API - Make the noises
* Service Worker - Make it work offline

<h2 id="demo">Building the demo.</h2>

First I began with the audio. I bought the audio files for lightsabre sound effects: on, off and the idle hum and the collision sound. Using Audacity I cut and mixed them to make them loop and crossface nicely.

To play the sounds first one must [load the audio files into the audio context,](https://github.com/AdaRoseEdwards/starsword/blob/master/app/_scripts/main.js#L8) I used a small library for to load the audio files and create audio buffers for later use. These audio buffers can be used again.

Now we have the audio files loaded into the browser I made a class, [a StarSword class, to handle the creation of audio sources,](https://github.com/AdaRoseEdwards/starsword/blob/master/app/_scripts/main.js#L80), in the WebAudio API sources are made to be use *once* then thrown away, they can be made loop but once they are stopped they cannot be played again. So to play a sound a second time one needs to create another audio source. This class handles the creation and garbage collection of the audio sources.

Once I had the demo playing the open, close and hum sounds I wanted to add motion detection for satisfying swooshiness. To [detect the device motion](https://github.com/AdaRoseEdwards/starsword/blob/master/app/_scripts/main.js#L140) I used the deviceMotion event. This fires events many times a second giving the devices current acceleration. Unfortunately to achieve the satisfying Doppler effect of the hum we need to approximate the velocity of the device. As you can probably remember from calculus to get the velocity we need to integrate the acceleration, to do this I sum the acceleraion per unit time. Unfortunately this is very inaccurate and quickly drifts away from 0, so to achieve this I constantly have it decay back to 0 using the half life decay equation.

To alter the pitch of the hum all I need to do is alter the play back speed of the sample, like playing a vinyl record at the incorrect speed. To increase the speed I set it to a number greater than 1 and to decrease the speed I set it to a number between 0 and 1.

I wanted to increase the pitch as the speed increased and at a standstill I wanted it to be 1. So made it exponential `playback speed = k`<sup>`2`</sup> where k is a constant. I chose 1.2 because it sounded the best.

To [detect sudden impacts and trigger the 'smash' sound effect](https://github.com/AdaRoseEdwards/starsword/blob/master/app/_scripts/main.js#L164) I worked out if the size of the acceleration vector was too large, usually caused by a sudden stop or impact, then I trigger a smash sound effect.

Also required are some hacks to deal with iOS quirks. Alas I don't own an iOS device so I am relying on stack overflow and write ups to get it working on that platform.

> > What was nice about working on the web was that I built my app using just my own device and it worked on most other android phones, a friend tried it on iOS but it needed a [couple of workarounds](https://github.com/AdaRoseEdwards/starsword/blob/master/app/_scripts/main.js#L46), such as webkit prefixing the Web Audio Context which only took a few minutes of research and implementing.
> >
> > Building an app for the web allowed me to build a cross platform app without the need for app stores in only an afternoon.

Once I had the JavaScript demo working I quickly knocked together [a bit of CSS](https://github.com/AdaRoseEdwards/starsword/blob/master/app/styles/main.css) to make it look pretty. I also put together [a small css hack](https://github.com/AdaRoseEdwards/starsword/blob/master/app/styles/main.css#L97) so that the handle always lies along the long axis of the device.

<h2 id='webapp'>Making a Progressive WebApp.</h2>

To make a progressive Web App there are [some requirements](https://developers.google.com/web/progressive-web-apps), the most important:

1. A Service Worker, gives offline support and push notifications. (I don't use push notifications here)
1. A manifest, describes to web browser what properties the App has.
1. A responsive website which fits to the screen.

### Service worker

For a simple web app like this instead of writing everything from scratch sw-toolbox probably has everything you need. The library sw-toolbox abstracts away a lot of routing logic often used on websites/web apps.

For most web apps you want the service worker to perform two tasks:

1. Cache/Precache your assets.
1. Supply cached assets in the event of network failure.

```javascript

'use strict';

// adds the toolbox object to the worker scope
importScripts('vendor/sw-toolbox.js');

toolbox.precache([
	'/index.html',
	'/audio/hum.wav',
	'/audio/off.wav',
	'/audio/on.wav',
	'/audio/smash.wav',
	'/scripts/main.js',
	'/styles/main.css'
]);

// Next we set a route to use cached assets in case of network failure:

// Fetch events should select from the cache or network which ever fulfils fastest.
// Update the cache after fetch.
toolbox.router.default = toolbox.fastest;

```

## Web App manifest file

[Manifest on Mozilla Developer Network (MDN)](https://developer.mozilla.org/en-US/docs/Web/Manifest)

<span class="gallery-item"><img src="/images/post_resources/Screenshot_2016-02-02-16-23-37-01.jpeg" alt="Add to Home screen" title="Add to Home screen" width="270px" /></span>

Now we're offline enabled we can use a manifest file to specify to the browser this is a web app, we can use this to hide the browser chrome once installed such as the address bar. We will also define the home screen icons and title. The Chrome browser may also prompt to the user to install the web app if not their first visit.
Otherwise they can install the app to their phone by selecting 'Add to Home screen' from the web browser's menu.

A neat trick is using the manifest to have the 'start_url' include an unused query parameter e.g. `?standalone` this will allow us to detect installed app usage in ones analytics.

## Benefits of a Web App

The new web app browser features allow a developer to build a cross-platform app in a single afternoon and distribute it without the need for app stores.

By bypassing the app store and getting the user to install the 'webapp app' straight from the website you will maintain the user's attention and increase app installs.
