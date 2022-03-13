import { trackEffects, triggerEffects, isTrackIng } from "../effect/effect";
import { reactive } from "../reactive/reactive";
import { hasChanged, isObject } from "../shared";

/**
 * ref => 一个key 对应一个 dep  用来做依赖收集
 * get 时依赖收集 set 时 触发依赖
 * 传入的会是一个值 比如 true  1
 * get set 的时候进行获取 设置
 * proxy 用来包裹object
 */

class Ref {
  private _value: any;
  // 为了收集依赖
  public dep;
  // 当ref设置对象时 需要使用基础值作为对比
  private _rawValue: any;
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    // 一定是先修改值 再通知
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTrackIng()) {
    trackEffects(ref.dep);
  }
}

export function ref(value) {
  return new Ref(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

/**
 * 主要用来在 template 中使用
 *  example
 *    const a = ref(1)
 *    template = > a  不需要使用 a.value
 */
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      // get => 获取数据时 如果是 ref 类型，就返回 xxx.value 否则就返回 xxx 本身
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      // 如果需要改变的 key 是 ref 类型，
      // 并且传入的 value 不是 ref 类型那么就替换 target[key].value
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
