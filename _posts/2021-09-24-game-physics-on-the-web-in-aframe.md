---
layout: post
title: "Game Physics on the Web in AFrame"
description: "Game Physics on the Web in AFrame
Adding physics to Virtual Reality and Augmented Reality scenes greatly improves the illusion of…"
category: Blog
author: Ada Rose Cannon
preview: https://cdn-images-1.medium.com/1*mImUo9SUjL84UTe_4Pq0RQ.png
---


Adding physics to Virtual Reality and Augmented Reality scenes greatly improves the illusion of immersion. For VR it gives the user the…

This guide came together to cover how the physics work in the Augmented Reality Basketball Game:
[**bARsketball**
*Shoot some hoops in your own home with Augmented Reality!* xr-basketball.glitch.me](https://xr-basketball.glitch.me)


<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FGlRe0uY3-l8%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DGlRe0uY3-l8&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGlRe0uY3-l8%2Fhqdefault.jpg&key=a19fcc184b9711e1b4764040d3dc5c07&type=text%2Fhtml&schema=youtube" allowfullscreen frameborder="0" scrolling="no"></iframe>


The component I use for physics is called `[aframe-physics-system`](https://github.com/n5ro/aframe-physics-system) this works best with ammo.js but needs a bit of configuration to use.

Installing AFrame physics system requires both the script for the component and the ammo webassembly build, the latest version doesn’t work but the one hosted by mozilla works well so add both these scripts:

```javascript
<script src="[https://mixedreality.mozilla.org/ammo.js/builds/ammo.wasm.js](https://mixedreality.mozilla.org/ammo.js/builds/ammo.wasm.js)"></script>
<script src="[https://cdn.jsdelivr.net/gh/n5ro/aframe-physics-system@v4.0.1/dist/aframe-physics-system.min.js](https://cdn.jsdelivr.net/gh/n5ro/aframe-physics-system@v4.0.1/dist/aframe-physics-system.min.js)"></script>
```

Then add the component to <a-scene>:

The debugging is useful for seeing the generated shape of the physics objects. because to keep things fast the physics objects have simpler geometry than the rendered object that it is attached to. In the case of the basketball demo the physics objects are created to enhance the gameplay rather than be a precise replica of the underlying objects.

```javascript
<a-scene physics="driver: ammo; debug: false; debugDrawMode: 1;">
```


<div><figure>
<img src="https://cdn-images-1.medium.com/max/3552/1*mImUo9SUjL84UTe_4Pq0RQ.png" width="988" height="651" alt="Two versions of the same virtual basketball hoop, in the latter the normally invisible physics objects are visible">
<figcaption>Two versions of the same virtual basketball hoop, in the latter the normally invisible physics objects are visible</figcaption>
</figure></div>

There are [three types of physics objects](https://github.com/n5ro/aframe-physics-system/blob/master/AmmoDriver.md#ammo-body-type): “dynamic”, “static” & “kinematic”. Static objects, shouldn’t move and are the simplest and most efficient try to use static objects where possible. Kinematic objects are like static objects but you can move them around. Dynamic objects are the objects in your scene which get moved by the physics system itself and what you think of most with physics systems. These are expensive so try to keep their shapes simple.

**Static objects** are often simpler than the original geometry for example in the demo above we have a basketball hoop with 100s of vertices and faces. The geometry is complex and totally inappropriate to run physics off so instead I will use simple shapes as stand-ins to be static bodies but make them invisible.

Here are a couple example of static bodies. The first is a torus where the shape is set to `hacd` which means it will match the geometry of the defined 3D model pretty precisely and can event handle convex shapes like this torus. The second object is just a simple box placed around the back board. Using a simple box like this is a very efficient shape to put on an object.

```javascript
<a-torus
  ammo-body="type: static;"
  ammo-shape="type: hacd"
  segments-tubular="9"
  segments-radial="6"
  radius="0.29"
  radius-tubular="0.02"
  position="0 0.4 -0.10"
  rotation="-5 0 0"
  scale="1 1 4"
  visible="false"
></a-torus>

<a-box
  ammo-body="type:static;"
  ammo-shape="type:box"
  width="2"
  height="1.4"
  depth="0.1"
  rotation="-90 0 0"
  position="0 0 -0.65"
  visible="false"
></a-box>
```

Having a few invisible models with simple shapes (very few polygons) to handle the physics of a single complex object (very many polygons) is an extremely common pattern you will find in almost every game which relies on a physics engine.

**Dynamic Bodies** such as the basketball should have even more simple physics shapes. Use simple boxes and spheres for them if you can.

You can find the configuration options for dynamic bodies in the [AFrame Physics System Ammo.js Documentation](https://github.com/n5ro/aframe-physics-system/blob/HEAD/AmmoDriver.md#ammo-body)

One useful feature which isn’t exposed is how bouncy and object is, this is available through the JavaScript API so it’s a good example of how to configure the Ammo bodies with JavaScript.

### Configuring Bounciness

The bounciness configuration is called ‘Restitution’. The Ammo version of AFrame physics system doesn’t let you set the restitution out of the box. By default it is set to zero for all objects, which means when objects collide the kinetic energy is almost entirely lost.

If you would like an object to have some bounciness you can add the below component to your script. Which adds the `ammo-restitution` component letting you configure the restitution (bounciness) for each object:

```javascript
AFRAME.registerComponent('ammo-restitution', {
  schema: { default: 0.5 },
  init() {
    const el = this.el;
    const restitution = this.data;
    el.addEventListener('body-loaded', function () {
      el.body.setRestitution(restitution);
    });
  }
});
```

Here is how I used that to configure the basketball in the demo, notice that I set it to 1.5 which is extremely high. If you set it too high so that the multiplication of the restitutions is larger than 1 then objects will gain energy as they bounce and each subsequent bounce will be higher than the last resulting in the object quickly losing control and probably glitching out of your scene when it moves too fast.

```javascript
<a-sphere
  material="color:orange;src:#balltexture"
  position="0.1 2.5 -1.8"
  scale="0.5 0.5 0.5"
  ammo-body="type: dynamic;"
  ammo-shape="type: sphere"
  radius="0.19"
  ammo-restitution="1.5"
></a-sphere>
```

When a collision occurs the restitution of both of the colliding objects is taken into account so to ensure it bounces well on the floor, the restitution needs needs to be set on the floor physics object as well. The code below shows how we defined our 20m by 20m floor which is 1m deep and level with the 0 position of the environment, ideal for representing the user’s real floor in VR and AR:

```javascript
<a-box
  ammo-body="type:static;"
  ammo-shape="type:box"
  width="20"
  height="20"
  depth="1"
  rotation="-90 0 0"
  visible="false"
  position="0 -0.5 0"
  ammo-restitution="0.5"
  visible="false"
></a-box>
```

### Controlling your Physics Engine with JavaScript

You can reposition the dynamic 3D objects with a peculiarly arcane JavaScript incantation. Thank you [@brianpeiris](https://twitter.com/brianpeiris) for getting it working.

```javascript
function positionAmmoBody(body, p) {
  const transform = new Ammo.btTransform();
  body.getMotionState().getWorldTransform(transform);

  const positionVec = new Ammo.btVector3(p.x, p.y, p.z);

  transform.setOrigin(positionVec);
  body.getMotionState().setWorldTransform(transform);
  body.setCenterOfMassTransform(transform);
  body.activate();

  // Clean up
  Ammo.destroy(transform);
  Ammo.destroy(positionVec);
}
```

Unless you are [thinking with portals](https://youtu.be/Pcf99_DZZew?t=19) it’s often useful to set the velocity of an object to zero once you have re-positioned it. Setting the velocity is a little less arcane and is a useful tool for either launching objects or stopping them.

```javascript
const velocity = new Ammo.btVector3(0,0,0);
this.data.ball.body.setLinearVelocity(velocity);
Ammo.destroy(velocity);
```

It’s important to notice that every `Ammo` object I create needs to be manually destroyed, Ammo.js is based on web assembly which requires memory be handled manually so for every object you create you need to destroy it eventually to avoid memory leaks.

The final useful incantations to know are to do with the activation of 3D objects. If an object hasn’t moved much it will be deactivated to save processing power. But if you need to get it moving again you have to wake it up:

```javascript
const body = el.body;

// wake up an object
body.activate();

// Deactivate Object
body.setActivationState(0);

// Prevent object from automatically being deactivated
body.setActivationState(4);
```

Thank you for reading, I tried to cover all of the pitfalls I fell into when building this simple game. Feel free to remix the project on Glitch to make your own version. Or take a look through the source code of the project on Glitch:


<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fglitch.com%2Fembed%2F%23%21%2Fembed%2Fxr-basketball%3FpreviewSize%3D0%26attributionHidden%3Dfalse%26sidebarCollapsed%3Dtrue%26path%3Dindex.html%26previewFirst%3Dfalse&dntp=1&display_name=Glitch&url=https%3A%2F%2Fglitch.com%2Fembed%2F%23%21%2Fembed%2Fxr-basketball&image=https%3A%2F%2Fglitch.com%2Fedit%2Fimages%2Flogos%2Fglitch%2Fsocial-card%402x.png&key=a19fcc184b9711e1b4764040d3dc5c07&type=text%2Fhtml&schema=glitch" allowfullscreen frameborder="0" scrolling="no"></iframe>


[Canonical Link](https://medium.com/samsung-internet-dev/game-physics-on-the-web-in-aframe-628fbf7c32a3)
