import React from "react";

declare type OverrideProps = { [reactEventName: string]: string };

export const adapt = (
  componentSelector: string,
  overrideProps: OverrideProps
) => {
  return class Adapter extends React.Component<any> {
    ref: HTMLElement | null = null;

    eventListeners: {
      [id: string]: EventListenerOrEventListenerObject;
    } | null = {};

    componentDidMount() {
      for (let key in this.props) {
        const handler = this.props[key];

        if (key.indexOf(`on`) === -1 && !this.shouldKeyBeMapped(key)) {
          continue;
        }

        if (typeof handler !== `function`) {
          console.warn(`The prop ${key} is not a function.`);
          continue;
        }

        this.eventListeners![key] = handler;
        this.ref!.addEventListener(this.mapKeyToEventName(key), handler);
      }
    }

    componentWillUnmount() {
      for (let key in this.eventListeners!) {
        const handler = this.eventListeners![key];
        this.ref!.removeEventListener(this.mapKeyToEventName(key), handler);
      }
      this.eventListeners = null;
    }

    mapKeyToEventName(key: string) {
      if (this.shouldKeyBeMapped(key)) {
        return overrideProps[key];
      }

      // onChange -> change
      return key.substr(2).toLowerCase();
    }

    shouldKeyBeMapped(key: string) {
      return !!overrideProps[key];
    }

    render() {
      return React.createElement(componentSelector, {
        ref: (ref: HTMLElement) => (this.ref = ref),
        ...this.props
      });
    }
  };
};
