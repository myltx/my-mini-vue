import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

/**
 * reactive 方法
 *
 * 思路：
 * 	接收一个对象参数，返回一个 Proxy 对象
 * 	在 Proxy 的get set 方法中对数据进行拦截处理
 *	在 get 中进行依赖收集
 *  在 set 中进行依赖触发
 *
 * 使用到的方法:
 * 	Proxy   https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * 	Reflect https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
 */

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly",
}

export function reactive(raw) {
  return createProxy(raw, mutableHandlers);
}

export function readonly(raw) {
  return createProxy(raw, readonlyHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

function createProxy(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
