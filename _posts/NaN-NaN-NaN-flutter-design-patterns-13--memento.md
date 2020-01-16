---
layout: post
title: "Flutter Design Patterns: 13 — Memento"
description: "In the last article, I have analysed a relatively popular design pattern — Command. In this article, I would like to analyse and implement a behavioural design pattern which works pretty well alongside the Command pattern — it is Memento."
categories: Blog
author: undefined
star: 0
---

# Flutter Design Patterns: 13 — Memento

An overview of the Memento design pattern and its implementation in Dart and Flutter

![](https://cdn-images-1.medium.com/max/4000/1*dhtptlVokmtXCZsVlnJN-w.png)

In the last [article](https://medium.com/@mkazlauskas/flutter-design-patterns-12-command-e199172e16eb), I have analysed a relatively popular design pattern — Command. In this article, I would like to analyse and implement a behavioural design pattern which works pretty well alongside the Command pattern — it is Memento.

## Table of Contents

* What is the Memento design pattern?

* Analysis

* Implementation

* Other articles in this series

* Your contribution

## What is the Memento design pattern?

![Making a snapshot of the current world’s state ([source](https://media.giphy.com/media/rb8bzxbHkOBAA/giphy.gif))](https://cdn-images-1.medium.com/max/2000/1*dKZW3Ad5Zi6RFZ6saX0DwQ.gif)*Making a snapshot of the current world’s state ([source](https://media.giphy.com/media/rb8bzxbHkOBAA/giphy.gif))*

**Memento**, also known as **Token**, belongs to the category of behavioural design patterns. The intention of this design pattern is described in the [GoF book](https://en.wikipedia.org/wiki/Design_Patterns):
> Without violating encapsulation, capture and externalize an object’s internal
state so that the object can be restored to this state later.

The key idea in this pattern is to make an object (**originator**) itself responsible for saving and restoring its internal state. The internal state (a snapshot of it) is saved in another object — **memento**. The undo mechanism will request a memento from the originator when it needs to restore the originator’s internal state. Clients (**caretaker**) that are responsible for saving and restoring an originator’s internal state stores a list of memento objects so that a memento can be passed back to the originator to restore to a previous state. However, the caretaker itself isn’t permitted to access or modify a memento — only the originator object which created the specific memento is allowed to do that.

To understand the Memento design pattern better, let’s dive in by analysing its structure and implementation in more detail!

## Analysis

The general structure of the Memento design pattern looks like this:

![Structure of the Memento design pattern ([source](https://refactoring.guru/images/patterns/diagrams/memento/structure2.png))](https://cdn-images-1.medium.com/max/2000/1*URvkRDrmtMCq35bbN0mCcA.png)*Structure of the Memento design pattern ([source](https://refactoring.guru/images/patterns/diagrams/memento/structure2.png))*

* *Memento* — an interface which restricts access to the *ConcreteMemento’s *fields, only declares methods related to the memento’s metadata and which is used by the *Caretaker *to work with *ConcreteMemento* object;

* *ConcreteMemento* — stores an *Originator’s* internal state. Also, protects against access by objects other than the *Originator *which has created the *ConcreteMemento*.

* *Caretaker *— is responsible for the *Memento’s *safekeeping and never operates or examines the contents of a *Memento*.

* *Originator *— creates a *ConcreteMememnto *containing a snapshot of its current internal state. Also, provides the *restore() *method to restore the internal state using the *ConcreteMemento*.

### Applicability

The Memento design pattern should be used when you want to produce snapshots of the object’s state to be able to restore a previous state of the object. The Memento pattern lets you make full copies of an object’s state, including private fields, and store them separately from the object.

Also, the pattern could be used for the safety reasons — when direct access to the object’s fields/getters/setters violates its encapsulation. The Memento makes the object itself responsible for creating a snapshot of its state. No other object can read the snapshot, making the original object’s state data safe and secure.

## Implementation

![](https://cdn-images-1.medium.com/max/2000/1*Ekt-1VpXyVROw8RQOIMtKw.gif)

To implement the Memento design pattern and show its advantages, we will work further on the Command design pattern’s example. So if you have missed the [previous article](https://medium.com/@mkazlauskas/flutter-design-patterns-12-command-e199172e16eb), I strongly recommend checking the implementation part of it now.

The main idea of the example remains the same — we will create a very simple, fake graphics editor. To simplify the Command design pattern’s part, only one command is created and available in the example’s UI — *RandomisePropertiesCommand*. This command randomises all the properties of the Shape object — height, width and colour — which acts as a state of our example.

Obviously, what is different from the previous implementation — the Memento design pattern is added. When implementing the Command design pattern’s example, we stored its state (Shape object) in the example component itself. This time, the state is stored inside the Originator object and could be manipulated only by it. The *RandomisePropertiesCommand *acts as a caretaker object and stores the previous snapshot of the originator’s state in the *backup* property. The *backup *property is nothing else than the *Memento *object which is created by the originator before executing the command.

As a result of using the Memento design pattern, the example’s state is encapsulated and moved outside from the example component. Also, the previous state could be restored from its Memento snapshot on *undo()* operation of the command. In this case, the Memento design pattern extends the Command design pattern and collaborates with it really well.

Before implementing the Memento design pattern and integrating it inside our example, let’s check the class diagram first and investigate its components.

### Class diagram

The class diagram below shows the implementation of the Memento design pattern:

![Class Diagram — Implementation of the Memento design pattern](https://cdn-images-1.medium.com/max/2000/1*gEyUnMNCO1518kGIpJX8Kw.png)*Class Diagram — Implementation of the Memento design pattern*

*ICommand* is an abstract class which is used as an interface for the specific command:

* *execute()* — an abstract method which executes the command;

* *undo()* — an abstract method which undoes the command and returns the state to the previous snapshot of it.

*RandomisePropertiesCommand* is a concrete command which implements the abstract class *ICommand* and its methods.

*CommandHistory* is a simple class which stores a list of already executed commands (*commandList*) and provides methods to add a new command to the command history list (*add()*) and undo the last command from that list (*undo()*).

*IMemento* is an abstract class which is used as an interface for the specific memento class:

* *getState()* — an abstract method which returns the snapshot of the internal originator’s state.

*Memento* is a class that acts as a snapshot of the originator’s internal state which is stored in the *state* property and returned via the *getState()* method.

*Shape* is a simple data class which is used as an internal originator’s state. It stores multiple properties defining the shape presented in UI: *color*, *height* and *width*.

*Originator *— a simple class which contains its internal state and stores the snapshot of it to the *Memento* object using the *createMemento()* method. Also, the originator’s state could be restored from the provided *Memento* object using the *restore()* method.

*MementoExample* initializes and contains *CommandHistory*, *Originator* objects. Also, this component contains a *PlatformButton* widget which has the command of *RandomisePropertiesCommand* assigned to it. When the button is pressed, the command is executed and added to the command history list stored in *CommandHistory* object.

### Shape

A simple class to store information about the shape: its color, height and width. Also, this class contains several constructors:

* *Shape()* — a basic constructor to create a shape object with provided values;

* *Shape.initial()* — a named constructor to create a shape object with pre-defined initial values;

* *Shape.copy()* — a named constructor to create a shape object as a copy of the provided *Shape* value.

<iframe src="https://medium.com/media/a80a28386b0105d72a97f753d26c2b1f" frameborder=0></iframe>

### ICommand

An interface which defines methods to be implemented by the specific command classes. Dart language does not support the interface as a class type, so we define an interface by creating an abstract class and providing a method header (name, return type, parameters) without the default implementation.

<iframe src="https://medium.com/media/c06cc6d1a8a977ac9e9d28e655f1437c" frameborder=0></iframe>

### RandomisePropertiesCommand

A specific implementation of the command which sets all the properties of the *Shape* object stored in the *Originator* to random values. Also, the class implements the *undo* operation.

<iframe src="https://medium.com/media/a504553fa0104b66858682e3f89d7084" frameborder=0></iframe>

### CommandHistory

A simple class which stores a list of already executed commands. Also, this class provides *isEmpty* getter method to return true if the command history list is empty. A new command could be added to the command history list via the *add()* method and the last command could be undone using the *undo()* method (if the command history list is not empty).

<iframe src="https://medium.com/media/d33d548d95d794624aa652f5df51c9d4" frameborder=0></iframe>

### IMemento

An interface which defines the *getState()* method to be implemented by the specific Memento class.

<iframe src="https://medium.com/media/07f247fe978bda49cce26264eb8991c7" frameborder=0></iframe>

### Memento

An implementation of the *IMemento* interface which stores the snapshot of *Originator’s* internal state (*Shape* object). The state is accessible to the *Originator* via the *getState()* method.

<iframe src="https://medium.com/media/b9e343897ece5bfdb09851b40ab7d19a" frameborder=0></iframe>

### Originator

A class which defines a *createMemento()* method to save the current internal state to a *Memento* object.

<iframe src="https://medium.com/media/2c75b7aba40e1b6c4b92f011abd9c638" frameborder=0></iframe>

### Example

First of all, a markdown file is prepared and provided as a pattern’s description:

![](https://cdn-images-1.medium.com/max/2000/1*XWYf-bTkoErFj_Tieq5uKg.gif)

*MementoExample* contains *CommandHistory* and *Originator* objects. Also, this widget contains a *PlatformButton* component which uses the *RandomisePropertiesCommand* to randomise property values of the shape. After the command’s execution, it is added to the command history list stored in the *CommandHistory* object. If the command history is not empty, the *Undo* button is enabled and the last command could be undone.

<iframe src="https://medium.com/media/19cfec7c72bd10d4a0aff50617024275" frameborder=0></iframe>

As you can see in this example, the client code (UI elements, command history, etc.) isn’t coupled to any specific command class because it works with it via the *ICommand* interface.

In addition to what the Command design pattern provides to this example, the Memento design pattern adds an additional layer on the example’s state. It is stored inside the Originator object, the command itself does not mutate the state directly but through the Originator. Also, the backup (state’s snapshot) stored inside the Command is a Memento object and not the state (Shape object) itself — in case of the state’s restore (undo is triggered on the command), the specific command calls the restore method on the Originator which restores its internal state to the value stored in the snapshot. Hence, it allows restoring multiple property values (a whole complex state object) in a single request, while the state itself is completely separated from the command’s code or UI logic.

![](https://cdn-images-1.medium.com/max/2000/1*BdSW1MGa2Vnlh39iHwMSXg.gif)

As you can see in the example, when the command is executed, under the hood the snapshot of originator’s internal state is stored which could be restored later by executing the undo operation on the command.

All of the code changes for the Memento design pattern and its example implementation could be found [here](https://github.com/MangirdasKazlauskas/flutter-design-patterns/pull/14).

## Other articles in this series

* [0 — Introduction](https://medium.com/@mkazlauskas/flutter-design-patterns-0-introduction-5e88cfff6792)

* [1 — Singleton](https://medium.com/@mkazlauskas/flutter-design-patterns-1-singleton-437f04e923ce)

* [2 — Adapter](https://medium.com/@mkazlauskas/flutter-design-patterns-2-adapter-3f05c02a7c84)

* [3 — Template Method](https://medium.com/@mkazlauskas/flutter-design-patterns-3-template-method-89799d84e378)

* [4 — Composite](https://medium.com/@mkazlauskas/flutter-design-patterns-4-composite-23473cccf2b3)

* [5 — Strategy](https://medium.com/@mkazlauskas/flutter-design-patterns-5-strategy-ef9cf5b5b694)

* [6 — State](https://medium.com/@mkazlauskas/flutter-design-patterns-6-state-be06cb05525c)

* [7 — Facade](https://medium.com/@mkazlauskas/flutter-design-patterns-7-facade-eb40434fb973)

* [8 — Interpreter](https://medium.com/@mkazlauskas/flutter-design-patterns-8-interpreter-8f15e9de3ee9)

* [9 — Iterator](https://medium.com/@mkazlauskas/flutter-design-patterns-9-iterator-8da27ee83c17)

* [10 — Factory Method](https://medium.com/@mkazlauskas/flutter-design-patterns-10-factory-method-c53ad11d863f)

* [11 — Abstract Factory](https://medium.com/@mkazlauskas/flutter-design-patterns-11-abstract-factory-7098112925d8)

* [12 — Command](https://medium.com/@mkazlauskas/flutter-design-patterns-12-command-e199172e16eb)

## Your contribution

👏 Press the clap button below to show your support and motivate me to write better!
💬 Leave a response to this article by providing your insights, comments or wishes for the series.
📢 Share this article with your friends, colleagues in social media.
➕ Follow me on Medium.
⭐ Star the [Github](https://github.com/MangirdasKazlauskas/flutter-design-patterns) repository.

