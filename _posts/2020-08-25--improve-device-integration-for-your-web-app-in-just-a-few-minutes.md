---
layout: post
title: "Improve device integration for your Web App in just a few minutes"
description: "This was a feature I had set aside an afternoon to implement but in the end it only needed a moment and made the experience significantly better."
category: Blog
author: Ada Rose Cannon
star: 1
---

# Improve device integration for your Web App in just a few minutes

Improve device integration for your Web App in just a few minutes

### Make your app a Web Share Target to enable

This was a feature I had set aside an afternoon to implement but in the end it only needed a moment and made the experience significantly better.

Web Share Target allows your Web App to receive URLs from the operating systems just like native apps do.

In the video below I use the share button in Samsung Internet to share the website’s URL with my Web App, which then retrieves and displays the associated feed information from the website.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/IfOkuPSdUvg" frameborder="0" allowfullscreen></iframe></center>

You add a Web Share target by adding the information into the Web App Manifest:

```javascript

 "share_target": {
   "action": "/feed/",
   "method": "GET",
   "params": {
     "title": "title",
     "text": "text",
     "url": "url"
   }
 },
```

When it’s shared, it will open your WebApp at the following URL /feed/?url=[share url]&text=[share text]&title=[share title]. Not all of these get filled out, depending on what is being shared and what is sharing it.

When sharing web pages to the app sometimes, the URL was in the text field rather than the URL field. So if you are expecting a URL you should probably check there as well.

```javascript

const { search } = new URL(req.url, "[http://example.com](http://example.com)");
const params = new URLSearchParams(search);

const sharedURL =
  params.get("url") ||
  params.get("text");
```

There are more options you can add to the share_target, for advanced features like sharing files, you can find out more information in the great article on web.dev:
[**Receiving shared data with the Web Share Target API**
*On a mobile device, sharing should be as simple as clicking the Share button, choosing an app, then choosing who to…*web.dev](https://web.dev/web-share-target/)

*Note*: At this writing, the Web Share Target API is implemented in some browsers (notably Chromium-based browsers like Samsung Internet) but it is still considered experimental and in “incubation” [within the W3C](https://w3c.github.io/web-share-target/). Make sure you take this into account when incorporating Web Share Target into your development plans.



By Ada Rose Cannon on August 25, 2020.

[Canonical link](https://medium.com/samsung-internet-dev/improve-device-integration-for-your-web-app-in-just-a-few-minutes-cca413c4f0f)
