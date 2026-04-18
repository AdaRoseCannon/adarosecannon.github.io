---
layout: post
title: "Wow that was some night in VR!"
description: "At the recent LDNWebPerf I had the entire audience sharing the same Virtual Reality experience, able to see each other looking around in virtual space."
category: Blog
author: Ada Rose Cannon
preview: /images/medium/vr-night-photo.webp
inline_hero: true
---

> Originally published at [medium.com](https://medium.com/samsung-internet-dev/wow-that-was-some-night-in-vr-ba091be38794)

Last night I gave a talk on Virtual Reality in Virtual Reality at [London Web Performance](https://ldnwebperf.org/). LDNWebPerf is a monthly talk hosted at the Financial Times in London.

The talk was recorded so if you missed it don't worry.

![Photo by LDNWebPerf's Perry](/images/medium/vr-night-photo.webp)

100 people sharing the same VR experience powered by A-Frame and Web Sockets. We managed to get the whole audience connected simultaneously and they could see each other looking around in the virtual space.

## Video and Notes

The whole talk was recorded. Here are my talk notes and a video of the event.

Of course you can't experience the magic of sharing a VR experience with the 100 other audience members but it was pretty incredible.

- [Video: Getting started with Virtual Reality in the Web](https://ldnwebperf.org/sessions/getting-started-with-virtual-reality-in-the-web/)
- [Talk Notes: Introducing A-Frame](https://medium.com/samsung-internet-dev/ldnwebperf-talk-notes-6120d6e8e58c)

## How did I do it?

Feel free to fork the repo for a future project if you want: [AdaRoseCannon/metaverse](https://github.com/AdaRoseCannon/metaverse)

The main message of my talk last night was that A-Frame enables one to author a VR scene exactly like one would with HTML.

I marked up a simple studio from A-Frame components with a stage and a place for the audience to go.

The HTML file which contains the scene: [static/index.html](https://github.com/AdaRoseCannon/metaverse/blob/c5059a08561083d218182de0b0d15f61ea3ac871/static/index.html#L49)

When I would introduce new content, the server would message every client using websockets. The client would then update the innerHTML of the entity: [scripts/slides.es6](https://github.com/AdaRoseCannon/metaverse/blob/c5059a08561083d218182de0b0d15f61ea3ac871/static/scripts/slides.es6#L20)

That is all that is required to add some new content.

## Syncing Users

This was a little more complex because I wanted to ensure that the server could handle unexpected loads.

In order to minimise overhead the server deals only in byte data and does no parsing, it just stores it on each websocket object.

60x per second the server concatenates all the raw byte data and sends it down to every client.

The clients then parse the raw byte data to update the position and rotation of each avatar with matching IDs to the chunks of data.

If there is an ID without a corresponding Avatar we make a new DOM node and use appendChild to add it to the `#avatar-container`.

If any avatars have not been updated then using `.removeChild` we remove the avatar from the scene.

There is some redundancy in the data format, allowing me to store some additional data for future use:

```
4 bytes  - ID
12 bytes - Position
12 bytes - Rotation
4 bytes  - Misc
```

## Final Thoughts

The night was a huge success! The audience had fun and the VR held up — we had over 100 users at peak load and it ran without a hitch!!

I built this over a few days and I couldn't have done it without [A-Frame](https://aframe.io) which made it very easy to do VR without expertise.

Thank you to Perry and the Financial Times for hosting us last night and thanks to Google for the cardboards. It was a really fun talk to give and I am glad it went well!

![](/images/medium/vr-night-end.webp)
