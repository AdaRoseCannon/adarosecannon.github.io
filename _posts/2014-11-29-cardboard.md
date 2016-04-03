---
layout: post
title:  "Audio visualisation in WebGL"
categories: Blog
author: Ada Rose Edwards
---

[[Glitch Bunny]](https://gh.ada.is/SoundThing/) is an audio visualisation. It uses input from the microphone via webaudio and maps it onto a bunny.

<video class="gallery-item" data-src="/post_resources/BunnyBunny.m4v" poster="/images/post_resources/BunnyBunnyPreview.jpeg" loop="true" controls="controls">
	Sorry it appears video is not supported in your browser.
</video>

[Later support for google cardboard and better lighting was added.](https://gh.ada.is/SoundThing/?vr) The source code is [[Here]](https://github.com/AdaRoseEdwards/SoundThing)

## Why?

I wanted to do some interesting data visualistation. I had a half finished guitar tuner I was writing (never did finish) and that inspired me to hook it up to that. The challenges were mostly in getting and maintainging 30-60fps on mobile whilst fourier transforming audio and mapping it to a 3d object.

## How?

The Algorithm is nice and simple. (/js/processVerts.js) I take the Audio data which has been fourier transformed into 32 buckets. I then remove the highest 50% of the frequency bins because they weren't that interesting and were quite noisy. I wanted it to be best for music.

The algo:


```javascript


function updateAudioData(d) {
	var l = d.length;
	for (var i = 0; i < l; i += 1) {
		currentAudioData[i] = parseFloat(d[i]);
		previousAudioData[i] = (previousAudioData[i] || 0) + currentAudioData[i];
		sumOfSquareDeviations[i] = (sumOfSquareDeviations[i] || 0) + Math.pow(currentAudioData[i] - averageAudioChannel(i), 2);
	}
	count++;
}

function standardDeviation(i) {
	if (count > 2) {
		return Math.sqrt(sumOfSquareDeviations[i]/(count -1));
	} else {
		return 0;
	}
}

function scaleSphere(p, t, array) {
	var scale = 0;
	var l = array.length;
	for (var i = 0; i < l; i++) {
		var amplitude = (array[i] - averageAudioChannel(i)) / standardDeviation(i);
		scale += amplitude/(l * Math.log(i + 2)) * (Math.sin(i * i * Math.PI * p / l) + Math.cos(i * i * Math.PI * t / l));
	}
	return 1 + scale;
}

// Map the x,y,z to phi, theta, r (radius) spherical coordinates.
function convertCartesianToSpherical(cartesian) {

	var r = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
	var lat = Math.asin(cartesian.z / r);
	var lon = Math.atan2(cartesian.y, cartesian.x);
	return {
		p: lat,
		t: lon,
		r: r
	};
}

```

`scaleSphere` maps different frequencies to different points on the sphere. Higher frequencies have more spikes and lower frequencies have fewer the video below shows what happens if we turn on only one frequency bin at a time:

<video class="gallery-item" data-src="/post_resources/bunny_debug.m4v" poster="/images/post_resources/bunny_debugPreview.jpeg" loop="true" controls="controls">
	Sorry it appears video is not supported in your browser.
</video>

As you can see as we turn on higher frequencies the rabbit gets spikier. This behaviour is generated with the following formulae.

Where `i` is the frequency bin, `p` & `t` stand for phi and theta respectively from the angle components of the vertex position in spherical polar coordinates. `l` is just the number of bins. Finally `amplitude` is the value of that bin from the audio analyser.

As you'll remember from physics the function for a simple plane wave is
    y = Amplitude * sin(2π*Frequency * x);
In this case the amplitude is `amplitude/(l * Math.log(i + 2))` It is damped at higher frequencies since they tended to have higher amplitudes and the frequency in the `phi` direction is `i`<sup>2</sup>`/2l`. In the `theta` direction it is the same frequency but offset by `π/2`.

```javascript
amplitude/(l * Math.log(i + 2)) * (Math.sin(i * i * Math.PI * p / l) + Math.cos(i * i * Math.PI * t / l));
```

## Performance

The bunny has 1569 vertices which are updated on every requestAnimationFrame with a fair amount of Maths, so the vertices are not cached which I can imagine makes it more difficult for the shadow mapping algorithm in three.js.

I run the bulk of the calculations for the vertices in a service worker then pass them back to the main app to update the mesh. This allows the 3d render to stay in 60fps and the mesh gets updated when the new vertices are calculated.

It runs very fast on my Nexus 5 which is nice although it kills my 1st gen Moto X.

Scripts are downloaded as they are required so someone who chooses to view it in the browser does not get the cardboard libraries and someone who is viewing it in cardboard does not get the touch interaction.

The webaudio analyser has support for very fine grain fourier transform with hundreds of bins but I am limiting it to 32 (The top 16 are discarded) because it is very computationally expensive to generate. With hundreds of bins my laptop would spin up the fans even without drawing anything.

## Cardboard

After seeing some Virtual Reality demoes in the borwser I used the three.js cardboard demoes to add cardboard support it works really well and required no calibration. VR in the browser is super easy and a fun weekend project.

## Future Work?

 * Algorithm improvements to make the effect look better.
 * Add a sky box so you can tell you are turning in VR.
 * Probably can squeeze out some more performance. - Will write post on how I ported this to run from the glsl shader.
 * Add occulus rift support.
