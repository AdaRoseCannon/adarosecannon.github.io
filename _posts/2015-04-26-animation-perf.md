---
layout: post
title:  "Animation Performance"
categories: Blog
author: Ada Rose Cannon
---

On Monday 20/04/2015 I gave a ligtning talk at the extensible on animation performance in the browser.
These are the notes from the talk prose-ified.  
[Link to the talk](https://www.1am.club/~ada/ews-slides/). Talk notes are displayed on mobile.

<blockquote class="twitter-tweet" lang="en"><p>Just saw <a href="https://twitter.com/slightlylate">@slightlylate</a> and <a href="https://twitter.com/timberners_lee">@timberners_lee</a> here, trying to not panic.</p>&mdash; Ada Rose Cannon ♥ (@AdaRoseCannon) <a href="https://twitter.com/AdaRoseCannon/status/590189790248587264">April 20, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

----

In the Browser we have a goal to reach 60fps, which gives us 16ms to render a single frame.  
Jank is when the frame takes longer to layout and render than 16ms.
It causes a stutter, which feels bad.  
A long frame is caused by slow, synchronous main thread activity this can be most simply a long main thread loop or blocking io (XHR or large local storage transactions).

However most commonly it is caused by the layouts and paints used to render the page.

---------

🐢 Layout is slowest. Layout is where the browser calculates the positions and sizes of all the elements in the page. Making a small DOM change could potentially invalidate the entire DOM tree causing it to be recalculated. An invalidated DOM is recalculated whenever a layout property is read as well as when each frame is rendered. If an element's layout needs to be recalculated it also has its bitmap in memory invalidated, so it needs to be repainted.

🐢 Paint is medium-slow. This is where the layer's bitmap has been invalidated and needs to be redrawn and stored in memory. Aside from when its layout changes this will also happen when its appearance changes, such as background or color. Elements which need to be repainted will only be repainted once per frame.

🐰 Composite is very fast. Composite only involves the graphics card rerendering from bitmaps calculated in paint and stored in memory: it is performed once per frame. It is triggered by gfx card-only operations such as transform, clipping and opacity.

<a href="http://csstriggers.com/" target="_blank">CSS triggers</a> is a great resource for discovering how properties trigger each of these operations.

Writing to DOM is free; you can write as much as you want.
Once the DOM is read if it has been invalidated the layout needs to be recalculated, which is expensive.
One common problem is reading, then writing in a loop, which is known as thrashing the DOM; the layout is invalidated and recalculated on every single read.
Interleaving reads and writes could mean multiple layout operations per frame

```javascript
el.height = (myVar + 1) + "px"
myVar = el.clientHeight;
el.height = (myVar + 1) + "px"
myVar = el.clientHeight;
el.height = (myVar + 1) + "px"
myVar = el.clientHeight;
el.height = (myVar + 1) + "px"
myVar = el.clientHeight;
```

Animating properties which cause layouts on the DOM will trigger a layout on every frame. In the slides I've put in some examples of bad practise where I naively do css animations on the width property.

```css
@keyframes bad {
	0% {width: 1.5em;}
	50% {width: 4em;}
	100% {width: 1.5em;}
}
```

The fix for the first situation tends to be fairly simple: batch your reads and write all together. Don't change a property then immediately read it.
E.g.Don't append to an `innerhtml` in a loop INSTEAD add it to a separate string and update the `innerHTML` in one go.

In an mvc or a large framework with many independent modules it can be difficult to ensure modules do not interleave read and writes. Wilson Page's <a href="https://github.com/wilsonpage/fastdom" target="_blank">fastdom library</a> can help with this so that reads and writes in a single frame all get done together.

> > A good general motto is to calculate all DOM changes first then apply them in a single step.

### Animating an interaction which causes a lot of change to the layout.

Let's say we have a widget in which notifications get appended. <a href="https://www.1am.club/~ada/ews-slides/#slide-3" target="_blank">(Slide showing the notification example)</a> As a new element gets added the widget grows in height.  
We want to animate prepending an element to the start.
Here we have an issue because the height changes which pushes many elements around the page,
so it's expensive because it's a layout operation and much worse because the whole page will change so layout needs to be performed on the entire document.

But following our advice from earlier before we insert the new notification we can measure how everything will change then animate that change. (Click twice to demo the smooth interaction)

When doing something like this it is best to front load all of the dom read/writes so the app is responsive as the animation finishes.

If doing a DOM change on a user interaction then you have about a whole 100ms (~6 frames) to measure and write to the DOM before it feels sluggish. Which is plenty of time to perform these measurements.
This method follows up from a great talk given by Paul Lewis ([@aerotwist](https://twitter.com/aerotwist)) at the Chrome Dev Summit.

(Next example in the slides follows this through step by step)

 > <a href="/blog/2015/04/29/animation-perf-follow-up/" target="_blank">This follow up post</a> goes into some more detail since this doesn't work that well in all situations. That post fixes an issue with animating nested scale transforms with css transitions.
 >
 > In short - One should instead use a library like tween.js to transform the children to have the inverse scale of the parent.

* Measure every element we want to animate.
* Store the current animation so it can be restored later set it to ‘0s’
* Store the current transform so it can be restored later
* Perform the function
* Measure the new positions, sizes,
* Anything which has changed size: scale it and all give all of its children the inverse transform.
* Give all the children the offset of the top left of the parent
* Give them the inverse scale
* Apply the translations to move everything to its new place
* Apply the new transition to everything affected
* Set all of the transforms to their original values
* Watch everything smoothly animate.
* On transitionend
* Restore the transitions
* Fire any callbacks

<blockquote class="twitter-tweet" lang="en"><p>This is the code for the smooth layout demo: <a href="https://t.co/fgWeP4DhrG">https://t.co/fgWeP4DhrG</a> <a href="https://twitter.com/hashtag/extwebsummit?src=hash">#extwebsummit</a> apolgies for the jQuery I wrote it in a hurry.</p>&mdash; Ada Rose Cannon ♥ (@AdaRoseCannon) <a href="https://twitter.com/AdaRoseCannon/status/590200595086082049">April 20, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

# Layout Boundaries and Containment

Even though this modal <a href="https://www.1am.club/~ada/ews-slides/#slide-4" target="_blank">(Slide 4)</a> looks isolated the browser may still relayout the whole Dom.
However, we can seperate its DOM invalidation from the rest of the page.
Doing so doesn't accelerate the animation, but it does make the layout change less catastophic.

There is a draft css spec called <a href="http://dev.w3.org/csswg/css-containment/" target="_blank">containment</a> which will hint to the browser in much the same way as the will-change property that this element will not affect the rest of the DOM tree.
The containment spec requires certain properties, such as no scrolling and fixed dimensions.

```css
{
    height: <fixed value>;
    width: <fixed value or a %>;
    overflow: hidden;
    position: absolute;
    contain: strict; // In draft
}
```

Containment could be done in browsers previously, but it relied on the element having certain properties before it would have layout boundaries, such as a fixed height and no scroll and relied upon the browser's implementation.

Containment is really good because it makes explicit as a performance enhancement what was previously a full set of properties. The performance gains from these could not be relied upon in every browser and using styling hacks for perf feels messy.

Containment will enforce the styling neccessary for the performance which means it could potentially collapse down a box without a height and width set (either to 300px x 150px or to 0 x 0). It will clip all content outside of itself.

***Note:*** Layout Containment is _not_ style containment as defined in the web components spec.  Style containment stops custom elements styling affecting other elements; layout containment is a css property in draft to aid performance by allowing the browser to isolate elements from the rest of the DOM's layout tree.

# References
* <a href="http://dev.w3.org/csswg/css-containment/" target="_blank">Containment Spec</a>
* <a href="https://github.com/wilsonpage/fastdom" target="_blank">Fastdom - Library to avoid read/write loop</a>
* <a href="http://csstriggers.com/" target="_blank">CSS Triggers</a>
* <a href="https://css-tricks.com/things-chrome-dev-summit-2014/" target="_blank">Great Paul Lewis talk</a>
* <a href="http://lanyrd.com/2015/extwebsummit/" target="_blank">2015 Extensible Web Summit.</a>
