/**
 * effect 方法
 *
 * 思路：
 * 	1.接收一个fn
 * 	2.直接触发fn
 *	3.提供收集依赖方法，当触发 get 方法时 调用 track 方法  进行依赖收集
 *	4.提供执行依赖方法，当触发 set 方法时 调用 trigger 方法 执行收集到的所有依赖
 *
 */

// 通过对象形式创建
class ReactiveEffect {
  private _fn: any;
  public;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

let targetMaps = new Map();
/**
 *
 * 收集依赖方法
 *
 */
export function track(target, key) {
  // target -> key -> dep
  let depMaps = targetMaps.get(target);
  // 处理初始化逻辑， 当初始化时没有 depMaps 就创建一个添加到 targetMaps 中
  if (!depMaps) {
    depMaps = new Map();
    targetMaps.set(target, depMaps);
  }
  // 处理初始化逻辑， 当初始化时没有 dep 就创建 添加到 depMaps 中
  let dep = depMaps.get(key);
  if (!dep) {
    dep = new Set();
    depMaps.set(key, dep);
  }
  dep.add(activeEffect);
}

/**
 *
 * 依赖执行方法
 *
 */
export function trigger(target, key) {
  // 根据 target 获取到depMaps
  let depMaps = targetMaps.get(target);
  // 根据 key 获取到 deps
  let dep = depMaps.get(key);
  // 循环 deps 执行每一个 fn => run
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // 开始就会执行一次
  _effect.run();
  return _effect.run.bind(_effect);
}
