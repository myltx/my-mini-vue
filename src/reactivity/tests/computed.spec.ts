import { computed } from "../computed/computed";
import { reactive } from "../reactive/reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1,
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });
  it("should computed lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);
    // lazy
    // 当没有调用computed 的 get 时 不执行传入的 fn
    expect(getter).not.toHaveBeenCalled();
    // 当调用 get 时 触发 传入的 fn
    expect(cValue.value).toBe(1);
    expect(getter).toBeCalledTimes(1);
    // should not compute again
    // 再次调用 get 时 fn 只会执行一次
    cValue.value;
    expect(getter).toBeCalledTimes(1);
    // should not compute until needed
    // 在需要之前不应该计算
    value.foo = 2;
    // 传入函数还是只执行一次
    expect(getter).toHaveBeenCalledTimes(1);
    // 当 cValue 被修改时 computed 返回新的值(这里使用 effect )
    // now it should compute
    // 现在它应该计算
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
