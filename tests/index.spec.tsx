import React from "react";
import { render, cleanup } from "@testing-library/react";
import { adapt } from "../src/index";

beforeEach(cleanup);
beforeEach(jest.clearAllMocks);

const addEventListener = jest.fn();
const removeEventListener = jest.fn();
const primitiveDataSetter = jest.fn();
const mappedDataSetter = jest.fn();
const richDataSetter = jest.fn();

class MockWebComponent extends React.Component<any> {
  addEventListener = addEventListener;

  removeEventListener = removeEventListener;

  set richData(value) {
    richDataSetter(value);
  }

  set mappedRichData(value) {
    mappedDataSetter(value);
  }

  set primitiveData(value) {
    primitiveDataSetter(value);
  }

  render() {
    return (
      <>
        <div>Hello World!</div>
        <div>{this.props.primitiveData}</div>
        <div>{this.props.data}</div>
      </>
    );
  }
}

const AdaptedComponent = adapt(MockWebComponent as any, {
  onChange: "input",
  value: "data",
  data: "mappedRichData"
});

const AdaptedComponentWithoutOverrides = adapt(MockWebComponent as any);

test("it should render component", () => {
  const { getByText } = render(<AdaptedComponent />);
  expect(getByText("Hello World!")).toBeTruthy();
});

test("it should call addEventListener and removeEventListener for onSelect -> select", () => {
  const onSelect = () => null;
  const { unmount } = render(<AdaptedComponent onSelect={onSelect} />);
  expect(addEventListener).toHaveBeenCalledWith("select", onSelect);

  unmount();

  expect(removeEventListener).toHaveBeenCalledWith("select", onSelect);
});

test("it should call setter for rich data", () => {
  const obj = { foo: 1 };
  render(<AdaptedComponent richData={obj} />);
  expect(richDataSetter).toHaveBeenCalledWith(obj);
});

test("it should not call setter for primitive data, but pass in as prop instead", () => {
  const primitiveData = "TEST_STRING";
  const { getByText } = render(
    <AdaptedComponent primitiveData={primitiveData} />
  );
  expect(primitiveDataSetter).not.toHaveBeenCalled();
  expect(getByText(primitiveData)).toBeTruthy();
});

test("it should call addEventListener and removeEventListener for mapped event onChange -> input", () => {
  const onChange = () => null;
  const { unmount } = render(<AdaptedComponent onChange={onChange} />);
  expect(addEventListener).toHaveBeenCalledWith("input", onChange);

  unmount();

  expect(removeEventListener).toHaveBeenCalledWith("input", onChange);
});

test("it should map primitive data properties", () => {
  const dataString = "DATA_STRING";
  const { getByText } = render(<AdaptedComponent value={dataString} />);
  expect(getByText(dataString)).toBeTruthy();
});

test("it should map rich data properties", () => {
  const arr = [1, 2, 3];
  render(<AdaptedComponent data={arr} />);
  expect(mappedDataSetter).toHaveBeenCalledWith(arr);
});

test("it should use defaults if no overrides are present", () => {
  const onInput = () => null;
  render(<AdaptedComponentWithoutOverrides onInput={onInput} />);
  expect(addEventListener).toHaveBeenCalledWith("input", onInput);
});

test("it should not call addEventListener if value is not a function", () => {
  const onInput = 1;
  render(<AdaptedComponentWithoutOverrides onInput={onInput} />);
  expect(addEventListener).not.toHaveBeenCalled();
});
