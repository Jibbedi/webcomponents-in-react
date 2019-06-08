import React from "react";

declare type OverrideProps = { [reactEventName: string]: string };

export const adapt = (
  componentSelector: string,
  overrideProps?: OverrideProps
) => {
  return class Adapter extends React.Component<any> {
    ref: HTMLElement | null = null;

    eventListeners: {
      [id: string]: EventListenerOrEventListenerObject;
    } | null = {};

    componentDidMount() {
      this.setUpEventListeners();
      this.updatePropertiesForRichData();
    }

    componentDidUpdate() {
      this.updatePropertiesForRichData();
    }

    componentWillUnmount() {
      this.removeEventListeners();
    }

    mapKeyToEventName(key: string) {
      if (this.shouldKeyBeMapped(key)) {
        return overrideProps![key];
      }

      // onChange -> change
      return key.substr(2).toLowerCase();
    }

    mapKeyToPropertyName(key: string) {
      if (this.shouldKeyBeMapped(key)) {
        return overrideProps![key];
      }

      return key;
    }

    shouldKeyBeMapped(key: string) {
      return overrideProps ? !!overrideProps[key] : false;
    }

    removeEventListeners() {
      for (let key in this.eventListeners!) {
        const handler = this.eventListeners![key];
        this.ref!.removeEventListener(this.mapKeyToEventName(key), handler);
      }
      this.eventListeners = null;
    }

    setUpEventListeners() {
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

    updatePropertiesForRichData() {
      for (let key in this.props) {
        const data = this.props[key];
        if (!this.isRichData(data)) {
          continue;
        }
        (this.ref as any)![this.mapKeyToPropertyName(key)] = data;
      }
    }

    filterOutRichData(props: any) {
      return Object.keys(props).reduce(
        (filteredProps, propKey) => {
          const value = props[propKey];
          if (!this.isRichData(value)) {
            filteredProps[propKey] = value;
          }
          return filteredProps;
        },
        {} as any
      );
    }

    isRichData(prop: any) {
      return typeof prop === "object";
    }

    render() {
      return React.createElement(componentSelector, {
        ref: (ref: HTMLElement) => (this.ref = ref),
        ...this.filterOutRichData(this.props)
      });
    }
  };
};
