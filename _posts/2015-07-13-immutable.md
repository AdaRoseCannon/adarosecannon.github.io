---
layout: post
title:  "Const & Immutable Objects"
categories: Blog
author: Ada Rose Cannon
image: https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Pusa_hispida_pup.jpg/1023px-Pusa_hispida_pup.jpg
star: 1
---

ES6 introduces the `const` keyword. One issue I've seen raised a few times by people who are skilled with Javascript but unfamiliar with ES6 is confusion because when an object is defined using const it is not immutable.

The goal of this blog post is to go into detail about const and cover some ways ES6 handles immutability.

One question I've been asked a few times recently is in the following situation:

<div>
```javascript
// This Array will be populated later
const myArray = [];

// this Object too:
const myObject = {};
```
</div>

> > If myArray and myObject are const how can you populate them later?

## What is const, how is it different from var?

The `const` keyword declares a constant variable.
Like its mutable counterpart `let`, const is block scoped (i.e. the variable will be defined only within its enclosing block as indicated by curly brackets, `if`, `for`, `while` etc).
This prevents variables being [hoisted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting) outside of their block statement. You can read about <a href="#block-scoping">Block scoping at the bottom of this article</a>.

## The Immutability of Const

The property of const that differentiates it from `let` is that the value assigned to it will not change if it is updated. For example:

```javascript
const myVar = 2;
// undefined
myVar = 3;
// 3
myVar
// 2
```

<div class="notebene">
When trying to overwrite a const variable the variable is left unchanged.
It does NOT throw an error unless you are in strict mode.
</div>

#### But what about with Arrays and other Objects?

A well known subtlety of JavaScript is that, much like other C based languages, when a new `Array`, `Object`, `Function` or another object is declared, what is returned is not the value itself but a reference to what we just created.

In the case of Arrays, it is not the array itself which cannot change but the reference to the array.

```javascript
const myArray = [];
// undefined

// Array can be modified in place
myArray.push(3);
// 1
myArray
// [3]

// Array cannot be overwritten
myArray = [5, 6];
// [5, 6]
myArray
// [3]
```

This is good because it allows us to declare that this array should not be overridden and will maintain the same memory space. This is a good property because we will not be creating new Arrays and Objects and using up lots of memory needlessly.

<div class="notebene">
In JavaScript strings are primitives, not objects like arrays. So like other primitive types, they are immutable if const. This behaviour differs from other C-like languages where strings are usually passed via reference.

```javascript
const myString = "Hello World";
// undefined
myString[0] = "'";
// "'"
myString
// "Hello World"
```
</div>

## What do I do if I want my object to be immutable?

The two new ES6 Object properties Seal and Freeze are for this purpose.

<span class="gallery-item align-right">![Pun Alert: Seal and Freeze!](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Pusa_hispida_pup.jpg/1023px-Pusa_hispida_pup.jpg)<br /> *Pun Alert: Seal and Freeze!*</span>

`Object.seal(myObject)` stops properties being added to or deleted from the object, but you can update the existing properties.

`Object.freeze(myObject)` makes the object totally immutable. Like seal, new properties cannot not be added or removed but also they cannot be changed.
It is important to remember that as with `const`, child Arrays and Objects are just references so although they cannot be replaced they can still be modified.

```javascript
const myObject = {a: {b: 1}, c: 2};

Object.freeze(myObject);
// note myObject is changed in place
// so the object is still frozen even though it is defined with const

myObject.c = 2;
// fails silently if not in strict mode,
// in strict mode it throws an error.

myObject
// {a: {b: 1}, c: 2}

myObject.a.d = 2; // child object is not frozen

myObject
// {a: {b: 1, d: 2}, c: 2}
```

<h2 id="block-scoping">Block scoping of let and const</h2>

The two new variable declaration keywords introduced in ES6, `let` and `const`, are both block scoped.
This means that they only have scope in their block (i.e. between the innermost `{}`).
This is great because it allows variables to be declared in only the smallest possible block of code in which they are used.
`const` and `let` also allow for more explicit code as one can infer what the developer's intentions are with regards to the mutabilty of these variables.

```javascript
if (true) {
  const myVar = 1;
  const myFunc = function (a) { console.log(a) };
  myFunc(myVar);
  // 1
}
myFunc(2);
// ReferenceError: myFunc is not defined

myVar;
// ReferenceError: myVar is not defined
```

In ES5, declaring functions and variables can leave the scope (and memory) cluttered with declared variables not relevant to all the parts of the code they are made available.
The hoisted variables have the value `undefined` before they are initialized and linger after they are used.

If you wanted to further restrict the scope of a variable in ES5 one would use an Immediately-Invoked Function Expression (IIFE).

```javascript

myVar;
// undefined
// note: undefined not reference error because
// myVar has been hoisted from the if block

myFunc();
// TypeError: undefined is not a function
// note: the myFunc declaration has been hoisted
// giving us a not very useful error here

if (true) {
  var myVar = 1;
  function myFunc(a) { console.log(a) };
  myFunc(myVar);
  // 1
}

myVar;
// 1
// this variable is still hanging around even though we should be done with it

myFunc(2);
// 2
// this function is also still around even though we should be done with it.

// To restrict scope in ES5 one would use an IIFE
// (Immediately-Invoked Function Expression)

(function () {
	var scopedVar = 2;
	scopedVar;
	// 2
})();

scopedVar;
// ReferenceError: scopedVar is not defined

```

## Use these today

ES6 provides us with numerous tools to improve developer expressiveness and to make our code cleaner. `const`, `let`, `Object.seal` and `Object.freeze` can all be used today in recent versions of Chrome and Firefox, also IE11.

> I use `const` by default, `let` only where it is required and `var` to identify code which needs to be refactored.
