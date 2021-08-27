---
layout: post
title: "Multiple Language Installable Web Apps using a single Manifest File"
description: "Multiple Language Installable Web Apps using a single Manifest File"
category: Blog
author: Ada Rose Cannon
star: 1
---


Many Websites provide multiple language variations allowing users to comfortably use the site without relying on machine translation. When…

Many Websites provide multiple language variations allowing users to comfortably use the site without relying on machine translation. When you making this website into a Progressive Web App you have a choice to make:
> # Do you have a single PWA for all languages or do you make a PWA on a per language basis?

It’s easy to mistakenly apply the restrictions of Apps to PWAs, due to the additonal cost and work required in submitting your native app to app-stores many companies provide a single app which can be configured from the inside.

The Web is a lot simpler you can sub-divide your site into as many progressive Web Apps as you want. Each Web App manifest you make becomes a new Web App. So making a Web App for each language has the advantage of being localised into the user’s language when installed on their homescreen!


<div><figure>
<img src="https://cdn-images-1.medium.com/max/3552/1*6P1SQ449OX3qbbbBDwT0NA.png" width="1316" height="351" alt="An app with a purple icon with a shield, called “Security and Privacy Wizard” translated into multiple languages.">
<figcaption>An app with a purple icon with a shield, called “Security and Privacy Wizard” translated into multiple languages.</figcaption>
</figure></div>

You can set the `start_url` to be the language specific version i.e. `/en/` , `/fr/` , `/kr/` but have the app scope set above it to `/` so even when the user changes their language it is still associated with the installed progressive web app.

### A shortcut using a single manifest file

The technique I am going to talk about in this article is an interesting hack for providing language specific versions of a manifest file using a single manifest file as a template to generate the localised versions.

It works by embedding the manifest file itself as a URL encoded `<link>` tag on each page. This lets you take advantage of your templating system to automatically populate the Web App Manifest so everytime you add a new translation you automatically get a new Web App!

This technique is especially useful on static site generators like Jekyll where each file gets transformed into a single other file preventing you from automatically generating multiple manifest files.
> # In short the technique is to populate the language specific Web App Manifest, url-encode it and have it linked in the head directly.

To make this work in Jekyll the `{{ content }}` of the page is the manifest.json code and the page’s text content is assembled by parsing and inserting the page content into the final document using Jekyll loops. Encoding and embedding the Manifest JSON is this one line in the head of the page:

```javascript
<link *rel*="manifest" *href*="data:application/manifest+json,{{ content | strip_html | uri_escape }}">
```

I came up with this technique when working on the Samsung Internet Security and Privacy wizard which has multiple language translations, where each language is stored in a separate folder in the site:

You can view the source code for the project here:
[**wizard/index.html at main · SamsungInternet/wizard**
*Security Wizard for securing Samsung Internet. Contribute to SamsungInternet/wizard development by creating an account…* github.com](https://github.com/SamsungInternet/wizard/blob/main/_layouts/index.html)

### Making it work in Jekyll

In Jekyll you can’t `{% include %}` a file and then perform transforms onto it. So by including it as the body content you can then access it via `{{ content }}` which does mean you need to find some other method for loading your actual content. Fortunately our site is a little complex and built each Single Page App out of an entire folder of pages so this was already the case.

This does raise two issues which need to be fixed before it can work.

**Smart Quotes,** are where the pre-processor replaces simple quotes like these `"hello world"` with fancy quotes “…”, this looks great in prose. Since it is trying to parse the JSON like a document it replaces the simple quotes with the fancy quotes. Which is invalid JSON and cannot be parsed by the browsers.

To fix this you need to configure Jekyll to ignore quotes with the following configuration setting in your `_config.yml`:

```javascript
kramdown:
    smart_quotes: ["apos", "apos", "quot", "quot"]
```

**Relative URLs,** Web App Manifests link to many resources such as icons and the start location for your app. Most developers use relative URLs to do this. The advantage here is that you can change the domain and things still work, great for testing and alternate environments.

These URLs are parsed relative to the location of the manifest URL. If the manifest is a data URL then there are no relative locations. So what you must do is use absolute URLs for every URL in the manifest such as icons or the `start_url`.

**https:**, The Absolute URL tool was how I solved the relative URL problem which unfortunately uses “http:” urls by default. PWAs need to be on https: so I had to replace the http with https in Jekyll syntax to get it working.
[**wizard/manifest.json at main · SamsungInternet/wizard**
*Security Wizard for securing Samsung Internet. Contribute to SamsungInternet/wizard development by creating an account…* github.com](https://github.com/SamsungInternet/wizard/blob/main/_includes/manifest.json#L18)

### The Downsides

Aside from the edge cases listed above there are some downsides. This is a hacky solution to the lack of internationalisation support in Web App manifests. Many tools that work with Progressive Web Apps are not expecting a data URL but a link to a real file. For example the incredibly useful tool [PWABuilder](https://www.pwabuilder.com/) wasn’t able to parse manifests stored this way but amazingly they had a fix ready in a few hours!

In addition there maybe some future problems which could arise.
> # The manifest URL changes if you change the data.

This may seem like an obvious consequence of storing all the data in the URL but it has a surprising side effect.

Some browsers are planning to scan for changes in the manifest and update the install Web App for things like Web Share shortcuts. They would do this by reloading the manifest from the URL. Because it’s a data URL this manifest will never be able to be changed or deleted it will always be valid and static. So the installed Web App will never be able to change unless the user reinstalls the app.

The other main downside is bloat, every page load includes the full Web App manifest every time, in the head of the document, even if the app is installed. Although the size is not huge because it’s in the `<head>` of the HTML file it will need to be loaded before the page can start rendering the page content in the `<body>` .

### Using it in the wild

You can test it yourself in your browser of choice at [privacy.samsunginter.net](https://privacy.samsunginter.net)
[**Security and Privacy Wizard**
*This guide will help you browse the web securely when you use the Samsung Internet web browser for Android. The tips…* privacy.samsunginter.net](https://privacy.samsunginter.net)

✓ The Web Site correctly gets identified as a PWA and an ambient badge gets shown

✓When I install the app Samsung Internet is able to generate an APK file and install it with the correct name and icons

✓ The `start_url` is handled correctly, I can install the Korean version, instead of the default English version, and that is what opens when I click on the installed app

✓ The `scope` is handled correctly, if I am on another language the URL icon is present to open the page in the installed PWA.


<blockquote class="twitter-tweet" data-conversation="none" data-align="center" data-dnt="true"><p> — <a href="https://twitter.com/AdaRoseCannon/status/1414584453234626561">@AdaRoseCannon</a></p></blockquote>


### Other potential use cases

Make every page it’s own PWA!

This technique applies to any site where your user will want to start on a unique particular page every time. For example if you were a travel app you could let the user install it as an app for only their bus stop only. SO when they start your app from cold it goes straight to the page they installed it from.

### Better alternative solutions

A lot of the downsides can be circumvented by generating a Web App manifest on the fly. If your app is running on a Web Server this can be almost trivial to set up depending on the framework you use.

This would make the final HTML a lot neater and mean that your Web App manifest can have a real manifest that you can update if you need to make changes.

When I started making my App I chose to have it statically generated using GitHub pages because it’s inexpensive with minimal maintenance requirements. This forced me to come up with this creative solution which works surprisingly well.

—

I hope this article gave you some interesting ideas about what you can do with Web App manifests.

[Canonical Link](https://medium.com/samsung-internet-dev/multiple-language-installable-web-apps-using-a-single-manifest-file-f246cd782eef)
