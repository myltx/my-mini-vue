import { isReactive, reactive, readonly, isProxy } from "../reactive/reactive";

describe("happy path", () => {
  it("reactive", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    const readOnlyObj = readonly({
      age: 10,
    });
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  });
  it("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
