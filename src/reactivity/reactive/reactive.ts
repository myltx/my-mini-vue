import { isObject } from "../shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

/**
 * reactive 方法
 *
 * 思路：
 * 	接收一个对象参数，返回一个 Proxy 对象
 * 	在 Proxy 的get set 方法中对数据进行拦截处理
 *	在 get 中进行依赖收集
 *  在 set 中进行依赖触发
 */

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly",
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}
export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createReactiveObject(target: any, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target：${target} 必须是一个对象`);
    return target;
  }
  return new Proxy(target, baseHandlers);
}
