---
layout: post
title: "Audio on the Web, for Games and VR!"
description: "Audio is a fundamental way of adding important theming and immersion to games and virtual reality experiences on the Web. It’s not too hard to add but can do wonders for giving the user a wonderful experience. Resources like Freesound make it easier to find Creative Commons sound effects and music so there is no excuse to leave your experience silent."
category: Blog
author: Ada Rose Cannon
star: 1
---

# Audio on the Web, for Games and VR!

Audio on the Web, for Games and VR!

### Tips, tricks and getting started.

Audio is a fundamental way of adding important theming and immersion to games and virtual reality experiences on the Web. It’s not too hard to add but can do wonders for giving the user a wonderful experience. Resources like [Freesound](https://freesound.org/browse/) make it easier to find Creative Commons sound effects and music so there is no excuse to leave your experience silent.

I recently created a [relaxing VR experience](https://ada.is/xrgarden) which made use of 3D spatial audio for it’s procedurally generated music. This article covers some of the things I learned when building the audio aspects of that experience.
[**XR Koi Garden**
*A beautiful VR garden with peaceful music. Listen with headphones for the full effect.*ada.is](https://ada.is/xrgarden)

The most fundamental way to play audio on the Web is the HTML <audio> element. This has some fantastic benefits such as being able to play audio as it streams in. So if you have a long background music track or ambient sound loop then this is perfect for you.
> # Tip 1. Don’t use MP3 for Looping Audio

This is the HTML code for playing some looping background sound:

```javascript

<audio loop preload id="bgsound">
   <source src="assets/ambient/loop.ogg" type="audio/ogg" />
   <source src="assets/ambient/loop.mp3" type="audio/mpeg" />
</audio>
```

Note that the audio element can accept multiple different sources much like the <picture> element. MP3 has pretty good compression and really wide support so why don’t we just use MP3?

MP3 shouldn’t be used for looping audio because the header information often gets misread as a few milliseconds of no sound. This is fine for an MP3 player where the silent parts aren’t recognisable as one song changes to another, but if you are looping some ambient noise then that few ms of no sound is extremely jarring to the listener.

OGG format is really good too and does not have this issue but it isn’t supported on Apple devices. So we fall back to MP3 in that case. Which will give a worse effect but still be okay.

The alternative of using WAV would also not have the muting issue but could be up to 10x larger!! Making it an unsuitable format for the web where quick starts are imperative.
> # Tip 2. Don’t use auto-playing audio; have the user turn audio on.

Don’t use auto playing audio, this may seem counter intuitive because if we are adding audio to a game we want to have audio on by default.

From a user perspective people are pretty mixed about whether they want auto-playing audio at all:

<blockquote class="twitter-tweet" data-conversation="none" data-align="center" data-dnt="true"><p>&#x200A;&#x2014;&#x200A;<a href="https://twitter.com/ThisIsJoFrank/status/1315602837599068160">@ThisIsJoFrank</a></p></blockquote>

On top of that some browsers such as Chrome will prevent audio from autoplaying at all until a user event triggers the audio playing. The best way to work with browsers which block autoplaying audio is to have an audio toggle switch which can be built using HTML, CSS and a little JavaScript:

![Toggle Button](https://cdn-images-1.medium.com/max/2000/1*8U1wq3VFKBHVBAdSGTifmg.png)*Toggle Button*

The HTML is a checkbox and a label:

```javascript

<input type="checkbox" id="canaudio" />

<label for="canaudio">Toggle Audio</label>
```

CSS can be used to hide the label text but show an audio muted symbol if the sound is disabled and a speaker symbol if it’s playing audio.

```javascript

#canaudio {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

label[for="canaudio"] {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #0004;
  padding: 1.5rem;
  border-radius: 50%;
  border: 2px solid transparent;
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 0;
  color: white;
}

#canaudio:focus + label[for="canaudio"] {
  border: 2px solid white;
}

label[for="canaudio"]::before {
  content: "🔇\FE0E";
  font-size: 3rem;
  line-height: 3rem;
}

#canaudio:checked + label[for="canaudio"]::before {
  content: "🔊\FE0E";
}
```

We then listen for events on this checkbox to start the audio element playing:

```javascript

// Ensure the #canaudio element is not checked as some browsers
// Will remember it's state
window.canaudio.checked = false;

window.canaudio.addEventListener('change', function () {
 if (this.checked) {
  window.bgsound.play();

  // initialise the spatial audio
  audioInit();

} else {
  window.bgsound.pause();
 }
});
```
> # Tip 3. Spatial Audio in the Web isn’t as hard to add as you’d expect

The web has had support for 3D audio via the [WebAudio PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode) for a long time and it is possible to play your sound clips through the Web Audio API and the panner node for positional audio.

This works very well but may not be up to the expectation of game developers or audiophiles but a library by Google called [Resonance Audio](https://resonance-audio.github.io/resonance-audio/develop/web/getting-started.html) makes high quality spatial sound available in a neat API.

That is what I worked with for my recent VR experience [XRGarden](https://ada.is/xrgarden). It would play piano notes at random points on the waters surface with an accompanying ripple effect.

The first step is adding the resonance library script:

```javascript

<script src="https://cdn.jsdelivr.net/npm/resonance-audio/build/resonance-audio.min.js"></script>
```

The next step is creating an audio context for it to play from, because Chrome does not allow audio contexts to be created without audio being allowed we have to wait for some kind of mouse event, we will use the unmuting button to trigger this:

```javascript

*let* hasInit = false;

function audioInit() {

  if (hasInit) return;
  hasInit = true;

  // Create an AudioContext
  const audioContext = new AudioContext();
  const resonanceAudioScene = new ResonanceAudio(audioContext);
  resonanceAudioScene.output.connect(audioContext.destination);
}
```

If your game or experience is inside a room you can [set the size of the room ](https://resonance-audio.github.io/resonance-audio/develop/web/getting-started.html#add-a-room-to-the-scene)and the material of the walls/floor/ceiling to get accurate reverberations from each surface. You can get the full list of available materials here: [https://resonance-audio.github.io/resonance-audio/reference/web/Utils.html#.ROOM_MATERIAL_COEFFICIENTS](https://resonance-audio.github.io/resonance-audio/reference/web/Utils.html#.ROOM_MATERIAL_COEFFICIENTS)

```javascript

const roomDimensions = {
  width: 3.1,
  height: 2.5,
  depth: 3.4,
};

const roomMaterials = {
  left: 'brick-bare',
  right: 'curtain-heavy',
  front: 'marble',
  back: 'glass-thin',

  // Room floor
  down: 'grass',

  // Room ceiling
  up: 'transparent',
};

resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);
```

You’ll also want to sync up the listener position to the camera position so that the sounds are coming from the correct place according to the user’s point of view.

This code example is for the popular WebGL library [THREE.js](https://threejs.org/), we work out the direction the camera is looking and the up direction of the camera and use that to set the listenerOrientation, then we set the listenerPosition from the camera position.

```javascript

const tempForwardVector = new Vector3();
const tempUpVector = new Vector3();

function onRender() {
  tempForwardVector.set(0, 0, -1);
  tempForwardVector.applyQuaternion(camera.quaternion);

  tempUpVector.set(0, 1, 0);
  tempUpVector.applyQuaternion(camera.quaternion);

  resonanceAudioScene.setListenerOrientation(
    tempForwardVector.x,
    tempForwardVector.y,
    tempForwardVector.z,
    tempUpVector.x,
    tempUpVector.y,
    tempUpVector.z
  );

  resonanceAudioScene.setListenerPosition(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );
};
```

This needs to be called every time a frame is rendered to keep the listener position and orientation synced to the camera position.

To play a sound from a position you first need to load it:

```javascript

const audioElement = document.createElement("audio");
audioElement.src = filename;
const audioElementSource = audioContext.createMediaElementSource(
   audioElement
);
const source = resonanceAudioScene.createSource();
audioElementSource.connect(source.input);
```

Then when you are ready to play it you can set the position and play it:

```javascript

source.setPosition(position.x, position.y, position.z);
audioElement.play();
```

Here is the code I used in my demo for handling the positional audio, for my purposes I made a little class to handle the play back for all the different notes which kept the code pretty neat:
[**AdaRoseCannon/xrgarden**
*Contribute to AdaRoseCannon/xrgarden development by creating an account on GitHub.*github.com](https://github.com/AdaRoseCannon/xrgarden/blob/master/src/lib/audio.js)

I hope this helps you make engaging web experiences with audio. For my VR scene I used both general background audio and positional audio. An alternative would’ve been to have all of my ambient sounds positioned spatially too. I could put birds in sky and insects flying around at head level and splashing of water from below the user which would be a great way to improve the experience.



By Ada Rose Cannon on October 19, 2020.

[Canonical link](https://medium.com/samsung-internet-dev/audio-on-the-web-for-games-and-vr-efcd523a3d58)
