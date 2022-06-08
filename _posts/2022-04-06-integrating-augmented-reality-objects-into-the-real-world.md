---
layout: post
title: "Integrating Augmented Reality Objects into the Real World with Light and Shadows"
description: "Using the WebXR Light Estimation API we can make 3D objects appear to be physical parts of our real environment by having real lights affect virtual objects and virtual objects casting shadows onto real surfaces."
category: Blog
author: Ada Rose Cannon
preview: https://ada.is/images/lightandshadow.jpg
---

Using the WebXR Light Estimation API we can make 3D objects appear to be physical parts of our real environment by having real lights affect virtual objects and virtual objects casting shadows onto real surfaces.

This article will explore how to set it up in AFrame to make your own AR look really good.

![Two screenshots side by side one with lighting estimation turned off and one with it turned on](https://ada.is/images/lightandshadow.jpg)

Demo URL: [https://aframe-light-and-shadow.glitch.me/](https://aframe-light-and-shadow.glitch.me/)

Starting from the standard [AFrame Boilerplate](https://aframe.io/docs/1.3.0/introduction/):

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@0d23f9b21c33ab6821046ce95835492cb84996c5/dist/aframe-master.min.js"></script>
  </head>
  <body>
    <a-scene>
      <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  </body>
</html>
```

First we are going to replace the script with the latest testing one. Any numbered version after 1.3.0 would also work but this has just landed in the code so a numbered release hasn’t been made yet. You can copy the latest version URL from here: [https://github.com/aframevr/aframe/tree/master/dist](https://github.com/aframevr/aframe/tree/master/dist)

```html
<script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@0d23f9b21c33ab6821046ce95835492cb84996c5/dist/aframe-master.min.js"></script>
```

Next because we are working with Augmented Reality we need to shrink the various shapes down from over 2 meters to something more reasonable. We will also group them all up with a parent entity to make it easier to keep them together in AR. What I did here was to shrink the objects to 0.2 their previous scale and also added a replacement camera at a lower height so it still looks good. 

```html
<a-camera position="0 0.4 0" wasd-controls="acceleration:10;"></a-camera>
<a-entity id="objects" scale="0.2 0.2 0.2" position="0 0 -1">
  <a-box position="-1 0.5 1" rotation="0 45 0" color="#4CC3D9"></a-box>
  <a-sphere position="0 1.25 -1" radius="1.25" color="#EF2D5E"></a-sphere>
  <a-cylinder position="1 0.75 1" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
</a-entity> 
```

We will use the `ar-hit-test` component to position objects. It looks at the rays cast by the user to find real world locations to place objects. The component is configured on the `<a-scene>` element.

```html
<a-scene
  ar-hit-test="target:#objects;"
  webxr
>
```

This now allows us to place the objects into the real world but they stand out as clearly fake. We need to add lights and shadows to make it fit in.

The `reflection` component on `<a-scene>` handles the lighting estimation API and letting objects reflect their environment. It has two parts the component and a directional light it controls, we will add both to the scene. 

```html
<a-scene
  ar-hit-test="target:#objects;"
  webxr
  reflection="directionalLight:#real-light"
>
	<a-light id="real-light" type="directional" position="1 1 1" intensity="0.5"></a-light>
```

In AR the light now matches the color, intensity and direction of the main light source in the real world. But it doesn’t cast any shadow on the floor. To set this up we we need to make the light itself cast a shadow and an element for the shadow to fall on.

**NB:** There is a bug in THREE which prevents the reflection map provided by the WebXR lighting estimation API showing details on the standard material. So if you would like to have a shiny material which reflects the real world you should make it a phong material instead.

To make the light cast a shadow add `light="castShadow:true;shadowCameraAutomatic:#objects;"` to the `<a-light>` where the shadowCameraAutomatic property is set to the objects you want the shadow to follow. This ensures high quality shadows that fit your object even as it, and the light moves around, ensuring shadows continue to work well in dynamic conditions like AR.

```html
<a-light id="real-light" type="directional" light="castShadow:true;shadowCameraAutomatic:#objects;" position="1 1 1" intensity="0.5"></a-light>
```

You still won’t see a shadow because it needs to hit something. We will add the `shadow` component to the `#objects` so they can cast a shadow on each other.

To cast it onto the floor we need to make a special plane to receive the shadow. There is a special `shadow` shader which can receive a shadow but is otherwise invisible. We will use this to see the shadow.

```html
<a-plane id="shadow-plane" material="shader:shadow" shadow="cast:false;" rotation="-90 0 0" width="2" height="2"></a-plane>
```

Unfortunately this shadow will be stuck in place so we need to make a quick AFrame component to allow it to follow our objects. 

```html
<script>
  AFRAME.registerComponent('follow-shadow', {
    schema: {type: 'selector'},
    init() {this.el.object3D.renderOrder = -1;},
    tick() { 
      if (this.data) {
        this.el.object3D.position.copy(this.data.object3D.position); 
        this.el.object3D.position.y-=0.001; // stop z-fighting
      }
    }
  });
</script>
```

An object that uses this will sit slightly below a sibling object. We will add it to our plane so that it always sits under them receiving their shadow. 

```html
<a-plane id="shadow-plane" follow-shadow="#objects" material="shader:shadow" shadow="cast:false;" rotation="-90 0 0" width="2" height="2"></a-plane>
```

We now have the lighting set up nicely but there is one last thing we can set up to increase the realism and that is to setup the tone mapping and to tell AFrame to use the physical model for lighting, set `renderer` with this configuration on the `<a-scene>`

```html
<a-scene
  reflection="directionalLight:#real-light"
  ar-hit-test="target:#objects;"
  renderer="physicallyCorrectLights:true;colorManagement:true;exposure:1;toneMapping:ACESFilmic;"
  webxr
>
```

The `renderer.exposure` property can be tweaked in real time to make the scene lighter and darker as needed.

```javascript
const scene = document.querySelector('a-scene');
const data = scene.getAttribute('renderer');
data.exposure = 0.5;
scene.setAttribute('renderer', data);
```

I hope this helps you build more realistic scenes.
