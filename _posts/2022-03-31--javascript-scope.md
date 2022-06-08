---
layout: post
title: "JavaScript scope and closures"
description: "JavaScript is almost famous for some of it’s weird behaviours around variables. This goal of this article is to make it so that you will never be surprised by the value of `this` or why a variable seems to not change when you set it somewhere else."
category: Blog
author: Ada Rose Cannon
preview: https://miro.medium.com/max/1400/1*Uzrj7mSB1zP3AIq45uXNRg.jpeg
---

JavaScript is almost famous for some of it’s weird behaviours around variables. This goal of this article is to make it so that you will never be surprised by the value of `this` or why a variable seems to not change when you set it somewhere else.

TL;DR: “use strict” is good, JavaScript modules better. Never use `var` , use `const` where possible, use `let` sparingly. Use blocks to scope the impact of variables. The IIFE is a pretty cool pattern. Combined with a good linter you will write code which should hopefully work first time. Or don't, I'm not a cop.

## What’s what and where

## Before “use strict”, const and let

In the beginning when JavaScript was only on the web not the behemoth of a language it is today. Variables were defined with `var` and if they were defined on at the top level of a script (i.e. not in a function) they were also exposed on the global scope and the window object. 

This made using multiple scripts that work together easy since they all shared a scope, but when programs got more complicated it left lots of variables cluttering up the global scope leading to weird and frustrating bugs.

There would be weird behaviour like declaring the same variable twice would not throw an error! So if two scripts used the same variable, or you accidentally give two variables the same name, the first gets overwritten by the second leading to some hard to find bugs.

In the early days you could even get away with forgetting to declare a variable entirely. This would have the unfortunate effect of always putting the variable in the global scope and on the window object even if it was first used in a function. This behaviour is very bad. 

```jsx
test0 = 0;
var test1 = 1;

function runMe() {
  test4 = 4
  var test5 = 5;
}
runMe();
```

- test0 and test1 is in the global scope and exposed as window.test0 and window.test1
- test4 is also on the global scope and exposed as window.test4
- test5 is undefined and undeclared

Interestingly if you use `const` and `let` at the top level here they are not placed on the window object but are still available on global scope.

Because variables in functions are constrained to the scope of that function a common pattern was to contain your script you wanted to not be exposed in an Immediately Invoked Function Expression known as an IIFE (pronounced iffy). A popular pattern most JavaScript bundlers use is to place the whole file inside an IIFE.

```jsx
(function () {
  var cannotEscape = 'I am not declared outside of this function';
}());
```

## Closures

Functions in JavaScript still have access to all the defined variables in it’s parent’s scope and it’s grandparent scope, all the way up to the global scope. This behaviour is known as closures. It’s best practice to limit the scope of a function to only the variables it needs to exist. If a function doesn’t need access to the state of it’s parent closure then it’s usually best to move it up to to an IIFE in the top level to reduce it’s footprint and aid garbage collection. 

As all defined variables in the scope of a function cannot be garbage collected as long as the function itself is still available, this can lead to memory leaks.

For this reason defining functions inside loops is a bad idea because each time it’s created it is a distinct function is created which will eventually need to be collected, which can cause slowness. Even worse, if these functions aren’t able to be garbage collected because they are referenced somewhere else then you have potentially created a memory leak!

[MDN’s article on closures is interesting if this article doesn’t satisfy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

## “use strict”

The strict mode of JavaScript was designed to make JavaScript more reliable by throwing errors for mistakes which previously would’ve been been executed in a way that may have been unexpected to the developer. I.e. forgetting to declare a variable and it accidentally ending up in the global scope making weird things happen. 

To turn on script mode have the first statement in the script be just the string `"use strict";` it can also be invoked on a function level too.

I won’t go into detail on the effects of strict mode the, [strict mode article on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#converting_mistakes_into_errors) covers it well.

The main thing it introduced for us is that trying to use undeclared variables now throw errors. 

Variables defined with `var` still end up on the window object and in global scope. Variables defined with `const` and `let` still are available globally but are not on the window object.

Variables with the same name declared multiple times with `var` still overwrite each other and not throw an error.

## Hoisting

Variables defined with with `var` are declared for the whole closure no matter where in the closure they were defined. The declaration is invisibly “hoisted” to the top. Think of it like hoisting a flag where the flag gets pulled to the top.

The following function does not throw an error. 

```jsx
function () {
  "use strict"
  console.log(p); // undefined
  var p = 2;
}
```

Because this is what is really happening:

```jsx
function () {
  "use strict"
  var p;
  console.log(p); //undefined
  p = 2;
}
```

This is a behaviour you need to look out for when you are using loops. Where the variable is referenced outside of the context of the loop.

```jsx
for (var i=0;i<10;i++) {
  var printMe = "Test " + i;
  setTimeout(function () {console.log(printMe)}, 100)
}
// Prints "Test 9", 10 times
```

Because it’s effectively, updating printMe 10 times then printing the final value of printMe ten times. If you change the `var` to a `let` this bug gets fixed immediately because `let` is block scoped and then each function in the loop has it’s own copy of `printMe` which it can print. 

```jsx
for (var i=0;i<10;i++) {
  let printMe = "Test " + i;
  setTimeout(function () {console.log(printMe)}, 100)
}
```

The hoisting behaviour is not obvious to many people new to the language. So it’s best to explicitly declare your variables at the top of the function scope so you can be clear what exactly is happening.

```jsx
function doSomething() {
  var i=0;
  var output="";
  var intermediate;

  for (i=0;i<10;i++) {
    intermediate = '<span>' + i + '</span>\n'
		output += intermediate;
	}
}
```

## Functions

There are many ways to define a function. A named function is defined as if you used `var`

```jsx
if (true) {
  function myFunc() {

  }
}
myFunc // function
window.myFunc // function
```

is equivalent to:

```jsx
var myFunc;
if (true) {
  myFunc = function () {}
}
myFunc // function
window.myFunc // function
```

The exception is named IIFEs which are not:

```jsx
(function test() {
  console.log(test) // function
}())
test // ReferenceError: test is not defined
```

Named IIFEs are handy for if you want to run something once then reuse the function for other things. Be careful to avoid recursion though!

## Const and Let

These slightly newer ways of describing variables have some really nice properties, that fix most of the weirdness in `var`.  A big difference is that they are never automatically assigned to the window object but they do remain available in the global scope if they are defined there.

`const` and `let` are scoped to their containing [block](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block), i.e. the nearest curly brace the `{}` symbols. This makes them very useful for having variables which are only used in a single loop or if statement.

```jsx
const a = true;
if (a) {
	const b=2;
  console.log(b); // 2
}
console.log(b); // throws an error because b is not defined.
```

If you want to group some logic and it’s associated variables together, now instead of using an IIFE you can use a block statement:

```jsx
{
  const a = 2;
  console.log(a);
}

// labeled block statement
myBlock: {
  const a = 2;
  console.log(a);
}
```

If you try to define a variable with `const` and `let` twice in the same scope an error will be thrown preventing weird bugs from accidentally creating two variables with the same name but child blocks can redeclare the variable and will replace it for that block only.

```jsx
const a=2;
{
  const a=3;
  {
    const a=4;
    console.log(a); // 4
  }
}
console.log(a); // 2
```

Another difference from `var` is that `const` and `let` are never hoisted. So if you try to use them before they are defined you just get a syntax error.

```jsx
(function () {
  "use strict"
  console.log(p); // Error, Cannot access 'p' before initialization
  const p = 2;
}())
```

This also applies if you are going to redefine a variable in the parent lexical scope and try using it before if it is defined an error is thrown.

```jsx
const a=2;
{
  const a=3;
  {
    console.log(a); // Error, Cannot access 'a' before initialization
    const a=4;
    console.log(a);
  }
}
console.log(a);
```

I hope this section has emphasised how useful using `let` and `const` are to writing clean code which minimises the leaking of variables to the outer scopes.

## Const vs Let

We just talked about how `const` and `let` are similar. but how do they differ? 

Essentially `let` can be redefined, `const` cannot.

`const` is very useful for avoiding accidentally replacing a variables value. Which is incredibly useful in an untyped language like JavaScript. When I write code I use `const` by default and only use `let` if I have a need to replace the value. If I use a `let` then I know that I need to be careful.

JavaScript objects assigned to a `const` can still be modified but you cannot replace the object with another object. To prevent modification you need to use [Seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) and [Freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

They are also useful in loops, use `const` for “for of” loops or “for in” loops.

```jsx
for (const el of document.body.children) console.log(el);
```

Use `let` for standard for loops because the value of the variable is modified each iteration.

```jsx
for (let i=0;i<10;i++) console.log(i);
```

The block scoping behaviour of const and let includes `try{}catch(e){}` blocks. This is one situation where using `let` is important. Since `let` and `const` used in these blocks can’t be accessed from outside of them. 

```jsx
let answer;
try {
  answer = canThrow();
} catch (e) {
  answer = null;
}
if (answer !== null) {
  // huzzah
}
```

## Global Behaviour in JavaScript Modules

You can use JavaScript modules by adding them to the DOM with `type="module"` e.g.

```html
<script src="myscript.js" type="module"></script>
```

**Modules are always [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode).** You don’t need to declare strict mode and you can’t not have strict mode.

Unlike with regular script tags variables defined with `var` do not end up on the window object. In addition no variables are ever exposed in the global scope unless you manually assign them to the window object. 

## [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

An almost philosophical question in JavaScript is “Oh so you know JavaScript, then what is `this`?” 

The behaviour of this can seem confusing but there are various tools which make it easier to deal with.

At the top level `this` is the global object. The global object can be accessed any where in your code using `globalThis` ([globalThis on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)) 

```jsx
"use strict"
this // Window {window: Window, self: Window, document: document, name: '', location: Location, …}
this === globalThis // true
```

 In Web Workers this is the global scope for the worker which is different from the window object, which it cannot access. If you want to communicate back to the window you need to use things like postMessage.

```jsx
"use strict"
this // DedicatedWorkerGlobalScope {name: '', onmessage: null, onmessageerror: null, cancelAnimationFrame: ƒ, close: ƒ, …}
this === globalThis // true
```

The value of `this` in a function changes depending on how a function is called. If you call a function which on an object then `this` is set to that object. If you run the same function independently then in strict mode it is undefined. **In this situation when not in not strict mode `this` is the global object which can lead to all sorts of hard to spot errors.**

```jsx
"use strict"
const o = {
    b() {return this}
}
console.log(o.b()) // {b: function () }
const t=o.b;
console.log(t()) // undefined
```

Certain methods which take functions as callbacks will set `this` to be something else. Some examples are `setTimeout` and `setInterval` which will set this to the global object.

```jsx
"use strict"
const o = {
  b() {
    setTimeout(function () {
			console.log(this); // window
		},10)
  }
}
o.b();
```

and `element.addEventListener` callbacks where this will be the element the event listener was set to. In the example below with click set on the body, `this` is set to the body even if the actual element I clicked on was a button and the event bubbled up. 

```jsx
document.body.addEventListener('click', function (e) {
  console.log(this);     // <body>
  console.log(e.target); // <button>
});
```

You can manually set `this` in a few ways. Starting from my most used to least used:

1. **Fat arrow functions,** inherit `this` from where they were defined. 

These are incredibly useful when you are setting events in a class where the accessing the class from inside the event listener function is much more useful than the element that was clicked.

```jsx
"use strict"
const o = {
    a() {
      this.b = ()=>this;  
    }
}
o.a();
console.log(o.b()) // {b: function () }
const t=o.b;
console.log(t()) // {b: function () }
```

1. **function.bind( newThisElement ),** this creates a new function where `this` is fixed to a particular value. If you need to use `removeEventListener` this is really useful because you can define a function bound to where you need it and can then remove it later using the same function definition.

```jsx
"use strict"
const o = {a:2};
function f() {return this.a};
const f1 = f.bind(o);

f1() // 2
```

1. `[function.call](http://function.call)` and `function.apply` , these similar functions allow you to run a function once where the first argument is the new this value and the other arguments are the arguments to use on the function. Read the MDN article to know more, I don’t use these often but are handy to know. [function.apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) [function.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

## Classes

The behaviour for `this` in classes is the same as that for objects so I won’t go over it again. Instead I will look at where you can store variables in classes.
You can set public variables on this as you would expect.

You can declare private variables when you define the class. They can only be accessed from functions defined in the class description. Trying to access them or add functions to access them later results Syntax errors. So they really are private! [Private class fields on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)

```jsx
class A {
  #myPrivate
  constructor(){
      this.myPublic = 'Butts lol'
      this.#myPrivate = 'Hello World'
  }
  get myThing() { return this.#myPrivate} // Optional getter to access the private field
  set myThing(val) { this.#myPrivate = val } // Optional setter to set the private field
}

const test = new A()
test.#myPrivate // Syntax Error
test.hackTheGibson = function () {return this.#myPrivate} // Syntax error too!
test.hackTheGibson2 = function () {return eval('this.#myPrivate')}
test.hackTheGibson2() // Syntax error
```

You can use closures to emulate private data by having data which is only available in a closure in a function.

```jsx
"use strict"
const o = {};
(function () {
  let myPrivate = 'hello world';
  Object.defineProperty(o, 'myThing', {
    get: function () {return myPrivate},
    set: function (val) {myPrivate = val;}
  });
}())
```

Patterns like this with closures are really fantastic and reveal some of the hidden powers of JavaScript.
This book, JavaScript patterns is old but short and really good for seeing some of these patterns for taking advantage of closures to create various features which back then weren’t in the language at all. I strongly recommend it for those who want to get an in depth understanding of how JavaScript works at it’s core.

[https://www.amazon.co.uk/JavaScript-Patterns-Stoyan-Stefanov/dp/0596806752/ref=sr_1_1?crid=3VPWOP6D1L1O4&keywords=javascript+patterns&qid=1648645212&sprefix=javascript+patterns%2Caps%2C84&sr=8-1](https://www.amazon.co.uk/JavaScript-Patterns-Stoyan-Stefanov/dp/0596806752/ref=sr_1_1?crid=3VPWOP6D1L1O4&keywords=javascript+patterns&qid=1648645212&sprefix=javascript+patterns%2Caps%2C84&sr=8-1)
