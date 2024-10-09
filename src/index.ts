export type HTMLEvents = keyof HTMLElementEventMap;
export type DocumentEvents = keyof DocumentEventMap;
export type WindowEvents = keyof WindowEventMap;

type DropFirst<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never;

export type HTMLElementParams<K extends HTMLEvents> = DropFirst<
  Parameters<typeof HTMLElement.prototype.addEventListener<K>>
>;
export type DocumentParams<K extends DocumentEvents> = DropFirst<
  Parameters<typeof document.addEventListener<K>>
>;
export type WindowParams<K extends WindowEvents> = DropFirst<
  Parameters<typeof window.addEventListener<K>>
>;

export const off = <
  T extends HTMLElement | Document | Window,
  K = T extends HTMLElement ? HTMLEvents : T extends Document ? DocumentEvents : WindowEvents,
>(
    ele: T,
    eventName: K | K[],
    ...rest: K extends HTMLEvents
    ? HTMLElementParams<K>
    : K extends DocumentEvents
      ? DocumentParams<K>
      : K extends WindowEvents
        ? WindowParams<K>
        : never
  ) => {
  if (Array.isArray(eventName)) {
    eventName.forEach((evt) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore the spread is correct here
      ele.removeEventListener(evt, ...rest);
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore the spread is correct here
    ele.removeEventListener(eventName, ...rest);
  }
};

export const on = <
  T extends HTMLElement | Document | Window,
  K extends T extends HTMLElement ? HTMLEvents : T extends Document ? DocumentEvents : WindowEvents,
>(
    ele: T,
    eventName: K | K[],
    ...rest: K extends HTMLEvents
    ? HTMLElementParams<K>
    : K extends DocumentEvents
      ? DocumentParams<K>
      : K extends WindowEvents
        ? WindowParams<K>
        : never
  ) => {
  if (Array.isArray(eventName)) {
    eventName.forEach((evt) => {
      // @ts-expect-error this is actually correct, the spread is working as intended
      ele.addEventListener(evt, ...rest);
    });
  } else {
    // @ts-expect-error this is actually correct, the spread is working as intended
    ele.addEventListener(eventName, ...rest);
  }

  return () => off(ele, eventName, ...rest);
};
