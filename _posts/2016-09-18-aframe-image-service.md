---
layout: post
title: "Optimising A-Frame Assets for Faster Starts"
description: "How to use an image optimisation service for providing images which download faster and are optimised for WebGL."
category: Blog
author: Ada Rose Cannon
preview: /images/medium/aframe-optimised.webp
inline_hero: true
---

> Originally published at [medium.com](https://medium.com/samsung-internet-dev/optimising-a-frame-assets-for-faster-starts-4ec3bd35c6fc)

tl;dr Check out the [imageOptim web service](https://imageoptim.com/api) for providing images which download faster and are optimised for WebGL. The APIs for this are detailed below.

Demo: [https://jsbin.com/fugatar/edit?html,output](https://jsbin.com/fugatar/edit?html,output)

![Image optimised by the image optimisation service](/images/medium/aframe-optimised.webp)

On the web users are impatient, they will leave a mobile site if it does not load in only a few seconds. It is important to decrease the download size of assets so that pages load quickly. This applies just as much if your scene is a VR scene in A-Frame.

### Optimising Images for A-Frame Textures

Here I am going to focus on image assets. Image Assets for textures can be both very large but also offer the greatest chance for improvement.

By providing assets which are optimised for the web you can greatly decrease the time to download the asset. There are tools such as imageOptim for greatly decreasing the byte size of the image whilst preserving much of the quality.

Another optimisation is providing correctly sized assets.

One requirement of WebGL assets is that their dimensions are a power of two. (256, 512, 1024, 2048, 4096, etc...) pixels per edge. THREE.js, and A-Frame by extension, will handle this for you by using the next power of two size up but it is not optimal.

![Warning when image size is not a power of two.](/images/medium/aframe-power-warning.webp)

In the case above my image was almost doubled in memory size (1.86x) but no extra information was added. By having images correctly sized from the start they can optimally be used in memory.

It may seem difficult to always produce assets at particular sizes and maintaining appearance but fortunately preserving the aspect ratio for images in 3D scenes is not a priority. This is because the graphics cards treat all images as if they were a 1x1 unit square — it ignores the aspect ratio of the image.

![Two Images, the top is how the image is used in the browser. The bottom is it represented in UV space where aspect ratio is discarded.](/images/medium/aframe-uv-space.webp)

### Automating this on the fly with ImageOptim Service

Fortunately [Kornel Lesinski's](https://twitter.com/kornelski) amazing imageOptim service takes care of both ensuring images are power of two and optimising filesize/quality.

Kornel is a genius when it comes to image optimisation and his tools and service have the best quality/size I have seen.

Here is an example of using the image service to pull in an optimised asset with the correct size.

```
BEFORE:
https://cdn.rawgit.com/AdaRoseCannon/adarosecannon.github.io/master/images/SAM_100_0122.jpg
6.44MB 7200x3600

AFTER:
https://img.gs/bbdkhfbzkk/4096x2048,stretch/https://cdn.rawgit.com/AdaRoseCannon/adarosecannon.github.io/master/images/SAM_100_0122.jpg
0.77MB 4096x2048
```

[Demo (https://jsbin.com/fugatar/edit?html,output)](https://jsbin.com/fugatar/edit?html,output)

This greatly improves the loading time of the scene!!

### API Details

```
https://img.gs/[api-key]/[options]/[url]
```

API keys are currently free so you can get one from [the imageOptim website](https://imageoptim.com/api).

I have used here: '4096x2048' to fix the aspect to the nearest lower power of two. i.e. 7200x3600 => 4096x2048

I used 'stretch' because by default the image service will try to maintain aspect ratio and we want to force it to have a power of two dimension on each side.

Textures that are visible from close distance (or used for precise things like height maps) may need quality=high to preserve fine details; at the expense of a larger file size.

The image service also adds CORS headers [so that you can use them in WebGL](https://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/). It is easy to use, just add `https://img.gs/[your api key]/[options]/` before the URL and add `crossorigin="anonymous"` as a HTML attribute. E.g.

```html
<a-assets>
  <img id="sky" src="https://img.gs/bbdkhfbzkk/4096x2048,stretch/https://cdn.rawgit.com/AdaRoseCannon/adarosecannon.github.io/master/images/SAM_100_0122.jpg" crossorigin="anonymous" />
</a-assets>
```

### Further Reading: Optimising Geometry Data

Sometimes that model you really want is very large. Terence Eden has written an article on optimising very fine Geometry and shows how to reduce a statue from 230MB to 1MB!

[https://shkspr.mobi/blog/2016/08/reducing-the-filesize-of-complex-3d-obj-models/](https://shkspr.mobi/blog/2016/08/reducing-the-filesize-of-complex-3d-obj-models/)

### Thanks

Thank you [Kornel](https://twitter.com/kornelski) for adding the CORS headers and the 'stretch' option to your image service — it will make scenes so much faster to load!

Thank you Peter for reviewing.
