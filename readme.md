<h1 align="center">Nation</h1>

<p align="center">🌍💻 A minimalist, functional state management library.</p>

<p align="center">
  <a href="https://travis-ci.org/herber/nation">
    <img src="https://travis-ci.org/herber/nation.svg?branch=master" alt="Build Status">
  </a>

  <a href="https://codecov.io/gh/herber/nation">
    <img src="https://codecov.io/gh/herber/nation/branch/master/graph/badge.svg" />
  </a>
</p>

## Features

 - __Functional__: Nation enforces functional programming.
 - __Minimal__: Nation is a fully functional state management lib weighing less than 500 byte.
 - __Easy__: Nation's API is as minimal as possible.
 - __Immutable__: State can only be set in actions or using `setState`.
 - __Reactive__: The update event is emitted on every state change.

## Philosophy

State management libraries often weigh multiple kilobytes, even though most of the time you just need a small part of their API. __Nation's__ approach is different - nation only includes the bare minimum state management functionality.

Nation enforces functional programming, this allows nation to be even tinier and makes you code more explicit.

## Install

```
$ npm install nation
```

## Usage

```js
const nation = require('nation');

const ship = nation({
  initial: () => ({
    swimming: true
  })
});

console.log(ship.state().swimming);
// => true
```

#### Actions

```js
ship.action(state => ({
  setSwimming: (val) => {
    state().swimming = val;
  },
  setName: (val) => {
    state().name = val;
  }
}));

ship.actions().setName('merry');
ship.actions().setSwimming(false);

console.log(ship.state().name);
// => 'merry'

console.log(ship.state().swimming);
// => false
```

#### State can also be set using `setState`

```js
ship.setState({
  name: 'enterprise',
  swimming: true
})

console.log(ship.state().name);
// => 'enterprise'

console.log(ship.state().swimming);
// => true
```

#### Computed properties

Computed properties can be accessed like normal state values. They are computed every time the state changes.

```js
ship.computed(state => ({
  swimmingName: () => {
    return `The ${state().swimming} is ${state().name == true ? 'swimming' : 'not swimming'}.`;
  }
}));

console.log(ship.state().swimmingName);
// => 'The enterprise is swimming.'
```

#### Lifecycle

Nations lifecycle consists of a single method: `onChange`.

```js
ship.onChange((state) => {
  console.log('The state has changed - State: ', state);
});
```

#### Async actions

Nation treats every function the same no matter if it's sync or async. The only difference is, that in async functions you have to use `setState` to set state.

```js
ship.action(state => ({
  setAsync: async () => {
    ship.setState({ asyncValue: await asyncFn() })
  }
}));

ship.actions().setAsync();

// Wait

console.log(ship.state().asyncValue);
```

#### Nested state

Nation state can be nested, the `onChange` event will be passed on, so even nested state is reactive.

Nested state cannot be set using actions, you have to use `setState`.

```js
const cargo = nation({
  initial: () => {
    loaded: true
  }
});

ship.setState({
  cargo
});

ship.onChange((state) => {
  console.log('Loaded state: '+ state.loaded);
})

cargo.setState({
  loaded: false
});
// => Loaded state: false
```

## License

MIT © [Tobias Herber](http://tobihrbr.com)
