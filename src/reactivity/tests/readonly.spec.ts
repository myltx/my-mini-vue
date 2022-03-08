import { readonly } from "../reactive/reactive";

describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });
  it("not set", () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 15,
    });
    user.age = 16;
    expect(console.warn).toBeCalled();
  });
});
