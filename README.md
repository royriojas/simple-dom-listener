# simple-dom-listener

Simplified helpers to add/remove dom listeners without having to keep a reference to the listener itself to remove it

## Features

- Very simple api, `on`, `off` methods to add and remove dom listeners
- The `on` method returns a function that you can use to remove the listener without having to pass the event name and the listener function

## Installation

```bash
npm install simple-dom-listener
```

## Usage

```ts
import { on } from 'simple-dom-listener';

// add a listener to the document element
const removeListener = on(document, 'click', (event) => {
  console.log(event);
});

// later the returned function can be used
// to remove the event listener, without having to keep a reference to the listener
removeListener();

// a single listener for multiple events can be added
const off = on(document, ['click', 'keyup'], (event) => {
  console.log(event);
});

// later calling the returned off function listeners can be removed without having to keep a reference to the listener itself
```

The returned function to remove the listener is very useful in React for example, as it can be used in the `useEffect` cleanup function

```ts
useEffect(() => {
  const off = on(document, 'click', (event) => {
    console.log(event);
  });
  return off;
}, []);

// or more simplified as
useEffect(() => {
  return on(document, 'click', (event) => {
    console.log(event);
  });
}, []);
```

## License

MIT