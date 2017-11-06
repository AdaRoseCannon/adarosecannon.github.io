---
layout: post
title:  "Executable line noise"
categories: Blog
author: Ada Rose Cannon
---

Sometimes being concise is not the way forward.
Code you write conveys a certain amount of information per line.
Information dense code may feel neat and pretty but, unless it is idiomatic code with well known effects, it may be difficult for others to read.

This post is about coding style thus is an opinion piece about a highly inflammatory subject.

I write code for two audiences:

1. People who may be new to the language,
2. Future versions of myself.

(Almost entirely the second)

I happen to like myself. Unfortunately past Ada often makes mistakes future Ada needs to fix.
As present time Ada it is the least I can do to write code so that my good friend, future Ada, can repair my code easily.

The source code we write as developers is primarily to be written for _Humans_.
The aim of a programming language is to maximise Human legibility whilst maintaining precision of language and the ability for it to be parsed by a largely dumb compiler.
Consider each file as a letter we are writing to future developers about what we tried to do, this file, coincidentally, can also be transformed into instructions for a computer.

One should assume the code one writes is broken.
Provide all the hints so that someone who has never seen it your code can repair it.
Not because one is a poor developer; but _your code will only be read when it is broken_.

No software greater than 0 bytes is bug free. There will be unexpected edge cases or new use cases. When that comes someone will need to read it, probably you. Make life easy on yourself.

Your code in reading it should describe itself through the code or the comments to future developers.


# Code density

Programming languages like most spoken and written languages convey information in a String of symbols.

You can intuit information density as the information represented in a string of certain length. e.g.

```
More dense:

1+1=2

Less dense:

One plus One equals Two.

```

For example when reading an article, a document which has all of it's _relevant_ information in a single place in the document suffers from a few problems.

* Readers may gloss over the important section when scanning the document having got bored with the irrelevant parts.
* Readers may not get how important that section is because it is surrounded in low density information.
* Subtle details may be missed because too many things are being expressed close together.

Code with lots of boilerplate suffers from this. Really important points are lost amid a sea of irrelevant information. By separating the boilerplate code, code with similar information density is kept together.

## Not dense enough

In the example above both lines describe the same axiom, but the first example makes more immediate sense. We often like to make our phrases more concise to allow them to be gleaned in a single glance. For the example above the terse numerical sense is simple enough to be understood straight away but the longer phrase needs to have a bit more work done to understand it.

When reading our code one issue we have is boilerplate.
Boilerplate is content in our code which contains no information *useful to _us_*. Whether it is information for the compiler or for setting up a framework.
In stretching the previous letter metaphor it is the pleasantries and small talk at the beginning and end which is not what concerns us when we have a job to do.
The information contained in boilerplate code is not useful in helping us to complete our task at hand. It is intended for the computer, but the computer is not our audience.

If we define information as only the information we care about, boilerplate reduces the information density of our source code without improving the clarity. This can make it harder to work out what a piece of code is intended for because it is too hard to see the proverbial forest through all the trees.

In cases like this I can't help but feel it would be nice if it was possible to do compiler ignored formatting to highlight interesting parts or dim uninteresting parts to aid reading later.

One of the methods people get around boiler plate is by abstracting it away in other files/modules or moving each piece of useful content into it's own module. This allows for lots of pieces of concise content with our intentions specifically declared. Like a selection terse telegrams sent with a cover letter full of pleasantries (boiler plate).

Lots of more modern languages and libraries try to reduce the amount of boilerplate which needs to be present so that each line represents a decision made by the developer to complete a task which needs to be accomplished.

Unfortunately this needs to be done judiciously, as each module you separate your content into needs to be found by the developer and is another interface for them to remember.

If you find yourself having to produce many files full of text before you can even get your code to run any code what so ever you may be having trouble.

This can be known as Lasagne Code.

The types of language where this might be an issue tend to be compiled languages.

```
Insert hilariously verbose JAVA hello world.
```

## Too long

Having to remember what is in scope. If you write code with small scope from the start then it will make refactoring into smaller modules later much easier.

Don't put anything in global or module scope if you can avoid it.

Even the smallest script can grow to the point where it needs to be divided.

let, const

## Too dense

Many languages allow you to be very terse, especially scripting languages. I am primarily a JavaScript developer and have picked up many tricks over the (too many) years.

In my drive for writing concise code I have often

```
// Crazy JS example.
```

```
// Crazy Perl
```

>> We get you're very clever; but that is not code that is executable line noise.
>> Clever code is code which educates not obfuscates; really great code should illicit the feeling off "Oh I had never thought about it like that before!" rather than "huh, I don't get what is happening there."

Code like this is too information dense to make sense of easily. Information isn't always what is on the surface a simple line of code which takes into account many edge cases or far reaching effects should be visually isolated and/or commented to key the developer that this line of code is a wolf in sheep's clothing.

Code like this is hard to maintain if, like me, you are not an infallible developer you probably will have to make changes. In disrupting your elegant code you may be tempted to maintain the structure and turn something elegant into a Frankenstein's monster.

* Refactoring
* * Reducing scope
* * `:?`Ternary operator
* * Boolean operators && ||
* * Bitwise Operations & | ^ ~
* * `!!~string.indexOf(subString);`
* * Examples from ha-ha JavaScript is behaving so weird
* * Fat arrows are both wonderful but also cause many bad habits.

If you can't bring yourself to abandon your elegant solution, then you need to explain it in detail.

In my opinion, Good comments, should be in the order:

```
// What this line does in the content of the script
// Break down of how it does it and potential edge cases it accounts for
// Why this is the optimal solution
```

Exceptions:

Patterns, Idioms:

IIFE

> Language which can be prone to this issue: Perl

## Syntatic Sugar

Syntactic sugar is when patterns which were previously implemented verbosely become part of the spec for a language behind a simple keyword. English is full of Syntactic Sugar when we've poached, borrowed, copied and stole words from other cultures.

```
That feeling you get when you are happy at someone elses misfortune

becomes

Schaudenfreude
```

In JavaScript ES2015 it seemed to gain a lot of syntactic sugar, here is one example:
<div>
```javascript

	function MyClass(arg1, arg2) {
		this.prop1 = arg1;
	}

	MyClass.prototype.myMethod2 = function myMethod2() {
		console.log(this.prop1);
	}

	// becomes

	class MyClass {
		constructor(arg1) {
			this.prop1 = arg1;
		}

		myMethod() {
			console.log(this.prop1);
		}
	}

```
</div>
I have seen complaints about Syntactic sugar being flawed because it hides behaviour behind syntax so reduces how explicit code is, because there is some implicit behaviour.

I would like to disagree, and say that syntactic sugar makes code more explicit because it makes the authors intent more explicit. Syntactic sugar hides commonly used idioms behind well defined syntax. Idioms have the problem that they tend to only well known to more senior developers. To someone new to the language some Idioms may be hard to understand.

Syntactic sugar is easier to look up in documentation and will have it's side effects well defined unlike idioms which due to their word of mouth nature may have behaviour which the person writing them maybe unaware of.

## Just right

Like an essay delivered via telegram. Encapsulated paragraphs of logic but maintaining a consistent theme.


> Language which can be prone to this: Your favourite language, if written carefully.

## Whitespace

Opening a can of worms..

Do what ever is appropriate, snake poem, ouroborus code.

Promises, generators and loss of pyramid code. WHitespace  with .then() and dangling semi-colon.

## Linting

I've been known to be a stickler for linting, even been accused of being a human linter. And it is true I do think linting is important because by making the syntax uniform it makes it ignorable. Increasing the clarity of the authors original intentions.

I believe linting rules should be allowed to be broken when it makes the authors intent clearer. If you really feel you need 3 lines of whitespace around that statement then do it. It must do something extremely important. Add a comment too to explain why it is important that this statement be noticed and understood.

## Breaking code into files
<blockquote>
<pre style="height: 15em; overflow: scroll; display: block;">
	./FizzBuzzEnterpriseEdition
	├── CONTRIBUTING.md
	├── pom.xml
	├── README.md
	├── resources
	│   └── assets
	│       └── configuration
	│           └── spring
	│               └── dependencyinjection
	│                   └── configuration
	│                       └── spring.xml
	└── src
	    ├── main
	    │   └── java
	    │       └── com
	    │           └── seriouscompany
	    │               └── business
	    │                   └── java
	    │                       └── fizzbuzz
	    │                           └── packagenamingpackage
	    │                               ├── impl
	    │                               │   ├── ApplicationContextHolder.java
	    │                               │   ├── factories
	    │                               │   │   ├── BuzzStrategyFactory.java
	    │                               │   │   ├── BuzzStringPrinterFactory.java
	    │                               │   │   ├── BuzzStringReturnerFactory.java
	    │                               │   │   ├── EnterpriseGradeFizzBuzzSolutionStrategyFactory.java
	    │                               │   │   ├── FizzBuzzOutputGenerationContextVisitorFactory.java
	    │                               │   │   ├── FizzStrategyFactory.java
	    │                               │   │   ├── FizzStringPrinterFactory.java
	    │                               │   │   ├── FizzStringReturnerFactory.java
	    │                               │   │   ├── IntegerIntegerPrinterFactory.java
	    │                               │   │   ├── IntegerIntegerStringReturnerFactory.java
	    │                               │   │   ├── LoopComponentFactory.java
	    │                               │   │   ├── NewLineStringPrinterFactory.java
	    │                               │   │   ├── NewLineStringReturnerFactory.java
	    │                               │   │   ├── NoFizzNoBuzzStrategyFactory.java
	    │                               │   │   └── SystemOutFizzBuzzOutputStrategyFactory.java
	    │                               │   ├── loop
	    │                               │   │   ├── LoopCondition.java
	    │                               │   │   ├── LoopContext.java
	    │                               │   │   ├── LoopFinalizer.java
	    │                               │   │   ├── LoopInitializer.java
	    │                               │   │   ├── LoopRunner.java
	    │                               │   │   └── LoopStep.java
	    │                               │   ├── Main.java
	    │                               │   ├── math
	    │                               │   │   └── arithmetics
	    │                               │   │       ├── IntegerDivider.java
	    │                               │   │       └── NumberIsMultipleOfAnotherNumberVerifier.java
	    │                               │   ├── parameters
	    │                               │   │   └── DefaultFizzBuzzUpperLimitParameter.java
	    │                               │   ├── printers
	    │                               │   │   ├── BuzzPrinter.java
	    │                               │   │   ├── BuzzStringPrinter.java
	    │                               │   │   ├── FizzPrinter.java
	    │                               │   │   ├── FizzStringPrinter.java
	    │                               │   │   ├── IntegerIntegerPrinter.java
	    │                               │   │   ├── IntegerPrinter.java
	    │                               │   │   ├── NewLinePrinter.java
	    │                               │   │   └── NewLineStringPrinter.java
	    │                               │   ├── StandardFizzBuzz.java
	    │                               │   ├── strategies
	    │                               │   │   ├── adapters
	    │                               │   │   │   ├── FizzBuzzOutputStrategyToFizzBuzzExceptionSafeOutputStrategyAdapter.java
	    │                               │   │   │   └── LoopContextStateRetrievalToSingleStepOutputGenerationAdapter.java
	    │                               │   │   ├── BuzzStrategy.java
	    │                               │   │   ├── comparators
	    │                               │   │   │   ├── doublecomparator
	    │                               │   │   │   │   ├── FirstIsLargerThanSecondDoubleComparator.java
	    │                               │   │   │   │   └── FirstIsSmallerThanSecondDoubleComparator.java
	    │                               │   │   │   └── integercomparator
	    │                               │   │   │       ├── IntegerForEqualityComparator.java
	    │                               │   │   │       ├── ThreeWayIntegerComparator.java
	    │                               │   │   │       └── ThreeWayIntegerComparisonResult.java
	    │                               │   │   ├── constants
	    │                               │   │   │   ├── BuzzStrategyConstants.java
	    │                               │   │   │   ├── FizzStrategyConstants.java
	    │                               │   │   │   └── NoFizzNoBuzzStrategyConstants.java
	    │                               │   │   ├── converters
	    │                               │   │   │   └── primitivetypesconverters
	    │                               │   │   │       ├── DoubleToIntConverter.java
	    │                               │   │   │       └── IntToDoubleConverter.java
	    │                               │   │   ├── EnterpriseGradeFizzBuzzSolutionStrategy.java
	    │                               │   │   ├── FizzStrategy.java
	    │                               │   │   ├── NoFizzNoBuzzStrategy.java
	    │                               │   │   ├── SingleStepOutputGenerationStrategy.java
	    │                               │   │   ├── SingleStepPayload.java
	    │                               │   │   └── SystemOutFizzBuzzOutputStrategy.java
	    │                               │   ├── stringreturners
	    │                               │   │   ├── BuzzStringReturner.java
	    │                               │   │   ├── FizzStringReturner.java
	    │                               │   │   ├── IntegerIntegerStringReturner.java
	    │                               │   │   └── NewLineStringReturner.java
	    │                               │   └── visitors
	    │                               │       ├── FizzBuzzOutputGenerationContext.java
	    │                               │       └── FizzBuzzOutputGenerationContextVisitor.java
	    │                               └── interfaces
	    │                                   ├── factories
	    │                                   │   ├── FizzBuzzOutputStrategyFactory.java
	    │                                   │   ├── FizzBuzzSolutionStrategyFactory.java
	    │                                   │   ├── IntegerPrinterFactory.java
	    │                                   │   ├── IntegerStringReturnerFactory.java
	    │                                   │   ├── IsEvenlyDivisibleStrategyFactory.java
	    │                                   │   ├── OutputGenerationContextVisitorFactory.java
	    │                                   │   ├── StringPrinterFactory.java
	    │                                   │   └── StringStringReturnerFactory.java
	    │                                   ├── FizzBuzz.java
	    │                                   ├── loop
	    │                                   │   ├── LoopContextStateManipulation.java
	    │                                   │   ├── LoopContextStateRetrieval.java
	    │                                   │   └── LoopPayloadExecution.java
	    │                                   ├── parameters
	    │                                   │   └── FizzBuzzUpperLimitParameter.java
	    │                                   ├── printers
	    │                                   │   ├── DataPrinter.java
	    │                                   │   ├── IntegerPrinter.java
	    │                                   │   └── StringPrinter.java
	    │                                   ├── strategies
	    │                                   │   ├── FizzBuzzExceptionSafeOutputStrategy.java
	    │                                   │   ├── FizzBuzzOutputStrategy.java
	    │                                   │   ├── FizzBuzzSolutionStrategy.java
	    │                                   │   ├── IsEvenlyDivisibleStrategy.java
	    │                                   │   ├── OutputGenerationStrategy.java
	    │                                   │   └── SingleStepOutputGenerationParameter.java
	    │                                   ├── stringreturners
	    │                                   │   ├── IntegerStringReturner.java
	    │                                   │   └── StringStringReturner.java
	    │                                   └── visitors
	    │                                       ├── OutputGenerationContext.java
	    │                                       └── OutputGenerationContextVisitor.java
	    └── test
	        └── java
	            └── FizzBuzzTest.java
</pre>
  Directory tree from <a href="https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition">FizzBuzz Enterprise Edition</a>, Java FizzBuzz Implementation
</blockquote>

> ```javascript
 for (var i = 1; i <= 100; i++) {
   var f = i % 3 == 0, b = i % 5 == 0;
   console.log(f ? b ? "FizzBuzz" : "Fizz" : b ? "Buzz" : i);
 }
```
> FizzBuzz in JavaScript by [Paul Irish](http://twitter.com/paul_irish)
>
> from [https://gist.github.com/jaysonrowe/1592432](https://gist.github.com/jaysonrowe/1592432)
