---
layout: post
title: "Writing software using a phone!"
description: 'Developing without a laptop: Living the dream. On setting an Android phone as a Desktop computer and using it for Web Development.'
category: Blog
author: Ada Rose Cannon
star: 1
preview: /images/medium/phone-dex-setup.webp
inline_hero: true
---

> Originally published at [medium.com](https://medium.com/samsung-internet-dev/writing-software-using-a-phone-e71976f1f18d)

Update 3: This is probably the best way to do it now-a-days: [Visual Studio Code on DeX](https://medium.com/samsung-internet-dev/developing-on-android-phones-visual-studio-code-on-dex-4c99d2e80e91)

Update 2: [Web Development on a Phone, updated for Linux on DeX](https://medium.com/samsung-internet-dev/web-development-on-a-phone-updated-for-linux-on-dex-4b8ed6f693fc)

I was sat on my (long) train to work, just reached the halfway point, getting comfy, checking twitter on my phone.

Suddenly I realised!

> "Shit!! I left my laptop at home, what should I do?!"

It was too late to turn back, but I had an idea: the last few days I had been testing websites on Samsung DeX. This is a small dock which turns your S8 smartphone into a desktop computer.

Perhaps it could get me out of trouble? The advertising I saw suggested productivity, but it was mostly focused on normal office job work excel/word/email/etc.

Still, perhaps it could work for me as a developer.

> **"Necessity is the mother of invention"**

The Slack android app has already been optimised for DeX and all the web tools I use day to day, github, trello, jira, can all be used through the full desktop web browser.

But for writing code? Well first I need a terminal!

I installed the app _Termux_. _Termux_ provides a bash terminal for android with many GNU utilities, compiled for android. It brings tools like git, node and ruby to the phone. I had been using it previously for emergency devops on the go. It was the right choice. Although as a native app that is not adapted for DeX the window cannot be resized, this is not an issue as it is already a perfectly sized terminal window.

On Termux everything I needed could be installed: `node, npm, git, python`. I tested a http server; it was accessible out of the Termux sandbox via its IP address e.g. `127.0.0.1:8080` so I was able to test my sites in Samsung Internet. The mobile versions of Chrome and Firefox are available on DeX too.

### Two weeks later

I left my laptop at home. On purpose this time. I didn't need it!

Over two weeks I'd built an Open Source IDE for DeX called [_Web Code_](https://github.com/AdaRoseCannon/web-code). It is a Web App which uses web sockets to access the Termux file system!

It's based around Monaco, the same text editing core as Visual Studio Code, so all of my keyboard shortcuts remain the same as on my laptop. This was the missing link to a comfortable developer environment on DeX.

**The rest of this article shows how to set it up yourself and how to work around some of the quirks in Termux, for developing on Android:**

### Setting it up for yourself

Want a development machine you can fit in your purse? This is an incredibly cool way to work!

![Termux, slack and web code on Samsung DeX](/images/medium/phone-dex-setup.webp)

Now lets look at setting up the development environment.

### Get a Terminal

[Install Termux from the App Store](https://play.google.com/store/apps/details?id=com.termux&hl=en_GB), and open in DeX.

You can paste commands into Termux using _ctrl-alt-v_

We can now configure Termux to our liking. Let's start by giving ourselves access to the rest of the phone's storage so we can access files we download.

```
termux-setup-storage
```

This creates a folder called `storage` in the home directory we can use to access other bits of the phone.

### Install useful Packages

This command installs most packages needed for the development tools you may find in the web:

```
apt update
apt install \
  wget \
  less \
  coreutils \
  nano \
  git \
  vim \
  tar \
  openssh \
  clang \
  python \
  python2 \
  make \
  libc++
```

### Changing the Shell to zsh, with oh-my-zsh

If you prefer the Termux default shell (bash) to zsh you may skip this step.

```
apt install zsh
chsh -s zsh
```

For oh-my-zsh, it is a little different from the instructions on [https://github.com/robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

Download the install script and make it executable:

```
wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh
chmod +x install.sh
```

Edit the downloaded script `install.sh` with `nano` to remove the check for `zsh` by deleting the lines highlighted below:

```
nano install.sh
```

![Remove the highlighted lines](/images/medium/phone-nano-edit.webp)

Run the install script

```
./install.sh
```

### Installing Node

If you are a web developer like me you probably want node, for the stable version of node use:

```
apt install nodejs
```

For the latest use:

```
apt install node-current
```

### Installing ngrok

Ngrok is a really useful tool for exposing local network services via a proxy, so you can test from inside locked down networks.

Go to the [ngrok download page](https://ngrok.com/download). Copy the link to the "Linux ARM" binary and download the zip in termux e.g.

```
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip
```

Unzip the package to your current directory:

```
unzip /path/to/ngrok.zip
```

Run from termux

```
./ngrok help
```

### Termux Quirks

Only files within Termux's private space can be made executable. So any executable files such as shell scripts need to be kept inside the app.

This causes some issues because the operating system's executable files are not in the usual location, `/bin`, but in `/data/data/com.termux/files/usr/bin`. This can cause issues with shell scripts which have a shebang such as `#!/bin/sh`. This can be fixed using `termux-fix-shebang` on the shell scripts.

For example: Installing http-server:

```
npm install -g http-server
termux-fix-shebang `which http-server`
```

Now the http server will run correctly.

### Getting a text editor

Because only files inside the app's private storage can be executable, you will probably need to develop inside Termux's private storage.

Unfortunately other Android apps cannot access this area.

To get around this I created a text editor based around Microsoft's Monaco Editor, the same editor which powers Visual Studio Code. All FileSystem operations are sent via Web Sockets allowing you to edit files via the Web Browser.

The editor is installed via npm, and it will fix it's own shebang after being installed. So it will work right away on Termux.

```
npm install -g web-code
```

Open a directory:

```
web-code ./
```

This will open up a browser window running the editor at that path.

You can add it to your homescreen using the ambient badging buttons.

Web Code is still very early software. If you would like to contribute to it the GitHub repo is here: [AdaRoseCannon/web-code](https://github.com/AdaRoseCannon/web-code)

### Other DeX ready Apps for Work

- Slack
- Gmail
- Excel
- Google Docs works great in Samsung Internet for DeX
- This article was written on medium.com from the Samsung DeX

> Now you are all ready to start building.
>
> Without a laptop!
