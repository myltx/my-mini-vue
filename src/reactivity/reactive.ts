import { track, trigger } from "./effect";

/**
 * reactive 方法
 *
 * 思路：
 * 	接收一个对象参数，返回一个 Proxy 对象
 * 	在 Proxy 的get set 方法中对数据进行拦截处理
 *	在 get 中进行依赖收集
 *      在 set 中进行依赖触发
 *
 * 使用到的方法:
 * 	Proxy   https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * 	Reflect https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
 */
export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      let res = Reflect.get(target, key);
      // TODO: 进行依赖收集
      track(target, key);
      return res;
    },
    set(target, key, value) {
      let res = Reflect.set(target, key, value);
      // TODO: 进行依赖触发
      trigger(target, key);
      return res;
    },
  });
}
