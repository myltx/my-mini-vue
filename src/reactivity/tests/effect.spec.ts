import { effect, stop } from "../effect/effect";
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
  // 测试 stop 功能
  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    // 执行 stop 停止 runner 响应式
    stop(runner);
    // obj.prop 改变时 不会更新
    obj.prop = 3;
    // 所以结果 dummy 还是 2
    expect(dummy).toBe(2);
    // 重新执行 runner runner 重新打开响应式  可以更寻 dummy
    runner();
    expect(dummy).toBe(3);
  });
});
