<h1 align="center">
📦 Web Components in React ⚛️
</h1>

<h4 align="center">
Use web components in React as if they were regular React components. Zero dependencies adapter.
</h4>

<hr>

## Features <!-- omit in toc -->

- Use your web component seamlessly inside of React
- Declaratively listen to your web component's event in React. 
- Pass rich data (like objects and arrays) from your React components to your web component
- Remove the need to use `Refs`


## Table of contents <!-- omit in toc -->
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Getting started](#getting-started)
- [How does it work?](#how-does-it-work)
- [Registering a Web Component](#registering-a-web-component)
- [Handling Events](#handling-events)
- [Passing Data](#passing-data)
- [Advanced Usages](#advanced-usages)


## The Problem

We ❤️ React and we ❤️ web components.
But let's face it: Those guys don't really get along. 

React's synthetic events do not align well with `Custom Events` used by web components and passing rich data from React to your web component? It's tedious.

We need to make use of `Refs` and imperatively interact with our web components.
Check [Custom Elements Everywhere](https://custom-elements-everywhere.com/libraries/react/results/results.html) for details.

## The Solution
Let's fix this:
**Web Components in React** brings a small adapter that handles the 
tedious boilerplate of setting up (and removing!) event listeners and updating props imperatively so we can use our web components in React like we would use any other React component.

## Getting started

Install the library with

```bash
npm install --save webcomponents-in-react
```


Let's assume we have a web component called `my-calendar` that we want to use in our React app. 

Let's create a file `calendar_adapter.jsx`.
To create an adapter component, all we need to do is to call the `adapt` function from `webcomponents-in-react`.

```jsx
import {adapt} from "webcomponents-with-react"

const MyCalendar = adapt('my-calendar');

// this is now a React component
export default MyCalendar;
```

We can use in inside of our React app along side our regular components without any difference:

```jsx
import React, {useState} from "react";
import MyCalendar from "./my-calendar";
import RegularReactComponent from "./regular-react-component"

const App = () => {
    const [richDataState, setRichDataState] = useState({foo : 1, bar: 2});

    return (
        <div>
            <MyCalendar value={richDataState} 
                        onChange={e => setRichDataState(e)}>
            </MyCalendar>

            <RegularReactComponent  value={richDataState} 
                                    onChange={e => etRichDataState(e)}>
            </RegularReactComponent>
        </div>
    )

}

```

## How does it work?

The `adapt` function creates a React components that's renders the web component and set's up all the necessary event listeners. Any function that gets passed to the React component will be treated as an event listener and will be set up accordingly.

Any rich data passed to the component will be passed on to the web component by setting it's properties (rather than it's attributes).

## Registering a Web Component

`Web Components in React` only renders the web component. It does not register them. Please make sure that you have have registered your web component with `customElements.define` if you want to use the adapter.

Note: It's totally possible to call the `adapt` function before registering your web component in the browser.

## Handling Events

You can pass any function to the React component and it will set up the corresponding event listener on the web component.

To match the respective naming conventions for both technologies only functions starting with `on` will be processed. The on prefixed will be removed for the web component's event name.

Here's a few examples:

| React Component | Web Component |
| :-------------: | :-----------: |
|    onChange     |    change     |
|     onInput     |     input     |
|     onClick     |     click     |

Please check [advanced usages](#advanced-usages) to learn how to adjust the name mapping to your needs.


## Passing Data

You can pass in any data to the React Component. It will make sure to pass in primitive data as attributes as well as rich data as properties.


## Advanced Usages

If your web component follow a different naming convention you can override the default behavior by passing in a map as the second argument to the `adapt` function. Let's assume you would like to map `onChange` in React to your web component's event called `input`.

You can simply pass in a map with the `key` being the event's name of your React Component and the `value` representing the web component's event name.

```jsx
import {adapt} from "webcomponents-in-react"

const MyComponent = adapt("my-component", {
    "onChange" : "input"
})
```

This will now call the `onChange` handler of your React component every time that the web components fires an `input` event.

Note: All events you don't explicitly override will continue to follow the default behavior.







