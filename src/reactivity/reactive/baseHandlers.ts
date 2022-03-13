import { track, trigger } from "../effect/effect";
import { extend, isObject } from "../shared";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly?, shallow?) {
  return function get(target, key) {
    let res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    // TODO: 进行依赖收集
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

/**
 * 使用到的方法:
 * 	Proxy   https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * 	Reflect https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
 * */
function createSetter() {
  return function set(target, key, value) {
    let res = Reflect.set(target, key, value);
    // TODO: 进行依赖触发
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(
      `key:${String(key)} 修改失败，因为${JSON.stringify(target)} 是 readonly`
    );
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
