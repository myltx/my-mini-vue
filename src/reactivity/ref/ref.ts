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
