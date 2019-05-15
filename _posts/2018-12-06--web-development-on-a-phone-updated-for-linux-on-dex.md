---
layout: post
title: "Web Development on a Phone. Updated for Linux on DeX."
description: "Last year I wrote about how you can use a phone for web development using an Android Linux Terminal and a simple editor I’d made as a Progressive Web App. It worked pretty well but had some drawbacks, for example you couldn’t debug Samsung Internet on the DeX you had to use an external laptop."
category: Blog
author: Ada Rose Cannon
star: 1
---

# Web Development on a Phone. Updated for Linux on DeX.

Full desktop Linux on the phone.

Last year I wrote about how you can use a phone for web development using an Android Linux Terminal and a simple editor I’d made as a [Progressive Web App](https://medium.com/samsung-internet-dev/writing-software-using-a-phone-e71976f1f18d). It worked pretty well but had some drawbacks, for example you couldn’t debug Samsung Internet on the DeX you had to use an external laptop.

Since then Samsung has released Linux on DeX as a beta which addresses many of the issues I had previously. I was lucky enough to borrow a Note 9 from work to test out how well I can port my work flow to only need the DeX.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/yvpOIz7zAtY" frameborder="0" allowfullscreen></iframe></center>

* Setup [00:00:17]

* Installing Node [00:04:32]

* Installing Visual Studio Code [00:05:35]

* Installing git, zsh and tmux [00:09:23]

* Copying across my config files into Linux on DeX [00:10:25]

* Installing GIMP and changing the wallpaper [00:20:02]

* Testing running a http server [00:21:34]

* Quitting VIM [00:26:10]

* Setting up Blender [00:26:18]

* Testing gamepad support [00:28:17]

* Testing WebGL [00:30:55]

* Debugging Samsung Internet on DeX through Chrome on Linux for DeX [00:32:31]

## Setup

The first thing which is really pleasant with the Note 9 is that you no longer need the specialised DeX dock, any USB-C dongle with HDMI, USB and Charging will work. I have one which I got a while ago for the [VJ-OTG demo](https://medium.com/samsung-internet-dev/vj-on-the-go-e56666fe55eb) so I used that.

I plugged in a USB charger and mouse and keyboard to the dongle and DeX started straight away! The phone screen still works whilst DeX is running, so you can use it as a secondary screen for Android apps.

## About Linux on DeX

[Linux on Dex](https://www.linuxondex.com/) is an app for the Note 9 which gives you a Linux container you can access as a full desktop Linux environment on DeX. You can also access a terminal only version on the phone.

![Linux on DeX running in terminal mode on the phone.](https://cdn-images-1.medium.com/max/2000/0*paVGmwLb-LRi1h5E.png)*Linux on DeX running in terminal mode on the phone.*

The terminal only mode is a great way to run commands when you are on the move.

When you run it from the DeX you get full desktop Linux you’d inspect.

![Linux on DeX running desktop mode in DeX](https://cdn-images-1.medium.com/max/2000/0*yjvTXOmxIqg3uTaJ.png)*Linux on DeX running desktop mode in DeX*

Linux on DeX is so performant because it’s not running in a virtual machine, it’s a container which takes advantage of the device’s resources. So software written for it needs to be made for the device’s ARM architecture.

## Software

Linux for ARM devices is widely used because of the popularity of Linux powered SoC ARM devices such as the raspberry pi. As a result there is a lot of linux software compiled for ARM architecture ready to install using APT.

For example you can install node with:

    sudo apt-get install node-js

This will prompt you for the root password which is ‘secret’ out the box but you should probably change it.

For the editor I wanted to use Visual Studio code which is what I like to use on my personal computer. Unfortunately it’s not available for download for ARM architecture from the website. Fortunately because it’s open source software it has been compiled for ARM from [https://code.headmelted.com/](https://code.headmelted.com/)

The default script couldn’t install automatically for security reasons so I had to run ‘apt-get install code-oss’ after running the script from the site which added the repos.

## Configuring

If you’re like me you probably want to configure the Linux desktop to your liking. All the command line tools I like to use such as zsh and tmux. Worked really well. I copied my configuration for these from my personal laptop to the phone and they worked out the box.

To copy them across I put them on a memory stick and plugged it into the phone. I then moved them into the “Internal storage/LoD_Share/” to make it available on Linux on DeX. I then linked them into the right places.

zsh is a terminal shell, like bash, which provides nice features for autocompletion. I use oh-my-zsh with the powerlevel9k theme to make it really useful.

tmux is a tool which lets you tile terminal layouts, and have them in different “windows” so you can run multiple processes from one terminal and easily switch between them. I use a slightly modified version of [this set up](https://github.com/gpakosz/.tmux). Which gives me some really nice functionality when dealing with lots of processes.

Both zsh and tmux take advantage of [powerline fonts](https://github.com/powerline/fonts) which are really handy for making an attractive and useful terminal.

Configuring the window manager unfortunately was not as easy.

Linux on DeX uses Gnome 2 out the box. Unfortunately Gnome Tweak Tools doesn’t work on Linux on DeX right now. Gnome Desktop also appears to have some issues wrt changing windows.

It can be changed to Mate which may be familiar to those of you who use Linux Mint on your laptops. Mate works well and it also can be tweaked. I haven’t looked into using it on Linux on DeX yet but that is probably the route I will take.

## Using

One really powerful feature of Linux on DeX is that it is runs great alongside the standard DeX experience. It starts extremely quickly, pressing the keys win+return can be used to quickly minimise it and holding the mouse at the bottom of the screen shows the DeX taskbar for taking screenshots and showing notifications.

The clipboard is shared between both systems allowing you to copy text between Linux and Android desktop.

DeX gets paused when it’s minimised which is really handy for saving power but not very useful when you want to run a long running task or a web server in Linux and then go do something else. I’m hoping it’s going to be possible to keep it running in the background in the future.

## Graphics

The Note 9 has loads of RAM and a really powerful CPU, so lots of things were really fast. Unfortunately Linux on DeX cannot yet access the graphics capabilities of the device. Which means that things which would take advantage of this are slow or don’t work at all.

WebGL and Blender run pretty slow. Especially when comparing WebGL in Samsung Internet on DeX to Chrome in the Linux on DeX container.

## Gamepad

In a related note, we tested the Gamepad API in Linux on DeX. It seems gamepads were not exposed. They could not be accessed in Linux on DeX but worked great in Samsung Internet for DeX. [This article](https://medium.com/samsung-internet-dev/the-gamepad-reloaded-5ba866770003) by [@diekus](https://twitter.com/diekus) and I shows how different controllers get mapped in the browser.

## Debugging Samsung Internet on DeX from Chrome on Linux on DeX

This is the functionality I was most looking forward to and it works really well, with a small caveat.

It does require an ADB command on an external laptop to enable it but it lasts until the device is restarted.

Here are the steps to do it:

1. Enable USB debugging on the device

1. Plug in the phone to the laptop with a USB-C cable. I had to use the one which came with the device. My regular USB-C cables didn’t work.

1. Agree to the prompt on the phone to allow debugging.

1. On the laptop run, adb tcpip 5555

1. Plug the phone into DeX, start Linux on Dex, make sure that ADB is installed by running in the Linux on DeX terminal: sudo apt-get install android-tools-adb android-tools-fastboot

1. To start debugging run, adb connect localhost in the terminal.

1. Open chrome and browse to chrome://inspect to inspect open browsers.

It works really well with Samsung Internet running on the small phone screen and debugging it via Linux on DeX. It’s a great experience to do responsive design for both mobile and desktop at the same time on one device!!

![](https://cdn-images-1.medium.com/max/2028/1*wyDi-JLhf-VvaC21docuEA.png)

## Thanks

Thank you [Daniel Blandford](https://twitter.com/SmilerOnlineDeX) for helping with DeX and Linux on DeX tips!!



By Ada Rose Cannon on December 6, 2018.

[Canonical link](https://medium.com/samsung-internet-dev/web-development-on-a-phone-updated-for-linux-on-dex-4b8ed6f693fc)
