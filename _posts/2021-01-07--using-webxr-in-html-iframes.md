---
layout: post
title: "Using WebXR in HTML IFrames"
description: "IFrames are really useful for WebXR. Often WebXR web pages are large with a lot of code and many 3D frameworks default to taking up all the available space on the page. IFrames solve these issues by letting you put all the XR code into another webpage, which can even be on a different domain, they also let you choose exactly how much space they take up on the page and can be used with Flexbox and CSS Grid."
category: Blog
author: Ada Rose Cannon
star: 1
---

# Using WebXR in HTML IFrames

Using WebXR in HTML IFrames

### It’s really useful but there are a few pitfalls to avoid.

IFrames are really useful for WebXR. Often WebXR web pages are large with a lot of code and many 3D frameworks default to taking up all the available space on the page. IFrames solve these issues by letting you put all the XR code into another webpage, which can even be on a different domain, they also let you choose exactly how much space they take up on the page and can be used with Flexbox and CSS Grid.

There are some very important things to be aware of before you can get it working though:

* iFrame source needs to use [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (https://)

* The parent page also needs to use secure context

* The iframe needs to have allow=”xr-spatial-tracking” as a property

Example code:

```html
<iframe src="[https://ada.is/DSC-WOW-Demo/](https://ada.is/DSC-WOW-Demo/)" name="iframe" frameborder="0" allow="xr-spatial-tracking" allowfullscreen=""></iframe>

<ul>
    <li><a target="iframe" href="[https://ada.is/DSC-WOW-Demo/](https://ada.is/DSC-WOW-Demo/)">Cactus Demo</a></li>
    <li><a target="iframe" href="[https://ada.is/basketball-demo/](https://ada.is/basketball-demo/)">Basketball Demo</a></li>
    <li><a target="iframe" href="[https://ada.is/xrgarden/](https://ada.is/xrgarden/)">Fish Demo</a></li>
</ul>
```

This simple demo has an iFrame with 3 links which change the URL of the iFrame. Each link works with WebXR provided the page is hosted on https:
[**WebXR IFrame Demo!**
fold-me.glitch.me](https://fold-me.glitch.me/)

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is really useful for having a web page with a lot of demos on it. Using links with target=&quot;iframe&quot; to switch between them. <a href="https://t.co/35pEqzP2Ko">pic.twitter.com/35pEqzP2Ko</a></p>&mdash; Ada Rose Cannon (@Lady_Ada_King) <a href="https://twitter.com/Lady_Ada_King/status/1347152755530596354?ref_src=twsrc%5Etfw">January 7, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Try it today in the [Samsung Internet Beta on Android!](https://play.google.com/store/apps/details?id=com.sec.android.app.sbrowser.beta&hl=en_GB&gl=US)

Hope this helps!

By Ada Rose Cannon on January 7, 2021.

[Canonical link](https://medium.com/samsung-internet-dev/using-webxr-in-html-iframes-629c248ff96d)
