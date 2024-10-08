import { createEmitter } from '../src/index';

interface EmitterInterface {
  event: { foo: string; bar: number };
  // other events signatures come here
}

const emitter = createEmitter<EmitterInterface>();

describe('emitter', () => {
  it('should fire an event', () => {
    const spy = jest.fn();
    emitter.on('event', spy);
    emitter.fire('event', { foo: 'bar', bar: 1 });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar', bar: 1 });
  });

  it('should fire an event with the correct payload', () => {
    const spy = jest.fn();
    emitter.on('event', spy);
    emitter.fire('event', { foo: 'bar', bar: 1 });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar', bar: 1 });
  });

  it('should not execute the listener after it has been removed', () => {
    const spy = jest.fn();
    const off = emitter.on('event', spy);
    emitter.fire('event', { foo: 'bar', bar: 1 });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar', bar: 1 });
    off();
    emitter.fire('event', { foo: 'bar', bar: 1 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should let me known the wrong types for a given listener', () => {
    const spy = jest.fn();
    emitter.on('event', spy);
    // @ts-expect-error althought the event is not of the
    // correct type, the payload is passed as is to the listener
    // the protection provided will work only if tsc is executed
    // to verify the types before building the code. Once the code
    // is built, this will still work as not runtime checks are made
    emitter.fire('event', { foo: 1, bar: 'bar' });
    expect(spy).toHaveBeenCalledWith({ foo: 1, bar: 'bar' });
  });

  it('should warn about listerning or firing an event that does not exist in the typed interface', () => {
    const spy = jest.fn();

    // @ts-expect-error event does not exist
    emitter.on('event2', spy);

    // @ts-expect-error event does not exist
    emitter.fire('event2', { foo: 'bar', bar: 1 });
  });
});
