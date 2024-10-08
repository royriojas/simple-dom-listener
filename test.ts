import { createEmitter } from './src/index';

interface EmitterInterface {
  event: { foo: string; bar: number };
  // other events signatures come here
}

const emitter = createEmitter<EmitterInterface>();

// typescript will complain if you try to fire an event that doesn't exist
// typescript will complain if the payload is not of the correct type
emitter.on('event', ({ foo, bar }) => {
  console.log(foo, bar);
});

// this will fail as the event listened does not exist in the typed interface
// @ts-expect-error
emitter.on('foo', ({ foo, bar }) => {
  console.log(foo, bar);
});

// this will work, the event fired is of the correct type and have the correct payload
emitter.fire('event', { foo: 'bar', bar: 1 });

// this will fail because bar is missing
// @ts-expect-error
emitter.fire('event', { foo: 'bar' });

// this will fail because foo is not a string
// @ts-expect-error
emitter.fire('event', { foo: 1, bar: 1 });

// this will fail because the emitted event does not exist
// @ts-expect-error
emitter.fire('foo', { foo: 'bar', bar: 1 });

// this will execute the listener only once
emitter.once('event', ({ foo, bar }) => {
  console.log(foo, bar);
});

// this will remove the listener added without referencing the listener function
const off = emitter.once('event', ({ foo, bar }) => {
  console.log(foo, bar);
});

// later remove the listener (useful in useEffect cleanup in React for example)
off();
