---
layout: post
title: "Yet another blog about the state and future of Progressive Web App"
description: <b>Progressive Web Apps</b> are in flux at the moment, these are the opinions of someone who has been working on web apps before they got conflated with <b>Service Workers</b> and new web tech.
categories: Blog
author: Ada Rose Cannon
star: 1
---

Progressive Web Apps are in flux at the moment, these are the opinions of someone who has been working on web apps before they got conflated with Service Workers and new web tech.

## Other people's recent thoughts on the issues I will also talk on

* [Regression toward being mean - Jeremy Keith](https://adactio.com/journal/10736)
* [State of the Gap by Remy Sharp](https://remysharp.com/2016/05/28/state-of-the-gap)

## Before I begin,

I will be referring to work done at the Financial Times but my views do not represent the opinions of my employer the Financial Times.

## Some History and Background

iOS introduced install to homescreen in iOS 2.1 (September 2008), at it's core functionality this was [not much more than a glorified bookmark](http://gizmodo.com/5072967/iphone-secret-web-apps-can-mimic-real-apps). There is some slightly different behaviour developers may need to be aware of but nothing of note but this was enough introduce the concept of a web app. You declared your installed app configuration in the head of the page with meta tags. (icons etc)

In Chrome 31 (November 2013) Chrome for Android Introduced this functionality.

In Chrome 38 (October 2014) Web App manifest support in Chrome, this is a JSON file which describes the installed app configuration of your Web App.

In Chrome 40 (December 2014) Service Workers started to be rolled out across Firefox and Chrome, nothing on Safari at the time of writing.

So, Web Apps have been around since 2008 using older Web Technology and in the 7 years between that time and when Service workers became mainstream they have been around but not as a large part of the community consciousness. It was around the time Service Workers started to be 'a thing' that the Chrome team started to push for *Progressive Web Apps*.

*Progressive Web Apps* is not a spec, it started as a definition of what a _modern_ Web App should be. Chrome uses this definition so when a number of conditions are fulfilled an install prompt in the browser is displayed. The conditions are:

* has a service worker (requires https)
* has a web app manifest (with at least minimal config)
* it is the second distinct visit to the web site.

In this case progressive means it progressively becomes more app-like the more features the device supports.

The prompt is currently shown under varying conditions across Opera, Chrome and the Samsung Browser.

## Features of a Web App

Over the past 5 years the features of what makes a good Web App have largely been nailed down:

* On the open web, can be reached via any browser.
* Offline capable, shows useful content when the network cannot be reached.
* Responsive, works on desktop and mobile.
* Good touch and gesture support.
* Installable, provides a homescreen icon.
* Accessible
* Progressive - in that it still works as a normal website on older browsers

[What exactly is an app? - by FTLabs](http://labs.ft.com/2012/06/what-exactly-is-an-app/)

These features aren't entirely inline with what Chrome defines as a Progressive Web App.

## Ease of install for add to homescreen

One of the problems Web Apps have is that users don't know to look for the 'add to homescreen' menu item unless explicitly directed by the Web Page.
If your web app meets Chrome's requirements of a 'Progressive Web App' The install banner prompt is displayed to get around this, it is not a spec, it is implemented at the browser developer's discretion. In the case of Chrome it encourages web app developers to build using newer Web Technology such as Service Workers and Web App manifest.
It is great because it encourages the building of Web Apps as opposed to native by greatly reducing the barrier to getting your company's app on the user's home screen.

The issue I have with this is that the basis for what Chrome defines as a Web App is based upon a set of technology rather than a set of features. e.g. It judges based on Service Worker as opposed to whether an web app can provide useful data when offline.

>> You do not need a Service Worker to be offline and conversely not every site with a Service Worker works well offline.

The features I listed in the section above aren't exclusive to these new technology Google requires to be defined as a 'Progressive Web App' though, the [FT web app](https://app.ft.com) has been doing offline and installability this with flair since 2012. It supports older platforms and was even on old Android devices via a thin wrapper. If you see an iPhone user with the FT App on the phone they will have installed it via 'add to homescreen'. We are not in the app store.

A Service Worker is very powerful but is not applicable to everyone, many commercial applications need to support platforms which do not support the newer Web App related technology, such as iOS Safari or Android 2.3

This means that in order to work offline with this constraint you need to use an AppCache Manifest, the AppCache manifest is a horrible thing to develop with but it has extremely wide support.

<div class="notebene">
<p>If you are building a web site today and are wondering if you should use AppCache over Service workers to increase offline support. Don't. Although the Service Worker will play nicely with an AppCache being present by taking control if one is there. AppCache forces you to do horrendous things with your page navigation to work correctly.</p>
<p>When the FT was working with AppCache we served a minimal bootstrap via AppCache and the rest was loaded from Local Storage or IndexedDB due to the difficulty in dealing with it.</p>
<p>If you already have an app with AppCache which works but want to progress to a Service Worker then you can use <a href="https://github.com/GoogleChrome/sw-helpers">sw-appcache-behavior</a></p></div>

Because the browser sniffs technology rather than user experience I don't think the browser should determine whether something is app-like or not.
I feel that the prompt to add to homescreen should be something a web site requests the browser to show and not something it sniffs out itself. Perhaps by lowering the bar and only requiring a Web App manifest and a number of distinct visits.
Of course it is not a spec and it is entirely Chrome's decision to add the banner in the first place, without there would be no prompt at all.

It feels to me Google's Chrome team put the prompt there as a carrot to encourage a good user experience through the sniffing of the technology used. I feel a more precise carrot would be for their popular search engine to perhaps to improve search rankings based upon the content provided between online and offline. Thus encouraging wider offline support. It could also flag up Progressive Web Apps in the search results via judging how app-like the web site is using it's own metrics such as the user experience metrics from [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).

But it has raised the question should browsers themselves do more to promote Web Apps.

## In our rush to feel native we shouldn't lose our Webiness

>> URL sharing is the proto-social behavior. It’s what enabled the web to spread and prosper, and it’s something we take for granted. In fact, if you look at any of my talks, you’ll see that I call it out as the web’s superpower.
>>
>> -- [Alex Russell](https://infrequently.org/2016/05/not-the-post-i-wanted-to-be-writing/)

One of the core principles of the Web is URLs and Progressive Web Apps since their inception in 2011 have given developers the *choice* of hiding them. This prevents user's from easily sharing deep links into web apps.

In the web developer community's collective drive to be more App Like and compete with native apps we may lose or weaken some of the web's strongest features and we need to consider carefully before we throw away URLs or the entire browser chrome in an effort to look like and behave like the cool kids of native.

It's now very easy to shoot oneself in the foot with a web app by preventing the user from finding the URL to share your content. Users expect a web site to have a URL which will work from anywhere but they expect a native app to _not_ have one. By not differentiating ourselves from native apps enough they won't try to share our content.

Perhaps this sacrifice is too great if you are relying on word of mouth/tweet to get yourself known.

I've seen it asked repeatedly should we build an App Store for Web Apps, and I think that is missing one of the key aspects of the web. The ability to share content with a URL and make content available via search engines and social media.

Recently Google unveiled Android Instant Apps which are trying to emulate the behaviour of the web native Android by linking native apps to web URLs. Such an endeavour shows us that URLs are on the right track and we shouldn't be so fast throw them away. If many native developers take advantage of this then perhaps the user interactions to reveal a sharing url on mobile may come out of the native sector as they strive to make their own content sharable via URLs.

## tl;dr

* Web Apps have been around for a relatively long time.
* The install banner is the browser manufacturers choice. It is not a spec. Should it be?
* In our rush to be native-like to be cool and popular we shouldn't stop being web-like.

<span class="gallery-item" style="float: right;">
<img src="https://ada.is/progressive-web-apps-talk/images/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg" alt="The FT Web App on a Balloon." title="The FT Web App on a Balloon." />The FT Web App on a Balloon.
</span>
