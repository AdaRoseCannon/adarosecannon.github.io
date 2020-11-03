---
layout: post
title: "Three Powerful Tools in my Web Development Swiss Army Knife"
description: "These tools are not ones I use everyday but they have got me out some really sticky situations. I hope you find them useful too."
category: Blog
author: Ada Rose Cannon
star: 1
---

# My Three Fave Tools in my Web Development Swiss Army Knife

Three Powerful Tools in my Web Development Swiss Army Knife

### I’ve been doing this for a long time so here are some tools you may not have seen before.

These tools are not ones I use everyday but they have got me out some really sticky situations. I hope you find them useful too.

### **1. ngrok**

***[Ngrok](https://ngrok.com)*** gives you http tunnels to your local machine. Letting you test your local environment on devices not connected to your local network. This is incredibly useful for when you cannot attach the device to your local network.

*Example, * My dev machine is running a http server at localhost:8080.

I run ngrok http 8080 to get a new URL for that port. Ngrok gives me http://98b644cadcbe.ngrok.io

I open it in a web browser on my testing device. All the requests go back to my local dev machine, letting me make tweaks to the local code without needing to do a lengthy deploy.
[**ngrok - secure introspectable tunnels to localhost**
*ngrok secure introspectable tunnels to localhost webhook development tool and debugging tool* ngrok.com](https://ngrok.com/)

### **2. weinre**

***[Weinre](https://people.apache.org/~pmuellr/weinre/docs/latest/Home.html)*** is a really old-school tool back from before remote debugging was available in web browsers. Which surprisingly still comes in useful when a device is unable to connect to remote debugging.

I often have this when trying to debug iOS devices from windows or Linux and I can’t get the [ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy) to work.

You can install it using npm like so: npm install weinre and then start it from the command line like so: weinre --httpPort 8080 ensure the chosen port is not same one you are running any local http servers from.

Find out your machine’s ip address using ipconfig or ifconfig on windows or Linux respectively then open. [http://[your](http://[your) ip address]:8080 in the browser.

This will give you a script tag you can add to pages you want to debug:

```javascript
<script src="http://192.168.0.33:8080/target/target-script-min.js#anonymous"></script>
```

and a link you can open to debug those pages when they are opened:

```javascript
http://localhost:8080/client/#anonymous
```

The inspector has many feature you would expect such as a JavaScript console a HTML inspector and the ability to change the CSS, but it since it’s a just a script on a page it can’t do things like break points and debugger statements.

If you want to inspect a device which is not on your network, or the port you are hosting it on can’t be reached by the device you can use it with ***ngrok ***to expose the weinre port as a URL. Then instead of using your device’s IP address you can use the ngrok URL instead.

**NB: REMEMBER TO REMOVE THE SCRIPT TAG BEFORE YOU COMMIT YOUR CHANGES**
[**weinre - Home**
*Edit description* people.apache.org](https://people.apache.org/~pmuellr/weinre/docs/latest/Home.html)

![A screen shot of the inspector](https://cdn-images-1.medium.com/max/2000/1*GjzndClI1Ds7hryyPuVxUw.png)*A screen shot of the inspector*

### **3. Charles**

***[Charles](http://www.charlesproxy.com)*** is a passive utility I will often have running all the time. Charles runs as a proxy, I tell my computer to use it and it intercepts all HTTP requests and logs the contents. It can be used with HTTPS as well with a bit of set up if you want to debug live sites which these days are likely to use encryption.

When testing a large and complex site sometimes something goes weird unexpectedly. By running charles I can look back through the log and see what the responses were to generate that weird result.

You can see what responses are large or what kind of unexpected requests 3rd party content providers, such as ads, are making.

If you care deeply about your privacy it can be a useful tool to run it to inspect all of your web activity see what kind of tracking networks are following you around the web.
[**Charles**
*For discussion on the latest changes to Charles, please see Karl's blog. Show more news...* www.charlesproxy.com](https://www.charlesproxy.com/)

I hope you find these tools as useful as I have over the time who knows when it can help you out of a sticky situation too.



By Ada Rose Cannon on November 3, 2020.

[Canonical link](https://medium.com/samsung-internet-dev/my-three-fave-tools-in-my-web-development-swiss-army-knife-2736098c8b3b)
