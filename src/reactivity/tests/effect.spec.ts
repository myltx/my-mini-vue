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
  it("scheduler", () => {
    // 1. effect  接受第二个参数 是一个 options
    // 2. 第一次执行 effect 的时候 还会执行fn
    // 3. 当 set -> update 的时候，不会执行 fn 会执行 scheduler
    // 4. 执行 runner 的时候会再次执行 fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({
      foo: 1,
    });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    // 第一次不会执行 scheduler
    expect(scheduler).not.toHaveBeenCalled();
    // 但是会执行 fn 也就是 dummy 会被赋值 1
    expect(dummy).toBe(1);
    // set 更新数据时 fn 不会执行
    obj.foo++;
    // 但是会执行 scheduler
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    // 执行 runner 会执行 fn 也就是 foo 会改变
    run();
    expect(dummy).toBe(2);
  });
});
