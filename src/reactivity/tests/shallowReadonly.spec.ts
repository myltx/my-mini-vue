import { isReadonly, shallowReadonly } from "../reactive/reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });
  it("not set", () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      age: 15,
    });
    user.age = 16;
    expect(console.warn).toBeCalled();
  });
});
