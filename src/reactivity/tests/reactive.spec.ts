import {
  isReactive,
  isReadonly,
  reactive,
  readonly,
} from "../reactive/reactive";

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
    expect(isReadonly(readOnlyObj)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });
});
