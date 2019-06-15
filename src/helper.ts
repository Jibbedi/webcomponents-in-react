import { OverrideProps } from "./interfaces";
import { DEFAULT_EVENT_PREFIX } from "./constants";

export const filterOutRichData = (
  props: any,
  overrideProps?: OverrideProps
) => {
  return Object.keys(props).reduce(
    (filteredProps, propKey) => {
      const value = props[propKey];
      if (!isRichData(value) || propKey === "children") {
        filteredProps[mapKeyToPropertyName(propKey, overrideProps)] = value;
      }
      return filteredProps;
    },
    {} as any
  );
};

export const isRichData = (prop: any) => {
  return typeof prop === "object" || typeof prop === "function";
};

export const mapKeyToEventName = (
  key: string,
  overrideProps?: OverrideProps
) => {
  if (shouldKeyBeMapped(key, overrideProps)) {
    return overrideProps![key];
  }

  // onChange -> change
  return key.substr(DEFAULT_EVENT_PREFIX.length).toLowerCase();
};

export const mapKeyToPropertyName = (
  key: string,
  overrideProps?: OverrideProps
) => {
  if (shouldKeyBeMapped(key, overrideProps)) {
    return overrideProps![key];
  }

  return key;
};

export const shouldKeyBeMapped = (
  key: string,
  overrideProps?: OverrideProps
) => {
  return overrideProps ? !!overrideProps[key] : false;
};
