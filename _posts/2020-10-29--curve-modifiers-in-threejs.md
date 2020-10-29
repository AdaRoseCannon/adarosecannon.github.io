---
layout: post
title: "Curve Modifiers in Three.js"
description: "I recently made a relaxing koi garden demo, where koi fish swim around a VR environment. The two most notable parts of the scene are the 3D positioned audio which I wrote about previously and the 100s of fish which appear to organically swim around the trees."
category: Blog
author: Ada Rose Cannon
star: 1
---

# Curve Modifiers in Three.js

Curve Modifiers in Three.js

### My first major PR to Three.js

I recently made a relaxing [koi garden](https://koi-garden.glitch.me) demo, where koi fish swim around a VR environment. The two most notable parts of the scene are the [3D positioned audio which I wrote about previously](https://medium.com/samsung-internet-dev/audio-on-the-web-for-games-and-vr-efcd523a3d58) and the 100s of fish which appear to organically swim around the trees.

The 3D models of the fish bend as they turn tight corners. This effect is great for organic models that travel along fixed paths such as birds or fish.

For my fish scene I had found a [really cool demo](https://github.com/zz85/threejs-path-flow) which could be adapted for my needs. [The author was willing to make a THREE.js example,](https://github.com/mrdoob/three.js/issues/13553) but hadn’t got around to it. When I adapted it for myself I made it a general purpose module which can be brought in to abstract away lots of the complexities. [I then submitted this to THREE.js as an example to be used by anyone.](https://github.com/mrdoob/three.js/pull/20538)

### How it works

This technique works by encoding the curves into a texture. A special shader then distorts the vertices as the model moves around the curve.

The technique relies on floating point values in the texture. In WebGL 1 this is an optional feature for implementors, so if you use the first WebGL it may not work on many devices, but certain android phones don’t have this feature available. You can get around this by using WebGL2. [WebGL2 has pretty good browser support now](https://caniuse.com/webgl2).

You can use WebGL2 in THREEjs by explicitly getting the WebGL2 context and passing it to the renderer:

```javascript
const canvas = document.querySelector('canvas');
const context = canvas.getContext( 'webgl2', { antialias: true } );
const renderer = new WebGLRenderer({ canvas, context });
```

If you want to optimize support you could detect whether WebGL2 is supported, and use it if it is available.

This is an expensive technique, so if you want to have many of the same objects you need to take advantage of instancing to render the same object many times along the curve.

The code example I made for Three.js is designed to take advantage of instancing. Instancing lets you have many copies of the same object rendered in a single draw call. This allows you to define multiple curves in the texture and each instance of a model, set which curve it is on as well as set its position on the curve. This can let you have a very large amount of objects that get rendered in a single draw call.

In the demo I made with the fish you can control the number of fish by setting the ?fish=300 query parameter. On mobile devices it can render almost 100 fish whilst maintaining a 60fps frame rate. On laptops it can do 1000s of fish and on powerful desktop computers it can do over 10000 fish!

![The Koi Garden demo with 300 fish](https://cdn-images-1.medium.com/max/2000/1*QbMbO8H5H-DfW5T3FV6Nqw.gif)*The Koi Garden demo with 300 fish*
[**XR Koi Garden**
*A beautiful VR garden with peaceful music. Listen with headphones for the full effect.* koi-garden.glitch.me](https://koi-garden.glitch.me/?fish=300)

### Using the Three.js Example

The simplified demonstrations I made for Three.js have a mesh with complex geometry, generated using the Three.js TextGeometry which travels round the curves.

The [first example](https://threejs.org/examples/#webgl_modifier_curve) has a single object, which is not instanced, traveling around a single curve.

The [second example](https://threejs.org/examples/#webgl_modifier_curve_instanced) has a single object instanced 8 times traveling around 2 separate curves.

![3D text duplicated 8 times traveling along two paths.](https://cdn-images-1.medium.com/max/2000/1*D_UmP3vAp-SiyQTFOHp7Sg.gif)*3D text duplicated 8 times traveling along two paths.*

**The not-instanced method** is the simpler method for having a single object.

* Pick your mesh

* Define the curve to use

* Create a new flow from the mesh

* Add the curve to the mesh at index 0

* Add the curves object to the scene

```javascript
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";

const points = [
 new Vector3( 1, 0, z: -1 ),
 new Vector3( 1, 0, z: 1 ),
 new Vector3( -1, 0, z: 1 ),
 new Vector3( -1, 0, z: -1 ),
];

const curve = new THREE.CatmullRomCurve3(points);
curve.curveType = "centripetal";
curve.closed = true;

const mesh = // some mesh I made earlier;

// You may need to tweak the geometry beforehand to get it to
// Display with the orientation you expect.
mesh.geometry.rotateX( Math.PI );

const flow = new Flow( objectToCurve );
flow.updateCurve( 0, curve );
scene.add( flow.object3D );
```

Note: you do not need to add the mesh to the scene. The flow object clones one from the mesh.

**The instanced method** is how to performantly have many many objects drawn in a single draw call.

```javascript
import { InstancedFlow } from "three/examples/jsm/modifiers/CurveModifier.js";

const material = // some material
const geometry = // some geometry

const curve1 = // A curve
const curve2 = // A curve
const curve3 = // A curve
const curve4 = // A curve

geometry.rotateX( Math.PI );

const numberOfInstances = 8;
const numberOfCurves = 4;

const flow = new InstancedFlow( numberOfInstances, numberOfCurves, geometry, material );

// Add the flow object to the scene
scene.add( flow.object3D );

flow.updateCurve( 0, curve1 );
flow.updateCurve( 1, curve2 );
flow.updateCurve( 2, curve3 );
flow.updateCurve( 3, curve4 );

// Do each step below for each numberOfInstances

// Set the first instance to be on the first curve
flow.setCurve( 0, 0 );

// Move the first instance along the curve by a random amount
flow.moveIndividualAlongCurve( 0, Math.random() );

// Give the first instance a random Color
flow.object3D.setColorAt( 0, new THREE.Color( 0xffffff * Math.random() ) );
```

By calling updateCurve() at a later point you can change the curves on the fly. This is an expensive operation, especially if you have many curves — try to avoid changing it every frame if it can be avoided.

If you need more curves or instanced objects than you had allocated for, you will have to make a new curve instance with space for the new assets.

If you are a very advanced developer then you don’t need to use the Flow instances, they are just to make your life easier. The helper functions they use are exported as well so you can use them to create your own shaders and materials. Here is the source code for those interested in diving in and learning more:
[**mrdoob/three.js**
*You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or…* github.com](https://github.com/mrdoob/three.js/blob/master/examples/jsm/modifiers/CurveModifier.js)



By Ada Rose Cannon on October 29, 2020.

[Canonical link](https://medium.com/samsung-internet-dev/curve-modifiers-in-three-js-1ada72c61677)
