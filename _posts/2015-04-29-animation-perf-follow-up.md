---
layout: post
title:  "Animation Performance - Follow Up"
categories: Blog
author: Ada Rose Edwards
---

I and someone from slack tried implementing an accordion with the techniques discussed in my [previous post](/blog/2015/04/26/animation-perf/).

This did not work as expected. It had a kind of bouncy effect. This seems to be especially noticable in the accordion case because the change of height is very large.

Example:

<a href="http://jsbin.com/becudutuxe/4/embed?output" target="_blank">http://jsbin.com/becudutuxe/4/embed?output</a>

The reason for this error is that as the transition progresses, from the start (`t=1`) to the end (`t=0`), I had made the assumption that at `t=0.5` the shrinking element would be as proportionally small as the growing one is large.

This is not the case. To illustrate this with an example.

The outer element has grown to `scaleY(5)` it's height and so the inverse transform is applied to the child element to shrink it `scaleY(0.2)`, these will have their transforms removed to animate back to scaleY(1). (This example is the case of an accordion collapsing)

In order to maintain the scale of the child elements the product of the scaleY of both the inner and outer should be 1.

```
| Beginning `t=1` | Middle  `t=0.5`   | End  `t=0`    |
|-----------------|-------------------|---------------|
| `5 × 0.2 = 1` ✓ | `3 × 0.6 = 1.8` X | `1 × 1 = 1` ✓ |
```

In the middle it's too large because the inner element should not scale anti-linearly but scaled inversely. My naive initial attempt was to reproduce the inverse curve as an easing function. This was very flaky and would not match exactly. It also required a different curve for shrinking and growing. It would also vary depending on both the start and end values.

What I did instead was to tween the scale in javascript using request animation frame and apply the inverse scale to the children. This worked marvelously.

It is also still just as performant since there are no DOM reads in the tween only updating a transform which composite only.

This is an edited version of what I did in some proprietary code from habit I iterate `t` from `1` to `0` but you may probably want to do it the other way round for clarity:

```javascript
modules.forEach(module => {
	let newM = module.el.getBoundingClientRect();
	let oldM = oldModuleMeasurements[module._fmid];
	let scale = {
		x: oldM.width/newM.width,
		y: oldM.height/newM.height
	};
	let offset = {
		x: oldM.left - newM.left,
		y: oldM.top - newM.top,
	};

	// If the height has changed inverse scale the children.
	const childEls = Array.prototype.slice.call(module.el.children);
	if (newM.height !== oldM.height) {
		childEls.forEach(el => {
			let elDimensions = el.getBoundingClientRect();
			let offsetFromParent = {
				x: newM.left - elDimensions.left,
				y: newM.top - elDimensions.top
			};
			el.style.transformOrigin = `${offsetFromParent.x}px ${offsetFromParent.y}px 0`;
			childEls.push(el);
		});
	}
	module.el.style.transformOrigin = "0 0 0";

	// Tween the module and it's children.
	let t = 1;
	let duration =  2000;
	function tween() {
		let tScaleX = 1 + (scale.x - 1) * t;
		let tScaleY = 1 + (scale.y - 1) * t;
		let tOffsetX = offset.x * t;
		let tOffsetY = offset.y * t;
		module.el.style.transform = `scale(${tScaleX}, ${tScaleY}) translate(${tOffsetX}px, ${tOffsetY}px)`;
		if (newM.height !== oldM.height) {
			childEls.forEach(el => {
				el.style.transform = `scale(${1/tScaleX}, ${1/tScaleY})`;
			});
		}
		t -= 16/duration;
		if (t > 0) {
			requestAnimationFrame(tween);
		}
	}
	tween();
});
```

The css transform is still a good solution in many cases and does not require as much javascript work.
