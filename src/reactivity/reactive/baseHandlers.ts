import { track, trigger } from "../effect/effect";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly?) {
  return function get(target, key) {
    let res = Reflect.get(target, key);
    // TODO: 进行依赖收集
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

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
