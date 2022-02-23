import { effect } from "../effect/effect";
import { reactive } from "../reactive/reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });
  it("should return runner when call effect", () => {
    // effect(fn) -> function (runner) -> fn() -> return
    // 调用 effect  返回一个 runner 函数 效用runner  函数 返回用户传入fn 的返回值
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    // 测试 effect 执行
    expect(foo).toBe(11);
    // 执行 effect 返回的函数
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });
});
