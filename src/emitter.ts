// Inspired by https://github.com/bterlson/strict-event-emitter-types
export type ListenerType<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void]
  ? []
  : [T];

export type EmitterHandler<T, K extends keyof T> = {
  (...args: ListenerType<T[K]>): void;
};

// EventEmitter method overrides
export type OverriddenMethods<
  TEmitter extends Emitter,
  TEventRecord,
  TEmitRecord = TEventRecord,
> = {
  on<P extends keyof TEventRecord>(
    event: P,
    listener: EmitterHandler<TEventRecord, P>,
  ): ReturnType<TEmitter['on']>;

  once<P extends keyof TEventRecord>(
    event: P,
    listener: EmitterHandler<TEventRecord, P>,
  ): ReturnType<TEmitter['once']>;

  off<P extends keyof TEventRecord>(
    event: P,
    listener: EmitterHandler<TEventRecord, P>,
  ): ReturnType<TEmitter['off']>;

  fire<P extends keyof TEmitRecord>(
    event: P,
    ...args: ListenerType<TEmitRecord[P]>
  ): ReturnType<TEmitter['fire']>;
};

export type OverriddenKeys = keyof OverriddenMethods<any, any, any>;

export type TypedEmitter<
  TEmitterType extends Emitter,
  TEventRecord,
  TEmitRecord = TEventRecord,
  UnneededMethods extends Exclude<OverriddenKeys, keyof TEmitterType> = Exclude<
    OverriddenKeys,
    keyof TEmitterType
  >,
  NeededMethods extends Exclude<OverriddenKeys, UnneededMethods> = Exclude<
    OverriddenKeys,
    UnneededMethods
  >,
> =
  // Pick all the methods on the original type we aren't going to override
  Pick<TEmitterType, Exclude<keyof TEmitterType, OverriddenKeys>> &
    // Finally, pick the needed overrides (taking care not to add an override for a method
    // that doesn't exist)
    Pick<OverriddenMethods<TEmitterType, TEventRecord, TEmitRecord>, NeededMethods>;

export interface Handler<T> {
  (payload?: T): void;
}

export class Emitter {
  eventsMap = new Map<string, Set<Handler<any>>>();

  on = (eventName: string, handler: Handler<any>) => {
    if (typeof handler !== 'function') {
      throw new Error('handler must be a function');
    }

    let eventSet = this.eventsMap.get(eventName);

    if (!eventSet) {
      eventSet = new Set<Handler<any>>();
      this.eventsMap.set(eventName, eventSet);
    }

    eventSet.add(handler);

    return () => this.off(eventName, handler);
  };

  once = (eventName: string, handler: Handler<any>) => {
    const off = this.on(eventName, (...args: any[]) => {
      off();
      handler(...args);
    });

    return off;
  };

  off = (eventName: string, handler: Handler<any>): boolean => {
    const eventSet = this.eventsMap.get(eventName);

    if (!eventSet) {
      return false;
    }

    return eventSet.delete(handler);
  };

  clear = (eventName: string) => {
    const eventSet = this.eventsMap.get(eventName);

    if (!eventSet) {
      return;
    }

    eventSet.clear();
  };

  fire = (eventName: string, payload?: any) => {
    const eventSet = this.eventsMap.get(eventName);
    if (!eventSet) {
      return;
    }

    eventSet.forEach((fn: Handler<any>) => {
      fn(payload);
    });
  };

  getEventCount = (eventName: string): number => {
    const eventSet = this.eventsMap.get(eventName);

    return eventSet?.size ?? 0;
  };
}

export const createEmitter = <EmitterEventsMap>() => {
  return new Emitter() as unknown as TypedEmitter<Emitter, EmitterEventsMap>;
};
